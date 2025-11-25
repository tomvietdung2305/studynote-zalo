import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { WebPageName } from '../layout/WebLayout';
import { useClasses, useClassStudents } from '@/hooks/useApi';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: JSX.Element;
    color: string;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, onClick }) => (
    <Card
        className={`cursor-${onClick ? 'pointer hover:scale-105' : 'default'} transition-transform`}
        onClick={onClick}
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-gray-600 text-sm mb-1">{title}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${color.replace('text', 'bg').replace('600', '100')}`}>
                {icon}
            </div>
        </div>
    </Card>
);

interface WebDashboardProps {
    onNavigate: (page: WebPageName) => void;
}

export const WebDashboard: React.FC<WebDashboardProps> = ({ onNavigate }) => {
    const { classes, loading: loadingClasses } = useClasses();

    // Calculate total students across all classes
    const totalStudents = classes.reduce((sum, cls) => sum + (cls.total_students || 0), 0);

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Classes"
                    value={loadingClasses ? '...' : classes.length}
                    color="text-blue-600"
                    onClick={() => onNavigate('classes')}
                    icon={
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    }
                />

                <StatCard
                    title="Total Students"
                    value={loadingClasses ? '...' : totalStudents}
                    color="text-green-600"
                    onClick={() => onNavigate('students')}
                    icon={
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    }
                />

                <StatCard
                    title="Attendance Rate"
                    value="--"
                    color="text-purple-600"
                    onClick={() => onNavigate('attendance')}
                    icon={
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />

                <StatCard
                    title="AI Reports"
                    value="--"
                    color="text-orange-600"
                    onClick={() => onNavigate('reports')}
                    icon={
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card title="Recent Classes">
                    {loadingClasses ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : classes.length > 0 ? (
                        <div className="space-y-3">
                            {classes.slice(0, 3).map((cls) => (
                                <div
                                    key={cls.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => onNavigate('classes')}
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{cls.name}</p>
                                        <p className="text-sm text-gray-500">{cls.total_students || 0} students</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No classes yet</p>
                    )}
                </Card>

                <Card title="Quick Actions">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="primary" onClick={() => onNavigate('attendance')}>
                            📝 Quick Attendance
                        </Button>
                        <Button variant="secondary" onClick={() => onNavigate('classes')}>
                            ➕ Add Class
                        </Button>
                        <Button variant="secondary" onClick={() => onNavigate('grades')}>
                            ✏️ Input Grades
                        </Button>
                        <Button variant="secondary" onClick={() => onNavigate('reports')}>
                            🤖 Generate Report
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Welcome Banner */}
            <Card padding="lg">
                <div className="flex items-start gap-4">
                    <div className="text-5xl">👋</div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Welcome to StudyNote Web!
                        </h3>
                        <p className="text-gray-600 mb-4">
                            This is the desktop version of StudyNote. You can manage classes, students, attendance, and generate AI-powered reports.
                            For mobile access, please use the Zalo Mini App.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="primary" size="sm" onClick={() => onNavigate('classes')}>
                                Get Started
                            </Button>
                            <Button variant="ghost" size="sm">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
