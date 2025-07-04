    // Constantes da aplicação

    // Informações da aplicação
    export const APP_INFO = {
    name: 'Sistema de Gestão',
    version: '1.0.0',
    description: 'Sistema completo de gestão de produtividade e finanças pessoais',
    author: 'Seu Nome',
    email: 'suporte@exemplo.com',
    website: 'https://seudominio.com'
    };

    // Configurações financeiras do usuário
    export const FINANCIAL_CONFIG = {
    monthlyIncome: {
        base: 3000,
        transport: 220,
        overtime: 560,
        total: 3780
    },
    fixedExpenses: {
        family: 150,
        utilities: 250,
        internet: 100,
        account: 150,
        materials: 300,
        total: 950
    },
    budgetDistribution: {
        investment: { amount: 500, percentage: 18 },
        food: { amount: 2000, percentage: 71 },
        clothing: { amount: 200, percentage: 7 },
        entertainment: { amount: 130, percentage: 4 }
    },
    availableAmount: 2830 // Total - Fixed expenses
    };

    // Categorias de tarefas
    export const TASK_CATEGORIES = {
    work: {
        label: 'Trabalho',
        icon: 'briefcase',
        color: '#3B82F6',
        description: 'Tarefas relacionadas ao trabalho'
    },
    study: {
        label: 'Estudos',
        icon: 'book-open',
        color: '#8B5CF6',
        description: 'Atividades de aprendizado e estudo'
    },
    personal: {
        label: 'Pessoal',
        icon: 'user',
        color: '#06B6D4',
        description: 'Tarefas pessoais e autocuidado'
    },
    home: {
        label: 'Casa',
        icon: 'home',
        color: '#10B981',
        description: 'Tarefas domésticas e organização'
    },
    health: {
        label: 'Saúde',
        icon: 'heart',
        color: '#EF4444',
        description: 'Saúde e bem-estar'
    },
    finance: {
        label: 'Finanças',
        icon: 'dollar-sign',
        color: '#F59E0B',
        description: 'Controle financeiro e investimentos'
    }
    };

    // Prioridades de tarefas
    export const TASK_PRIORITIES = {
    low: {
        label: 'Baixa',
        color: '#10B981',
        value: 1,
        description: 'Pode ser feita quando houver tempo'
    },
    medium: {
        label: 'Média',
        color: '#F59E0B',
        value: 2,
        description: 'Importante mas não urgente'
    },
    high: {
        label: 'Alta',
        color: '#EF4444',
        value: 3,
        description: 'Urgente e importante'
    }
    };

    // Status de tarefas
    export const TASK_STATUS = {
    pending: {
        label: 'Pendente',
        color: '#6B7280',
        icon: 'clock'
    },
    in_progress: {
        label: 'Em Andamento',
        color: '#3B82F6',
        icon: 'play'
    },
    completed: {
        label: 'Concluída',
        color: '#10B981',
        icon: 'check'
    },
    cancelled: {
        label: 'Cancelada',
        color: '#EF4444',
        icon: 'x'
    }
    };

    // Categorias financeiras
    export const FINANCIAL_CATEGORIES = {
    income: {
        salary: {
        label: 'Salário',
        icon: 'wallet',
        color: '#10B981',
        description: 'Salário base mensal'
        },
        transport: {
        label: 'Auxílio Transporte',
        icon: 'car',
        color: '#3B82F6',
        description: 'Auxílio para transporte'
        },
        overtime: {
        label: 'Horas Extras',
        icon: 'clock',
        color: '#8B5CF6',
        description: 'Pagamento por horas extras'
        },
        freelance: {
        label: 'Freelance',
        icon: 'briefcase',
        color: '#06B6D4',
        description: 'Trabalhos freelance'
        },
        investment: {
        label: 'Investimentos',
        icon: 'trending-up',
        color: '#F59E0B',
        description: 'Rendimentos de investimentos'
        },
        other: {
        label: 'Outros',
        icon: 'plus',
        color: '#6B7280',
        description: 'Outras fontes de renda'
        }
    },
    expense: {
        family: {
        label: 'Família',
        icon: 'heart',
        color: '#EF4444',
        description: 'Contribuição familiar'
        },
        utilities: {
        label: 'Conta de Luz',
        icon: 'zap',
        color: '#F59E0B',
        description: 'Energia elétrica'
        },
        internet: {
        label: 'Internet',
        icon: 'wifi',
        color: '#3B82F6',
        description: 'Serviços de internet'
        },
        account: {
        label: 'Conta PicPay',
        icon: 'credit-card',
        color: '#8B5CF6',
        description: 'Conta digital'
        },
        materials: {
        label: 'Materiais',
        icon: 'shopping-cart',
        color: '#06B6D4',
        description: 'Materiais diversos'
        },
        food: {
        label: 'Alimentação',
        icon: 'coffee',
        color: '#10B981',
        description: 'Gastos com alimentação'
        },
        clothing: {
        label: 'Roupas',
        icon: 'shirt',
        color: '#EC4899',
        description: 'Vestuário e acessórios'
        },
        entertainment: {
        label: 'Lazer',
        icon: 'film',
        color: '#8B5CF6',
        description: 'Entretenimento e lazer'
        },
        transport: {
        label: 'Transporte',
        icon: 'car',
        color: '#3B82F6',
        description: 'Combustível e transporte'
        },
        health: {
        label: 'Saúde',
        icon: 'heart',
        color: '#EF4444',
        description: 'Gastos com saúde'
        },
        education: {
        label: 'Educação',
        icon: 'book',
        color: '#8B5CF6',
        description: 'Cursos e educação'
        },
        investment: {
        label: 'Investimentos',
        icon: 'trending-up',
        color: '#F59E0B',
        description: 'Aplicações financeiras'
        },
        other: {
        label: 'Outros',
        icon: 'more-horizontal',
        color: '#6B7280',
        description: 'Outros gastos'
        }
    }
    };

    // Tipos de transação
    export const TRANSACTION_TYPES = {
    income: {
        label: 'Receita',
        color: '#10B981',
        icon: 'trending-up',
        description: 'Entrada de dinheiro'
    },
    expense: {
        label: 'Despesa',
        color: '#EF4444',
        icon: 'trending-down',
        description: 'Saída de dinheiro'
    }
    };

    // Períodos de tempo
    export const TIME_PERIODS = {
    week: {
        label: 'Semana',
        days: 7,
        description: 'Últimos 7 dias'
    },
    month: {
        label: 'Mês',
        days: 30,
        description: 'Últimos 30 dias'
    },
    quarter: {
        label: 'Trimestre',
        days: 90,
        description: 'Últimos 90 dias'
    },
    semester: {
        label: 'Semestre',
        days: 180,
        description: 'Últimos 180 dias'
    },
    year: {
        label: 'Ano',
        days: 365,
        description: 'Últimos 365 dias'
    }
    };

    // Configurações de produtividade
    export const PRODUCTIVITY_CONFIG = {
    weeklyHours: {
        study: 7,
        work: 47.5,
        gym: 7.5,
        content: 6.75,
        reading: 3.5
    },
    dailyRoutine: {
        wakeUp: '05:00',
        study: '05:30',
        work: '07:30',
        gym: '19:30',
        sleep: '23:00'
    },
    goals: {
        tasksPerWeek: 35,
        completionRate: 85,
        studyHours: 7,
        contentHours: 6.75
    }
    };

    // Configurações de tema
    export const THEME_CONFIG = {
    light: {
        name: 'Claro',
        primary: '#3B82F6',
        secondary: '#6B7280',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#1F2937'
    },
    dark: {
        name: 'Escuro',
        primary: '#60A5FA',
        secondary: '#9CA3AF',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB'
    }
    };

    // Configurações de notificação
    export const NOTIFICATION_TYPES = {
    success: {
        color: '#10B981',
        icon: 'check-circle',
        duration: 3000
    },
    error: {
        color: '#EF4444',
        icon: 'x-circle',
        duration: 5000
    },
    warning: {
        color: '#F59E0B',
        icon: 'alert-triangle',
        duration: 4000
    },
    info: {
        color: '#3B82F6',
        icon: 'info',
        duration: 3000
    }
    };

    // Configurações de API
    export const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000
    };

    // Configurações de Firebase
    export const FIREBASE_CONFIG = {
    collections: {
        users: 'users',
        tasks: 'tasks',
        transactions: 'transactions',
        goals: 'goals',
        categories: 'categories',
        settings: 'settings'
    },
    storage: {
        avatars: 'avatars',
        attachments: 'attachments',
        backups: 'backups'
    }
    };

    // Configurações de cache
    export const CACHE_CONFIG = {
    version: 'v1',
    duration: {
        short: 5 * 60 * 1000, // 5 minutos
        medium: 30 * 60 * 1000, // 30 minutos
        long: 24 * 60 * 60 * 1000 // 24 horas
    },
    keys: {
        userData: 'user-data',
        tasks: 'tasks-data',
        transactions: 'transactions-data',
        settings: 'app-settings'
    }
    };

    // Configurações de validação
    export const VALIDATION_RULES = {
    task: {
        title: {
        required: true,
        minLength: 3,
        maxLength: 100
        },
        description: {
        required: false,
        maxLength: 500
        },
        timeEstimate: {
        required: false,
        min: 5,
        max: 480 // 8 horas
        }
    },
    transaction: {
        description: {
        required: true,
        minLength: 3,
        maxLength: 100
        },
        amount: {
        required: true,
        min: 0.01,
        max: 999999.99
        }
    },
    user: {
        email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        }
    }
    };

    // Configurações de formato
    export const FORMAT_CONFIG = {
    currency: {
        locale: 'pt-BR',
        currency: 'BRL',
        minimumFractionDigits: 2
    },
    date: {
        locale: 'pt-BR',
        formats: {
        short: 'dd/MM/yyyy',
        medium: 'dd MMM yyyy',
        long: 'dd MMMM yyyy',
        full: 'EEEE, dd MMMM yyyy'
        }
    },
    number: {
        locale: 'pt-BR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }
    };

    // Configurações de exportação
    export const EXPORT_CONFIG = {
    formats: {
        json: {
        extension: '.json',
        mimeType: 'application/json',
        label: 'JSON'
        },
        csv: {
        extension: '.csv',
        mimeType: 'text/csv',
        label: 'CSV'
        },
        xlsx: {
        extension: '.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        label: 'Excel'
        }
    },
    templates: {
        tasks: {
        fields: ['title', 'description', 'category', 'priority', 'dueDate', 'completed'],
        headers: ['Título', 'Descrição', 'Categoria', 'Prioridade', 'Data Vencimento', 'Status']
        },
        transactions: {
        fields: ['date', 'description', 'category', 'type', 'amount'],
        headers: ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']
        }
    }
    };

    // Configurações de PWA
    export const PWA_CONFIG = {
    name: 'Sistema de Gestão',
    shortName: 'Gestão Pro',
    description: 'Sistema completo de gestão de produtividade e finanças',
    themeColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    startUrl: '/'
    };

    // Configurações de SEO
    export const SEO_CONFIG = {
    title: 'Sistema de Gestão - Produtividade e Finanças',
    description: 'Organize sua vida financeira e produtiva em um só lugar',
    keywords: 'produtividade, finanças, gestão, tarefas, orçamento',
    author: 'Sistema de Gestão',
    ogImage: '/og-image.png',
    twitterCard: 'summary_large_image'
    };

    // Configurações de acessibilidade
    export const ACCESSIBILITY_CONFIG = {
    focusVisible: true,
    reduceMotion: false,
    highContrast: false,
    fontSize: 'medium',
    keyboardNavigation: true
    };

    // Configurações de performance
    export const PERFORMANCE_CONFIG = {
    lazyLoading: true,
    imageOptimization: true,
    codesplitting: true,
    bundleAnalyzer: false,
    compressionLevel: 6
    };

    // Configurações de desenvolvimento
    export const DEV_CONFIG = {
    logging: process.env.NODE_ENV === 'development',
    debugging: process.env.NODE_ENV === 'development',
    mockData: process.env.REACT_APP_MOCK_DATA === 'true',
    showDevTools: process.env.REACT_APP_SHOW_DEVTOOLS === 'true'
    };

    // Limites da aplicação
    export const LIMITS = {
    maxTasks: 1000,
    maxTransactions: 5000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxBackupSize: 50 * 1024 * 1024, // 50MB
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    maxLoginAttempts: 5
    };

    // URLs importantes
    export const URLS = {
    support: 'mailto:suporte@exemplo.com',
    privacy: '/privacy',
    terms: '/terms',
    github: 'https://github.com/seuusuario/sistema-gestao',
    documentation: '/docs',
    changelog: '/changelog'
    };

    // Mensagens padrão
    export const MESSAGES = {
    success: {
        taskCreated: 'Tarefa criada com sucesso!',
        taskUpdated: 'Tarefa atualizada com sucesso!',
        taskDeleted: 'Tarefa excluída com sucesso!',
        transactionCreated: 'Transação criada com sucesso!',
        transactionUpdated: 'Transação atualizada com sucesso!',
        transactionDeleted: 'Transação excluída com sucesso!',
        dataSaved: 'Dados salvos com sucesso!',
        dataExported: 'Dados exportados com sucesso!',
        profileUpdated: 'Perfil atualizado com sucesso!'
    },
    error: {
        generic: 'Ocorreu um erro inesperado',
        network: 'Erro de conexão. Verifique sua internet.',
        validation: 'Por favor, verifique os dados informados',
        permission: 'Você não tem permissão para esta ação',
        notFound: 'Recurso não encontrado',
        serverError: 'Erro do servidor. Tente novamente mais tarde.',
        fileTooBig: 'Arquivo muito grande',
        invalidFile: 'Formato de arquivo inválido'
    },
    warning: {
        unsavedChanges: 'Você tem alterações não salvas',
        deleteConfirmation: 'Tem certeza que deseja excluir?',
        logoutConfirmation: 'Deseja realmente sair?',
        offlineMode: 'Você está offline. Algumas funcionalidades podem estar limitadas.',
        sessionExpiring: 'Sua sessão expirará em breve',
        lowStorage: 'Espaço de armazenamento baixo'
    },
    info: {
        loading: 'Carregando...',
        saving: 'Salvando...',
        noData: 'Nenhum dado encontrado',
        welcome: 'Bem-vindo ao Sistema de Gestão!',
        firstTime: 'Parece que é sua primeira vez aqui',
        syncInProgress: 'Sincronizando dados...',
        updateAvailable: 'Nova versão disponível'
    }
    };

    // Export default com todas as constantes
    export default {
    APP_INFO,
    FINANCIAL_CONFIG,
    TASK_CATEGORIES,
    TASK_PRIORITIES,
    TASK_STATUS,
    FINANCIAL_CATEGORIES,
    TRANSACTION_TYPES,
    TIME_PERIODS,
    PRODUCTIVITY_CONFIG,
    THEME_CONFIG,
    NOTIFICATION_TYPES,
    API_CONFIG,
    FIREBASE_CONFIG,
    CACHE_CONFIG,
    VALIDATION_RULES,
    FORMAT_CONFIG,
    EXPORT_CONFIG,
    PWA_CONFIG,
    SEO_CONFIG,
    ACCESSIBILITY_CONFIG,
    PERFORMANCE_CONFIG,
    DEV_CONFIG,
    LIMITS,
    URLS,
    MESSAGES
    };