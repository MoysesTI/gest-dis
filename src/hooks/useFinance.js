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

    // Hook personalizado para gerenciar finanças
    export const useFinance = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Buscar transações do usuário em tempo real
    useEffect(() => {
        if (!user) {
        setTransactions([]);
        setLoading(false);
        return;
        }

        const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, 
        (snapshot) => {
            const transactionsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
            }));
            setTransactions(transactionsData);
            setLoading(false);
        },
        (error) => {
            console.error('Erro ao buscar transações:', error);
            setError(error);
            setLoading(false);
            toast.error('Erro ao carregar transações');
        }
        );

        return () => unsubscribe();
    }, [user]);

    // Adicionar nova transação
    const addTransaction = async (transactionData) => {
        try {
        const docRef = await addDoc(collection(db, 'transactions'), {
            ...transactionData,
            userId: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        toast.success('Transação criada com sucesso!');
        return docRef.id;
        } catch (error) {
        console.error('Erro ao adicionar transação:', error);
        toast.error('Erro ao criar transação');
        throw error;
        }
    };

    // Atualizar transação
    const updateTransaction = async (transactionId, updates) => {
        try {
        const transactionRef = doc(db, 'transactions', transactionId);
        await updateDoc(transactionRef, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
        
        toast.success('Transação atualizada com sucesso!');
        } catch (error) {
        console.error('Erro ao atualizar transação:', error);
        toast.error('Erro ao atualizar transação');
        throw error;
        }
    };

    // Deletar transação
    const deleteTransaction = async (transactionId) => {
        try {
        await deleteDoc(doc(db, 'transactions', transactionId));
        toast.success('Transação excluída com sucesso!');
        } catch (error) {
        console.error('Erro ao deletar transação:', error);
        toast.error('Erro ao excluir transação');
        throw error;
        }
    };

    // Calcular estatísticas financeiras
    const getFinancialStats = (period = 'month') => {
        const now = new Date();
        const startDate = new Date();

        // Definir período
        switch (period) {
        case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
        case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        default:
            startDate.setMonth(now.getMonth() - 1);
        }

        // Filtrar transações do período
        const periodTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate;
        });

        // Calcular totais
        const totalIncome = periodTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = periodTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpenses;

        // Agrupar por categoria
        const expensesByCategory = periodTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

        const incomeByCategory = periodTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

        // Calcular médias
        const avgIncome = totalIncome / getDaysInPeriod(period);
        const avgExpenses = totalExpenses / getDaysInPeriod(period);

        // Transações recentes
        const recentTransactions = periodTransactions.slice(0, 5);

        return {
        totalIncome,
        totalExpenses,
        balance,
        expensesByCategory,
        incomeByCategory,
        avgIncome,
        avgExpenses,
        recentTransactions,
        transactionCount: periodTransactions.length
        };
    };

    // Obter dados para gráficos
    const getChartData = (period = 'month', type = 'both') => {
        const now = new Date();
        const months = [];
        const data = [];

        // Gerar últimos 12 meses
        for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            month: date.toLocaleDateString('pt-BR', { month: 'short' }),
            year: date.getFullYear(),
            fullDate: date
        });
        }

        // Calcular dados para cada mês
        months.forEach(({ month, year, fullDate }) => {
        const monthStart = new Date(fullDate);
        const monthEnd = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

        const monthTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= monthStart && transactionDate <= monthEnd;
        });

        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        data.push({
            month,
            year,
            income,
            expenses,
            balance: income - expenses
        });
        });

        return data;
    };

    // Obter orçamento e comparação
    const getBudgetAnalysis = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
                transactionDate.getFullYear() === currentYear;
        });

        // Orçamento baseado na sua renda
        const monthlyBudget = {
        income: 3780, // Sua renda total
        expenses: {
            family: 150,
            utilities: 250,
            internet: 100,
            account: 150,
            materials: 300,
            food: 2000,
            clothing: 200,
            entertainment: 130,
            investment: 500
        }
        };

        // Gastos atuais por categoria
        const actualExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

        // Comparação orçamento vs real
        const budgetComparison = {};
        Object.keys(monthlyBudget.expenses).forEach(category => {
        const budgeted = monthlyBudget.expenses[category];
        const actual = actualExpenses[category] || 0;
        const difference = budgeted - actual;
        const percentage = budgeted > 0 ? (actual / budgeted) * 100 : 0;

        budgetComparison[category] = {
            budgeted,
            actual,
            difference,
            percentage,
            status: difference >= 0 ? 'under' : 'over'
        };
        });

        return {
        monthlyBudget,
        actualExpenses,
        budgetComparison,
        totalBudgeted: Object.values(monthlyBudget.expenses).reduce((a, b) => a + b, 0),
        totalActual: Object.values(actualExpenses).reduce((a, b) => a + b, 0)
        };
    };

    // Exportar dados financeiros
    const exportFinancialData = (format = 'json', period = 'month') => {
        const stats = getFinancialStats(period);
        const chartData = getChartData(period);
        const budgetAnalysis = getBudgetAnalysis();

        const dataToExport = {
        resumo: {
            periodo: period,
            receitas: stats.totalIncome,
            despesas: stats.totalExpenses,
            saldo: stats.balance,
            numeroTransacoes: stats.transactionCount
        },
        transacoes: transactions.map(t => ({
            data: t.date,
            descricao: t.description,
            categoria: t.category,
            tipo: t.type === 'income' ? 'Receita' : 'Despesa',
            valor: t.amount
        })),
        gastosPorCategoria: stats.expensesByCategory,
        receitasPorCategoria: stats.incomeByCategory,
        evolucaoMensal: chartData,
        analiseOrcamento: budgetAnalysis
        };

        if (format === 'json') {
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financas_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        } else if (format === 'csv') {
        const csv = [
            'Data,Descrição,Categoria,Tipo,Valor',
            ...dataToExport.transacoes.map(t => 
            `${t.data},${t.descricao},${t.categoria},${t.tipo},${t.valor}`
            )
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financas_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        }

        toast.success('Dados financeiros exportados com sucesso!');
    };

    // Função auxiliar para obter dias no período
    const getDaysInPeriod = (period) => {
        switch (period) {
        case 'week': return 7;
        case 'month': return 30;
        case 'quarter': return 90;
        case 'year': return 365;
        default: return 30;
        }
    };

    return {
        transactions,
        loading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getFinancialStats,
        getChartData,
        getBudgetAnalysis,
        exportFinancialData
    };
    };

    // Hook para relatórios financeiros avançados
    export const useFinancialReports = () => {
    const { transactions } = useFinance();

    // Análise de tendências
    const getTrendAnalysis = () => {
        const last6Months = getChartData('month').slice(-6);
        
        const incomeGrowth = calculateGrowthRate(last6Months, 'income');
        const expenseGrowth = calculateGrowthRate(last6Months, 'expenses');
        const balanceGrowth = calculateGrowthRate(last6Months, 'balance');

        return {
        incomeGrowth,
        expenseGrowth,
        balanceGrowth,
        trend: balanceGrowth > 0 ? 'positive' : 'negative'
        };
    };

    // Calcular taxa de crescimento
    const calculateGrowthRate = (data, field) => {
        if (data.length < 2) return 0;
        
        const latest = data[data.length - 1][field];
        const previous = data[data.length - 2][field];
        
        if (previous === 0) return 0;
        
        return ((latest - previous) / previous) * 100;
    };

    // Previsões baseadas em tendências
    const getFinancialForecast = (months = 3) => {
        const trends = getTrendAnalysis();
        const currentStats = getFinancialStats('month');
        
        const forecast = [];
        
        for (let i = 1; i <= months; i++) {
        const projectedIncome = currentStats.totalIncome * (1 + (trends.incomeGrowth / 100));
        const projectedExpenses = currentStats.totalExpenses * (1 + (trends.expenseGrowth / 100));
        
        forecast.push({
            month: i,
            projectedIncome,
            projectedExpenses,
            projectedBalance: projectedIncome - projectedExpenses
        });
        }
        
        return forecast;
    };

    return {
        getTrendAnalysis,
        getFinancialForecast
    };
    };

    export default useFinance;