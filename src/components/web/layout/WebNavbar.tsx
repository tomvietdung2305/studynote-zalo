import React from 'react';

interface WebNavbarProps {
    onMenuClick: () => void;
    sidebarOpen: boolean;
}

export const WebNavbar: React.FC<WebNavbarProps> = ({ onMenuClick, sidebarOpen }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 shadow-sm">
            <div className="h-full px-4 flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📚</span>
                        <h1 className="text-xl font-bold text-gray-900">StudyNote</h1>
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Web</span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Teacher</p>
                            <p className="text-xs text-gray-500">Demo Account</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            T
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
