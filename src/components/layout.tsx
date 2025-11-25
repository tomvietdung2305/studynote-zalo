import { SnackbarProvider, Box, ZMPRouter } from "zmp-ui";
import { zaloAdapter } from "@/adapters";
import { PlatformApp } from "@/components/PlatformApp";
import { isWeb } from "@/utils/platform";
import { WebLoginPage } from "@/pages/WebLoginPage";
import { AppProvider, useAppNavigation, type PageName } from "@/context/AppContext";
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

  console.log('Current page:', currentPage);

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

const LayoutWrapper = () => {
  // In Zalo, show full app with ZMP UI components
  const theme = zaloAdapter.getTheme();
  const isWebEnv = isWeb();

  console.log('[Layout] Rendering app. Environment:', isWebEnv ? 'Web' : 'Zalo');

  const appContent = (
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

  // If on web, wrap in a mobile simulator container
  if (isWebEnv) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-[430px] h-[932px] max-h-[95vh] bg-white shadow-2xl rounded-[30px] overflow-hidden border-[8px] border-gray-900 relative">
          {/* Notch simulation */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] bg-gray-900 rounded-b-[16px] z-50"></div>

          {/* App Content */}
          <div className="w-full h-full overflow-y-auto scrollbar-hide">
            {appContent}
          </div>
        </div>

        {/* Helper Text */}
        <div className="fixed bottom-4 left-4 text-gray-500 text-sm">
          <p>Running in Web Mode (Mobile Simulation)</p>
        </div>
      </div>
    );
  }

  return appContent;
};

export default LayoutWrapper;
