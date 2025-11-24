import { SnackbarProvider, Box, ZMPRouter } from "zmp-ui";
import { zaloAdapter } from "@/adapters";
import { PlatformApp } from "@/components/PlatformApp";
import { AppProvider, useAppNavigation, type PageName } from "@/context/AppContext";
import { Navigation } from "@/components/navigation";
import { AuthWrapper } from "@/components/AuthWrapper";
import DashboardPage from "@/pages/dashboard";
import QuickAttendancePage from "@/pages/quick-attendance";
import GradesInputPage from "@/pages/grades-input";
import BroadcastMessagePage from "@/pages/broadcast-message";
import ClassManagementPage from "@/pages/class-management";
import AttendanceHistoryPage from "@/pages/attendance-history";
import ParentConnectPage from "@/pages/parent-connect";
import ParentDashboardPage from "@/pages/parent-dashboard";

function AppContent() {
  const { currentPage } = useAppNavigation();

  console.log('Current page:', currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
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
      case 'parent-connect':
        return <ParentConnectPage />;
      case 'parent-dashboard':
        return <ParentDashboardPage />;
      case 'student-detail':
        return <div>Student Detail</div>; // Hidden for MVP
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

const LayoutWrapper = () => {
  const theme = zaloAdapter.getTheme();

  console.log('[Layout] Rendering with theme:', theme);

  return (
    <PlatformApp theme={theme}>
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
    </PlatformApp>
  );
};

export default LayoutWrapper;
