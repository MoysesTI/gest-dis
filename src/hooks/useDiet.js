// src/hooks/useDiet.js
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Dados das dietas base
const DIET_TEMPLATES = {
  LOW_CARB: {
    name: "Low Carb - Perda de Gordura",
    objective: "Redução de gordura corporal mantendo massa muscular",
    calories: 2400,
    macros: { protein: 202, carbs: 120, fat: 130 },
    meals: {
      breakfast: {
        name: "Café da Manhã",
        time: "07:00",
        items: ["4 ovos inteiros mexidos com margarina", "1 fatia de pão integral", "Café sem açúcar"]
      },
      morningSnack: {
        name: "Lanche da Manhã", 
        time: "10:00",
        items: ["Whey protein (30g) com água", "1 banana pequena"]
      },
      lunch: {
        name: "Almoço",
        time: "13:00", 
        items: ["Peito de frango grelhado (180g)", "Arroz integral (40g cru)", "Feijão (30g cru)", "Brócolis refogado", "Salada verde"]
      },
      afternoonSnack: {
        name: "Lanche da Tarde",
        time: "16:00",
        items: ["Iogurte natural (200g)", "Whey protein (25g) misturado no iogurte"]
      },
      dinner: {
        name: "Jantar",
        time: "19:00",
        items: ["Carne bovina magra (150g)", "Omelete de 2 ovos", "Salada verde com tomate"]
      },
      lateSnack: {
        name: "Ceia",
        time: "22:00",
        items: ["Vitamina: 300ml leite integral + 1 banana + canela"]
      }
    }
  },
  HIGH_CARB: {
    name: "Alto Carb - Ganho de Massa",
    objective: "Maximizar ganho de massa muscular",
    calories: 3200,
    macros: { protein: 202, carbs: 400, fat: 100 },
    meals: {
      breakfast: {
        name: "Café da Manhã",
        time: "07:00",
        items: ["3 ovos mexidos com margarina", "2 fatias de pão integral", "1 banana grande", "200ml leite integral"]
      },
      morningSnack: {
        name: "Lanche da Manhã",
        time: "10:00", 
        items: ["Whey protein (30g) com água", "2 fatias de pão integral", "1 banana"]
      },
      lunch: {
        name: "Almoço",
        time: "13:00",
        items: ["Peito de frango grelhado (180g)", "Arroz branco (80g cru)", "Feijão (50g cru)", "Brócolis refogado", "Salada verde"]
      },
      afternoonSnack: {
        name: "Lanche da Tarde",
        time: "16:00",
        items: ["Iogurte natural (250g)", "Whey protein (25g)", "2 fatias de pão integral"]
      },
      dinner: {
        name: "Jantar", 
        time: "19:00",
        items: ["Carne bovina (150g)", "Macarrão (70g cru)", "Molho de tomate", "Brócolis refogado"]
      },
      lateSnack: {
        name: "Ceia",
        time: "22:00",
        items: ["Mingau: 300ml leite integral + 30g aveia + 1 banana + canela"]
      }
    }
  },
  MEDIUM_CARB: {
    name: "Médio Carb - Recomposição",
    objective: "Ganho de massa com mínimo acúmulo de gordura",
    calories: 2800,
    macros: { protein: 202, carbs: 260, fat: 115 },
    meals: {
      breakfast: {
        name: "Café da Manhã",
        time: "07:00",
        items: ["3 ovos mexidos com margarina", "1 fatia de pão integral", "1 banana média", "200ml leite integral"]
      },
      morningSnack: {
        name: "Lanche da Manhã",
        time: "10:00",
        items: ["Whey protein (30g) com água", "1 fatia de pão integral"]
      },
      lunch: {
        name: "Almoço",
        time: "13:00",
        items: ["Peito de frango grelhado (180g)", "Arroz integral (60g cru)", "Feijão (40g cru)", "Brócolis refogado", "Salada verde"]
      },
      afternoonSnack: {
        name: "Lanche da Tarde",
        time: "16:00",
        items: ["Iogurte natural (200g)", "Whey protein (25g)", "1 fatia de pão integral"]
      },
      dinner: {
        name: "Jantar",
        time: "19:00",
        items: ["Carne bovina magra (150g)", "Macarrão integral (50g cru)", "Molho de tomate", "Brócolis refogado"]
      },
      lateSnack: {
        name: "Ceia",
        time: "22:00",
        items: ["Tapioca doce: 25g tapioca + 200ml leite + 1/2 banana + canela"]
      }
    }
  }
};

