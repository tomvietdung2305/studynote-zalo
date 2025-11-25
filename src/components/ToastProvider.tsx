import React, { createContext, useContext } from 'react';
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

// --- Unified Provider ---
export interface UnifiedToastContextType {
    openSnackbar: (props: any) => void;
    closeSnackbar: () => void;
}

export const UnifiedToastContext = createContext<UnifiedToastContextType | undefined>(undefined);

export const AppToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const webEnv = isWeb();

    if (webEnv) {
        return (
            <MockToastProvider>
                <WebToastAdapter>{children}</WebToastAdapter>
            </MockToastProvider>
        );
    }

    // For Zalo: Use React.lazy to prevent zmp-ui from being bundled in web build
    const ZaloWrapper = React.lazy(() =>
        import('./ZaloToastWrapper').catch(() => ({
            default: ({ children: kids }: { children: React.ReactNode }) => <>{kids}</>
        }))
    );

    return (
        <React.Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
            <ZaloWrapper>{children}</ZaloWrapper>
        </React.Suspense>
    );
};

// Adapters to bridge specific providers to UnifiedContext
const WebToastAdapter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const context = useContext(MockToastContext);
    if (!context) {
        console.error('[WebToastAdapter] MockToastContext not found');
        return <>{children}</>;
    }

    const { openToast, closeToast } = context;
    return (
        <UnifiedToastContext.Provider value={{ openSnackbar: openToast, closeSnackbar: closeToast }}>
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
