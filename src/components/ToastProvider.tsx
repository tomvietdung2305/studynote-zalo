import React, { createContext, useContext } from 'react';
import { SnackbarProvider, useSnackbar as useZmpSnackbar } from 'zmp-ui';
import { isWeb } from '@/utils/platform';

// --- Mock Implementation for Web ---
interface ToastContextType {
    openToast: (props: { text?: string; message?: string; type?: 'success' | 'error' | 'warning' | 'info'; duration?: number }) => void;
    closeToast: () => void;
}

const MockToastContext = createContext<ToastContextType | undefined>(undefined);

const MockToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const openToast = (props: any) => {
        console.log('[Toast] Open:', props);
        const message = props.text || props.message || '';

        // Create DOM element
        const toast = document.createElement('div');
        toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-xl z-[9999] flex items-center gap-2 min-w-[300px] animate-slide-down transition-all`;

        // Styles based on type
        if (props.type === 'success') {
            toast.className += ' bg-green-50 text-green-800 border border-green-200';
            toast.innerHTML = `<span class="text-xl">✅</span> <span class="font-medium">${message}</span>`;
        } else if (props.type === 'error') {
            toast.className += ' bg-red-50 text-red-800 border border-red-200';
            toast.innerHTML = `<span class="text-xl">❌</span> <span class="font-medium">${message}</span>`;
        } else if (props.type === 'warning') {
            toast.className += ' bg-orange-50 text-orange-800 border border-orange-200';
            toast.innerHTML = `<span class="text-xl">⚠️</span> <span class="font-medium">${message}</span>`;
        } else {
            toast.className += ' bg-gray-800 text-white';
            toast.innerText = message;
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -20px)';
            setTimeout(() => toast.remove(), 300);
        }, props.duration || 3000);
    };

    const closeToast = () => { };

    return (
        <MockToastContext.Provider value={{ openToast, closeToast }}>
            {children}
        </MockToastContext.Provider>
    );
};

// --- Main Provider ---
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isWeb()) {
        return <MockToastProvider>{children}</MockToastProvider>;
    }

    return (
        /* @ts-ignore */
        <SnackbarProvider>
            {children}
        </SnackbarProvider>
    );
};

// --- Custom Hook ---
export const useToast = () => {
    const webContext = useContext(MockToastContext);

    // We can't conditionally call hooks, so we must call both (or handle it carefully)
    // But useZmpSnackbar might throw if not in provider.
    // So we need to be careful.

    // Actually, if we are on web, we are in MockToastProvider.
    // If we are on Zalo, we are in SnackbarProvider.

    // We can try-catch the ZMP hook? No, hooks rules.

    // Solution: We need a wrapper component that provides the UNIFIED context.
    // But that's complicated.

    // Simpler: Just return the web context if it exists.
    if (webContext) {
        return {
            openSnackbar: webContext.openToast,
            closeSnackbar: webContext.closeToast
        };
    }

    // If no web context, assume we are in Zalo and use ZMP hook
    // This is safe because if we are on web, webContext IS defined.
    // If we are on Zalo, webContext is undefined, so we call useZmpSnackbar.
    // Wait, calling hooks conditionally is forbidden.

    // We must call useZmpSnackbar ALWAYS?
    // If we call it on web (where SnackbarProvider is missing), it throws.

    // So we cannot use a single hook `useToast` that conditionally calls hooks.

    // We have to implement `useToast` such that it uses a Unified Context.
    // Let's refactor ToastProvider to provide a UnifiedContext.
};

// --- Unified Provider ---
interface UnifiedToastContextType {
    openSnackbar: (props: any) => void;
    closeSnackbar: () => void;
}

const UnifiedToastContext = createContext<UnifiedToastContextType | undefined>(undefined);

export const AppToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isWeb()) {
        return (
            <MockToastProvider>
                <WebToastAdapter>{children}</WebToastAdapter>
            </MockToastProvider>
        );
    }

    return (
        /* @ts-ignore */
        <SnackbarProvider>
            <ZaloToastAdapter>{children}</ZaloToastAdapter>
        </SnackbarProvider>
    );
};

// Adapters to bridge specific providers to UnifiedContext
const WebToastAdapter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { openToast, closeToast } = useContext(MockToastContext)!;
    return (
        <UnifiedToastContext.Provider value={{ openSnackbar: openToast, closeSnackbar: closeToast }}>
            {children}
        </UnifiedToastContext.Provider>
    );
};

const ZaloToastAdapter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { openSnackbar, closeSnackbar } = useZmpSnackbar();
    return (
        <UnifiedToastContext.Provider value={{ openSnackbar, closeSnackbar }}>
            {children}
        </UnifiedToastContext.Provider>
    );
};

export const useAppToast = () => {
    const context = useContext(UnifiedToastContext);
    if (!context) {
        throw new Error('useAppToast must be used within AppToastProvider');
    }
    return context;
};
