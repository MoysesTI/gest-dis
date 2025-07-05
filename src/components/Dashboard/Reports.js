import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Target, 
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Award,
  Info,
  AlertTriangle,
  PieChart,
  Plus
} from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useFinance } from '../../hooks/useFinance';

// Componente de Cartão de Métrica
const MetricCard = ({ title, value, change, icon: Icon, color, prefix = '', suffix = '' }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {prefix}{value}{suffix}
        </p>
        {change !== undefined && (
          <div className={`flex items-center mt-2 ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(change).toFixed(1)}% vs mês anterior
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </motion.div>
);

// Componente de Gráfico Simples
const SimpleBarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600 truncate">{item.name}</div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-16 text-sm font-medium text-right text-gray-900">
              {typeof item.value === 'number' && item.value > 1000 
                ? `R$ ${item.value.toLocaleString('pt-BR')}`
                : item.value
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente principal de Relatórios
const Reports = () => {
  const { getTaskStats, getProductivityChartData, exportTasks } = useTasks();
  const { getFinancialStats, getChartData, exportFinancialData } = useFinance();
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Obter dados das tarefas
  const taskStats = useMemo(() => getTaskStats(selectedPeriod), [selectedPeriod, getTaskStats]);
  const productivityData = useMemo(() => getProductivityChartData(30), [getProductivityChartData]);
  
  // Obter dados financeiros
  const financeStats = useMemo(() => getFinancialStats(selectedPeriod), [selectedPeriod, getFinancialStats]);
  const chartData = useMemo(() => getChartData(6), [getChartData]);

  // Calcular mudanças percentuais (simuladas)
  const getPercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Simular dados do mês anterior para comparação
  const previousTaskStats = {
    completed: Math.max(0, taskStats.completed - Math.floor(Math.random() * 5)),
    total: Math.max(0, taskStats.total - Math.floor(Math.random() * 8)),
    completionRate: Math.max(0, taskStats.completionRate - Math.random() * 20)
  };

  const previousFinanceStats = {
    totalIncome: Math.max(0, financeStats.totalIncome - Math.random() * 1000),
    totalExpenses: Math.max(0, financeStats.totalExpenses - Math.random() * 500),
    balance: financeStats.balance - Math.random() * 800
  };

  // Preparar dados para gráficos
  const categoryTasksData = Object.entries(taskStats.byCategory || {}).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count
  }));

  const priorityTasksData = Object.entries(taskStats.byPriority || {}).map(([priority, count]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: count
  }));

  const expenseCategoryData = Object.entries(financeStats.expensesByCategory || {}).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount
  }));

  const monthlyTrendData = chartData.slice(-6).map(item => ({
    name: item.month,
    value: item.balance
  }));

  // Exportar relatórios
  const handleExportTasks = () => {
    exportTasks('csv', selectedPeriod);
  };

  const handleExportFinance = () => {
    exportFinancialData('csv', selectedPeriod);
  };

  const handleExportComplete = () => {
    // Exportar dados combinados
    const combinedData = {
      periodo: selectedPeriod,
      dataGeracao: new Date().toISOString(),
      tarefas: taskStats,
      financas: financeStats,
      tendencias: chartData
    };

    const blob = new Blob([JSON.stringify(combinedData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_completo_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2">Análise detalhada do seu desempenho</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Ano</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportComplete}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Relatório</span>
          </motion.button>
        </div>
      </div>

      {/* Seletor de Métricas */}
      <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'overview', label: 'Visão Geral' },
            { key: 'tasks', label: 'Tarefas' },
            { key: 'finance', label: 'Finanças' },
            { key: 'trends', label: 'Tendências' }
          ].map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedMetric === metric.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>

        {/* Visão Geral */}
        {selectedMetric === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Taxa de Conclusão"
                value={taskStats.completionRate.toFixed(1)}
                change={getPercentageChange(taskStats.completionRate, previousTaskStats.completionRate)}
                icon={CheckCircle}
                color="bg-green-500"
                suffix="%"
              />
              <MetricCard
                title="Tarefas Concluídas"
                value={taskStats.completed}
                change={getPercentageChange(taskStats.completed, previousTaskStats.completed)}
                icon={Target}
                color="bg-blue-500"
              />
              <MetricCard
                title="Saldo Atual"
                value={financeStats.balance.toLocaleString('pt-BR')}
                change={getPercentageChange(financeStats.balance, previousFinanceStats.balance)}
                icon={DollarSign}
                color="bg-green-500"
                prefix="R$ "
              />
              <MetricCard
                title="Economia Mensal"
                value={financeStats.totalIncome > 0 ? ((financeStats.balance / financeStats.totalIncome) * 100).toFixed(1) : '0'}
                change={5.2}
                icon={PieChart}
                color="bg-purple-500"
                suffix="%"
              />
            </div>

            {/* Resumo Rápido */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumo de Produtividade
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total de Tarefas</span>
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
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumo Financeiro
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Receitas</span>
                    <span className="font-semibold text-green-600">
                      R$ {financeStats.totalIncome.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Despesas</span>
                    <span className="font-semibold text-red-600">
                      R$ {financeStats.totalExpenses.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transações</span>
                    <span className="font-semibold text-gray-900">{financeStats.transactionCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Maior Categoria</span>
                    <span className="font-semibold text-gray-900">
                      R$ {Math.max(...Object.values(financeStats.expensesByCategory || {}), 0).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Relatório de Tarefas */}
        {selectedMetric === 'tasks' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Taxa de Conclusão"
                value={taskStats.completionRate.toFixed(1)}
                change={getPercentageChange(taskStats.completionRate, previousTaskStats.completionRate)}
                icon={CheckCircle}
                color="bg-green-500"
                suffix="%"
              />
              <MetricCard
                title="Tarefas Criadas"
                value={taskStats.total}
                change={getPercentageChange(taskStats.total, previousTaskStats.total)}
                icon={Plus}
                color="bg-blue-500"
              />
              <MetricCard
                title="Tempo Estimado"
                value={taskStats.totalEstimatedTime || 0}
                change={8}
                icon={Clock}
                color="bg-purple-500"
                suffix=" min"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {categoryTasksData.length > 0 && (
                <SimpleBarChart
                  data={categoryTasksData}
                  title="Tarefas por Categoria"
                />
              )}
              
              {priorityTasksData.length > 0 && (
                <SimpleBarChart
                  data={priorityTasksData}
                  title="Tarefas por Prioridade"
                />
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleExportTasks}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Dados de Tarefas</span>
              </button>
            </div>
          </div>
        )}

        {/* Relatório Financeiro */}
        {selectedMetric === 'finance' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Receita Total"
                value={financeStats.totalIncome.toLocaleString('pt-BR')}
                change={getPercentageChange(financeStats.totalIncome, previousFinanceStats.totalIncome)}
                icon={TrendingUp}
                color="bg-green-500"
                prefix="R$ "
              />
              <MetricCard
                title="Gastos Totais"
                value={financeStats.totalExpenses.toLocaleString('pt-BR')}
                change={getPercentageChange(financeStats.totalExpenses, previousFinanceStats.totalExpenses)}
                icon={TrendingDown}
                color="bg-red-500"
                prefix="R$ "
              />
              <MetricCard
                title="Taxa de Economia"
                value={financeStats.totalIncome > 0 ? ((financeStats.balance / financeStats.totalIncome) * 100).toFixed(1) : '0'}
                change={15}
                icon={PieChart}
                color="bg-blue-500"
                suffix="%"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {expenseCategoryData.length > 0 && (
                <SimpleBarChart
                  data={expenseCategoryData}
                  title="Gastos por Categoria"
                />
              )}
              
              {monthlyTrendData.length > 0 && (
                <SimpleBarChart
                  data={monthlyTrendData}
                  title="Evolução do Saldo (6 meses)"
                />
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleExportFinance}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Dados Financeiros</span>
              </button>
            </div>
          </div>
        )}

        {/* Tendências */}
        {selectedMetric === 'trends' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Insights e Recomendações
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Produtividade Consistente</p>
                    <p className="text-sm text-gray-600">
                      Sua taxa de conclusão está em {taskStats.completionRate.toFixed(1)}%. 
                      {taskStats.completionRate >= 70 ? ' Excelente trabalho!' : ' Tente melhorar gradualmente.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Controle Financeiro</p>
                    <p className="text-sm text-gray-600">
                      {financeStats.balance >= 0 
                        ? `Parabéns! Você tem um saldo positivo de R$ ${financeStats.balance.toLocaleString('pt-BR')}.`
                        : 'Atenção: seu saldo está negativo. Revise seus gastos.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Gestão de Tempo</p>
                    <p className="text-sm text-gray-600">
                      {taskStats.overdue > 0 
                        ? `Você tem ${taskStats.overdue} tarefa(s) vencida(s). Priorize-as!`
                        : 'Ótimo! Nenhuma tarefa vencida no momento.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Award className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Próximas Metas</p>
                    <p className="text-sm text-gray-600">
                      Continue focado! Tente manter uma taxa de conclusão acima de 80% 
                      e uma economia mensal de pelo menos 20%.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados de Produtividade dos Últimos 30 Dias */}
            {productivityData.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Produtividade Diária (Últimos 30 dias)
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {productivityData.slice(-21).map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                      <div className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                        day.completed > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {day.completed}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Cada célula mostra o número de tarefas concluídas no dia.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Aviso sobre Dados */}
      {(taskStats.total === 0 && financeStats.transactionCount === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Dados Insuficientes</h4>
              <p className="text-yellow-800 text-sm mb-3">
                Para gerar relatórios mais precisos, você precisa de mais dados. 
                Comece criando tarefas e registrando transações financeiras.
              </p>
              <p className="text-yellow-700 text-sm">
                💡 <strong>Dica:</strong> Use o sistema por pelo menos uma semana para obter insights valiosos!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;