export const useDiet = () => {
  const [currentDiet, setCurrentDiet] = useState(null);
  const [dietHistory, setDietHistory] = useState([]);
  const [mealProgress, setMealProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Buscar dieta atual do usuário
  useEffect(() => {
    if (!user) {
      setCurrentDiet(null);
      setDietHistory([]);
      setMealProgress({});
      setLoading(false);
      return;
    }

    console.log('🍽️ Buscando dieta para usuário:', user.uid);

    const currentDietRef = doc(db, 'userDiets', user.uid);
    const unsubscribeCurrent = onSnapshot(currentDietRef, 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setCurrentDiet({
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt
          });
        } else {
          setCurrentDiet(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('❌ Erro ao buscar dieta atual:', error);
        setError(error);
        setLoading(false);
      }
    );

    // Buscar histórico de dietas
    const historyQuery = query(
      collection(db, 'dietHistory'),
      where('userId', '==', user.uid)
    );

    const unsubscribeHistory = onSnapshot(historyQuery,
      (snapshot) => {
        const history = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt instanceof Timestamp ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt,
          endedAt: doc.data().endedAt instanceof Timestamp ? doc.data().endedAt.toDate().toISOString() : doc.data().endedAt
        }));
        setDietHistory(history);
      },
      (error) => {
        console.error('❌ Erro ao buscar histórico de dietas:', error);
      }
    );

    // Buscar progresso das refeições de hoje
    const today = new Date().toISOString().split('T')[0];
    const progressQuery = query(
      collection(db, 'mealProgress'),
      where('userId', '==', user.uid),
      where('date', '==', today)
    );

    const unsubscribeProgress = onSnapshot(progressQuery,
      (snapshot) => {
        const progress = {};
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          progress[data.mealType] = {
            id: doc.id,
            completed: data.completed,
            completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate().toISOString() : data.completedAt,
            notes: data.notes || ''
          };
        });
        setMealProgress(progress);
      },
      (error) => {
        console.error('❌ Erro ao buscar progresso das refeições:', error);
      }
    );

    return () => {
      unsubscribeCurrent();
      unsubscribeHistory();
      unsubscribeProgress();
    };
  }, [user]);

  // Criar nova dieta
  const createDiet = async (dietType, customizations = {}) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (!DIET_TEMPLATES[dietType]) {
      toast.error('Tipo de dieta inválido');
      return;
    }

    try {
      console.log('🍽️ Criando nova dieta:', dietType);

      // Se já existe uma dieta, mover para histórico
      if (currentDiet) {
        await moveCurrentDietToHistory();
      }

      const dietTemplate = DIET_TEMPLATES[dietType];
      const newDiet = {
        userId: user.uid,
        type: dietType,
        name: dietTemplate.name,
        objective: dietTemplate.objective,
        calories: dietTemplate.calories,
        macros: dietTemplate.macros,
        meals: dietTemplate.meals,
        customizations: customizations,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'userDiets', user.uid), newDiet);
      
      // Criar tarefas diárias para as refeições
      await createDailyMealTasks(dietTemplate.meals);

      console.log('✅ Dieta criada com sucesso');
      toast.success(`Dieta ${dietTemplate.name} criada com sucesso!`);
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao criar dieta:', error);
      toast.error('Erro ao criar dieta: ' + error.message);
      throw error;
    }
  };

  // Mover dieta atual para histórico
  const moveCurrentDietToHistory = async () => {
    if (!currentDiet) return;

    try {
      await setDoc(doc(db, 'dietHistory', `${user.uid}_${Date.now()}`), {
        ...currentDiet,
        endedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('❌ Erro ao mover dieta para histórico:', error);
    }
  };

  // Criar tarefas diárias para as refeições
  const createDailyMealTasks = async (meals) => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (const [mealType, mealData] of Object.entries(meals)) {
      const taskData = {
        title: `${mealData.name} - ${mealData.time}`,
        description: `Refeição: ${mealData.items.join(', ')}`,
        category: 'health',
        priority: 'high',
        taskType: 'daily',
        mealType: mealType,
        mealTime: mealData.time,
        completed: false,
        userId: user.uid,
        dueDate: lastDayOfMonth.toISOString().split('T')[0],
        repeatUntil: lastDayOfMonth.toISOString().split('T')[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'tasks', `${user.uid}_meal_${mealType}_${today.getMonth() + 1}`), taskData);
    }
  };

  // Atualizar dieta atual
  const updateDiet = async (updates) => {
    if (!user || !currentDiet) {
      toast.error('Nenhuma dieta ativa para atualizar');
      return;
    }

    try {
      console.log('📝 Atualizando dieta:', updates);

      const dietRef = doc(db, 'userDiets', user.uid);
      await updateDoc(dietRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      toast.success('Dieta atualizada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar dieta:', error);
      toast.error('Erro ao atualizar dieta: ' + error.message);
      throw error;
    }
  };

  // Deletar dieta atual
  const deleteDiet = async () => {
    if (!user || !currentDiet) {
      toast.error('Nenhuma dieta ativa para deletar');
      return;
    }

    try {
      console.log('🗑️ Deletando dieta atual');

      // Mover para histórico antes de deletar
      await moveCurrentDietToHistory();

      // Deletar documento da dieta atual
      await deleteDoc(doc(db, 'userDiets', user.uid));

      // Deletar tarefas de refeições associadas
      const today = new Date();
      const meals = Object.keys(currentDiet.meals || {});
      
      for (const mealType of meals) {
        try {
          await deleteDoc(doc(db, 'tasks', `${user.uid}_meal_${mealType}_${today.getMonth() + 1}`));
        } catch (error) {
          console.log(`Tarefa de refeição ${mealType} não encontrada para deletar`);
        }
      }

      toast.success('Dieta deletada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao deletar dieta:', error);
      toast.error('Erro ao deletar dieta: ' + error.message);
      throw error;
    }
  };

  // Marcar refeição como completa
  const completeMeal = async (mealType, notes = '') => {
    if (!user || !currentDiet) {
      toast.error('Nenhuma dieta ativa');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const progressId = `${user.uid}_${mealType}_${today}`;

      await setDoc(doc(db, 'mealProgress', progressId), {
        userId: user.uid,
        mealType: mealType,
        date: today,
        completed: true,
        completedAt: serverTimestamp(),
        notes: notes || ''
      });

      toast.success(`Refeição ${currentDiet.meals[mealType]?.name} marcada como completa!`);
    } catch (error) {
      console.error('❌ Erro ao completar refeição:', error);
      toast.error('Erro ao marcar refeição como completa');
      throw error;
    }
  };

  // Desmarcar refeição
  const uncompleteMeal = async (mealType) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const progressId = `${user.uid}_${mealType}_${today}`;

      await deleteDoc(doc(db, 'mealProgress', progressId));

      toast.success('Refeição desmarcada');
    } catch (error) {
      console.error('❌ Erro ao desmarcar refeição:', error);
      toast.error('Erro ao desmarcar refeição');
      throw error;
    }
  };

  // Obter estatísticas da dieta
  const getDietStats = (period = 'week') => {
    if (!currentDiet) return null;

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
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Calcular estatísticas do progresso das refeições
    const totalMeals = Object.keys(currentDiet.meals).length;
    const completedToday = Object.values(mealProgress).filter(p => p.completed).length;
    const completionRate = totalMeals > 0 ? (completedToday / totalMeals) * 100 : 0;

    return {
      currentDiet: currentDiet.name,
      totalMeals,
      completedToday,
      completionRate,
      calories: currentDiet.calories,
      macros: currentDiet.macros,
      objective: currentDiet.objective,
      daysActive: currentDiet.createdAt ? Math.ceil((now - new Date(currentDiet.createdAt)) / (1000 * 60 * 60 * 24)) : 0
    };
  };

  // Obter templates de dieta disponíveis
  const getDietTemplates = () => {
    return Object.keys(DIET_TEMPLATES).map(key => ({
      type: key,
      ...DIET_TEMPLATES[key]
    }));
  };

  return {
    currentDiet,
    dietHistory,
    mealProgress,
    loading,
    error,
    createDiet,
    updateDiet,
    deleteDiet,
    completeMeal,
    uncompleteMeal,
    getDietStats,
    getDietTemplates,
    dietTemplates: DIET_TEMPLATES
  };
};

export default useDiet;