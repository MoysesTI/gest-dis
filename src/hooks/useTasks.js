// src/hooks/useTasks.js
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
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Buscar tarefas do usuário em tempo real
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    console.log('📋 Buscando tarefas para usuário:', user.uid);

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
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
        setTasks(tasksData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('❌ Erro ao buscar tarefas:', error);
        setError(error);
        setLoading(false);
        toast.error('Erro ao carregar tarefas');
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Adicionar nova tarefa
  const addTask = async (taskData) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('📝 Criando tarefa:', taskData);
      
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId: user.uid,
        completed: false,
        timeEstimate: taskData.timeEstimate ? parseInt(taskData.timeEstimate) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        completedAt: null
      });
      
      console.log('✅ Tarefa criada com ID:', docRef.id);
      toast.success('Tarefa criada com sucesso!');
      return docRef.id;
    } catch (error) {
      console.error('❌ Erro ao adicionar tarefa:', error);
      toast.error('Erro ao criar tarefa: ' + error.message);
      throw error;
    }
  };

  // Atualizar tarefa
  const updateTask = async (taskId, updates) => {
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
      toast.error('Erro ao atualizar tarefa: ' + error.message);
      throw error;
    }
  };

  // Deletar tarefa
  const deleteTask = async (taskId) => {
    try {
      console.log('🗑️ Deletando tarefa:', taskId);
      
      await deleteDoc(doc(db, 'tasks', taskId));
      
      console.log('✅ Tarefa deletada');
      toast.success('Tarefa excluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao deletar tarefa:', error);
      toast.error('Erro ao excluir tarefa: ' + error.message);
      throw error;
    }
  };

  // Alternar status de completada
  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        toast.error('Tarefa não encontrada');
        return;
      }

      const updates = {
        completed: !task.completed,
        completedAt: !task.completed ? serverTimestamp() : null
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

  // Estatísticas das tarefas
  const getTaskStats = (period = 'all') => {
    let filteredTasks = tasks;

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
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    // Tarefas por prioridade
    const byPriority = filteredTasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
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
      .reduce((sum, t) => sum + t.timeEstimate, 0);

    // Produtividade por dia da semana
    const productivityByDay = {};
    filteredTasks.forEach(task => {
      if (task.completedAt) {
        const dayOfWeek = new Date(task.completedAt).getDay();
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const dayName = dayNames[dayOfWeek];
        productivityByDay[dayName] = (productivityByDay[dayName] || 0) + 1;
      }
    });

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
      productivityByDay,
      avgCompletionTime: completed > 0 ? totalEstimatedTime / completed : 0
    };
  };

  // Filtrar tarefas
  const filterTasks = (filters) => {
    let filteredTasks = tasks;

    // Filtro por texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
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

    // Filtro por data de vencimento
    if (filters.dueDate) {
      const today = new Date().toISOString().split('T')[0];
      filteredTasks = filteredTasks.filter(task => {
        if (filters.dueDate === 'today') return task.dueDate === today;
        if (filters.dueDate === 'overdue') return task.dueDate < today && !task.completed;
        if (filters.dueDate === 'upcoming') return task.dueDate > today;
        return true;
      });
    }

    return filteredTasks;
  };

  // Obter dados para gráficos de produtividade
  const getProductivityChartData = (days = 30) => {
    const now = new Date();
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const dayTasks = tasks.filter(task => {
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
  };

  // Exportar dados das tarefas
  const exportTasks = (format = 'json', period = 'all') => {
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
        byPriority: stats.byPriority,
        productivityByDay: stats.productivityByDay
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

// Hook para uma tarefa específica
export const useTask = (taskId) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) {
      setTask(null);
      setLoading(false);
      return;
    }

    const taskRef = doc(db, 'tasks', taskId);
    const unsubscribe = onSnapshot(taskRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setTask({ 
            id: doc.id, 
            ...data,
            dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate().toISOString().split('T')[0] : data.dueDate,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate().toISOString() : data.completedAt
          });
        } else {
          setTask(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar tarefa:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [taskId]);

  return { task, loading, error };
};

export default useTasks;