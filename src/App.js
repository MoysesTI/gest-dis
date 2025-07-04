import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  CheckSquare, 
  DollarSign, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  Target,
  Wallet,
  Plus,
  Edit,
  Trash2,
  Clock,
  Flag,
  Calendar,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  PieChart,
  CreditCard,
  Car,
  ShoppingCart,
  Heart,
  Shirt,
  Coffee,
  Wifi,
  BookOpen,
  Briefcase,
  Circle,
  CheckCircle,
  Zap,
  Film,
  MoreHorizontal,
  AlertTriangle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Save,
  FileText,
  Download
} from 'lucide-react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

// Componente de Loading
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
    />
  </div>
);

// Componente de Login
const LoginForm = ({ onLogin, onRegister, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = () => {
    if (isRegisterMode) {
      onRegister(email, password);
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <Target className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Gestão
          </h1>
          <p className="text-gray-600">
            Produtividade e Finanças Pessoais
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Carregando...' : (isRegisterMode ? 'Criar Conta' : 'Entrar')}
          </motion.button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isRegisterMode ? 'Já tem conta? Faça login' : 'Não tem conta? Registre-se'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Componente de Navegação
const Navigation = ({ currentPage, onPageChange, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'finance', label: 'Finanças', icon: Wallet },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Gestão Pro
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-700 hidden sm:block">
                {user?.email || 'Usuário'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-400 hover:text-gray-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Componente Dashboard
const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalTasks: 12,
    completedTasks: 8,
    monthlyIncome: 3780,
    monthlyExpenses: 950,
    savingsGoal: 1000
  });

  const [quickTasks, setQuickTasks] = useState([
    { id: 1, title: 'Estudar React', completed: false, priority: 'high' },
    { id: 2, title: 'Revisar finanças', completed: true, priority: 'medium' },
    { id: 3, title: 'Preparar marmitas', completed: false, priority: 'high' }
  ]);

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
  const availableToSpend = stats.monthlyIncome - stats.monthlyExpenses;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {user?.email?.split('@')[0] || 'Usuário'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Aqui está um resumo do seu progresso hoje
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tarefas do Mês</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">
              {completionRate.toFixed(1)}% concluídas
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Renda Mensal</p>
              <p className="text-2xl font-bold text-gray-900">R$ {stats.monthlyIncome.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-blue-600">
              Salário + Extras
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gastos Fixos</p>
              <p className="text-2xl font-bold text-gray-900">R$ {stats.monthlyExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              25% da renda
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponível</p>
              <p className="text-2xl font-bold text-gray-900">R$ {availableToSpend.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">
              75% da renda
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tarefas Rápidas
          </h3>
          <div className="space-y-3">
            {quickTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  task.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    task.completed
                      ? 'bg-green-500'
                      : task.priority === 'high'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                />
                <span
                  className={`flex-1 ${
                    task.completed
                      ? 'text-green-700 line-through'
                      : 'text-gray-700'
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição Financeira Sugerida
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">💰 Investimentos</span>
              <span className="font-semibold text-blue-600">R$ 500 (18%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">🍽️ Alimentação</span>
              <span className="font-semibold text-green-600">R$ 2.000 (71%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">👕 Roupas</span>
              <span className="font-semibold text-purple-600">R$ 200 (7%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">🎉 Lazer</span>
              <span className="font-semibold text-pink-600">R$ 130 (4%)</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">R$ 2.830</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Componente de Gestão de Tarefas
const TaskManagement = ({ user }) => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Estudar React - Hooks Avançados',
      description: 'Revisar useState, useEffect, useContext e custom hooks',
      category: 'study',
      priority: 'high',
      dueDate: '2024-12-15',
      timeEstimate: '60',
      completed: false,
      createdAt: '2024-12-01T10:00:00Z'
    },
    {
      id: '2',
      title: 'Preparar Marmitas da Semana',
      description: 'Seguir cardápio da dieta: frango, arroz, feijão, salada',
      category: 'home',
      priority: 'medium',
      dueDate: '2024-12-08',
      timeEstimate: '120',
      completed: false,
      createdAt: '2024-12-01T11:00:00Z'
    },
    {
      id: '3',
      title: 'Treino Peito - Academia',
      description: 'Exercícios: supino, crucifixo, flexão + 10min esteira',
      category: 'gym',
      priority: 'high',
      dueDate: '2024-12-09',
      timeEstimate: '90',
      completed: true,
      createdAt: '2024-12-01T12:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const categories = {
    work: { label: 'Trabalho', icon: Briefcase, color: 'bg-blue-100 text-blue-800' },
    study: { label: 'Estudos', icon: BookOpen, color: 'bg-purple-100 text-purple-800' },
    gym: { label: 'Academia', icon: Heart, color: 'bg-red-100 text-red-800' },
    home: { label: 'Casa', icon: Home, color: 'bg-green-100 text-green-800' },
    content: { label: 'Conteúdo', icon: Edit, color: 'bg-yellow-100 text-yellow-800' }
  };

  const priorities = {
    low: { label: 'Baixa', color: 'bg-green-500' },
    medium: { label: 'Média', color: 'bg-yellow-500' },
    high: { label: 'Alta', color: 'bg-red-500' }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCompleted = showCompleted || !task.completed;
    return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const TaskItem = ({ task }) => {
    const category = categories[task.category];
    const Icon = category?.icon || Circle;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border-2 transition-all ${
          task.completed ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="flex items-start space-x-3">
          <button
            onClick={() => handleToggleTask(task.id)}
            className={`mt-1 transition-colors ${
              task.completed ? 'text-green-600' : 'text-gray-400 hover:text-blue-600'
            }`}
          >
            {task.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  priorities[task.priority]?.color || 'bg-gray-500'
                } text-white`}>
                  <Flag className="h-3 w-3 mr-1" />
                  {priorities[task.priority]?.label}
                </span>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {task.description && (
              <p className={`text-sm mb-3 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Icon className="h-4 w-4" />
                <span>{category?.label}</span>
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

  const TaskForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: 'work',
      priority: 'medium',
      dueDate: '',
      timeEstimate: ''
    });

    const handleSubmit = () => {
      if (!formData.title.trim()) return;
      
      const newTask = {
        ...formData,
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      setTasks([...tasks, newTask]);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'work',
        priority: 'medium',
        dueDate: '',
        timeEstimate: ''
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
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Nova Tarefa</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o título da tarefa"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Descrição opcional"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="work">Trabalho</option>
                  <option value="study">Estudos</option>
                  <option value="gym">Academia</option>
                  <option value="home">Casa</option>
                  <option value="content">Conteúdo</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tempo (min)</label>
                <input
                  type="number"
                  value={formData.timeEstimate}
                  onChange={(e) => setFormData({ ...formData, timeEstimate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Tarefas</h1>
          <p className="text-gray-600 mt-2">Organize sua produtividade diária</p>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas Categorias</option>
            <option value="work">Trabalho</option>
            <option value="study">Estudos</option>
            <option value="gym">Academia</option>
            <option value="home">Casa</option>
            <option value="content">Conteúdo</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
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

      <AnimatePresence>
        {showForm && <TaskForm />}
      </AnimatePresence>
    </div>
  );
};

// Componente de Gestão Financeira
const FinanceManagement = ({ user }) => {
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'income',
      amount: 3780,
      description: 'Salário',
      category: 'salary',
      date: '2024-12-01',
      recurring: true
    },
    {
      id: '2',
      type: 'expense',
      amount: 450,
      description: 'Aluguel',
      category: 'housing',
      date: '2024-12-01',
      recurring: true
    },
    {
      id: '3',
      type: 'expense',
      amount: 300,
      description: 'Supermercado',
      category: 'food',
      date: '2024-12-02',
      recurring: false
    },
    {
      id: '4',
      type: 'expense',
      amount: 89,
      description: 'Internet',
      category: 'utilities',
      date: '2024-12-05',
      recurring: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = {
    salary: { label: 'Salário', icon: DollarSign, color: 'text-green-600' },
    food: { label: 'Alimentação', icon: Coffee, color: 'text-orange-600' },
    housing: { label: 'Moradia', icon: Home, color: 'text-blue-600' },
    transport: { label: 'Transporte', icon: Car, color: 'text-purple-600' },
    utilities: { label: 'Utilidades', icon: Wifi, color: 'text-gray-600' },
    entertainment: { label: 'Entretenimento', icon: Film, color: 'text-pink-600' },
    shopping: { label: 'Compras', icon: ShoppingCart, color: 'text-red-600' },
    health: { label: 'Saúde', icon: Heart, color: 'text-green-600' },
    other: { label: 'Outros', icon: MoreHorizontal, color: 'text-gray-600' }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    return matchesType && matchesCategory;
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const TransactionItem = ({ transaction }) => {
    const category = categories[transaction.category];
    const Icon = category?.icon || MoreHorizontal;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
              <Icon className={`h-5 w-5 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{transaction.description}</h3>
              <p className="text-sm text-gray-500">{category?.label}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(transaction.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const TransactionForm = () => {
    const [formData, setFormData] = useState({
      type: 'expense',
      amount: '',
      description: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      recurring: false
    });

    const handleSubmit = () => {
      if (!formData.amount || !formData.description) return;
      
      const newTransaction = {
        ...formData,
        id: Date.now().toString(),
        amount: parseFloat(formData.amount)
      };
      
      setTransactions([...transactions, newTransaction]);
      setShowForm(false);
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        recurring: false
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
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Nova Transação</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0,00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição da transação"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="salary">Salário</option>
                <option value="food">Alimentação</option>
                <option value="housing">Moradia</option>
                <option value="transport">Transporte</option>
                <option value="utilities">Utilidades</option>
                <option value="entertainment">Entretenimento</option>
                <option value="shopping">Compras</option>
                <option value="health">Saúde</option>
                <option value="other">Outros</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Recorrente</label>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
          <p className="text-gray-600 mt-2">Controle suas finanças pessoais</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Transação</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-green-600">R$ {totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-red-600">R$ {totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <ArrowDownRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {balance.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoria</h3>
          <div className="space-y-3">
            {Object.entries(expensesByCategory).map(([categoryKey, amount]) => {
              const category = categories[categoryKey];
              const Icon = category?.icon || MoreHorizontal;
              const percentage = (amount / totalExpenses) * 100;
              
              return (
                <div key={categoryKey} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${category?.color || 'text-gray-600'}`} />
                    <span className="text-gray-700">{category?.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">R$ {amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Mensal</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxa de Economia</span>
              <span className="font-semibold text-blue-600">
                {((balance / totalIncome) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Meta de Economia</span>
              <span className="font-semibold text-green-600">20%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Maior Gasto</span>
              <span className="font-semibold text-red-600">
                R$ {Math.max(...Object.values(expensesByCategory)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Dias até Salário</span>
              <span className="font-semibold text-gray-900">15 dias</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas Categorias</option>
            {Object.entries(categories).map(([key, category]) => (
              <option key={key} value={key}>{category.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredTransactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showForm && <TransactionForm />}
      </AnimatePresence>
    </div>
  );
};

// Componente de Relatórios
const Reports = ({ user }) => {
  const [reportType, setReportType] = useState('tasks');
  const [dateRange, setDateRange] = useState('month');

  const taskData = [
    { name: 'Concluídas', value: 8, color: '#10B981' },
    { name: 'Pendentes', value: 4, color: '#F59E0B' },
    { name: 'Atrasadas', value: 2, color: '#EF4444' }
  ];

  const financeData = [
    { name: 'Receitas', value: 3780, color: '#10B981' },
    { name: 'Despesas', value: 1250, color: '#EF4444' },
    { name: 'Economia', value: 2530, color: '#3B82F6' }
  ];

  const productivityData = [
    { day: 'Seg', tasks: 3, hours: 8 },
    { day: 'Ter', tasks: 2, hours: 6 },
    { day: 'Qua', tasks: 4, hours: 7 },
    { day: 'Qui', tasks: 1, hours: 5 },
    { day: 'Sex', tasks: 3, hours: 8 },
    { day: 'Sab', tasks: 2, hours: 4 },
    { day: 'Dom', tasks: 1, hours: 2 }
  ];

  const ReportCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}% vs mês anterior
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2">Análise detalhada do seu desempenho</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Exportar PDF</span>
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="tasks">Tarefas</option>
          <option value="finance">Finanças</option>
          <option value="productivity">Produtividade</option>
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">Última Semana</option>
          <option value="month">Último Mês</option>
          <option value="quarter">Último Trimestre</option>
          <option value="year">Último Ano</option>
        </select>
      </div>

      {reportType === 'tasks' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportCard
              title="Taxa de Conclusão"
              value="67%"
              change={12}
              icon={CheckSquare}
              color="bg-green-500"
            />
            <ReportCard
              title="Tarefas Criadas"
              value="14"
              change={-5}
              icon={Plus}
              color="bg-blue-500"
            />
            <ReportCard
              title="Tempo Médio"
              value="45min"
              change={8}
              icon={Clock}
              color="bg-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Tarefas</h3>
              <div className="space-y-4">
                {taskData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtividade Semanal</h3>
              <div className="space-y-3">
                {productivityData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700 w-8">{day.day}</span>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(day.tasks / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">{day.tasks} tarefas</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {reportType === 'finance' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportCard
              title="Receita Total"
              value="R$ 3.780"
              change={5}
              icon={TrendingUp}
              color="bg-green-500"
            />
            <ReportCard
              title="Gastos Totais"
              value="R$ 1.250"
              change={-8}
              icon={TrendingDown}
              color="bg-red-500"
            />
            <ReportCard
              title="Taxa de Economia"
              value="67%"
              change={15}
              icon={PieChart}
              color="bg-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição Financeira</h3>
              <div className="space-y-4">
                {financeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">R$ {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metas e Objetivos</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Meta de Economia</span>
                  <span className="font-semibold text-green-600">R$ 1.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-semibold text-blue-600">253%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Próxima Meta</span>
                  <span className="font-semibold text-purple-600">R$ 5.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tempo Restante</span>
                  <span className="font-semibold text-gray-900">4 meses</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {reportType === 'productivity' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportCard
              title="Horas Trabalhadas"
              value="40h"
              change={5}
              icon={Clock}
              color="bg-blue-500"
            />
            <ReportCard
              title="Eficiência"
              value="85%"
              change={12}
              icon={Zap}
              color="bg-yellow-500"
            />
            <ReportCard
              title="Foco Médio"
              value="6.5h"
              change={-3}
              icon={Target}
              color="bg-green-500"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights de Produtividade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Horário mais produtivo: 14h-16h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Categoria mais eficiente: Estudos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="text-gray-700">Maior distração: Redes sociais</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Padrão semanal: Qua-Sex</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Tempo médio por tarefa: 45min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Taxa de conclusão: 67%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Componente principal do App
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    try {
      setTimeout(() => {
        setUser({ email, uid: '123' });
        setAuthLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
      setAuthLoading(false);
    }
  };

  const handleRegister = async (email, password) => {
    setAuthLoading(true);
    try {
      setTimeout(() => {
        setUser({ email, uid: '123' });
        setAuthLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro no registro:', error);
      alert('Erro ao criar conta. Tente novamente.');
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'tasks':
        return <TaskManagement user={user} />;
      case 'finance':
        return <FinanceManagement user={user} />;
      case 'reports':
        return <Reports user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={authLoading}
      />
    );
  }

  return (
    <AppContext.Provider value={{ user, currentPage, setCurrentPage }}>
      <div className="min-h-screen bg-gray-50">
        <Navigation
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          user={user}
          onLogout={handleLogout}
        />
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </AppContext.Provider> 
  );
};

export default App;