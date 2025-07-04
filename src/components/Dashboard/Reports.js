    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
    import { 
    TrendingUp, 
    TrendingDown, 
    Calendar, 
    Download, 
    Target, 
    CheckCircle,
    Clock,
    DollarSign,
    Activity,
    Award
    } from 'lucide-react';

    // Dados mockados para demonstração
    const monthlyData = [
    { month: 'Jan', income: 3780, expenses: 2450, tasks: 28, completed: 22 },
    { month: 'Fev', income: 3780, expenses: 2380, tasks: 32, completed: 28 },
    { month: 'Mar', income: 3780, expenses: 2520, tasks: 30, completed: 25 },
    { month: 'Abr', income: 3780, expenses: 2410, tasks: 35, completed: 31 },
    { month: 'Mai', income: 3780, expenses: 2580, tasks: 28, completed: 26 },
    { month: 'Jun', income: 3780, expenses: 2480, tasks: 33, completed: 30 },
    { month: 'Jul', income: 3780, expenses: 2550, tasks: 29, completed: 27 },
    { month: 'Ago', income: 3780, expenses: 2420, tasks: 34, completed: 32 },
    { month: 'Set', income: 3780, expenses: 2510, tasks: 31, completed: 28 },
    { month: 'Out', income: 3780, expenses: 2490, tasks: 36, completed: 34 },
    { month: 'Nov', income: 3780, expenses: 2530, tasks: 33, completed: 31 },
    { month: 'Dez', income: 3780, expenses: 2470, tasks: 25, completed: 18 }
    ];

    const expenseCategories = [
    { name: 'Alimentação', value: 2000, color: '#10B981' },
    { name: 'Família', value: 150, color: '#EC4899' },
    { name: 'Utilities', value: 350, color: '#F59E0B' },
    { name: 'Materiais', value: 300, color: '#8B5CF6' },
    { name: 'Outros', value: 200, color: '#6B7280' }
    ];

    const productivityData = [
    { category: 'Estudos', planned: 7, completed: 5.5 },
    { category: 'Trabalho', planned: 47.5, completed: 47.5 },
    { category: 'Academia', planned: 7.5, completed: 6.8 },
    { category: 'Conteúdo', planned: 6.75, completed: 5.2 },
    { category: 'Leitura', planned: 3.5, completed: 2.8 }
    ];

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
            {change && (
            <div className={`flex items-center mt-2 ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
                {change >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                {Math.abs(change)}% vs mês anterior
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

    // Componente de Relatórios
    const Reports = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('6months');
    const [selectedMetric, setSelectedMetric] = useState('financial');

    // Calcular métricas
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    
    const avgIncome = monthlyData.reduce((sum, m) => sum + m.income, 0) / monthlyData.length;
    const avgExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0) / monthlyData.length;
    const avgSavings = avgIncome - avgExpenses;
    
    const totalTasks = monthlyData.reduce((sum, m) => sum + m.tasks, 0);
    const totalCompleted = monthlyData.reduce((sum, m) => sum + m.completed, 0);
    const avgProductivity = (totalCompleted / totalTasks) * 100;

    const incomeChange = ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100;
    const expenseChange = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;
    const productivityChange = ((currentMonth.completed / currentMonth.tasks) - (previousMonth.completed / previousMonth.tasks)) * 100;

    // Filtrar dados baseado no período selecionado
    const getFilteredData = () => {
        switch (selectedPeriod) {
        case '3months':
            return monthlyData.slice(-3);
        case '6months':
            return monthlyData.slice(-6);
        case '12months':
            return monthlyData;
        default:
            return monthlyData.slice(-6);
        }
    };

    const filteredData = getFilteredData();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-2">Análise completa do seu progresso</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="3months">Últimos 3 meses</option>
                <option value="6months">Últimos 6 meses</option>
                <option value="12months">Últimos 12 meses</option>
            </select>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
                <Download className="h-4 w-4" />
                <span>Exportar</span>
            </motion.button>
            </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
            title="Receita Média"
            value={avgIncome.toLocaleString()}
            change={incomeChange}
            icon={DollarSign}
            color="bg-green-500"
            prefix="R$ "
            />
            <MetricCard
            title="Gasto Médio"
            value={avgExpenses.toLocaleString()}
            change={expenseChange}
            icon={TrendingDown}
            color="bg-red-500"
            prefix="R$ "
            />
            <MetricCard
            title="Poupança Média"
            value={avgSavings.toLocaleString()}
            change={5.2}
            icon={Target}
            color="bg-blue-500"
            prefix="R$ "
            />
            <MetricCard
            title="Produtividade"
            value={avgProductivity.toFixed(1)}
            change={productivityChange}
            icon={Activity}
            color="bg-purple-500"
            suffix="%"
            />
        </div>

        {/* Seletor de Métricas */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
            <div className="flex flex-wrap gap-2 mb-6">
            {[
                { key: 'financial', label: 'Financeiro' },
                { key: 'productivity', label: 'Produtividade' },
                { key: 'goals', label: 'Metas' }
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

            {/* Gráfico Financeiro */}
            {selectedMetric === 'financial' && (
            <div className="h-80">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Evolução Financeira
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                    formatter={(value) => [`R$ ${value.toLocaleString()}`, '']}
                    />
                    <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Receita"
                    />
                    <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    name="Despesas"
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
            )}

            {/* Gráfico de Produtividade */}
            {selectedMetric === 'productivity' && (
            <div className="h-80">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Horas Semanais - Planejado vs Realizado
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}h`, '']} />
                    <Bar dataKey="planned" fill="#93C5FD" name="Planejado" />
                    <Bar dataKey="completed" fill="#3B82F6" name="Realizado" />
                </BarChart>
                </ResponsiveContainer>
            </div>
            )}

            {/* Gráfico de Metas */}
            {selectedMetric === 'goals' && (
            <div className="h-80">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Progresso das Tarefas Mensais
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    name="Tarefas Criadas"
                    />
                    <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Tarefas Concluídas"
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
            )}
        </div>

        {/* Análise Detalhada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Distribuição de Gastos */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
            >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribuição de Gastos
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    >
                    {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                </PieChart>
                </ResponsiveContainer>
            </div>
            </motion.div>

            {/* Insights e Recomendações */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
            >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Insights e Recomendações
            </h3>
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">Poupança Consistente</p>
                    <p className="text-sm text-gray-600">
                    Você tem mantido uma economia média de R$ {avgSavings.toLocaleString()} por mês. Excelente!
                    </p>
                </div>
                </div>

                <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                    <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">Meta de Produtividade</p>
                    <p className="text-sm text-gray-600">
                    Sua taxa de conclusão de tarefas está em {avgProductivity.toFixed(1)}%. 
                    Tente chegar a 90% para melhor eficiência.
                    </p>
                </div>
                </div>

                <div className="flex items-start space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">Otimização de Tempo</p>
                    <p className="text-sm text-gray-600">
                    Considere dedicar mais tempo aos estudos nos finais de semana 
                    para compensar a rotina de trabalho.
                    </p>
                </div>
                </div>

                <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                    <Award className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">Parabéns!</p>
                    <p className="text-sm text-gray-600">
                    Você está no caminho certo para suas metas financeiras e de produtividade.
                    </p>
                </div>
                </div>
            </div>
            </motion.div>
        </div>
        </div>
    );
    };

    export default Reports;