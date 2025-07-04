    // Service Worker Registration para PWA
    const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.0/8 are considered localhost for IPv4.
        window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
    );

    // Configuração do Service Worker
    const swConfig = {
    onSuccess: null,
    onUpdate: null,
    onError: null,
    onOfflineReady: null,
    onNeedRefresh: null
    };

    // Função para registrar o Service Worker
    export function register(config) {
    if ('serviceWorker' in navigator) {
        // Aguardar o carregamento da página
        window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

        if (isLocalhost) {
            // Desenvolvimento local
            checkValidServiceWorker(swUrl, config);
            
            // Adicionar informações extras em desenvolvimento
            navigator.serviceWorker.ready.then(() => {
            console.log(
                '🔧 Este aplicativo está sendo servido do cache pelo service worker. ' +
                'Para saber mais, visite https://cra.link/PWA'
            );
            });
        } else {
            // Produção
            registerValidSW(swUrl, config);
        }
        });
    }
    }

    // Função para registrar Service Worker válido
    function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
        console.log('✅ Service Worker registrado com sucesso:', registration);
        
        // Configurar listeners para atualizações
        registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
            return;
            }
            
            installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                // Nova versão disponível
                console.log('🔄 Nova versão disponível');
                
                if (config && config.onUpdate) {
                    config.onUpdate(registration);
                }
                
                // Mostrar notificação de atualização
                showUpdateNotification();
                } else {
                // Primeira instalação
                console.log('💾 Conteúdo cacheado para uso offline');
                
                if (config && config.onSuccess) {
                    config.onSuccess(registration);
                }
                
                // Mostrar notificação de offline ready
                showOfflineReadyNotification();
                }
            }
            });
        });
        
        // Verificar por atualizações periodicamente
        setInterval(() => {
            registration.update();
        }, 60000); // Verificar a cada minuto
        
        })
        .catch((error) => {
        console.error('❌ Erro ao registrar Service Worker:', error);
        
        if (config && config.onError) {
            config.onError(error);
        }
        });
    }

    // Função para verificar Service Worker válido
    function checkValidServiceWorker(swUrl, config) {
    // Verificar se o service worker pode ser encontrado
    fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
    })
        .then((response) => {
        // Verificar se o service worker existe e é válido
        const contentType = response.headers.get('content-type');
        if (
            response.status === 404 ||
            (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
            // Service Worker não encontrado, recarregar página
            navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
                window.location.reload();
            });
            });
        } else {
            // Service Worker válido, registrar
            registerValidSW(swUrl, config);
        }
        })
        .catch(() => {
        console.log(
            '📵 Aplicativo rodando em modo offline. Service Worker não disponível.'
        );
        });
    }

    // Função para desregistrar Service Worker
    export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
        .then((registration) => {
            registration.unregister();
            console.log('🗑️ Service Worker desregistrado');
        })
        .catch((error) => {
            console.error('❌ Erro ao desregistrar Service Worker:', error);
        });
    }
    }

    // Função para mostrar notificação de atualização
    function showUpdateNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Nova versão disponível!', {
        body: 'Clique para atualizar o aplicativo.',
        icon: '/icon-192x192.png',
        tag: 'app-update',
        requireInteraction: true,
        actions: [
            {
            action: 'update',
            title: 'Atualizar Agora'
            },
            {
            action: 'dismiss',
            title: 'Mais Tarde'
            }
        ]
        });
        
        notification.addEventListener('click', () => {
        window.location.reload();
        });
    } else {
        // Fallback para browsers sem suporte a notificações
        if (window.confirm('Nova versão disponível! Deseja atualizar agora?')) {
        window.location.reload();
        }
    }
    }

    // Função para mostrar notificação de offline ready
    function showOfflineReadyNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Aplicativo pronto para uso offline!', {
        body: 'Agora você pode usar o aplicativo mesmo sem internet.',
        icon: '/icon-192x192.png',
        tag: 'offline-ready'
        });
    }
    }

    // Função para verificar se há atualizações
    export function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
        registration.update();
        });
    }
    }

    // Função para pular aguardando e ativar nova versão
    export function skipWaiting() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        });
    }
    }

    // Função para detectar se está online/offline
    export function setupNetworkStatusListener() {
    const updateOnlineStatus = () => {
        const isOnline = navigator.onLine;
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('networkStatusChanged', {
        detail: { isOnline }
        }));
        
        // Mostrar notificação
        if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(
            isOnline ? 'Conectado à internet' : 'Modo offline',
            {
            body: isOnline 
                ? 'Sincronização automática restaurada.'
                : 'Seus dados serão salvos localmente.',
            icon: '/icon-192x192.png',
            tag: 'network-status'
            }
        );
        }
    };
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Verificar status inicial
    updateOnlineStatus();
    }

    // Função para cache de dados importantes
    export function cacheImportantData(data) {
    if ('caches' in window) {
        caches.open('app-data-v1').then((cache) => {
        const dataBlob = new Blob([JSON.stringify(data)], {
            type: 'application/json'
        });
        const response = new Response(dataBlob);
        cache.put('/offline-data', response);
        });
    } else {
        // Fallback para localStorage
        localStorage.setItem('offline-data', JSON.stringify(data));
    }
    }

    // Função para recuperar dados do cache
    export function getCachedData() {
    return new Promise((resolve) => {
        if ('caches' in window) {
        caches.open('app-data-v1').then((cache) => {
            cache.match('/offline-data').then((response) => {
            if (response) {
                response.json().then(resolve);
            } else {
                // Fallback para localStorage
                const data = localStorage.getItem('offline-data');
                resolve(data ? JSON.parse(data) : null);
            }
            });
        });
        } else {
        // Fallback para localStorage
        const data = localStorage.getItem('offline-data');
        resolve(data ? JSON.parse(data) : null);
        }
    });
    }

    // Função para limpar cache antigo
    export function clearOldCaches() {
    if ('caches' in window) {
        caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
            if (cacheName !== 'app-data-v1') {
                console.log('🗑️ Limpando cache antigo:', cacheName);
                return caches.delete(cacheName);
            }
            })
        );
        });
    }
    }

    // Configurar listeners para Service Worker
    if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('💾 Cache atualizado:', event.data.payload);
        }
    });
    }

    // Exportar configuração
    export { swConfig };

    // Função para inicializar PWA features
    export function initializePWA() {
    // Configurar listeners de rede
    setupNetworkStatusListener();
    
    // Limpar caches antigos
    clearOldCaches();
    
    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
        console.log('🔔 Permissão de notificação:', permission);
        });
    }
    
    // Detectar se foi instalado como PWA
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        
        // Salvar evento para usar depois
        window.deferredPrompt = e;
        
        // Mostrar botão de instalação personalizado
        const installButton = document.querySelector('#install-button');
        if (installButton) {
        installButton.style.display = 'block';
        }
        
        console.log('📱 PWA pode ser instalado');
    });
    
    // Detectar quando PWA foi instalado
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA foi instalado');
        
        // Esconder botão de instalação
        const installButton = document.querySelector('#install-button');
        if (installButton) {
        installButton.style.display = 'none';
        }
    });
    }