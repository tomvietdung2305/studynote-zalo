import React, { useState } from 'react';
import { WebLayout, WebPageName } from './web/layout/WebLayout';
import { WebDashboard } from './web/dashboard/WebDashboard';
import { WebClasses } from './web/classes/WebClasses';
import { WebStudents } from './web/students/WebStudents';

/**
 * Web App Entry Point
 * Full-featured desktop application with modern UI
 */
const WebApp: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<WebPageName>('dashboard');

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <WebDashboard onNavigate={setCurrentPage} />;
            case 'classes':
                return <WebClasses />;
            case 'students':
                return <WebStudents />;
            case 'attendance':
                return <ComingSoon title="Attendance" />;
            case 'grades':
                return <ComingSoon title="Grades" />;
            case 'reports':
                return <ComingSoon title="AI Reports" />;
            case 'parent-connection':
                return <ComingSoon title="Parent Connection" />;
            default:
                return <WebDashboard onNavigate={setCurrentPage} />;
        }
    };

    return (
        <WebLayout currentPage={currentPage} onNavigate={setCurrentPage}>
            {renderPage()}
        </WebLayout>
    );
};

// Coming Soon placeholder
const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">This feature is coming soon!</p>
    </div>
);

export default WebApp;
