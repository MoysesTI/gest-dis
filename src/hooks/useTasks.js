// src/hooks/useTasks.js - VERSÃO MELHORADA
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  serverTimestamp,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Buscar tarefas do usuário em tempo real - QUERY SIMPLIFICADA
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    console.log('📋 Buscando tarefas para usuário:', user.uid);
    
    try {
      // QUERY SIMPLIFICADA - SEM orderBy para evitar dependência de índices
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('✅ Tarefas recebidas:', snapshot.size);
          
          const tasksData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              // Converter timestamps do Firestore para strings
              dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate().toISOString().split('T')[0] : data.dueDate,
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
              updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
              completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate().toISOString() : data.completedAt
            };
          });
          
          // ORDENAR NO CLIENTE (já que não podemos ordenar no servidor ainda)
          const sortedTasks = tasksData.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA; // Mais recentes primeiro
          });
          
          setTasks(sortedTasks);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('❌ Erro ao buscar tarefas:', error);
          setError(error);
          setLoading(false);
          
          // Tentar fallback - buscar sem listener
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

  // Fallback para buscar dados sem listener em caso de erro
  const handleErrorFallback = async () => {
    if (!user) return;
    
    try {
      console.log('🔄 Tentando fallback para buscar tarefas...');
      
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTasks(tasksData);
      setError(null);
      console.log('✅ Fallback bem-sucedido, tarefas carregadas:', tasksData.length);
    } catch (fallbackError) {
      console.error('❌ Fallback também falhou:', fallbackError);
      toast.error('Erro ao carregar tarefas. Tente recarregar a página.');
    }
  };

  // Adicionar nova tarefa - MELHORADO
  const addTask = async (taskData) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('📝 Criando tarefa:', taskData);
      
      // Validar dados obrigatórios
      if (!taskData.title || taskData.title.trim().length === 0) {
        toast.error('Título da tarefa é obrigatório');
        return;
      }

      const docData = {
        title: taskData.title.trim(),
        description: taskData.description?.trim() || '',
        category: taskData.category || 'personal',
        priority: taskData.priority || 'medium',
        completed: false,
        userId: user.uid,
        dueDate: taskData.dueDate || null,
        timeEstimate: taskData.timeEstimate ? parseInt(taskData.timeEstimate) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        completedAt: null
      };
      
      const docRef = await addDoc(collection(db, 'tasks'), docData);
      
      console.log('✅ Tarefa criada com ID:', docRef.id);
      toast.success('Tarefa criada com sucesso!');
      return docRef.id;
    } catch (error) {
      console.error('❌ Erro ao adicionar tarefa:', error);
      
      // Mensagens de erro mais específicas
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

  // Atualizar tarefa - MELHORADO
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

  // Deletar tarefa - MELHORADO
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

  // Alternar status de completada - MELHORADO
  const toggleTask = async (taskId) => {
    if (!taskId || !user) {
      toast.error('Dados inválidos');
      return;
    }

    try {
      const task = tasks.find(t => t.id === taskId);
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

  // Estatísticas das tarefas - MELHORADO
  const getTaskStats = (period = 'all') => {
    try {
      let filteredTasks = [...tasks]; // Criar cópia para evitar mutação

      // Filtrar por período se especificado
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
          filteredTasks = tasks.filter(task => {
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
        total,
        completed,
        pending,
        completionRate,
        byCategory,
        byPriority,
        overdue,
        dueToday,
        totalEstimatedTime,
        avgCompletionTime: completed > 0 ? totalEstimatedTime / completed : 0
      };
    } catch (error) {
      console.error('❌ Erro ao calcular estatísticas:', error);
      return {
        period,
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
        byCategory: {},
        byPriority: {},
        overdue: 0,
        dueToday: 0,
        totalEstimatedTime: 0,
        avgCompletionTime: 0
      };
    }
  };

  // Filtrar tarefas - MELHORADO
  const filterTasks = (filters = {}) => {
    try {
      let filteredTasks = [...tasks];

      // Filtro por texto
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
          task.title?.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
        );
      }

      // Filtro por categoria
      if (filters.category && filters.category !== 'all') {
        filteredTasks = filteredTasks.filter(task => 
          task.category === filters.category
        );
      }

      // Filtro por prioridade
      if (filters.priority && filters.priority !== 'all') {
        filteredTasks = filteredTasks.filter(task => 
          task.priority === filters.priority
        );
      }

      // Filtro por status
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
      return tasks;
    }
  };

  // Obter dados para gráficos de produtividade - MELHORADO
  const getProductivityChartData = (days = 30) => {
    try {
      const now = new Date();
      const data = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        const dayTasks = tasks.filter(task => {
          if (!task.createdAt) return false;
          const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
          return taskDate === dateString;
        });

        const completedTasks = tasks.filter(task => {
          if (!task.completedAt) return false;
          const completedDate = new Date(task.completedAt).toISOString().split('T')[0];
          return completedDate === dateString;
        });

        data.push({
          date: dateString,
          day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          created: dayTasks.length,
          completed: completedTasks.length,
          productivity: dayTasks.length > 0 ? (completedTasks.length / dayTasks.length) * 100 : 0
        });
      }

      return data;
    } catch (error) {
      console.error('❌ Erro ao gerar dados de produtividade:', error);
      return [];
    }
  };

  // Exportar dados das tarefas - MELHORADO
  const exportTasks = (format = 'json', period = 'all') => {
    try {
      const stats = getTaskStats(period);
      const filteredTasks = period === 'all' ? tasks : filterTasks({ period });

      const dataToExport = {
        exportDate: new Date().toISOString(),
        userId: user?.uid,
        period,
        summary: {
          total: stats.total,
          completed: stats.completed,
          pending: stats.pending,
          completionRate: stats.completionRate,
          overdue: stats.overdue
        },
        tasks: filteredTasks.map(task => ({
          titulo: task.title,
          descricao: task.description || '',
          categoria: task.category,
          prioridade: task.priority,
          status: task.completed ? 'Concluída' : 'Pendente',
          dataVencimento: task.dueDate || '',
          tempoEstimado: task.timeEstimate || '',
          criadoEm: task.createdAt,
          concluidoEm: task.completedAt || ''
        })),
        statistics: {
          byCategory: stats.byCategory,
          byPriority: stats.byPriority
        }
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tarefas_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        const csv = [
          'Título,Descrição,Categoria,Prioridade,Status,Data Vencimento,Tempo Estimado,Criado Em,Concluído Em',
          ...dataToExport.tasks.map(task => 
            `"${task.titulo}","${task.descricao}","${task.categoria}","${task.prioridade}","${task.status}","${task.dataVencimento}","${task.tempoEstimado}","${task.criadoEm}","${task.concluidoEm}"`
          )
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tarefas_${new Date().toISOString().split('T')[0]}.csv`;
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
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTaskStats,
    filterTasks,
    getProductivityChartData,
    exportTasks
  };
};

export default useTasks;