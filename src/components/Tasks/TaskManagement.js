import React, { useState } from 'react';
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
  Home,
  Heart,
  DollarSign
} from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import toast from 'react-hot-toast';

// Mapeamento de ícones para categorias
const categoryIcons = {
  work: Briefcase,
  study: BookOpen,
  personal: User,
  home: Home,
  health: Heart,
  finance: DollarSign
};

// Configuração de prioridades
const priorityConfig = {
  low: { label: 'Baixa', color: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-100' },
  medium: { label: 'Média', color: 'bg-yellow-500', textColor: 'text-yellow-800', bgColor: 'bg-yellow-100' },
  high: { label: 'Alta', color: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-100' }
};

// Configuração de categorias
const categoryConfig = {
  work: { label: 'Trabalho', color: 'text-blue-600' },
  study: { label: 'Estudos', color: 'text-purple-600' },
  personal: { label: 'Pessoal', color: 'text-cyan-600' },
  home: { label: 'Casa', color: 'text-green-600' },
  health: { label: 'Saúde', color: 'text-red-600' },
  finance: { label: 'Finanças', color: 'text-yellow-600' }
};

// Componente de Item de Tarefa
const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const category = categoryConfig[task.category] || categoryConfig.work;
  const Icon = categoryIcons[task.category] || Circle;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueToday = task.dueDate === new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-xl border-2 transition-all ${
        task.completed 
          ? 'bg-gray-50 border-gray-200 opacity-75' 
          : isOverdue 
            ? 'bg-red-50 border-red-200 hover:border-red-300'
            : isDueToday
              ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
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
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                priority.bgColor
              } ${priority.textColor}`}>
                <Flag className="h-3 w-3 mr-1" />
                {priority.label}
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

          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center space-x-1 ${category.color}`}>
              <Icon className="h-4 w-4" />
              <span>{category.label}</span>
            </div>
            {task.dueDate && (
              <div className={`flex items-center space-x-1 ${
                isOverdue ? 'text-red-600' : isDueToday ? 'text-yellow-600' : 'text-gray-500'
              }`}>
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                  {isOverdue && ' (Vencida)'}
                  {isDueToday && ' (Hoje)'}
                </span>
              </div>
            )}
            {task.timeEstimate && (
              <div className="flex items-center space-x-1 text-gray-500">
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

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
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
              Título *
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
                <option value="health">Saúde</option>
                <option value="finance">Finanças</option>
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
                min="1"
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
  const {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTaskStats,
    filterTasks
  } = useTasks();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Filtrar tarefas baseado nos filtros atuais
  const filteredTasks = filterTasks({
    search: searchTerm,
    category: filterCategory,
    priority: filterPriority,
    status: showCompleted ? 'all' : 'pending'
  });

  // Obter estatísticas
  const stats = getTaskStats('month');

  // Funções de manipulação
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await addTask(taskData);
      }
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleToggleTask = async (id) => {
    try {
      await toggleTask(id);
    } catch (error) {
      console.error('Erro ao alternar tarefa:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Vencidas</div>
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
            <option value="health">Saúde</option>
            <option value="finance">Finanças</option>
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
        {filteredTasks.length > 0 ? (
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
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            {searchTerm || filterCategory !== 'all' || filterPriority !== 'all' ? (
              <div>
                <Filter className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
                <p className="text-gray-600 mb-4">
                  Nenhuma tarefa corresponde aos filtros aplicados.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setFilterPriority('all');
                    setShowCompleted(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div>
                <Circle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa criada</h3>
                <p className="text-gray-600 mb-4">
                  Comece criando sua primeira tarefa para organizar sua produtividade.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Criar Primeira Tarefa
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resumo de Produtividade */}
      {stats.total > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo de Produtividade
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Taxa de Conclusão</h4>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {stats.completionRate.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Tempo Estimado Restante</h4>
              <div className="text-lg font-bold text-blue-600">
                {stats.totalEstimatedTime > 0 ? `${stats.totalEstimatedTime} min` : 'N/A'}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Tarefas para Hoje</h4>
              <div className="text-lg font-bold text-yellow-600">
                {stats.dueToday}
              </div>
            </div>
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