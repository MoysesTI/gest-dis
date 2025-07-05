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

// Importar contextos e hooks
import { useAuth } from './contexts/AuthContext';
import { useTasks } from './hooks/useTasks';
import { useFinance } from './hooks/useFinance';

// IMPORTAR OS COMPONENTES REAIS - CORREÇÃO PRINCIPAL
import TaskManagement from './components/Tasks/TaskManagement';
import FinanceManagement from './components/Finance/FinanceManagement';
import Reports from './components/Dashboard/Reports';

// Context da aplicação
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
    if (!email || !password) return;
    
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
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
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
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
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
                {user?.email?.split('@')[0] || 'Usuário'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Logout"
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

// Dashboard com dados reais
const Dashboard = ({ user }) => {
  const { getTaskStats } = useTasks();
  const { getFinancialStats, userFinancialConfig } = useFinance();
  
  // Obter estatísticas reais
  const taskStats = getTaskStats('month');
  const financeStats = getFinancialStats('month');
  
  const completionRate = taskStats.total > 0 ? taskStats.completionRate : 0;
  const userName = user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {userName}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Aqui está um resumo do seu progresso atual
        </p>
      </div>

      {/* Cards de Estatísticas Reais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tarefas do Mês</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
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
              <p className="text-sm text-gray-600">Receitas do Mês</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {financeStats.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-blue-600">
              Esperado: R$ {userFinancialConfig.monthlyIncome.total.toLocaleString()}
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Despesas do Mês</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {financeStats.totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {Object.keys(financeStats.expensesByCategory).length} categorias
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saldo Atual</p>
              <p className={`text-2xl font-bold ${financeStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {financeStats.balance.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-sm ${financeStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {financeStats.balance >= 0 ? 'Positivo' : 'Negativo'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Seções de Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumo de Tarefas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status das Tarefas
          </h3>
          {taskStats.total > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold text-gray-900">{taskStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Concluídas</span>
                <span className="font-semibold text-green-600">{taskStats.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pendentes</span>
                <span className="font-semibold text-blue-600">{taskStats.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vencidas</span>
                <span className="font-semibold text-red-600">{taskStats.overdue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Para Hoje</span>
                <span className="font-semibold text-yellow-600">{taskStats.dueToday}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma tarefa criada ainda</p>
              <p className="text-sm">Comece criando sua primeira tarefa!</p>
            </div>
          )}
        </motion.div>

        {/* Resumo Financeiro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo Financeiro
          </h3>
          {financeStats.transactionCount > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transações</span>
                <span className="font-semibold text-gray-900">{financeStats.transactionCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maior Receita</span>
                <span className="font-semibold text-green-600">
                  R$ {Math.max(...Object.values(financeStats.incomeByCategory || {}), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maior Gasto</span>
                <span className="font-semibold text-red-600">
                  R$ {Math.max(...Object.values(financeStats.expensesByCategory || {}), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de Economia</span>
                <span className={`font-semibold ${financeStats.totalIncome > 0 && financeStats.balance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {financeStats.totalIncome > 0 ? ((financeStats.balance / financeStats.totalIncome) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma transação registrada</p>
              <p className="text-sm">Comece adicionando suas receitas e despesas!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Dica do Salário */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Configuração do Salário</h4>
            <p className="text-blue-800 text-sm mb-3">
              Sua renda mensal configurada é de <strong>R$ {userFinancialConfig.monthlyIncome.total.toLocaleString()}</strong> 
              (Salário base: R$ {userFinancialConfig.monthlyIncome.base.toLocaleString()}, 
              Auxílio transporte: R$ {userFinancialConfig.monthlyIncome.transport.toLocaleString()}, 
              Horas extras: R$ {userFinancialConfig.monthlyIncome.overtime.toLocaleString()}).
            </p>
            <p className="text-blue-700 text-sm">
              Para registrar suas receitas mensais, adicione transações de receita na seção Finanças.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Componente principal do App
const App = () => {
  const { user, loading: authLoading, login, register, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Função de login
  const handleLogin = async (email, password) => {
    setIsLoggingIn(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Função de registro
  const handleRegister = async (email, password) => {
    setIsLoggingIn(true);
    try {
      await register(email, password, email.split('@')[0]);
    } catch (error) {
      console.error('Erro no registro:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await logout();
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // CORREÇÃO PRINCIPAL: Renderizar componentes REAIS ao invés dos placeholders
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'tasks':
        return <TaskManagement />; // ✅ COMPONENTE REAL
      case 'finance':
        return <FinanceManagement />; // ✅ COMPONENTE REAL
      case 'reports':
        return <Reports />; // ✅ COMPONENTE REAL
      default:
        return <Dashboard user={user} />;
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoggingIn}
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