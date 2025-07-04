    // Utilitários gerais para a aplicação

    // Formatação de números
    export const formatCurrency = (value, currency = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(value);
    };

    export const formatNumber = (value, decimals = 2) => {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
    };

    export const formatPercentage = (value, decimals = 1) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
    };

    // Formatação de datas
    export const formatDate = (date, format = 'short') => {
    const d = new Date(date);
    
    const formats = {
        short: { day: '2-digit', month: '2-digit', year: 'numeric' },
        long: { day: '2-digit', month: 'long', year: 'numeric' },
        medium: { day: '2-digit', month: 'short', year: 'numeric' },
        time: { hour: '2-digit', minute: '2-digit' },
        datetime: { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
        }
    };
    
    return d.toLocaleDateString('pt-BR', formats[format]);
    };

    export const formatRelativeTime = (date) => {
    const now = new Date();
    const target = new Date(date);
    const diffTime = Math.abs(now - target);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)} meses atrás`;
    return `${Math.floor(diffDays / 365)} anos atrás`;
    };

    export const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
    };

    export const getGreeting = () => {
    const timeOfDay = getTimeOfDay();
    const greetings = {
        morning: 'Bom dia',
        afternoon: 'Boa tarde',
        evening: 'Boa noite'
    };
    return greetings[timeOfDay];
    };

    // Validações
    export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
    };

    export const isValidCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
    };

    export const isValidPhone = (phone) => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
    };

    export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`Deve ter pelo menos ${minLength} caracteres`);
    }
    if (!hasUpperCase) {
        errors.push('Deve ter pelo menos uma letra maiúscula');
    }
    if (!hasLowerCase) {
        errors.push('Deve ter pelo menos uma letra minúscula');
    }
    if (!hasNumbers) {
        errors.push('Deve ter pelo menos um número');
    }
    if (!hasSpecial) {
        errors.push('Deve ter pelo menos um caractere especial');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        strength: calculatePasswordStrength(password)
    };
    };

    const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
    };

    // Formatação de strings
    export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    export const titleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
    };

    export const slugify = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    export const truncate = (str, length = 50, ending = '...') => {
    if (str.length <= length) return str;
    return str.substring(0, length - ending.length) + ending;
    };

    export const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    export const formatCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    export const formatPhone = (phone) => {
    phone = phone.replace(/\D/g, '');
    if (phone.length === 11) {
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    };

    // Utilitários de array
    export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
    };

    export const sortBy = (array, key, direction = 'asc') => {
    return array.sort((a, b) => {
        if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
        }
        return a[key] < b[key] ? 1 : -1;
    });
    };

    export const unique = (array, key) => {
    if (key) {
        return array.filter((item, index, self) => 
        index === self.findIndex(t => t[key] === item[key])
        );
    }
    return [...new Set(array)];
    };

    export const chunk = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
    };

    // Utilitários de objeto
    export const pick = (obj, keys) => {
    return keys.reduce((result, key) => {
        if (obj[key] !== undefined) {
        result[key] = obj[key];
        }
        return result;
    }, {});
    };

    export const omit = (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
    };

    export const deepMerge = (target, source) => {
    const result = { ...target };
    
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
        result[key] = source[key];
        }
    }
    
    return result;
    };

    export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
    };

    // Utilitários de cores
    export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
    };

    export const rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
    };

    export const getContrastColor = (hexColor) => {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return '#000000';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    // Utilitários de localStorage
    export const storage = {
    get: (key, defaultValue = null) => {
        try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
        console.error('Erro ao ler localStorage:', error);
        return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
        } catch (error) {
        console.error('Erro ao salvar localStorage:', error);
        return false;
        }
    },
    
    remove: (key) => {
        try {
        localStorage.removeItem(key);
        return true;
        } catch (error) {
        console.error('Erro ao remover localStorage:', error);
        return false;
        }
    },
    
    clear: () => {
        try {
        localStorage.clear();
        return true;
        } catch (error) {
        console.error('Erro ao limpar localStorage:', error);
        return false;
        }
    }
    };

    // Utilitários de debounce e throttle
    export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
        clearTimeout(timeout);
        func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
    };

    export const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
        }
    };
    };

    // Utilitários de cálculo financeiro
    export const calculateInterest = (principal, rate, time, compound = 'annually') => {
    const compoundFrequency = {
        annually: 1,
        semiannually: 2,
        quarterly: 4,
        monthly: 12,
        daily: 365
    };
    
    const n = compoundFrequency[compound];
    const r = rate / 100;
    
    return principal * Math.pow(1 + r / n, n * time);
    };

    export const calculateMonthlyPayment = (principal, rate, months) => {
    const monthlyRate = rate / 100 / 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
            (Math.pow(1 + monthlyRate, months) - 1);
    };

    export const calculateROI = (initialValue, finalValue) => {
    return ((finalValue - initialValue) / initialValue) * 100;
    };

    // Utilitários de cálculo de produtividade
    export const calculateProductivity = (completed, total) => {
    if (total === 0) return 0;
    return (completed / total) * 100;
    };

    export const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    };

    export const calculateGrowthRate = (oldValue, newValue) => {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
    };

    // Utilitários de exportação
    export const exportToJSON = (data, filename = 'export.json') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
    });
    downloadFile(blob, filename);
    };

    export const exportToCSV = (data, filename = 'export.csv') => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => 
        JSON.stringify(row[header] || '')
        ).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, filename);
    };

    const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    };

    // Utilitários de clipboard
    export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Erro ao copiar para clipboard:', error);
        return false;
    }
    };

    // Utilitários de URL
    export const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
    };

    export const updateUrlParams = (params) => {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.set(key, params[key]);
        } else {
        url.searchParams.delete(key);
        }
    });
    window.history.pushState({}, '', url);
    };

    // Utilitários de performance
    export const measurePerformance = (fn, name) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} executado em ${end - start}ms`);
    return result;
    };

    // Utilitários de erro
    export const handleError = (error, context = '') => {
    console.error(`Erro${context ? ` em ${context}` : ''}:`, error);
    
    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    
    return {
        message: error.message || 'Erro desconhecido',
        stack: error.stack,
        timestamp: new Date().toISOString(),
        context
    };
    };

    // Utilitários de dispositivo
    export const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*Mobile)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    
    return {
        isMobile,
        isTablet,
        isDesktop,
        userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
    };
    };

    // Utilitários de conexão
    export const getConnectionInfo = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    return {
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false
    };
    };

    export default {
    formatCurrency,
    formatNumber,
    formatPercentage,
    formatDate,
    formatRelativeTime,
    getTimeOfDay,
    getGreeting,
    isValidEmail,
    isValidCPF,
    isValidPhone,
    validatePassword,
    capitalize,
    titleCase,
    slugify,
    truncate,
    removeAccents,
    formatCPF,
    formatPhone,
    groupBy,
    sortBy,
    unique,
    chunk,
    pick,
    omit,
    deepMerge,
    isEmpty,
    hexToRgb,
    rgbToHex,
    getContrastColor,
    storage,
    debounce,
    throttle,
    calculateInterest,
    calculateMonthlyPayment,
    calculateROI,
    calculateProductivity,
    calculateAverage,
    calculateGrowthRate,
    exportToJSON,
    exportToCSV,
    copyToClipboard,
    getUrlParams,
    updateUrlParams,
    measurePerformance,
    handleError,
    getDeviceInfo,
    getConnectionInfo
    };