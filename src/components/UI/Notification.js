    import React, { useState, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

    // Componente de notificação individual
    const NotificationItem = ({ notification, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    const typeConfig = {
        success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
        },
        error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
        },
        warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
        },
        info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
        }
    };

    const config = typeConfig[notification.type] || typeConfig.info;
    const Icon = config.icon;

    useEffect(() => {
        if (notification.autoClose !== false) {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose(notification.id), 300);
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(notification.id), 300);
    };

    return (
        <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ 
            opacity: isVisible ? 1 : 0, 
            y: isVisible ? 0 : -50, 
            scale: isVisible ? 1 : 0.9 
        }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`max-w-sm w-full ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg pointer-events-auto`}
        >
        <div className="p-4">
            <div className="flex items-start">
            <div className="flex-shrink-0">
                <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div className="ml-3 w-0 flex-1">
                {notification.title && (
                <p className={`text-sm font-medium ${config.textColor}`}>
                    {notification.title}
                </p>
                )}
                <p className={`text-sm ${config.textColor} ${notification.title ? 'mt-1' : ''}`}>
                {notification.message}
                </p>
                {notification.actions && (
                <div className="mt-3 flex space-x-2">
                    {notification.actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => {
                        action.onClick();
                        handleClose();
                        }}
                        className={`text-sm font-medium ${config.textColor} hover:${config.textColor.replace('800', '900')} underline`}
                    >
                        {action.label}
                    </button>
                    ))}
                </div>
                )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button
                onClick={handleClose}
                className={`inline-flex ${config.textColor} hover:${config.textColor.replace('800', '900')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600`}
                >
                <span className="sr-only">Fechar</span>
                <X className="h-5 w-5" />
                </button>
            </div>
            </div>
        </div>
        </motion.div>
    );
    };

    // Hook para gerenciar notificações
    export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (notification) => {
        const id = Date.now() + Math.random();
        setNotifications(prev => [...prev, { ...notification, id }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    // Métodos de conveniência
    const success = (message, options = {}) => {
        addNotification({ type: 'success', message, ...options });
    };

    const error = (message, options = {}) => {
        addNotification({ type: 'error', message, ...options });
    };

    const warning = (message, options = {}) => {
        addNotification({ type: 'warning', message, ...options });
    };

    const info = (message, options = {}) => {
        addNotification({ type: 'info', message, ...options });
    };

    return {
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        success,
        error,
        warning,
        info
    };
    };

    // Componente container de notificações
    export const NotificationContainer = ({ notifications, onClose, position = 'top-right' }) => {
    const positionClasses = {
        'top-right': 'top-0 right-0',
        'top-left': 'top-0 left-0',
        'bottom-right': 'bottom-0 right-0',
        'bottom-left': 'bottom-0 left-0',
        'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
    };

    return (
        <div
        className={`fixed ${positionClasses[position]} p-6 space-y-4 z-50 pointer-events-none`}
        style={{ maxHeight: '100vh', overflowY: 'auto' }}
        >
        <AnimatePresence>
            {notifications.map((notification) => (
            <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
            />
            ))}
        </AnimatePresence>
        </div>
    );
    };

    // Componente de notificação inline
    export const InlineNotification = ({ 
    type = 'info', 
    title, 
    message, 
    onClose, 
    className = '',
    actions = []
    }) => {
    const typeConfig = {
        success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
        },
        error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
        },
        warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
        },
        info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
        }
    };

    const config = typeConfig[type] || typeConfig.info;
    const Icon = config.icon;

    return (
        <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}
        >
        <div className="flex">
            <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <div className="ml-3 flex-1">
            {title && (
                <h3 className={`text-sm font-medium ${config.textColor}`}>
                {title}
                </h3>
            )}
            <div className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>
                {message}
            </div>
            {actions.length > 0 && (
                <div className="mt-3 flex space-x-2">
                {actions.map((action, index) => (
                    <button
                    key={index}
                    onClick={action.onClick}
                    className={`text-sm font-medium ${config.textColor} hover:${config.textColor.replace('800', '900')} underline`}
                    >
                    {action.label}
                    </button>
                ))}
                </div>
            )}
            </div>
            {onClose && (
            <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                <button
                    onClick={onClose}
                    className={`inline-flex rounded-md p-1.5 ${config.textColor} hover:${config.bgColor.replace('50', '100')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600`}
                >
                    <span className="sr-only">Fechar</span>
                    <X className="h-5 w-5" />
                </button>
                </div>
            </div>
            )}
        </div>
        </motion.div>
    );
    };

    // Componente de notificação persistente
    export const PersistentNotification = ({ 
    type = 'info', 
    title, 
    message, 
    onClose, 
    className = '',
    actions = [],
    icon: CustomIcon
    }) => {
    const typeConfig = {
        success: {
        icon: CheckCircle,
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
        },
        error: {
        icon: AlertCircle,
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
        },
        warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-300',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
        },
        info: {
        icon: Info,
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
        }
    };

    const config = typeConfig[type] || typeConfig.info;
    const Icon = CustomIcon || config.icon;

    return (
        <div className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 ${className}`}>
        <div className="flex">
            <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <div className="ml-3 flex-1">
            {title && (
                <h3 className={`text-sm font-medium ${config.textColor}`}>
                {title}
                </h3>
            )}
            <div className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>
                {message}
            </div>
            {actions.length > 0 && (
                <div className="mt-3 flex space-x-2">
                {actions.map((action, index) => (
                    <button
                    key={index}
                    onClick={action.onClick}
                    className={`text-sm font-medium ${config.textColor} hover:${config.textColor.replace('800', '900')} underline`}
                    >
                    {action.label}
                    </button>
                ))}
                </div>
            )}
            </div>
            {onClose && (
            <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                <button
                    onClick={onClose}
                    className={`inline-flex rounded-md p-1.5 ${config.textColor} hover:${config.bgColor.replace('100', '200')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600`}
                >
                    <span className="sr-only">Fechar</span>
                    <X className="h-5 w-5" />
                </button>
                </div>
            </div>
            )}
        </div>
        </div>
    );
    };

    export default NotificationContainer;