import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PageName = 'dashboard' | 'students' | 'quick-attendance' | 'grades-input' | 'broadcast-message' | 'student-detail' | 'student-report' | 'class-management' | 'attendance-history' | 'parent-connect' | 'parent-dashboard';

interface AppContextType {
  currentPage: PageName;
  navigateTo: (page: PageName, params?: Record<string, any>) => void;
  navigate: (page: PageName, params?: Record<string, any>) => void; // Alias
  params: Record<string, any>;
  goBack: () => void;
  previousPage: PageName | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageName>('dashboard');
  const [previousPage, setPreviousPage] = useState<PageName | null>(null);
  const [params, setParams] = useState<Record<string, any>>({});

  const navigateTo = (page: PageName, newParams?: Record<string, any>) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
    if (newParams) {
      setParams(newParams);
    }
  };

  const goBack = () => {
    if (previousPage) {
      setCurrentPage(previousPage);
      setPreviousPage(null);
      setParams({});
    }
  };

  return (
    <AppContext.Provider value={{ currentPage, navigateTo, navigate: navigateTo, params, goBack, previousPage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppNavigation() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppNavigation must be used within AppProvider');
  }
  return context;
}
