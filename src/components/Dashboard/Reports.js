// src/components/Dashboard/Reports.js - VERSÃO CORRIGIDA
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  Target,
  Award,
  Clock,
  Utensils,
  Activity,
  Download,
  FileText,
  PieChart,
  Users,
  Zap,
  RefreshCw,
  AlertCircle,
  ChefHat,
  Timer,
  Star
} from 'lucide-react';
import { useTasks, TASK_TYPES } from '../../hooks/useTasks';
import { useDiet } from '../../hooks/useDiet';
import { useFinance } from '../../hooks/useFinance';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart as RePieChart, 
  Cell 
} from 'recharts';

// Cores para os gráficos
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

// Componente de Métricas de Consistência
const ConsistencyMetrics = ({ tasks, period = 'month' }) => {
  const [metrics, setMetrics] = useState({
    daily: { total: 0, completed: 0, rate: 0 },
    weekly: { total: 0, completed: 0, rate: 0 },
    monthly: { total: 0, completed: 0, rate: 0 }
  });

  useEffect(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
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
      default:
        startDate.setMonth(now.getMonth());
        startDate.setDate(1);
    }

    const periodTasks = tasks.filter(task => {
      if (!task.createdAt) return false;
      const taskDate = new Date(task.createdAt);
      return taskDate >= startDate;
    });

    const dailyTasks = periodTasks.filter(t => t.taskType === TASK_TYPES.DAILY);
    const weeklyTasks = periodTasks.filter(t => t.taskType === TASK_TYPES.WEEKLY);
    const monthlyTasks = periodTasks.filter(t => t.taskType === TASK_TYPES.MONTHLY);

    const calcRate = (completed, total) => total > 0 ? (completed / total) * 100 : 0;

    setMetrics({
      daily: {
        total: dailyTasks.length,
        completed: dailyTasks.filter(t => t.completed).length,
        rate: calcRate(dailyTasks.filter(t => t.completed).length, dailyTasks.length)
      },
      weekly: {
        total: weeklyTasks.length,
        completed: weeklyTasks.filter(t => t.completed).length,
        rate: calcRate(weeklyTasks.filter(t => t.completed).length, weeklyTasks.length)
      },
      monthly: {
        total: monthlyTasks.length,
        completed: monthlyTasks.filter(t => t.completed).length,
        rate: calcRate(monthlyTasks.filter(t => t.completed).length, monthlyTasks.length)
      }
    });
  }, [tasks, period]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Consistência na Rotina
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.daily.rate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Tarefas Diárias</div>
          <div className="text-xs text-gray-500">
            {metrics.daily.completed}/{metrics.daily.total} concluídas
          </div>
        </div>

        <div className="text-center">
          <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
            <RefreshCw className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.weekly.rate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Tarefas Semanais</div>
          <div className="text-xs text-gray-500">
            {metrics.weekly.completed}/{metrics.weekly.total} concluídas
          </div>
        </div>

        <div className="text-center">
          <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.monthly.rate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Tarefas Mensais</div>
          <div className="text-xs text-gray-500">
            {metrics.monthly.completed}/{metrics.monthly.total} concluídas
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Análise de Dieta
const DietAnalysis = ({ currentDiet, mealProgress, period = 'week' }) => {
  const [analysis, setAnalysis] = useState({
    totalMeals: 0,
    completedMeals: 0,
    completionRate: 0,
    bestMeal: null,
    worstMeal: null,
    dailyAverages: []
  });

  useEffect(() => {
    if (!currentDiet) return;

    const totalMeals = Object.keys(currentDiet.meals || {}).length;
    const completedMeals = Object.values(mealProgress).filter(p => p.completed).length;
    const completionRate = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

    // Simular dados históricos para análise
    const dailyAverages = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simular dados de conclusão (seria obtido do histórico real)
      const dayProgress = Math.random() * 100;
      
      dailyAverages.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        progress: dayProgress,
        completed: Math.floor((dayProgress / 100) * totalMeals),
        total: totalMeals
      });
    }

    setAnalysis({
      totalMeals,
      completedMeals,
      completionRate,
      bestMeal: 'lunch',
      worstMeal: 'lateSnack',
      dailyAverages
    });
  }, [currentDiet, mealProgress]);

  if (!currentDiet) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma dieta ativa
          </h3>
          <p className="text-gray-600">
            Crie uma dieta para ver análises detalhadas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Análise da Dieta - {currentDiet.name}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Progresso Hoje</span>
            <span className="text-lg font-semibold text-gray-900">
              {analysis.completedMeals}/{analysis.totalMeals}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${analysis.completionRate}%` }}
            />
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analysis.completionRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Conclusão</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {currentDiet.calories} kcal
            </div>
            <div className="text-sm text-gray-600">Meta Calórica</div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-sm font-medium text-blue-600">
                {currentDiet.macros.protein}g
              </div>
              <div className="text-xs text-gray-500">Proteína</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-green-600">
                {currentDiet.macros.carbs}g
              </div>
              <div className="text-xs text-gray-500">Carboidrato</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-orange-600">
                {currentDiet.macros.fat}g
              </div>
              <div className="text-xs text-gray-500">Gordura</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Progresso dos Últimos 7 Dias
        </h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analysis.dailyAverages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(1)}%`, 'Conclusão']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="progress" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Componente de Produtividade por Categoria
