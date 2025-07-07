// src/hooks/useTasks.js - VERSÃO MELHORADA COM TIPOS DE TAREFAS
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Tipos de tarefas
export const TASK_TYPES = {
  NORMAL: 'normal',
  DAILY: 'daily',
  WEEKLY: 'weekly', 
  MONTHLY: 'monthly',
  MEAL: 'meal' // Para refeições da dieta
};

// Tipos de repetição
export const REPEAT_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  UNTIL_END_OF_MONTH: 'until_end_of_month'
};

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [monthlyTasks, setMonthlyTasks] = useState([]);
  const [mealTasks, setMealTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Buscar todas as tarefas do usuário
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setDailyTasks([]);
      setWeeklyTasks([]);
      setMonthlyTasks([]);
      setMealTasks([]);
      setLoading(false);
      return;
    }

    console.log('📋 Buscando tarefas para usuário:', user.uid);

    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('✅ Tarefas recebidas:', snapshot.size);
          
          const allTasks = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate().toISOString().split('T')[0] : data.dueDate,
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
              updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
              completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate().toISOString() : data.completedAt,
              repeatUntil: data.repeatUntil instanceof Timestamp ? data.repeatUntil.toDate().toISOString().split('T')[0] : data.repeatUntil
            };
          });

          // Separar tarefas por tipo
          const normalTasks = allTasks.filter(t => !t.taskType || t.taskType === TASK_TYPES.NORMAL);
          const dailyTasks = allTasks.filter(t => t.taskType === TASK_TYPES.DAILY);
          const weeklyTasks = allTasks.filter(t => t.taskType === TASK_TYPES.WEEKLY);
          const monthlyTasks = allTasks.filter(t => t.taskType === TASK_TYPES.MONTHLY);
          const mealTasks = allTasks.filter(t => t.taskType === TASK_TYPES.MEAL);

          setTasks(normalTasks);
          setDailyTasks(dailyTasks);
          setWeeklyTasks(weeklyTasks);
          setMonthlyTasks(monthlyTasks);
          setMealTasks(mealTasks);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('❌ Erro ao buscar tarefas:', error);
          setError(error);
          setLoading(false);
          handleErrorFallback();
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('❌ Erro ao configurar listener de tarefas:', error);
      setError(error);
      setLoading(false);
      handleErrorFallback();
    }
  }, [user]);

  // Fallback para buscar dados sem listener
  const handleErrorFallback = async () => {
    if (!user) return;
    
    try {
      console.log('🔄 Tentando fallback para buscar tarefas...');
      
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      const allTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Separar por tipos
      const normalTasks = allTasks.filter(t => !t.taskType || t.taskType === TASK_TYPES.NORMAL);
      const dailyTasks = allTasks.filter(t => t.taskType === TASK_TYPES.DAILY);
      const weeklyTasks = allTasks.filter(t => t.taskType === TASK_TYPES.WEEKLY);
      const monthlyTasks = allTasks.filter(t => t.taskType === TASK_TYPES.MONTHLY);
      const mealTasks = allTasks.filter(t => t.taskType === TASK_TYPES.MEAL);

      setTasks(normalTasks);
      setDailyTasks(dailyTasks);
      setWeeklyTasks(weeklyTasks);
      setMonthlyTasks(monthlyTasks);
      setMealTasks(mealTasks);
      setError(null);
      
      console.log('✅ Fallback bem-sucedido');
    } catch (fallbackError) {
      console.error('❌ Fallback também falhou:', fallbackError);
      toast.error('Erro ao carregar tarefas. Tente recarregar a página.');
    }
  };

  // Adicionar nova tarefa
  const addTask = async (taskData) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('📝 Criando tarefa:', taskData);
      
      if (!taskData.title || taskData.title.trim().length === 0) {
        toast.error('Título da tarefa é obrigatório');
        return;
      }

      const docData = {
        title: taskData.title.trim(),
        description: taskData.description?.trim() || '',
        category: taskData.category || 'personal',
        priority: taskData.priority || 'medium',
        taskType: taskData.taskType || TASK_TYPES.NORMAL,
        repeatType: taskData.repeatType || REPEAT_TYPES.NONE,
        completed: false,
        userId: user.uid,
        dueDate: taskData.dueDate || null,
        repeatUntil: taskData.repeatUntil || null,
        timeEstimate: taskData.timeEstimate ? parseInt(taskData.timeEstimate) : null,
        mealType: taskData.mealType || null,
        mealTime: taskData.mealTime || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        completedAt: null
      };

      // Se for tarefa diária, semanal ou mensal, criar com ID específico
      if (taskData.taskType !== TASK_TYPES.NORMAL) {
        const today = new Date();
        const month = today.getMonth() + 1;
        const week = Math.ceil(today.getDate() / 7);
        
        let taskId;
        switch (taskData.taskType) {
          case TASK_TYPES.DAILY:
            taskId = `${user.uid}_daily_${taskData.title.replace(/\s+/g, '_').toLowerCase()}_${month}`;
            break;
          case TASK_TYPES.WEEKLY:
            taskId = `${user.uid}_weekly_${taskData.title.replace(/\s+/g, '_').toLowerCase()}_${week}`;
            break;
          case TASK_TYPES.MONTHLY:
            taskId = `${user.uid}_monthly_${taskData.title.replace(/\s+/g, '_').toLowerCase()}_${month}`;
            break;
          case TASK_TYPES.MEAL:
            taskId = `${user.uid}_meal_${taskData.mealType}_${month}`;
            break;
          default:
            taskId = null;
        }

        if (taskId) {
          await setDoc(doc(db, 'tasks', taskId), docData);
          console.log('✅ Tarefa criada com ID específico:', taskId);
        } else {
          const docRef = await addDoc(collection(db, 'tasks'), docData);
          console.log('✅ Tarefa criada com ID automático:', docRef.id);
        }
      } else {
        const docRef = await addDoc(collection(db, 'tasks'), docData);
        console.log('✅ Tarefa criada com ID:', docRef.id);
      }
      
      toast.success('Tarefa criada com sucesso!');
      return true;
    } catch (error) {
      console.error('❌ Erro ao adicionar tarefa:', error);
      
      if (error.code === 'permission-denied') {
        toast.error('Erro de permissão. Verifique se está logado corretamente.');
      } else if (error.code === 'network-request-failed') {
        toast.error('Erro de conexão. Verifique sua internet.');
      } else {
        toast.error('Erro ao criar tarefa: ' + (error.message || 'Erro desconhecido'));
      }
      throw error;
    }
  };

  // Criar tarefas diárias automaticamente
  const createDailyTasks = async (tasksData) => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (const taskData of tasksData) {
      await addTask({
        ...taskData,
        taskType: TASK_TYPES.DAILY,
        repeatType: REPEAT_TYPES.UNTIL_END_OF_MONTH,
        dueDate: lastDayOfMonth.toISOString().split('T')[0],
        repeatUntil: lastDayOfMonth.toISOString().split('T')[0]
      });
    }
  };

  // Criar tarefas semanais automaticamente
  const createWeeklyTasks = async (tasksData) => {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    for (const taskData of tasksData) {
      await addTask({
        ...taskData,
        taskType: TASK_TYPES.WEEKLY,
        repeatType: REPEAT_TYPES.WEEKLY,
        dueDate: endOfWeek.toISOString().split('T')[0],
        repeatUntil: endOfWeek.toISOString().split('T')[0]
      });
    }
  };

  // Criar tarefas mensais automaticamente
  const createMonthlyTasks = async (tasksData) => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (const taskData of tasksData) {
      await addTask({
        ...taskData,
        taskType: TASK_TYPES.MONTHLY,
        repeatType: REPEAT_TYPES.MONTHLY,
        dueDate: lastDayOfMonth.toISOString().split('T')[0],
        repeatUntil: lastDayOfMonth.toISOString().split('T')[0]
      });
    }
  };

  // Atualizar tarefa
  const updateTask = async (taskId, updates) => {
    if (!taskId || !user) {
      toast.error('Dados inválidos para atualização');
      return;
    }

    try {
      console.log('📝 Atualizando tarefa:', taskId, updates);
      
      const taskRef = doc(db, 'tasks', taskId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      if (updates.timeEstimate) {
        updateData.timeEstimate = parseInt(updates.timeEstimate);
      }
      
      await updateDoc(taskRef, updateData);
      
      console.log('✅ Tarefa atualizada');
      toast.success('Tarefa atualizada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar tarefa:', error);
      
      if (error.code === 'not-found') {
        toast.error('Tarefa não encontrada');
      } else if (error.code === 'permission-denied') {
        toast.error('Sem permissão para atualizar esta tarefa');
      } else {
        toast.error('Erro ao atualizar tarefa: ' + (error.message || 'Erro desconhecido'));
      }
      throw error;
    }
  };

  // Deletar tarefa
  const deleteTask = async (taskId) => {
    if (!taskId || !user) {
      toast.error('Dados inválidos para exclusão');
      return;
    }

    try {
      console.log('🗑️ Deletando tarefa:', taskId);
      
      await deleteDoc(doc(db, 'tasks', taskId));
      
      console.log('✅ Tarefa deletada');
      toast.success('Tarefa excluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao deletar tarefa:', error);
      
      if (error.code === 'not-found') {
        toast.error('Tarefa não encontrada');
      } else if (error.code === 'permission-denied') {
        toast.error('Sem permissão para excluir esta tarefa');
      } else {
        toast.error('Erro ao excluir tarefa: ' + (error.message || 'Erro desconhecido'));
      }
      throw error;
    }
  };

  // Alternar status de completada
  const toggleTask = async (taskId) => {
    if (!taskId || !user) {
      toast.error('Dados inválidos');
      return;
    }

    try {
      // Encontrar a tarefa em todas as listas
      const allTasks = [...tasks, ...dailyTasks, ...weeklyTasks, ...monthlyTasks, ...mealTasks];
      const task = allTasks.find(t => t.id === taskId);
      
      if (!task) {
        toast.error('Tarefa não encontrada');
        return;
      }

      const updates = {
        completed: !task.completed,
        completedAt: !task.completed ? serverTimestamp() : null,
        updatedAt: serverTimestamp()
      };

      await updateTask(taskId, updates);
      
      toast.success(
        !task.completed 
          ? '✅ Tarefa marcada como concluída!' 
          : '🔄 Tarefa marcada como pendente!'
      );
    } catch (error) {
      console.error('❌ Erro ao alternar tarefa:', error);
      toast.error('Erro ao atualizar status da tarefa');
      throw error;
    }
  };

  // Estatísticas das tarefas melhoradas
  const getTaskStats = (period = 'all', taskType = 'all') => {
    try {
      let filteredTasks = [];

      // Selecionar tarefas baseado no tipo
      switch (taskType) {
        case TASK_TYPES.DAILY:
          filteredTasks = [...dailyTasks];
          break;
        case TASK_TYPES.WEEKLY:
          filteredTasks = [...weeklyTasks];
          break;
        case TASK_TYPES.MONTHLY:
          filteredTasks = [...monthlyTasks];
          break;
        case TASK_TYPES.MEAL:
          filteredTasks = [...mealTasks];
          break;
        case 'all':
          filteredTasks = [...tasks, ...dailyTasks, ...weeklyTasks, ...monthlyTasks, ...mealTasks];
          break;
        default:
          filteredTasks = [...tasks];
      }

      // Filtrar por período
      if (period !== 'all') {
        const now = new Date();
        const startDate = new Date();

        switch (period) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth());
            startDate.setDate(1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear());
            startDate.setMonth(0);
            startDate.setDate(1);
            break;
        }

        if (period !== 'all') {
          filteredTasks = filteredTasks.filter(task => {
            if (!task.createdAt) return false;
            const taskDate = new Date(task.createdAt);
            return taskDate >= startDate;
          });
        }
      }

      const total = filteredTasks.length;
      const completed = filteredTasks.filter(t => t.completed).length;
      const pending = total - completed;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      // Tarefas por categoria
      const byCategory = filteredTasks.reduce((acc, task) => {
        const category = task.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Tarefas por prioridade
      const byPriority = filteredTasks.reduce((acc, task) => {
        const priority = task.priority || 'medium';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});

      // Tarefas por tipo
      const byType = filteredTasks.reduce((acc, task) => {
        const type = task.taskType || 'normal';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      // Tarefas vencidas
      const today = new Date().toISOString().split('T')[0];
      const overdue = filteredTasks.filter(t => 
        !t.completed && t.dueDate && t.dueDate < today
      ).length;

      // Tarefas para hoje
      const dueToday = filteredTasks.filter(t => 
        !t.completed && t.dueDate === today
      ).length;

      // Tempo total estimado
      const totalEstimatedTime = filteredTasks
        .filter(t => !t.completed && t.timeEstimate)
        .reduce((sum, t) => sum + (parseInt(t.timeEstimate) || 0), 0);

      return {
        period,
        taskType,
        total,
        completed,
        pending,
        completionRate,
        byCategory,
        byPriority,
        byType,
        overdue,
        dueToday,
        totalEstimatedTime,
        avgCompletionTime: completed > 0 ? totalEstimatedTime / completed : 0
      };
    } catch (error) {
      console.error('❌ Erro ao calcular estatísticas:', error);
      return {
        period,
        taskType,
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
        byCategory: {},
        byPriority: {},
        byType: {},
        overdue: 0,
        dueToday: 0,
        totalEstimatedTime: 0,
        avgCompletionTime: 0
      };
    }
  };

  // Filtrar tarefas melhorado
  const filterTasks = (filters = {}, taskType = 'all') => {
    try {
      let filteredTasks = [];

      // Selecionar tarefas baseado no tipo
      switch (taskType) {
        case TASK_TYPES.DAILY:
          filteredTasks = [...dailyTasks];
          break;
        case TASK_TYPES.WEEKLY:
          filteredTasks = [...weeklyTasks];
          break;
        case TASK_TYPES.MONTHLY:
          filteredTasks = [...monthlyTasks];
          break;
        case TASK_TYPES.MEAL:
          filteredTasks = [...mealTasks];
          break;
        case 'all':
          filteredTasks = [...tasks, ...dailyTasks, ...weeklyTasks, ...monthlyTasks, ...mealTasks];
          break;
        default:
          filteredTasks = [...tasks];
      }

      // Aplicar filtros
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
          task.title?.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
        );
      }

      if (filters.category && filters.category !== 'all') {
        filteredTasks = filteredTasks.filter(task => 
          task.category === filters.category
        );
      }

      if (filters.priority && filters.priority !== 'all') {
        filteredTasks = filteredTasks.filter(task => 
          task.priority === filters.priority
        );
      }

      if (filters.status && filters.status !== 'all') {
        filteredTasks = filteredTasks.filter(task => {
          if (filters.status === 'completed') return task.completed;
          if (filters.status === 'pending') return !task.completed;
          return true;
        });
      }

      return filteredTasks;
    } catch (error) {
      console.error('❌ Erro ao filtrar tarefas:', error);
      return [];
    }
  };

  // Exportar dados das tarefas melhorado
  const exportTasks = (format = 'json', period = 'all', taskType = 'all') => {
    try {
      const stats = getTaskStats(period, taskType);
      const filteredTasks = filterTasks({}, taskType);

      const dataToExport = {
        exportDate: new Date().toISOString(),
        userId: user?.uid,
        period,
        taskType,
        summary: {
          total: stats.total,
          completed: stats.completed,
          pending: stats.pending,
          completionRate: stats.completionRate,
          overdue: stats.overdue,
          dailyTasks: dailyTasks.length,
          weeklyTasks: weeklyTasks.length,
          monthlyTasks: monthlyTasks.length,
          mealTasks: mealTasks.length
        },
        tasks: filteredTasks.map(task => ({
          titulo: task.title,
          descricao: task.description || '',
          categoria: task.category,
          prioridade: task.priority,
          tipo: task.taskType || 'normal',
          status: task.completed ? 'Concluída' : 'Pendente',
          dataVencimento: task.dueDate || '',
          tempoEstimado: task.timeEstimate || '',
          tipoRefeicao: task.mealType || '',
          horarioRefeicao: task.mealTime || '',
          criadoEm: task.createdAt,
          concluidoEm: task.completedAt || ''
        })),
        statistics: {
          byCategory: stats.byCategory,
          byPriority: stats.byPriority,
          byType: stats.byType
        }
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tarefas_${taskType}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        const csv = [
          'Título,Descrição,Categoria,Prioridade,Tipo,Status,Data Vencimento,Tempo Estimado,Tipo Refeição,Horário Refeição,Criado Em,Concluído Em',
          ...dataToExport.tasks.map(task => 
            `"${task.titulo}","${task.descricao}","${task.categoria}","${task.prioridade}","${task.tipo}","${task.status}","${task.dataVencimento}","${task.tempoEstimado}","${task.tipoRefeicao}","${task.horarioRefeicao}","${task.criadoEm}","${task.concluidoEm}"`
          )
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tarefas_${taskType}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast.success('Dados das tarefas exportados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao exportar tarefas:', error);
      toast.error('Erro ao exportar dados');
    }
  };

  return {
    // Tarefas por tipo
    tasks, // Tarefas normais
    dailyTasks,
    weeklyTasks,
    monthlyTasks,
    mealTasks,
    
    // Estados
    loading,
    error,
    
    // Funções CRUD
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    
    // Funções de criação automática
    createDailyTasks,
    createWeeklyTasks,
    createMonthlyTasks,
    
    // Funções de análise
    getTaskStats,
    filterTasks,
    exportTasks,
    
    // Constantes
    TASK_TYPES,
    REPEAT_TYPES
  };
};

export default useTasks;