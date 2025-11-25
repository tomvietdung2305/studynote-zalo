import React from 'react';
import { getRoutingStrategy } from '@/utils/device';
import MobileLanding from '@/pages/MobileLanding';
import WebApp from '@/components/WebApp';

// Lazy load Zalo app to prevent ZMP-UI from loading on web
const ZaloApp = React.lazy(() => import('@/components/ZaloApp'));

/**
 * Root Layout with Device-Based Routing
 * - Mobile browser → Landing page (redirect to Zalo)
 * - Desktop browser → Web app
 * - Zalo Mini App → Mobile app (ZMP-UI)
 */
const LayoutWrapper = () => {
  const strategy = getRoutingStrategy();

  // Allow manual override via sessionStorage (for testing)
  const forceWeb = typeof window !== 'undefined' && sessionStorage.getItem('force-web') === 'true';

  console.log('[Layout] Routing strategy:', strategy, forceWeb ? '(forced web)' : '');

  // Route 1: Forced web mode (for testing)
  if (forceWeb && strategy === 'mobile-landing') {
    return <WebApp />;
  }

  // Route 2: Mobile landing page
  if (strategy === 'mobile-landing') {
    return <MobileLanding />;
  }

  // Route 3: Zalo Mini App
  if (strategy === 'zalo') {
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ZaloApp />
      </React.Suspense>
    );
  }

  // Route 4: Desktop web app
  return <WebApp />;
};

export default LayoutWrapper;