const ProductivityByCategory = ({ tasks, period = 'month' }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
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
      default:
        startDate.setMonth(now.getMonth());
        startDate.setDate(1);
    }

    const periodTasks = tasks.filter(task => {
      if (!task.createdAt) return false;
      const taskDate = new Date(task.createdAt);
      return taskDate >= startDate;
    });

    const categoryData = periodTasks.reduce((acc, task) => {
      const category = task.category || 'other';
      if (!acc[category]) {
        acc[category] = { total: 0, completed: 0 };
      }
      acc[category].total += 1;
      if (task.completed) {
        acc[category].completed += 1;
      }
      return acc;
    }, {});

    const chartData = Object.entries(categoryData).map(([category, stats]) => ({
      category: category === 'work' ? 'Trabalho' : 
                category === 'personal' ? 'Pessoal' :
                category === 'health' ? 'Saúde' :
                category === 'study' ? 'Estudos' :
                category === 'finance' ? 'Finanças' : 'Outros',
      total: stats.total,
      completed: stats.completed,
      rate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
    }));

    setData(chartData);
  }, [tasks, period]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Produtividade por Categoria
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'total' ? value : `${value.toFixed(1)}%`,
                name === 'total' ? 'Total' : name === 'completed' ? 'Concluídas' : 'Taxa'
              ]}
            />
            <Bar dataKey="total" fill="#E5E7EB" />
            <Bar dataKey="completed" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente de Gráfico de Tendências - CORRIGIDO
const TrendChart = ({ tasks, finances, period = 'month' }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const now = new Date();
    const chartData = [];
    
    const daysToShow = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayTasks = tasks.filter(task => {
        if (!task.createdAt) return false;
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === date.toDateString();
      });
      
      const dayFinances = finances.filter(transaction => {
        if (!transaction.date) return false;
        const transactionDate = new Date(transaction.date);
        return transactionDate.toDateString() === date.toDateString();
      });

      const completedTasks = dayTasks.filter(t => t.completed).length;
      const totalExpenses = dayFinances
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      chartData.push({
        date: date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        tasks: completedTasks,
        expenses: totalExpenses,
        productivity: dayTasks.length > 0 ? (completedTasks / dayTasks.length) * 100 : 0
      });
    }

    setData(chartData);
  }, [tasks, finances, period]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Tendências de Produtividade
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'productivity' ? `${value.toFixed(1)}%` : 
                name === 'expenses' ? `R$ ${value.toFixed(2)}` : value,
                name === 'productivity' ? 'Produtividade' : 
                name === 'expenses' ? 'Gastos' : 'Tarefas'
              ]}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="productivity" 
              stroke="#3B82F6" 
              strokeWidth={2}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="tasks" 
              stroke="#10B981" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente de Resumo Executivo
