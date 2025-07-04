    import React, { useState, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { 
    Plus, 
    Edit, 
    Trash2, 
    CheckCircle, 
    Circle, 
    Calendar,
    Clock,
    Flag,
    Search,
    Filter,
    BookOpen,
    Briefcase,
    User,
    Home
    } from 'lucide-react';

    // Componente de Tarefa Individual
    const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
    const priorityColors = {
        high: 'bg-red-100 text-red-800 border-red-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        low: 'bg-green-100 text-green-800 border-green-200'
    };

    const categoryIcons = {
        work: <Briefcase className="h-4 w-4" />,
        study: <BookOpen className="h-4 w-4" />,
        personal: <User className="h-4 w-4" />,
        home: <Home className="h-4 w-4" />
    };

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`p-4 rounded-xl border-2 transition-all ${
            task.completed
            ? 'bg-gray-50 border-gray-200 opacity-75'
            : 'bg-white border-gray-200 hover:border-blue-300'
        }`}
        >
        <div className="flex items-start space-x-3">
            <button
            onClick={() => onToggle(task.id)}
            className={`mt-1 transition-colors ${
                task.completed 
                ? 'text-green-600 hover:text-green-700' 
                : 'text-gray-400 hover:text-blue-600'
            }`}
            >
            {task.completed ? (
                <CheckCircle className="h-5 w-5" />
            ) : (
                <Circle className="h-5 w-5" />
            )}
            </button>

            <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
                <h3 className={`font-medium ${
                task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                {task.title}
                </h3>
                <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    priorityColors[task.priority]
                }`}>
                    <Flag className="h-3 w-3 mr-1" />
                    {task.priority}
                </span>
                <div className="flex items-center space-x-1">
                    <button
                    onClick={() => onEdit(task)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                    <Edit className="h-4 w-4" />
                    </button>
                    <button
                    onClick={() => onDelete(task.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                    <Trash2 className="h-4 w-4" />
                    </button>
                </div>
                </div>
            </div>

            {task.description && (
                <p className={`text-sm mb-3 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {task.description}
                </p>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                {categoryIcons[task.category]}
                <span className="capitalize">{task.category}</span>
                </div>
                {task.dueDate && (
                <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                )}
                {task.timeEstimate && (
                <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{task.timeEstimate}min</span>
                </div>
                )}
            </div>
            </div>
        </div>
        </motion.div>
    );
    };

    // Componente de Formulário de Tarefa
    const TaskForm = ({ task, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'work',
        priority: 'medium',
        dueDate: '',
        timeEstimate: '',
        ...task
    });

    const handleSubmit = () => {
        if (!formData.title.trim()) return;
        
        onSave({
        ...formData,
        id: task?.id || Date.now().toString(),
        completed: task?.completed || false,
        createdAt: task?.createdAt || new Date().toISOString()
        });
    };

    return (
        <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h3>

            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
                </label>
                <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o título da tarefa"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
                </label>
                <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Descrição opcional"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                </label>
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="work">Trabalho</option>
                    <option value="study">Estudos</option>
                    <option value="personal">Pessoal</option>
                    <option value="home">Casa</option>
                </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade
                </label>
                <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Vencimento
                </label>
                <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempo Estimado (min)
                </label>
                <input
                    type="number"
                    value={formData.timeEstimate}
                    onChange={(e) => setFormData({ ...formData, timeEstimate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30"
                />
                </div>
            </div>
            </div>

            <div className="flex space-x-3 mt-6">
            <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
                Cancelar
            </button>
            <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                {task ? 'Salvar' : 'Criar'}
            </button>
            </div>
        </div>
        </motion.div>
    );
    };

    // Componente principal de Gestão de Tarefas
    const TaskManagement = () => {
    const [tasks, setTasks] = useState([
        {
        id: '1',
        title: 'Estudar React Hooks',
        description: 'Revisar useState, useEffect e useContext',
        category: 'study',
        priority: 'high',
        dueDate: '2024-12-15',
        timeEstimate: '60',
        completed: false,
        createdAt: '2024-12-01T10:00:00Z'
        },
        {
        id: '2',
        title: 'Preparar marmitas da semana',
        description: 'Seguir o cardápio da dieta de recomposição',
        category: 'home',
        priority: 'medium',
        dueDate: '2024-12-08',
        timeEstimate: '120',
        completed: false,
        createdAt: '2024-12-01T11:00:00Z'
        },
        {
        id: '3',
        title: 'Revisar finanças do mês',
        description: 'Verificar gastos e planejamento do orçamento',
        category: 'personal',
        priority: 'high',
        dueDate: '2024-12-10',
        timeEstimate: '45',
        completed: true,
        createdAt: '2024-12-01T12:00:00Z'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [showCompleted, setShowCompleted] = useState(true);
    const [editingTask, setEditingTask] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Filtrar tarefas
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        const matchesCompleted = showCompleted || !task.completed;

        return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
    });

    // Estatísticas
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length,
        highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
    };

    // Funções de manipulação
    const handleToggleTask = (id) => {
        setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleSaveTask = (taskData) => {
        if (editingTask) {
        setTasks(tasks.map(task => 
            task.id === editingTask.id ? taskData : task
        ));
        } else {
        setTasks([...tasks, taskData]);
        }
        setEditingTask(null);
        setShowForm(false);
    };

    const handleDeleteTask = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
        setTasks(tasks.filter(task => task.id !== id));
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Tarefas</h1>
            <p className="text-gray-600 mt-2">Organize sua produtividade</p>
            </div>
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
            <Plus className="h-5 w-5" />
            <span>Nova Tarefa</span>
            </motion.button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Concluídas</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <div className="text-sm text-gray-600">Alta Prioridade</div>
            </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar tarefas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                </div>
            </div>
            <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="all">Todas Categorias</option>
                <option value="work">Trabalho</option>
                <option value="study">Estudos</option>
                <option value="personal">Pessoal</option>
                <option value="home">Casa</option>
            </select>
            <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="all">Todas Prioridades</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
            </select>
            <label className="flex items-center space-x-2">
                <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mostrar concluídas</span>
            </label>
            </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-4">
            <AnimatePresence>
            {filteredTasks.map(task => (
                <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                />
            ))}
            </AnimatePresence>
        </div>

        {filteredTasks.length === 0 && (
            <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
                {searchTerm || filterCategory !== 'all' || filterPriority !== 'all' 
                ? 'Nenhuma tarefa encontrada com os filtros aplicados' 
                : 'Nenhuma tarefa cadastrada ainda'}
            </div>
            </div>
        )}

        {/* Formulário de Tarefa */}
        <AnimatePresence>
            {showForm && (
            <TaskForm
                task={editingTask}
                onSave={handleSaveTask}
                onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
                }}
            />
            )}
        </AnimatePresence>
        </div>
    );
    };

    export default TaskManagement;