import { Page } from 'zmp-ui';
import { ReactNode } from 'react';

interface SafePageProps {
    children: ReactNode;
    className?: string;
}

export function SafePage({ children, className = '' }: SafePageProps) {
    return (
        <Page className={className}>
            <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
                {children}
            </div>
        </Page>
    );
}
