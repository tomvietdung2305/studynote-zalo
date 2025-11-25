import React from 'react';

/**
 * Web App Entry Point
 * Standard web application for desktop users
 * Uses React components WITHOUT ZMP-UI
 */
const WebApp: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📚</span>
                            <h1 className="text-xl font-bold text-gray-900">StudyNote</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="/" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                            <a href="/classes" className="text-gray-600 hover:text-gray-900">Classes</a>
                            <a href="/students" className="text-gray-600 hover:text-gray-900">Students</a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        🎉 Welcome to StudyNote Web
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Web app is under construction. Full features coming soon!
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                            ✨ This is the desktop version. For mobile, please use Zalo Mini App.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WebApp;
