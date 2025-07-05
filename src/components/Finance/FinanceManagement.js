import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit,
  Trash2,
  Calendar,
  Wallet,
  Home,
  Car,
  ShoppingCart,
  Heart,
  Coffee,
  Wifi,
  CreditCard,
  Briefcase,
  MoreHorizontal
} from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import toast from 'react-hot-toast';

// Mapeamento de ícones para categorias
const categoryIcons = {
  salary: Wallet,
  transport: Car,
  overtime: TrendingUp,
  family: Heart,
  utilities: Home,
  internet: Wifi,
  account: CreditCard,
  materials: ShoppingCart,
  food: Coffee,
  clothing: Heart,
  entertainment: MoreHorizontal,
  investment: TrendingUp,
  other: MoreHorizontal
};

// Componente de Cartão de Transação
const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const Icon = categoryIcons[transaction.category] || MoreHorizontal;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <Icon className={`h-5 w-5 ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
            <p className="text-sm text-gray-600">
              {new Date(transaction.date).toLocaleDateString('pt-BR')} • {transaction.category}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`font-bold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(transaction)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de Formulário de Transação
const TransactionForm = ({ transaction, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    ...transaction
  });

  const incomeCategories = [
    { value: 'salary', label: 'Salário' },
    { value: 'transport', label: 'Auxílio Transporte' },
    { value: 'overtime', label: 'Horas Extras' },
    { value: 'other', label: 'Outros' }
  ];

  const expenseCategories = [
    { value: 'family', label: 'Família' },
    { value: 'utilities', label: 'Conta de Luz' },
    { value: 'internet', label: 'Internet' },
    { value: 'account', label: 'Conta PicPay' },
    { value: 'materials', label: 'Materiais' },
    { value: 'food', label: 'Alimentação' },
    { value: 'clothing', label: 'Roupas' },
    { value: 'entertainment', label: 'Lazer' },
    { value: 'investment', label: 'Investimentos' },
    { value: 'other', label: 'Outros' }
  ];

  const handleSubmit = async () => {
    if (!formData.description || !formData.amount || !formData.category) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
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
          {transaction ? 'Editar Transação' : 'Nova Transação'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Salário mensal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma categoria</option>
              {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
            {transaction ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente principal de Gestão Financeira
const FinanceManagement = () => {
  const {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFinancialStats,
    userFinancialConfig
  } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Filtrar transações do mês selecionado
  const currentMonthTransactions = transactions.filter(t => 
    t.date.startsWith(selectedMonth)
  );

  // Obter estatísticas do mês atual
  const stats = getFinancialStats('month');

  // Funções de manipulação
  const handleSaveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      setEditingTransaction(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Erro ao deletar transação:', error);
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
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
          <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
          <p className="text-gray-600 mt-2">Controle suas finanças pessoais</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Transação</span>
          </motion.button>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Receitas</p>
              <p className="text-2xl font-bold">R$ {stats.totalIncome.toLocaleString('pt-BR', {
                minimumFractionDigits: 2
              })}</p>
            </div>
            <div className="bg-green-400 p-3 rounded-full">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-green-100 text-sm">
              Meta: R$ {userFinancialConfig.monthlyIncome.total.toLocaleString('pt-BR')}
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Despesas</p>
              <p className="text-2xl font-bold">R$ {stats.totalExpenses.toLocaleString('pt-BR', {
                minimumFractionDigits: 2
              })}</p>
            </div>
            <div className="bg-red-400 p-3 rounded-full">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-red-100 text-sm">
              {Object.keys(stats.expensesByCategory).length} categorias
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`bg-gradient-to-r ${
            stats.balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'
          } rounded-xl p-6 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={stats.balance >= 0 ? 'text-blue-100' : 'text-orange-100'}>Saldo</p>
              <p className="text-2xl font-bold">R$ {stats.balance.toLocaleString('pt-BR', {
                minimumFractionDigits: 2
              })}</p>
            </div>
            <div className={`${stats.balance >= 0 ? 'bg-blue-400' : 'bg-orange-400'} p-3 rounded-full`}>
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <p className={`${stats.balance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm`}>
              {stats.balance >= 0 ? 'Positivo' : 'Atenção: Negativo'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Análise de Gastos */}
      {Object.keys(stats.expensesByCategory).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gastos por Categoria - {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.expensesByCategory).map(([category, amount]) => {
              const Icon = categoryIcons[category] || MoreHorizontal;
              const percentage = (amount / stats.totalExpenses) * 100;
              
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700 capitalize">{category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista de Transações */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transações Recentes ({currentMonthTransactions.length})
        </h3>
        
        {currentMonthTransactions.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {currentMonthTransactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(transaction => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma transação encontrada</h3>
            <p className="text-gray-600 mb-4">
              Comece adicionando suas receitas e despesas para este mês.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Adicionar Primeira Transação
            </motion.button>
          </div>
        )}
      </div>

      {/* Dica sobre o Salário */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <DollarSign className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">💡 Dica: Configuração do Salário</h4>
            <p className="text-blue-800 text-sm mb-3">
              Sua renda mensal está configurada como <strong>R$ {userFinancialConfig.monthlyIncome.total.toLocaleString('pt-BR')}</strong>. 
              Para registrar este valor, adicione as seguintes transações mensalmente:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• <strong>Salário Base:</strong> R$ {userFinancialConfig.monthlyIncome.base.toLocaleString('pt-BR')} (categoria: Salário)</li>
              <li>• <strong>Auxílio Transporte:</strong> R$ {userFinancialConfig.monthlyIncome.transport.toLocaleString('pt-BR')} (categoria: Auxílio Transporte)</li>
              <li>• <strong>Horas Extras:</strong> R$ {userFinancialConfig.monthlyIncome.overtime.toLocaleString('pt-BR')} (categoria: Horas Extras)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulário de Transação */}
      <AnimatePresence>
        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onSave={handleSaveTransaction}
            onCancel={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinanceManagement;