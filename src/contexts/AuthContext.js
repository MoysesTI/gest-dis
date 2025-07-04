    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup
    } from 'firebase/auth';
    import { doc, setDoc, getDoc } from 'firebase/firestore';
    import { auth, db } from '../services/firebase';
    import toast from 'react-hot-toast';

    // Criar contexto de autenticação
    const AuthContext = createContext();

    // Hook para usar o contexto
    export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
    };

    // Provedor de autenticação
    export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Monitorar estado de autenticação
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Buscar dados adicionais do usuário
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            
            setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            ...userData
            });
        } else {
            setUser(null);
        }
        setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Função de login
    const login = async (email, password) => {
        try {
        setError(null);
        const result = await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login realizado com sucesso!');
        return result.user;
        } catch (error) {
        console.error('Erro no login:', error);
        setError(error.message);
        
        // Mensagens de erro personalizadas
        switch (error.code) {
            case 'auth/user-not-found':
            toast.error('Usuário não encontrado');
            break;
            case 'auth/wrong-password':
            toast.error('Senha incorreta');
            break;
            case 'auth/invalid-email':
            toast.error('Email inválido');
            break;
            case 'auth/too-many-requests':
            toast.error('Muitas tentativas. Tente novamente mais tarde');
            break;
            default:
            toast.error('Erro ao fazer login');
        }
        
        throw error;
        }
    };

    // Função de registro
    const register = async (email, password, displayName) => {
        try {
        setError(null);
        
        // Criar usuário
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        // Atualizar perfil
        await updateProfile(result.user, {
            displayName: displayName
        });

        // Criar documento do usuário no Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
            displayName: displayName,
            email: email,
            createdAt: new Date().toISOString(),
            preferences: {
            theme: 'light',
            notifications: true,
            language: 'pt-BR'
            },
            profile: {
            avatar: null,
            bio: '',
            location: '',
            website: ''
            }
        });

        toast.success('Conta criada com sucesso!');
        return result.user;
        } catch (error) {
        console.error('Erro no registro:', error);
        setError(error.message);
        
        switch (error.code) {
            case 'auth/email-already-in-use':
            toast.error('Email já está em uso');
            break;
            case 'auth/weak-password':
            toast.error('Senha muito fraca');
            break;
            case 'auth/invalid-email':
            toast.error('Email inválido');
            break;
            default:
            toast.error('Erro ao criar conta');
        }
        
        throw error;
        }
    };

    // Função de logout
    const logout = async () => {
        try {
        await signOut(auth);
        toast.success('Logout realizado com sucesso!');
        } catch (error) {
        console.error('Erro no logout:', error);
        toast.error('Erro ao fazer logout');
        throw error;
        }
    };

    // Login com Google
    const loginWithGoogle = async () => {
        try {
        setError(null);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // Verificar se é um novo usuário
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        
        if (!userDoc.exists()) {
            // Criar documento do usuário
            await setDoc(doc(db, 'users', result.user.uid), {
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            createdAt: new Date().toISOString(),
            preferences: {
                theme: 'light',
                notifications: true,
                language: 'pt-BR'
            },
            profile: {
                avatar: result.user.photoURL,
                bio: '',
                location: '',
                website: ''
            }
            });
        }

        toast.success('Login com Google realizado com sucesso!');
        return result.user;
        } catch (error) {
        console.error('Erro no login com Google:', error);
        setError(error.message);
        toast.error('Erro ao fazer login com Google');
        throw error;
        }
    };

    // Redefinir senha
    const resetPassword = async (email) => {
        try {
        setError(null);
        await sendPasswordResetEmail(auth, email);
        toast.success('Email de redefinição enviado!');
        } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        setError(error.message);
        
        switch (error.code) {
            case 'auth/user-not-found':
            toast.error('Usuário não encontrado');
            break;
            case 'auth/invalid-email':
            toast.error('Email inválido');
            break;
            default:
            toast.error('Erro ao enviar email de redefinição');
        }
        
        throw error;
        }
    };

    // Atualizar perfil do usuário
    const updateUserProfile = async (updates) => {
        try {
        setError(null);
        
        // Atualizar no Firebase Auth
        if (updates.displayName || updates.photoURL) {
            await updateProfile(auth.currentUser, {
            displayName: updates.displayName,
            photoURL: updates.photoURL
            });
        }

        // Atualizar no Firestore
        await setDoc(doc(db, 'users', user.uid), {
            ...updates,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        // Atualizar estado local
        setUser(prev => ({
            ...prev,
            ...updates
        }));

        toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        setError(error.message);
        toast.error('Erro ao atualizar perfil');
        throw error;
        }
    };

    // Verificar se o usuário está autenticado
    const isAuthenticated = () => {
        return user !== null;
    };

    // Obter dados do usuário
    const getUserData = async () => {
        if (!user) return null;
        
        try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        return userDoc.exists() ? userDoc.data() : null;
        } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return null;
        }
    };

    // Valor do contexto
    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        loginWithGoogle,
        resetPassword,
        updateUserProfile,
        isAuthenticated,
        getUserData
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
    };

    // Hook para proteção de rotas
    export const useAuthGuard = () => {
    const { user, loading } = useAuth();
    
    const requireAuth = () => {
        if (!loading && !user) {
        throw new Error('Acesso negado. Faça login para continuar.');
        }
    };

    const requireNoAuth = () => {
        if (!loading && user) {
        throw new Error('Você já está logado.');
        }
    };

    return {
        requireAuth,
        requireNoAuth,
        isAuthenticated: !!user,
        isLoading: loading
    };
    };

    export default AuthContext;