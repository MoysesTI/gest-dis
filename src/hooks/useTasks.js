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
    orderBy 
    } from 'firebase/firestore';
    import { db } from '../services/firebase';
    import { useAuth } from '../contexts/AuthContext';
    import toast from 'react-hot-toast';

    // Hook personalizado para gerenciar tarefas
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

        const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, 
        (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
            }));
            setTasks(tasksData);
            setLoading(false);
        },
        (error) => {
            console.error('Erro ao buscar tarefas:', error);
            setError(error);
            setLoading(false);
            toast.error('Erro ao carregar tarefas');
        }
        );

        return () => unsubscribe();
    }, [user]);

    // Adicionar nova tarefa
    const addTask = async (taskData) => {
        try {
        const docRef = await addDoc(collection(db, 'tasks'), {
            ...taskData,
            userId: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        toast.success('Tarefa criada com sucesso!');
        return docRef.id;
        } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        toast.error('Erro ao criar tarefa');
        throw error;
        }
    };

    // Atualizar tarefa
    const updateTask = async (taskId, updates) => {
        try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
        
        toast.success('Tarefa atualizada com sucesso!');
        } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        toast.error('Erro ao atualizar tarefa');
        throw error;
        }
    };

    // Deletar tarefa
    const deleteTask = async (taskId) => {
        try {
        await deleteDoc(doc(db, 'tasks', taskId));
        toast.success('Tarefa excluída com sucesso!');
        } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        toast.error('Erro ao excluir tarefa');
        throw error;
        }
    };

    // Alternar status de completada
    const toggleTask = async (taskId) => {
        try {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        await updateTask(taskId, {
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : null
        });
        } catch (error) {
        console.error('Erro ao alternar tarefa:', error);
        toast.error('Erro ao atualizar tarefa');
        throw error;
        }
    };

    // Estatísticas das tarefas
    const getTaskStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;

        // Tarefas por categoria
        const byCategory = tasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
        }, {});

        // Tarefas por prioridade
        const byPriority = tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
        }, {});

        // Tarefas vencidas
        const today = new Date().toISOString().split('T')[0];
        const overdue = tasks.filter(t => 
        !t.completed && t.dueDate && t.dueDate < today
        ).length;

        // Tarefas para hoje
        const dueToday = tasks.filter(t => 
        !t.completed && t.dueDate === today
        ).length;

        return {
        total,
        completed,
        pending,
        completionRate,
        byCategory,
        byPriority,
        overdue,
        dueToday
        };
    };

    // Filtrar tarefas
    const filterTasks = (filters) => {
        let filteredTasks = tasks;

        // Filtro por texto
        if (filters.search) {
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            task.description.toLowerCase().includes(filters.search.toLowerCase())
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

    // Buscar tarefas por período
    const getTasksByPeriod = (period) => {
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
            startDate.setMonth(now.getMonth() - 1);
            break;
        case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        default:
            return tasks;
        }

        return tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= startDate;
        });
    };

    // Exportar dados das tarefas
    const exportTasks = (format = 'json') => {
        const dataToExport = tasks.map(task => ({
        titulo: task.title,
        descricao: task.description,
        categoria: task.category,
        prioridade: task.priority,
        status: task.completed ? 'Concluída' : 'Pendente',
        dataVencimento: task.dueDate,
        tempoEstimado: task.timeEstimate,
        criadoEm: task.createdAt,
        atualizadoEm: task.updatedAt
        }));

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
            Object.keys(dataToExport[0]).join(','),
            ...dataToExport.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tarefas_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        }

        toast.success('Dados exportados com sucesso!');
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
        getTasksByPeriod,
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
            setTask({ id: doc.id, ...doc.data() });
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