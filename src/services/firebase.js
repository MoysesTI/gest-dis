// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase - SUAS credenciais reais
const firebaseConfig = {
  apiKey: "AIzaSyBgfs4gjnea9qGY_OSXOFOEQO702kI0Kh4",
  authDomain: "sistema-gestao-moyses.firebaseapp.com",
  projectId: "sistema-gestao-moyses",
  storageBucket: "sistema-gestao-moyses.firebasestorage.app",
  messagingSenderId: "640849245591",
  appId: "1:640849245591:web:b5031611a83b15cc1640d2",
  measurementId: "G-RVGBC3BTR6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);

// Inicializar Analytics apenas em produção
let analytics = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
    console.log('📊 Firebase Analytics inicializado');
  } catch (error) {
    console.warn('⚠️ Analytics não pôde ser inicializado:', error.message);
  }
}

// Conectar emuladores apenas em desenvolvimento (opcional)
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('🔧 Conectado aos emuladores Firebase');
  } catch (error) {
    console.log('Emuladores já conectados ou não disponíveis');
  }
}

export { analytics };

// Função para verificar conexão
export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testando conexão Firebase...');
    console.log('📍 Projeto:', firebaseConfig.projectId);
    
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