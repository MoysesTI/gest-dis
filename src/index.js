    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import './index.css';
    import App from './App';
    import { AuthProvider } from './contexts/AuthContext';
    import { testFirebaseConnection } from './services/firebase';

    // Importar Service Worker para PWA
    import * as serviceWorkerRegistration from './serviceWorkerRegistration';

    // Configurar React Error Boundary
    class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        
        // Aqui você pode enviar o erro para um serviço de monitoramento
        // como Sentry, LogRocket, etc.
        if (process.env.NODE_ENV === 'production') {
        // Enviar erro para serviço de monitoramento
        console.error('Production error:', error);
        }
    }

    render() {
        if (this.state.hasError) {
        return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Algo deu errado
                </h2>
                <p className="text-gray-600 mb-6">
                Ocorreu um erro inesperado. Por favor, recarregue a página.
                </p>
                <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                Recarregar Página
                </button>
                {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-gray-500 text-sm">
                    Detalhes do erro (desenvolvimento)
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                    {this.state.error?.toString()}
                    </pre>
                </details>
                )}
            </div>
            </div>
        );
        }

        return this.props.children;
    }
    }

    // Componente de Loading inicial
    const InitialLoader = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Carregando Sistema de Gestão...</p>
        </div>
    </div>
    );

    // Função para inicializar a aplicação
    const initializeApp = async () => {
    try {
        // Testar conexão com Firebase
        const isConnected = await testFirebaseConnection();
        
        if (!isConnected) {
        console.warn('Firebase connection failed, using offline mode');
        }

        // Configurar ambiente
        if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Aplicação iniciada em modo desenvolvimento');
        console.log('📊 Versão:', process.env.REACT_APP_VERSION || '1.0.0');
        console.log('🔥 Firebase:', isConnected ? 'Conectado' : 'Offline');
        }

        // Renderizar aplicação
        const container = document.getElementById('root');
        const root = createRoot(container);

        root.render(
        <React.StrictMode>
            <ErrorBoundary>
            <AuthProvider>
                <App />
            </AuthProvider>
            </ErrorBoundary>
        </React.StrictMode>
        );

        // Registrar Service Worker para PWA
        if (process.env.REACT_APP_PWA_ENABLED === 'true') {
        serviceWorkerRegistration.register({
            onSuccess: () => {
            console.log('✅ Service Worker registrado com sucesso');
            },
            onUpdate: (registration) => {
            console.log('🔄 Nova versão disponível');
            // Mostrar notificação para atualizar
            if (window.confirm('Nova versão disponível! Deseja atualizar?')) {
                window.location.reload();
            }
            }
        });
        }

        // Configurar analytics (se habilitado)
        if (process.env.REACT_APP_ENABLE_ANALYTICS === 'true') {
        // Configurar Google Analytics ou outro serviço
        console.log('📊 Analytics habilitado');
        }

        // Configurar tema
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
        document.documentElement.className = savedTheme;
        } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.className = prefersDark ? 'dark' : 'light';
        }

        // Listeners para mudanças de tema do sistema
        window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
            document.documentElement.className = e.matches ? 'dark' : 'light';
            }
        });

        // Configurar shortcuts de teclado
        document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K para busca rápida
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Implementar busca rápida
            console.log('🔍 Busca rápida');
        }
        
        // Ctrl/Cmd + N para nova tarefa
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            // Implementar nova tarefa
            console.log('➕ Nova tarefa');
        }
        });

        // Configurar notificações
        if ('Notification' in window && process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true') {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
            console.log('🔔 Permissão de notificação:', permission);
            });
        }
        }

        // Detectar se está offline
        window.addEventListener('online', () => {
        console.log('🌐 Conectado à internet');
        });

        window.addEventListener('offline', () => {
        console.log('📵 Desconectado da internet');
        });

        // Configurar performance monitoring
        if (process.env.NODE_ENV === 'production') {
        // Monitorar performance
        new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
                console.log('📊 Performance:', {
                loadTime: entry.loadEventEnd - entry.loadEventStart,
                domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                firstPaint: entry.responseEnd - entry.responseStart
                });
            }
            });
        }).observe({ entryTypes: ['navigation'] });
        }

    } catch (error) {
        console.error('❌ Erro ao inicializar aplicação:', error);
        
        // Fallback para erro crítico
        const container = document.getElementById('root');
        const root = createRoot(container);
        
        root.render(
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Erro Crítico
            </h2>
            <p className="text-gray-600 mb-6">
                Não foi possível inicializar a aplicação. Por favor, recarregue a página.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Recarregar
            </button>
            </div>
        </div>
        );
    }
    };

    // Inicializar aplicação
    initializeApp();

    // Exportar função para testes
    export { initializeApp };