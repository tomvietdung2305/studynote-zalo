import React, { useState } from 'react';
import { WebSidebar } from './WebSidebar';
import { WebNavbar } from './WebNavbar';

export type WebPageName =
    | 'dashboard'
    | 'classes'
    | 'students'
    | 'attendance'
    | 'grades'
    | 'reports'
    | 'parent-connection';

interface WebLayoutProps {
    children: React.ReactNode;
    currentPage: WebPageName;
    onNavigate: (page: WebPageName) => void;
}

export const WebLayout: React.FC<WebLayoutProps> = ({
    children,
    currentPage,
    onNavigate,
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <WebNavbar
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                sidebarOpen={sidebarOpen}
            />

            <div className="flex">
                {/* Sidebar */}
                <WebSidebar
                    currentPage={currentPage}
                    onNavigate={onNavigate}
                    isOpen={sidebarOpen}
                />

                {/* Main Content */}
                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'
                        } mt-16 p-8`}
                >
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
