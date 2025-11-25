import React from 'react';
import { SnackbarProvider, useSnackbar } from 'zmp-ui';
import { UnifiedToastContext } from './ToastProvider';

// This file is only imported on Zalo platform via React.lazy
// This prevents zmp-ui from being included in web builds

const ZaloToastAdapter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { openSnackbar, closeSnackbar } = useSnackbar();
    return (
        <UnifiedToastContext.Provider value={{ openSnackbar, closeSnackbar }}>
            {children}
        </UnifiedToastContext.Provider>
    );
};

const ZaloToastWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        /* @ts-ignore */
        <SnackbarProvider>
            <ZaloToastAdapter>{children}</ZaloToastAdapter>
        </SnackbarProvider>
    );
};

export default ZaloToastWrapper;
