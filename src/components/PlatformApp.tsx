/**
 * Platform-aware App wrapper
 * Uses ZMP UI App component in Zalo, plain div on web
 */

import React from 'react';
import { App as ZMPApp } from 'zmp-ui';
import type { AppProps } from 'zmp-ui/app';
import { isWeb } from '@/utils/platform';

interface PlatformAppProps {
    theme?: AppProps['theme'];
    children: React.ReactNode;
}

export const PlatformApp: React.FC<PlatformAppProps> = ({ theme = 'light', children }) => {
    if (isWeb()) {
        // On web, use a simple div with theme class
        return (
            <div className={`app-container theme-${theme}`} style={{ minHeight: '100vh', background: theme === 'dark' ? '#000' : '#fff' }}>
                {children}
            </div>
        );
    }

    // In Zalo, use ZMP UI App component
    return <ZMPApp theme={theme}>{children}</ZMPApp>;
};
