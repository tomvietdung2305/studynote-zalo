// THIS FILE IS ONLY IMPORTED IN ZALO MINI APP
// Kept separate to prevent ZMP-UI from loading in web builds

import { App, SnackbarProvider, ZMPRouter } from "zmp-ui";
import { zaloAdapter } from "@/adapters";
import { AppProvider, useAppNavigation } from "@/context/AppContext";
import { Navigation } from "@/components/navigation";
import { AuthWrapper } from "@/components/AuthWrapper";
import DashboardPage from "@/pages/dashboard";
import StudentsPage from "@/pages/students";
import QuickAttendancePage from "@/pages/quick-attendance";
import GradesInputPage from "@/pages/grades-input";
import BroadcastMessagePage from "@/pages/broadcast-message";
import ClassManagementPage from "@/pages/class-management";
import AttendanceHistoryPage from "@/pages/attendance-history";
import ParentConnectPage from "@/pages/parent-connect";
import ParentDashboardPage from "@/pages/parent-dashboard";
import StudentDetailPage from "@/pages/student-detail";
import StudentReportPage from "@/pages/student-report";

function AppContent() {
    const { currentPage } = useAppNavigation();

    console.log('[ZaloApp] Current page:', currentPage);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'students':
                return <StudentsPage />;
            case 'quick-attendance':
                return <QuickAttendancePage />;
            case 'grades-input':
                return <GradesInputPage />;
            case 'broadcast-message':
                return <BroadcastMessagePage />;
            case 'class-management':
                return <ClassManagementPage />;
            case 'attendance-history':
                return <AttendanceHistoryPage />;
            case 'student-detail':
                return <StudentDetailPage />;
            case 'student-report':
                return <StudentReportPage />;
            case 'parent-connect':
                return <ParentConnectPage />;
            case 'parent-dashboard':
                return <ParentDashboardPage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <>
            {renderPage()}
            <Navigation />
        </>
    );
}

/**
 * Zalo Mini App Entry Point
 * Uses ZMP-UI components for mobile interface
 */
const ZaloApp = () => {
    const theme = zaloAdapter.getTheme();

    console.log('[ZaloApp] Initializing Zalo Mini App');

    return (
        <App theme={theme}>
            {/* @ts-ignore */}
            <SnackbarProvider>
                <AppProvider>
                    <ZMPRouter>
                        <AuthWrapper>
                            <AppContent />
                        </AuthWrapper>
                    </ZMPRouter>
                </AppProvider>
            </SnackbarProvider>
        </App>
    );
};

export default ZaloApp;
