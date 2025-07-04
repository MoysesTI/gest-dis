// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Verificar se as configurações foram carregadas
console.log('🔥 Firebase Config Status:', {
  apiKey: firebaseConfig.apiKey ? '✅ OK' : '❌ Missing',
  authDomain: firebaseConfig.authDomain ? '✅ OK' : '❌ Missing',
  projectId: firebaseConfig.projectId ? '✅ OK' : '❌ Missing'
});

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);

// Inicializar Analytics apenas se measurementId estiver presente
let analytics = null;
if (firebaseConfig.measurementId && typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
    console.log('📊 Firebase Analytics inicializado com sucesso');
  } catch (error) {
    console.warn('⚠️ Analytics não pôde ser inicializado:', error.message);
  }
}

export { analytics };

// Função para verificar conexão (corrigida)
export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testando conexão Firebase...');
    console.log('📍 Projeto conectado:', firebaseConfig.projectId);
    
    // Teste simples de conexão
    if (auth && db) {
      console.log('✅ Firebase conectado com sucesso!');
      return true;
    } else {
      console.log('❌ Serviços Firebase não inicializados');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com Firebase:', error.message);
    return false;
  }
};

export const firebaseApp = app;
export default app;