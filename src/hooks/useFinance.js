// src/hooks/useFinance.js
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
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Configurações financeiras fixas do usuário
const USER_FINANCIAL_CONFIG = {
  monthlyIncome: {
    base: parseFloat(process.env.REACT_APP_USER_SALARY_BASE) || 3000,
    transport: parseFloat(process.env.REACT_APP_USER_TRANSPORT_ALLOWANCE) || 220,
    overtime: parseFloat(process.env.REACT_APP_USER_OVERTIME) || 560,
    get total() {
      return this.base + this.transport + this.overtime;
    }
  }
};

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

    console.log('🔍 Buscando transações para usuário:', user.uid);

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('📊 Transações recebidas:', snapshot.size);
        const transactionsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Converter timestamps do Firestore para strings
            date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt
          };
        });
        setTransactions(transactionsData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('❌ Erro ao buscar transações:', error);
        setError(error);
        setLoading(false);
        toast.error('Erro ao carregar transações financeiras');
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Adicionar nova transação
  const addTransaction = async (transactionData) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('💰 Criando transação:', transactionData);
      
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        userId: user.uid,
        amount: parseFloat(transactionData.amount),
        date: transactionData.date || new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Transação criada com ID:', docRef.id);
      toast.success('Transação adicionada com sucesso!');
      return docRef.id;
    } catch (error) {
      console.error('❌ Erro ao adicionar transação:', error);
      toast.error('Erro ao criar transação: ' + error.message);
      throw error;
    }
  };

  // Atualizar transação
  const updateTransaction = async (transactionId, updates) => {
    try {
      console.log('📝 Atualizando transação:', transactionId, updates);
      
      const transactionRef = doc(db, 'transactions', transactionId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      if (updates.amount) {
        updateData.amount = parseFloat(updates.amount);
      }
      
      await updateDoc(transactionRef, updateData);
      
      console.log('✅ Transação atualizada');
      toast.success('Transação atualizada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error);
      toast.error('Erro ao atualizar transação: ' + error.message);
      throw error;
    }
  };

  // Deletar transação
  const deleteTransaction = async (transactionId) => {
    try {
      console.log('🗑️ Deletando transação:', transactionId);
      
      await deleteDoc(doc(db, 'transactions', transactionId));
      
      console.log('✅ Transação deletada');
      toast.success('Transação excluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao deletar transação:', error);
      toast.error('Erro ao excluir transação: ' + error.message);
      throw error;
    }
  };

  // Calcular estatísticas financeiras
  const getFinancialStats = (period = 'month') => {
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
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
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
    const daysInPeriod = getDaysInPeriod(period);
    const avgIncome = totalIncome / daysInPeriod;
    const avgExpenses = totalExpenses / daysInPeriod;

    // Transações recentes
    const recentTransactions = periodTransactions.slice(0, 10);

    return {
      period,
      totalIncome,
      totalExpenses,
      balance,
      expensesByCategory,
      incomeByCategory,
      avgIncome,
      avgExpenses,
      recentTransactions,
      transactionCount: periodTransactions.length,
      daysInPeriod,
      // Incluir renda total esperada (salário fixo + transações)
      expectedIncome: USER_FINANCIAL_CONFIG.monthlyIncome.total,
      actualVsExpected: totalIncome - USER_FINANCIAL_CONFIG.monthlyIncome.total
    };
  };

  // Obter dados para gráficos
  const getChartData = (months = 12) => {
    const now = new Date();
    const data = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        year: date.getFullYear(),
        fullDate: date,
        income,
        expenses,
        balance: income - expenses,
        expectedIncome: USER_FINANCIAL_CONFIG.monthlyIncome.total
      });
    }

    return data;
  };

  // Obter análise de orçamento
  const getBudgetAnalysis = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    // Gastos atuais por categoria
    const actualExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // Renda atual vs esperada
    const actualIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = Object.values(actualExpenses).reduce((a, b) => a + b, 0);
    const currentBalance = actualIncome - totalExpenses;

    return {
      expectedIncome: USER_FINANCIAL_CONFIG.monthlyIncome.total,
      actualIncome,
      actualExpenses,
      totalExpenses,
      currentBalance,
      savingsRate: actualIncome > 0 ? (currentBalance / actualIncome) * 100 : 0,
      incomeCompletion: (actualIncome / USER_FINANCIAL_CONFIG.monthlyIncome.total) * 100
    };
  };

  // Exportar dados financeiros
  const exportFinancialData = (format = 'json', period = 'month') => {
    const stats = getFinancialStats(period);
    const chartData = getChartData();
    const budgetAnalysis = getBudgetAnalysis();

    const dataToExport = {
      exportDate: new Date().toISOString(),
      userId: user?.uid,
      period,
      summary: {
        totalTransactions: stats.transactionCount,
        totalIncome: stats.totalIncome,
        totalExpenses: stats.totalExpenses,
        balance: stats.balance,
        expectedIncome: stats.expectedIncome
      },
      transactions: transactions.map(t => ({
        date: t.date,
        description: t.description,
        category: t.category,
        type: t.type === 'income' ? 'Receita' : 'Despesa',
        amount: t.amount
      })),
      categoryBreakdown: {
        expenses: stats.expensesByCategory,
        income: stats.incomeByCategory
      },
      monthlyTrends: chartData,
      budgetAnalysis
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
        ...dataToExport.transactions.map(t => 
          `${t.date},${t.description},${t.category},${t.type},${t.amount}`
        )
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financas_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast.success('Dados financeiros exportados com sucesso!');
  };

  // Função auxiliar
  const getDaysInPeriod = (period) => {
    switch (period) {
      case 'week': return 7;
      case 'month': return new Date().getDate(); // Dias decorridos no mês atual
      case 'quarter': return 90;
      case 'year': return new Date().getDayOfYear || 365;
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
    exportFinancialData,
    userFinancialConfig: USER_FINANCIAL_CONFIG
  };
};

export default useFinance;