const ExecutiveSummary = ({ tasks, currentDiet, finances, period = 'month' }) => {
  const [summary, setSummary] = useState({
    totalTasks: 0,
    completedTasks: 0,
    productivityRate: 0,
    dietCompliance: 0,
    financialHealth: 0,
    recommendations: []
  });

  useEffect(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
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
      default:
        startDate.setMonth(now.getMonth());
        startDate.setDate(1);
    }

    const periodTasks = tasks.filter(task => {
      if (!task.createdAt) return false;
      const taskDate = new Date(task.createdAt);
      return taskDate >= startDate;
    });

    const totalTasks = periodTasks.length;
    const completedTasks = periodTasks.filter(t => t.completed).length;
    const productivityRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calcular compliance da dieta (simulado)
    const dietCompliance = currentDiet ? 75 : 0;

    // Calcular saúde financeira (simulado)
    const totalIncome = finances.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = finances.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const financialHealth = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Gerar recomendações
    const recommendations = [];
    if (productivityRate < 70) {
      recommendations.push('Considere revisar suas metas diárias para aumentar a produtividade');
    }
    if (dietCompliance < 80 && currentDiet) {
      recommendations.push('Mantenha maior consistência na dieta para melhores resultados');
    }
    if (financialHealth < 20) {
      recommendations.push('Revise seus gastos para melhorar a saúde financeira');
    }

    setSummary({
      totalTasks,
      completedTasks,
      productivityRate,
      dietCompliance,
      financialHealth,
      recommendations
    });
  }, [tasks, currentDiet, finances, period]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Resumo Executivo
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {summary.productivityRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Produtividade</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {summary.dietCompliance.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Compliance Dieta</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {summary.financialHealth.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Saúde Financeira</div>
        </div>
      </div>

      {summary.recommendations.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Recomendações:</h4>
          <ul className="space-y-1">
            {summary.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-blue-800 flex items-start">
                <Star className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Componente Principal - CORRIGIDO
const Reports = () => {
  const { 
    tasks, 
    dailyTasks, 
    weeklyTasks, 
    monthlyTasks, 
    mealTasks,
    loading: tasksLoading,
    exportTasks
  } = useTasks();

  const { 
    currentDiet, 
    mealProgress,
    loading: dietLoading 
  } = useDiet();

  const { 
    transactions,
    loading: financeLoading,
    exportFinancialData
  } = useFinance();

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('overview');

  const allTasks = [...tasks, ...dailyTasks, ...weeklyTasks, ...monthlyTasks, ...mealTasks];
  const isLoading = tasksLoading || dietLoading || financeLoading;

  const handleExportData = () => {
    const confirmExport = window.confirm('Deseja exportar todos os dados de relatório?');
    if (confirmExport) {
      exportTasks('json', selectedPeriod, 'all');
      if (exportFinancialData) {
        exportFinancialData('json', selectedPeriod);
      }
    }
  };

  if (isLoading) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Relatórios e Análises
              </h1>
              <p className="text-gray-600">
                Insights detalhados sobre sua produtividade e rotina
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Última Semana</option>
              <option value="month">Este Mês</option>
              <option value="year">Este Ano</option>
            </select>
            
            <button
              onClick={handleExportData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navegação de Visualizações */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Target },
            { id: 'consistency', label: 'Consistência', icon: CheckCircle },
            { id: 'diet', label: 'Dieta', icon: Utensils },
            { id: 'productivity', label: 'Produtividade', icon: TrendingUp }
          ].map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  selectedView === view.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo dos Relatórios */}
      <div className="space-y-8">
        {selectedView === 'overview' && (
          <>
            <ExecutiveSummary 
              tasks={allTasks}
              currentDiet={currentDiet}
              finances={transactions}
              period={selectedPeriod}
            />
            <TrendChart 
              tasks={allTasks}
              finances={transactions}
              period={selectedPeriod}
            />
          </>
        )}

        {selectedView === 'consistency' && (
          <>
            <ConsistencyMetrics 
              tasks={allTasks}
              period={selectedPeriod}
            />
            <ProductivityByCategory 
              tasks={allTasks}
              period={selectedPeriod}
            />
          </>
        )}

        {selectedView === 'diet' && (
          <DietAnalysis 
            currentDiet={currentDiet}
            mealProgress={mealProgress}
            period={selectedPeriod}
          />
        )}

        {selectedView === 'productivity' && (
          <>
            <ProductivityByCategory 
              tasks={allTasks}
              period={selectedPeriod}
            />
            <TrendChart 
              tasks={allTasks}
              finances={transactions}
              period={selectedPeriod}
            />
          </>
        )}
      </div>

      {/* Resumo de Dados */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo dos Dados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {allTasks.length}
            </div>
            <div className="text-sm text-gray-600">Total de Tarefas</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {dailyTasks.length}
            </div>
            <div className="text-sm text-gray-600">Tarefas Diárias</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">
              {transactions.length}
            </div>
            <div className="text-sm text-gray-600">Transações</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {currentDiet ? 1 : 0}
            </div>
            <div className="text-sm text-gray-600">Dieta Ativa</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;