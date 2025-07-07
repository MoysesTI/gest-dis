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
  Download,
  ChefHat,
  Utensils
} from 'lucide-react';

// Importar contextos e hooks
import { useAuth } from './contexts/AuthContext';
import { useTasks } from './hooks/useTasks';
import { useFinance } from './hooks/useFinance';
import { useDiet } from './hooks/useDiet'; // ADICIONAR HOOK DE DIETAS

// IMPORTAR TODOS OS COMPONENTES PRINCIPAIS
import TaskManagement from './components/Tasks/TaskManagement';
import FinanceManagement from './components/Finance/FinanceManagement';
import DietManagement from './components/Diet/DietManagement'; // ADICIONAR COMPONENTE DE DIETAS
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
            Produtividade, Finanças e Nutrição
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

// Componente de Navegação - ATUALIZADO COM DIETAS
const Navigation = ({ currentPage, onPageChange, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ADICIONAR DIETAS NO MENU
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'diet', label: 'Dietas', icon: ChefHat }, // NOVO ITEM DE MENU
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

// Dashboard com dados reais - ATUALIZADO COM DIETAS
const Dashboard = ({ user }) => {
  const { getTaskStats } = useTasks();
  const { getFinancialStats, userFinancialConfig } = useFinance();
  const { getDietStats, currentDiet } = useDiet(); // ADICIONAR HOOK DE DIETAS

  // Obter estatísticas reais
  const taskStats = getTaskStats('month');
  const financeStats = getFinancialStats('month');
  const dietStats = getDietStats('month'); // OBTER ESTATÍSTICAS DA DIETA

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

      {/* Cards de Estatísticas Reais - ATUALIZADO COM DIETAS */}
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

        {/* NOVO CARD DE DIETAS */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Refeições Hoje</p>
              <p className="text-2xl font-bold text-gray-900">
                {dietStats ? `${dietStats.completedToday}/${dietStats.totalMeals}` : '0/0'}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <ChefHat className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-orange-600">
              {dietStats ? `${dietStats.completionRate.toFixed(1)}% concluído` : 'Sem dieta ativa'}
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

      {/* Seções de Resumo - ATUALIZADO COM DIETAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

        {/* NOVO RESUMO DE DIETAS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo da Dieta
          </h3>
          {currentDiet ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dieta Ativa</span>
                <span className="font-semibold text-gray-900">{dietStats.currentDiet}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Calorias Alvo</span>
                <span className="font-semibold text-orange-600">{dietStats.calories} kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Refeições Hoje</span>
                <span className="font-semibold text-blue-600">
                  {dietStats.completedToday}/{dietStats.totalMeals}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Progresso</span>
                <span className="font-semibold text-green-600">
                  {dietStats.completionRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dias Ativa</span>
                <span className="font-semibold text-purple-600">{dietStats.daysActive} dias</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ChefHat className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma dieta ativa</p>
              <p className="text-sm">Crie uma dieta para começar!</p>
            </div>
          )}
        </motion.div>

        {/* Resumo Financeiro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

      {/* SEÇÃO DE INFORMAÇÕES DA DIETA ATIVA */}
      {currentDiet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-6"
        >
          <div className="flex items-start space-x-3">
            <ChefHat className="h-6 w-6 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900 mb-2">Dieta Atual: {currentDiet.name}</h4>
              <p className="text-orange-800 text-sm mb-3">
                <strong>Objetivo:</strong> {currentDiet.objective}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {currentDiet.macros.protein}g Proteína
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {currentDiet.macros.carbs}g Carboidrato
                </span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {currentDiet.macros.fat}g Gordura
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {currentDiet.calories} Calorias
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dica do Salário */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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

// Custom Hook para PWA
const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar status da rede
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detectar prompt de instalação
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    // Detectar se foi instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar se já está instalado
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ PWA instalado pelo usuário');
      } else {
        console.log('❌ Usuário recusou instalação PWA');
      }

      setInstallPrompt(null);
    }
  };

  return {
    isOnline,
    installPrompt,
    isInstalled,
    installApp
  };
};

// Componente de Status de Rede
const NetworkStatus = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">
          Você está offline - Algumas funcionalidades podem estar limitadas
        </span>
      </div>
    </div>
  );
};

// Componente de Botão de Instalação
const InstallButton = ({ installPrompt, installApp, isInstalled }) => {
  if (!installPrompt || isInstalled) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <button
        onClick={installApp}
        className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-semibold"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18l9-9M12 18l-9-9M12 18V2" />
        </svg>
        <span>📱 Instalar App</span>
      </button>
    </motion.div>
  );
};

// Componente de Modal para Atualização
const UpdateModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[100]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Versão Disponível!</h3>
        <p className="text-gray-700 mb-6">Uma nova versão do aplicativo está disponível. Deseja atualizar agora?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </motion.div>
    </div>
  );
};


// Componente PWAFeatures para agrupar funcionalidades PWA
const PWAFeatures = ({ setShowTaskModal }) => {
  const { isOnline, installPrompt, isInstalled, installApp } = usePWA();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration);

          // Verificar atualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nova versão disponível
                  setShowUpdateModal(true); // Show custom update modal
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Erro ao registrar Service Worker:', error);
        });
    }

    // Configurar shortcuts de teclado para PWA
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + N para nova tarefa
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        // Abrir modal de nova tarefa
        setShowTaskModal && setShowTaskModal(true);
      }

      // Ctrl/Cmd + F para buscar
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        // Focar no campo de busca
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) searchInput.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Configurar meta viewport para mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
    }

    // Configurar theme-color dinamicamente
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', '#3B82F6');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowTaskModal]); // Add setShowTaskModal to dependency array

  const handleUpdateConfirm = () => {
    window.location.reload();
  };

  const handleUpdateCancel = () => {
    setShowUpdateModal(false);
  };

  return (
    <>
      <NetworkStatus isOnline={isOnline} />
      <InstallButton
        installPrompt={installPrompt}
        installApp={installApp}
        isInstalled={isInstalled}
      />
      <UpdateModal
        show={showUpdateModal}
        onConfirm={handleUpdateConfirm}
        onCancel={handleUpdateCancel}
      />
    </>
  );
};


// Componente principal do App - ATUALIZADO COM DIETAS e PWA
const App = () => {
  const { user, loading: authLoading, login, register, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false); // State for task modal visibility

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

  // RENDERIZAR COMPONENTES COM DIETAS INCLUÍDAS
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'tasks':
        // Pass setShowTaskModal to TaskManagement if it controls the modal
        return <TaskManagement showTaskModal={showTaskModal} setShowTaskModal={setShowTaskModal} />;
      case 'diet': // NOVO CASE PARA DIETAS
        return <DietManagement />;
      case 'finance':
        return <FinanceManagement />;
      case 'reports':
        return <Reports />;
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
    <AppContext.Provider value={{ user, currentPage, setCurrentPage, setShowTaskModal }}>
      <div className="min-h-screen bg-gray-50">
        <PWAFeatures setShowTaskModal={setShowTaskModal} /> {/* Pass setShowTaskModal */}
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
