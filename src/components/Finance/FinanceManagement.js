    import React, { useState, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown, 
    PieChart, 
    Plus, 
    Minus,
    Edit,
    Trash2,
    Calendar,
    Target,
    CreditCard,
    Wallet,
    Home,
    Car,
    ShoppingCart,
    Heart,
    Shirt,
    Coffee,
    Wifi
    } from 'lucide-react';

    // Componente de Cartão de Transação
    const TransactionCard = ({ transaction, onEdit, onDelete }) => {
    const categoryIcons = {
        salary: <Wallet className="h-5 w-5" />,
        transport: <Car className="h-5 w-5" />,
        overtime: <TrendingUp className="h-5 w-5" />,
        family: <Heart className="h-5 w-5" />,
        utilities: <Home className="h-5 w-5" />,
        internet: <Wifi className="h-5 w-5" />,
        account: <CreditCard className="h-5 w-5" />,
        materials: <ShoppingCart className="h-5 w-5" />,
        food: <Coffee className="h-5 w-5" />,
        clothing: <Shirt className="h-5 w-5" />,
        entertainment: <Heart className="h-5 w-5" />,
        investment: <TrendingUp className="h-5 w-5" />
    };

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
                {categoryIcons[transaction.category] || <DollarSign className="h-5 w-5" />}
            </div>
            <div>
                <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                <p className="text-sm text-gray-600">
                {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                </p>
            </div>
            </div>
            <div className="flex items-center space-x-3">
            <span className={`font-bold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
                {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString()}
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

    const handleSubmit = () => {
        if (!formData.description || !formData.amount || !formData.category) return;
        
        onSave({
        ...formData,
        id: transaction?.id || Date.now().toString(),
        amount: parseFloat(formData.amount),
        createdAt: transaction?.createdAt || new Date().toISOString()
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
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {transaction ? 'Editar Transação' : 'Nova Transação'}
            </h3>

            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
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
                    Tipo
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
                    Valor (R$)
                </label>
                <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0,00"
                    step="0.01"
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
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
    const [transactions, setTransactions] = useState([
        // Receitas mensais
        {
        id: '1',
        description: 'Salário Base',
        amount: 3000,
        category: 'salary',
        type: 'income',
        date: '2024-12-10',
        createdAt: '2024-12-01T10:00:00Z'
        },
        {
        id: '2',
        description: 'Auxílio Transporte',
        amount: 220,
        category: 'transport',
        type: 'income',
        date: '2024-12-10',
        createdAt: '2024-12-01T10:00:00Z'
        },
        {
        id: '3',
        description: 'Horas Extras',
        amount: 560,
        category: 'overtime',
        type: 'income',
        date: '2024-12-10',
        createdAt: '2024-12-01T10:00:00Z'
        },
        // Gastos fixos
        {
        id: '4',
        description: 'Contribuição Familiar',
        amount: 150,
        category: 'family',
        type: 'expense',
        date: '2024-12-05',
        createdAt: '2024-12-01T11:00:00Z'
        },
        {
        id: '5',
        description: 'Conta de Luz',
        amount: 250,
        category: 'utilities',
        type: 'expense',
        date: '2024-12-07',
        createdAt: '2024-12-01T11:00:00Z'
        },
        {
        id: '6',
        description: 'Internet',
        amount: 100,
        category: 'internet',
        type: 'expense',
        date: '2024-12-05',
        createdAt: '2024-12-01T11:00:00Z'
        },
        {
        id: '7',
        description: 'Conta PicPay',
        amount: 150,
        category: 'account',
        type: 'expense',
        date: '2024-12-05',
        createdAt: '2024-12-01T11:00:00Z'
        },
        {
        id: '8',
        description: 'Materiais',
        amount: 300,
        category: 'materials',
        type: 'expense',
        date: '2024-12-08',
        createdAt: '2024-12-01T11:00:00Z'
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('2024-12');

    // Calcular estatísticas
    const currentMonthTransactions = transactions.filter(t => 
        t.date.startsWith(selectedMonth)
    );

    const totalIncome = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Categorizar gastos
    const expensesByCategory = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
        }, {});

    // Sugestões de distribuição
    const suggestedBudget = {
        investment: 500,  // R$ 500 (18%)
        food: 2000,       // R$ 2000 (71%) - Seu gasto real
        clothing: 200,    // R$ 200 (7%)
        entertainment: 130 // R$ 130 (4%)
    };

    const remainingForSuggestions = balance - Object.values(suggestedBudget).reduce((a, b) => a + b, 0);

    // Funções de manipulação
    const handleSaveTransaction = (transactionData) => {
        if (editingTransaction) {
        setTransactions(transactions.map(t => 
            t.id === editingTransaction.id ? transactionData : t
        ));
        } else {
        setTransactions([...transactions, transactionData]);
        }
        setEditingTransaction(null);
        setShowForm(false);
    };

    const handleDeleteTransaction = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
        setTransactions(transactions.filter(t => t.id !== id));
        }
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setShowForm(true);
    };

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
                <option value="2024-12">Dezembro 2024</option>
                <option value="2024-11">Novembro 2024</option>
                <option value="2024-10">Outubro 2024</option>
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
                <p className="text-2xl font-bold">R$ {totalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-green-400 p-3 rounded-full">
                <TrendingUp className="h-6 w-6" />
                </div>
            </div>
            </motion.div>

            <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white"
            >
            <div className="flex items-center justify-between">
                <div>
                <p className="text-red-100">Despesas</p>
                <p className="text-2xl font-bold">R$ {totalExpenses.toLocaleString()}</p>
                </div>
                <div className="bg-red-400 p-3 rounded-full">
                <TrendingDown className="h-6 w-6" />
                </div>
            </div>
            </motion.div>

            <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-r ${
                balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'
            } rounded-xl p-6 text-white`}
            >
            <div className="flex items-center justify-between">
                <div>
                <p className={balance >= 0 ? 'text-blue-100' : 'text-orange-100'}>Saldo</p>
                <p className="text-2xl font-bold">R$ {balance.toLocaleString()}</p>
                </div>
                <div className={`${balance >= 0 ? 'bg-blue-400' : 'bg-orange-400'} p-3 rounded-full`}>
                <Wallet className="h-6 w-6" />
                </div>
            </div>
            </motion.div>
        </div>

        {/* Distribuição Sugerida */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição Sugerida do Saldo (R$ {balance.toLocaleString()})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Investimentos</span>
                </div>
                <span className="text-sm font-bold text-blue-600">18%</span>
                </div>
                <p className="text-lg font-bold text-blue-600 mt-2">
                R$ {suggestedBudget.investment.toLocaleString()}
                </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Coffee className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Alimentação</span>
                </div>
                <span className="text-sm font-bold text-green-600">71%</span>
                </div>
                <p className="text-lg font-bold text-green-600 mt-2">
                R$ {suggestedBudget.food.toLocaleString()}
                </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Shirt className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Roupas</span>
                </div>
                <span className="text-sm font-bold text-purple-600">7%</span>
                </div>
                <p className="text-lg font-bold text-purple-600 mt-2">
                R$ {suggestedBudget.clothing.toLocaleString()}
                </p>
            </div>

            <div className="bg-pink-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-pink-600" />
                    <span className="text-sm font-medium text-gray-700">Lazer</span>
                </div>
                <span className="text-sm font-bold text-pink-600">4%</span>
                </div>
                <p className="text-lg font-bold text-pink-600 mt-2">
                R$ {suggestedBudget.entertainment.toLocaleString()}
                </p>
            </div>
            </div>
        </div>

        {/* Lista de Transações */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Transações Recentes
            </h3>
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

            {currentMonthTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                Nenhuma transação encontrada para este mês
            </div>
            )}
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