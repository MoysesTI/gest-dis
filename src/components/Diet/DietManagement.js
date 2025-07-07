// src/components/Diet/DietManagement.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  Circle,
  BarChart3,
  Settings,
  RefreshCw,
  AlertCircle,
  Target,
  TrendingUp,
  Calendar,
  Award,
  ChefHat,
  Zap,
  Info,
  X,
  Check,
  Save
} from 'lucide-react';
import { useDiet } from '../../hooks/useDiet';
import { useTasks } from '../../hooks/useTasks';
import toast from 'react-hot-toast';

// Componente de Card de Dieta
const DietCard = ({ diet, isActive, onSelect, onEdit, onDelete }) => {
  const macroColors = {
    protein: 'bg-blue-100 text-blue-800',
    carbs: 'bg-green-100 text-green-800',
    fat: 'bg-orange-100 text-orange-800'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-200 ${
        isActive ? 'ring-2 ring-blue-500 border-blue-200' : 'border border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <ChefHat className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
              {diet.name}
            </h3>
            <p className="text-sm text-gray-600">{diet.objective}</p>
          </div>
        </div>
        
        {isActive && (
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              Ativa
            </span>
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(diet);
                }}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(diet);
                }}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{diet.calories}</div>
          <div className="text-sm text-gray-600">Calorias</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{Object.keys(diet.meals || {}).length}</div>
          <div className="text-sm text-gray-600">Refeições</div>
        </div>
      </div>

      <div className="flex space-x-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${macroColors.protein}`}>
          {diet.macros?.protein || 0}g Proteína
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${macroColors.carbs}`}>
          {diet.macros?.carbs || 0}g Carbo
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${macroColors.fat}`}>
          {diet.macros?.fat || 0}g Gordura
        </span>
      </div>
    </motion.div>
  );
};

// Componente de Seletor de Dieta
const DietSelector = ({ isOpen, onClose, onSelect }) => {
  const { getDietTemplates } = useDiet();
  const templates = getDietTemplates();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Escolha sua Dieta
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Selecione uma dieta baseada no seu objetivo atual
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <DietCard
                key={template.type}
                diet={template}
                isActive={false}
                onSelect={() => onSelect(template.type)}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente de Refeição
const MealCard = ({ meal, mealType, progress, onComplete, onUncomplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCompleted = progress?.completed || false;

  return (
    <motion.div
      layout
      className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-200 ${
        isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              isCompleted ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Utensils className={`h-5 w-5 ${
                isCompleted ? 'text-green-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-semibold ${
                isCompleted ? 'text-green-900' : 'text-gray-900'
              }`}>
                {meal.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {meal.time}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Info className="h-5 w-5" />
            </button>
            <button
              onClick={isCompleted ? onUncomplete : onComplete}
              className={`p-2 rounded-full transition-all duration-200 ${
                isCompleted 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
              }`}
            >
              {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isCompleted && progress?.completedAt && (
          <div className="mb-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Concluída às {new Date(progress.completedAt).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <h4 className="font-medium text-gray-900 mb-2">Itens da Refeição:</h4>
              <ul className="space-y-1">
                {meal.items.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Componente Principal
const DietManagement = () => {
  const { 
    currentDiet, 
    mealProgress, 
    loading, 
    error,
    createDiet,
    deleteDiet,
    completeMeal,
    uncompleteMeal,
    getDietStats
  } = useDiet();

  const [showDietSelector, setShowDietSelector] = useState(false);
  const [stats, setStats] = useState(null);

  // Atualizar estatísticas
  useEffect(() => {
    if (currentDiet) {
      const dietStats = getDietStats();
      setStats(dietStats);
    }
  }, [currentDiet, mealProgress, getDietStats]);

  const handleCreateDiet = async (dietType) => {
    try {
      await createDiet(dietType);
      setShowDietSelector(false);
      toast.success('Dieta criada e tarefas diárias adicionadas!');
    } catch (error) {
      console.error('Erro ao criar dieta:', error);
    }
  };

  const handleDeleteDiet = async () => {
    if (!currentDiet) return;

    const confirmed = window.confirm(
      'Tem certeza que deseja deletar a dieta atual? Esta ação não pode ser desfeita.'
    );

    if (confirmed) {
      try {
        await deleteDiet();
        toast.success('Dieta deletada com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar dieta:', error);
      }
    }
  };

  const handleCompleteMeal = async (mealType) => {
    try {
      await completeMeal(mealType);
    } catch (error) {
      console.error('Erro ao completar refeição:', error);
    }
  };

  const handleUncompleteMeal = async (mealType) => {
    try {
      await uncompleteMeal(mealType);
    } catch (error) {
      console.error('Erro ao descompletar refeição:', error);
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Erro ao carregar dietas</h3>
              <p className="text-red-700">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <ChefHat className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gerenciamento de Dietas
              </h1>
              <p className="text-gray-600">
                Controle sua alimentação e nutrição
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDietSelector(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Dieta</span>
            </button>
            
            {currentDiet && (
              <button
                onClick={handleDeleteDiet}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Deletar Dieta</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dieta Atual</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentDiet}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Refeições Hoje</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedToday}/{stats.totalMeals}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">
                {stats.completionRate.toFixed(1)}% concluído
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calorias Alvo</p>
                <p className="text-2xl font-bold text-gray-900">{stats.calories}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-orange-600">
                {stats.macros.protein}g proteína
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dias Ativa</p>
                <p className="text-2xl font-bold text-gray-900">{stats.daysActive}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-purple-600">
                {stats.objective}
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Conteúdo Principal */}
      {currentDiet ? (
        <div className="space-y-8">
          {/* Informações da Dieta */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDiet.name}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <strong>Objetivo:</strong> {currentDiet.objective}
                </div>
                <div className="flex space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {currentDiet.macros.protein}g Proteína
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {currentDiet.macros.carbs}g Carboidrato
                  </span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {currentDiet.macros.fat}g Gordura
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso do Dia</span>
                <span>{stats?.completedToday || 0}/{stats?.totalMeals || 0} refeições</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats?.completionRate || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Refeições */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Refeições de Hoje
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(currentDiet.meals || {}).map(([mealType, meal]) => (
                <MealCard
                  key={mealType}
                  meal={meal}
                  mealType={mealType}
                  progress={mealProgress[mealType]}
                  onComplete={() => handleCompleteMeal(mealType)}
                  onUncomplete={() => handleUncompleteMeal(mealType)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
            <ChefHat className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Nenhuma dieta ativa
          </h3>
          <p className="text-gray-600 mb-6">
            Crie uma nova dieta para começar a controlar sua alimentação
          </p>
          <button
            onClick={() => setShowDietSelector(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Criar Primeira Dieta</span>
          </button>
        </div>
      )}

      {/* Modal de Seleção */}
      <AnimatePresence>
        {showDietSelector && (
          <DietSelector
            isOpen={showDietSelector}
            onClose={() => setShowDietSelector(false)}
            onSelect={handleCreateDiet}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DietManagement;