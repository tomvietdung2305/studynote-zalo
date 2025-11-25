import React, { createContext, useContext } from 'react';
import { useSnackbar as useZmpSnackbar } from 'zmp-ui';

// Mock context to match ZMP UI's SnackbarContext
// However, zmp-ui doesn't export the context directly, so we mock the hook behavior.

// We'll create a simple context that provides openSnackbar and closeSnackbar
interface SnackbarContextType {
    openSnackbar: (props: any) => void;
    closeSnackbar: () => void;
}

const MockSnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const MockSnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const openSnackbar = (props: any) => {
        console.log('[MockSnackbar] Open:', props);
        // Simple alert for web fallback, or we could build a real toast
        // For now, let's just log it or use a simple DOM overlay if needed
        // But alert might be too intrusive.
        // Let's create a custom toast DOM element

        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-[9999] animate-fade-in';
        toast.innerText = props.text || props.message || '';

        // Add icon if present
        if (props.type === 'success') toast.style.borderLeft = '4px solid #48bb78';
        if (props.type === 'error') toast.style.borderLeft = '4px solid #f56565';
        if (props.type === 'warning') toast.style.borderLeft = '4px solid #ed8936';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, props.duration || 3000);
    };

    const closeSnackbar = () => {
        // No-op for now
    };

    return (
        <MockSnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
            {children}
        </MockSnackbarContext.Provider>
    );
};

// We need to override useSnackbar from zmp-ui
// But we can't easily override module exports.
// Instead, we will wrap the usage.
// BUT, the components import useSnackbar from 'zmp-ui'.
// We cannot change that import easily without changing all files.

// WAIT. If we use MockSnackbarProvider, the components calling useSnackbar from 'zmp-ui'
// will still try to access ZMP's context.
// If ZMP's context is missing, useSnackbar might throw.

// So we MUST use ZMP's SnackbarProvider on web too, IF it's safe.
// If it's NOT safe, we have to refactor all useSnackbar calls to a custom hook.

// Let's assume ZMP's SnackbarProvider IS safe if ZMPApp is not used.
// But earlier I suspected it might call ZMP SDK.

// Alternative: Create a custom hook `useAppToast` that wraps `useSnackbar` on Zalo and custom logic on Web.
// This requires changing all files.

// Let's try to stick with ZMP's SnackbarProvider first, but REMOVE ZMPRouter.
// ZMPRouter is more likely to cause issues (navigation sync).
// SnackbarProvider is usually UI only.

// So, step 1: Remove ZMPRouter on web.
// Step 2: If that fails, then we deal with Snackbar.

export const MockZMPRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};
