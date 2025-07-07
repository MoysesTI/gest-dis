// src/components/Tasks/TaskManagement.js - VERSÃO MELHORADA COM TIPOS DE TAREFAS
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Plus,
  Edit,
  Trash2,
  Clock,
  Flag,
  Search,
  Filter,
  Calendar,
  Target,
  Repeat,
  CheckCircle,
  Circle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  X,
  RefreshCw,
  Users,
  Zap,
  Timer,
  Utensils,
  Save,
  RotateCcw
} from 'lucide-react';
import { useTasks, TASK_TYPES, REPEAT_TYPES } from '../../hooks/useTasks';
import { useDiet } from '../../hooks/useDiet';
import toast from 'react-hot-toast';

// Componente de Filtros
const TaskFilters = ({ filters, onFilterChange, taskType, onTaskTypeChange }) => {
  const categories = [
    { id: 'all', name: 'Todas', icon: Target },
    { id: 'work', name: 'Trabalho', icon: Users },
    { id: 'personal', name: 'Pessoal', icon: Users },
    { id: 'health', name: 'Saúde', icon: Zap },
    { id: 'study', name: 'Estudos', icon: Users },
  ];

  const priorities = [
    { id: 'all', name: 'Todas' },
    { id: 'low', name: 'Baixa' },
    { id: 'medium', name: 'Média' },
    { id: 'high', name: 'Alta' },
  ];

  const statuses = [
    { id: 'all', name: 'Todas' },
    { id: 'pending', name: 'Pendentes' },
    { id: 'completed', name: 'Concluídas' },
  ];

  const taskTypes = [
    { id: 'all', name: 'Todas', icon: Target },
    { id: TASK_TYPES.NORMAL, name: 'Normais', icon: CheckSquare },
    { id: TASK_TYPES.DAILY, name: 'Diárias', icon: Calendar },
    { id: TASK_TYPES.WEEKLY, name: 'Semanais', icon: RefreshCw },
    { id: TASK_TYPES.MONTHLY, name: 'Mensais', icon: BarChart3 },
    { id: TASK_TYPES.MEAL, name: 'Refeições', icon: Utensils },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tipo de Tarefa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Tarefa
          </label>
          <select
            value={taskType}
            onChange={(e) => onTaskTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {taskTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prioridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridade
          </label>
          <select
            value={filters.priority || 'all'}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Componente de Estatísticas
const TaskStats = ({ stats, taskType }) => {
  const getTypeLabel = (type) => {
    switch (type) {
      case TASK_TYPES.DAILY: return 'Diárias';
      case TASK_TYPES.WEEKLY: return 'Semanais';
      case TASK_TYPES.MONTHLY: return 'Mensais';
      case TASK_TYPES.MEAL: return 'Refeições';
      case 'all': return 'Todas';
      default: return 'Normais';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tarefas {getTypeLabel(taskType)}</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <CheckSquare className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Concluídas</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-sm text-green-600">
            {stats.completionRate.toFixed(1)}% de conclusão
          </span>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pendentes</p>
            <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Circle className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-sm text-blue-600">
            {stats.dueToday} para hoje
          </span>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Vencidas</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-sm text-red-600">
            {stats.totalEstimatedTime}h estimadas
          </span>
        </div>
      </motion.div>
    </div>
  );
};

// Componente de Card de Tarefa
const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case TASK_TYPES.DAILY: return <Calendar className="h-4 w-4" />;
      case TASK_TYPES.WEEKLY: return <RefreshCw className="h-4 w-4" />;
      case TASK_TYPES.MONTHLY: return <BarChart3 className="h-4 w-4" />;
      case TASK_TYPES.MEAL: return <Utensils className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case TASK_TYPES.DAILY: return 'Diária';
      case TASK_TYPES.WEEKLY: return 'Semanal';
      case TASK_TYPES.MONTHLY: return 'Mensal';
      case TASK_TYPES.MEAL: return 'Refeição';
      default: return 'Normal';
    }
  };

  const isOverdue = !task.completed && task.dueDate && task.dueDate < new Date().toISOString().split('T')[0];
  const isDueToday = !task.completed && task.dueDate === new Date().toISOString().split('T')[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-200 ${
        task.completed ? 'border-green-200 bg-green-50' : 
        isOverdue ? 'border-red-200 bg-red-50' :
        isDueToday ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => onToggle(task.id)}
              className={`p-2 rounded-full transition-all duration-200 ${
                task.completed 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
              }`}
            >
              {task.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-semibold ${
                task.completed ? 'text-green-900 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              )}
              
              {/* Informações da Refeição */}
              {task.taskType === TASK_TYPES.MEAL && task.mealTime && (
                <div className="flex items-center mt-2 text-sm text-orange-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{task.mealTime}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Tipo de Tarefa */}
            <span className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {getTypeIcon(task.taskType)}
              <span>{getTypeLabel(task.taskType)}</span>
            </span>
            
            {/* Prioridade */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
            </span>
            
            {/* Categoria */}
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
              {task.category}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {task.timeEstimate && (
              <div className="flex items-center">
                <Timer className="h-4 w-4 mr-1" />
                <span>{task.timeEstimate}h</span>
              </div>
            )}
            
            {task.dueDate && (
              <div className={`flex items-center ${
                isOverdue ? 'text-red-600' : 
                isDueToday ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Informações de Repetição */}
        {task.taskType !== TASK_TYPES.NORMAL && task.repeatUntil && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center text-sm text-blue-800">
              <Repeat className="h-4 w-4 mr-2" />
              <span>
                Repetir até {new Date(task.repeatUntil).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        )}

        {/* Status de Conclusão */}
        {task.completed && task.completedAt && (
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Concluída em {new Date(task.completedAt).toLocaleDateString('pt-BR')} às {new Date(task.completedAt).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Modal de Criação/Edição de Tarefa
const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    taskType: TASK_TYPES.NORMAL,
    repeatType: REPEAT_TYPES.NONE,
    dueDate: '',
    repeatUntil: '',
    timeEstimate: '',
    mealType: '',
    mealTime: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'personal',
        priority: task.priority || 'medium',
        taskType: task.taskType || TASK_TYPES.NORMAL,
        repeatType: task.repeatType || REPEAT_TYPES.NONE,
        dueDate: task.dueDate || '',
        repeatUntil: task.repeatUntil || '',
        timeEstimate: task.timeEstimate || '',
        mealType: task.mealType || '',
        mealTime: task.mealTime || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        taskType: TASK_TYPES.NORMAL,
        repeatType: REPEAT_TYPES.NONE,
        dueDate: '',
        repeatUntil: '',
        timeEstimate: '',
        mealType: '',
        mealTime: ''
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {task ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o título da tarefa"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Descreva a tarefa (opcional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="personal">Pessoal</option>
                <option value="work">Trabalho</option>
                <option value="health">Saúde</option>
                <option value="study">Estudos</option>
                <option value="finance">Finanças</option>
              </select>
            </div>

            {/* Prioridade */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Tarefa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Tarefa
              </label>
              <select
                value={formData.taskType}
                onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={TASK_TYPES.NORMAL}>Normal</option>
                <option value={TASK_TYPES.DAILY}>Diária</option>
                <option value={TASK_TYPES.WEEKLY}>Semanal</option>
                <option value={TASK_TYPES.MONTHLY}>Mensal</option>
              </select>
            </div>

            {/* Tempo Estimado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo Estimado (horas)
              </label>
              <input
                type="number"
                value={formData.timeEstimate}
                onChange={(e) => setFormData({ ...formData, timeEstimate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 2"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data de Vencimento */}
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

            {/* Repetir Até */}
            {formData.taskType !== TASK_TYPES.NORMAL && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repetir Até
                </label>
                <input
                  type="date"
                  value={formData.repeatUntil}
                  onChange={(e) => setFormData({ ...formData, repeatUntil: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{task ? 'Salvar' : 'Criar'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Componente Principal
const TaskManagement = () => {
  const { 
    tasks, 
    dailyTasks, 
    weeklyTasks, 
    monthlyTasks, 
    mealTasks,
    loading, 
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTaskStats,
    filterTasks,
    createDailyTasks,
    createWeeklyTasks,
    createMonthlyTasks,
    TASK_TYPES
  } = useTasks();

  const { currentDiet } = useDiet();
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priority: 'all',
    status: 'all'
  });
  
  const [currentTaskType, setCurrentTaskType] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Obter estatísticas baseadas no tipo atual
  const stats = getTaskStats('all', currentTaskType);

  // Obter tarefas filtradas
  const filteredTasks = filterTasks(filters, currentTaskType);

  // Criar tarefas de rotina automáticas
  const handleCreateRoutineTasks = async (type) => {
    const routineTasks = [];
    
    if (type === TASK_TYPES.DAILY) {
      routineTasks.push(
        { title: 'Acordar às 5:00', category: 'health', priority: 'high', timeEstimate: '1' },
        { title: 'Exercícios matinais', category: 'health', priority: 'high', timeEstimate: '0.5' },
        { title: 'Planejar o dia', category: 'personal', priority: 'medium', timeEstimate: '0.25' },
        { title: 'Revisão do dia', category: 'personal', priority: 'medium', timeEstimate: '0.25' }
      );
      
      if (currentDiet) {
        // Adicionar tarefas das refeições se há uma dieta ativa
        Object.entries(currentDiet.meals || {}).forEach(([mealType, meal]) => {
          routineTasks.push({
            title: `${meal.name} - ${meal.time}`,
            description: `Refeição: ${meal.items.join(', ')}`,
            category: 'health',
            priority: 'high',
            timeEstimate: '0.5',
            mealType: mealType,
            mealTime: meal.time
          });
        });
      }
      
      await createDailyTasks(routineTasks);
    }
    
    if (type === TASK_TYPES.WEEKLY) {
      routineTasks.push(
        { title: 'Planejamento semanal', category: 'personal', priority: 'high', timeEstimate: '1' },
        { title: 'Limpeza da casa', category: 'personal', priority: 'medium', timeEstimate: '2' },
        { title: 'Compras da semana', category: 'personal', priority: 'medium', timeEstimate: '1' },
        { title: 'Revisão financeira', category: 'finance', priority: 'high', timeEstimate: '1' }
      );
      
      await createWeeklyTasks(routineTasks);
    }
    
    if (type === TASK_TYPES.MONTHLY) {
      routineTasks.push(
        { title: 'Planejamento mensal', category: 'personal', priority: 'high', timeEstimate: '2' },
        { title: 'Revisão de metas', category: 'personal', priority: 'high', timeEstimate: '1' },
        { title: 'Balanço financeiro', category: 'finance', priority: 'high', timeEstimate: '1' },
        { title: 'Avaliação física', category: 'health', priority: 'medium', timeEstimate: '1' }
      );
      
      await createMonthlyTasks(routineTasks);
    }
    
    toast.success(`Tarefas ${type === TASK_TYPES.DAILY ? 'diárias' : type === TASK_TYPES.WEEKLY ? 'semanais' : 'mensais'} criadas com sucesso!`);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        toast.success('Tarefa atualizada com sucesso!');
      } else {
        await addTask(taskData);
        toast.success('Tarefa criada com sucesso!');
      }
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(taskId);
        toast.success('Tarefa excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Erro ao carregar tarefas</h3>
              <p className="text-red-700">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gerenciamento de Tarefas
              </h1>
              <p className="text-gray-600">
                Organize sua rotina e produtividade
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowTaskModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Tarefa</span>
            </button>
            
            <div className="relative">
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleCreateRoutineTasks(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors appearance-none"
              >
                <option value="">Criar Rotina</option>
                <option value={TASK_TYPES.DAILY}>Tarefas Diárias</option>
                <option value={TASK_TYPES.WEEKLY}>Tarefas Semanais</option>
                <option value={TASK_TYPES.MONTHLY}>Tarefas Mensais</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <TaskFilters 
        filters={filters}
        onFilterChange={setFilters}
        taskType={currentTaskType}
        onTaskTypeChange={setCurrentTaskType}
      />

      {/* Estatísticas */}
      <TaskStats stats={stats} taskType={currentTaskType} />

      {/* Lista de Tarefas */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                <CheckSquare className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Nenhuma tarefa encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                {currentTaskType === 'all' 
                  ? 'Crie sua primeira tarefa para começar'
                  : `Nenhuma tarefa do tipo ${currentTaskType} encontrada`
                }
              </p>
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Criar Primeira Tarefa</span>
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <TaskModal
            isOpen={showTaskModal}
            onClose={() => {
              setShowTaskModal(false);
              setEditingTask(null);
            }}
            task={editingTask}
            onSave={handleSaveTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskManagement;