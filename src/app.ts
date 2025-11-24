

// ZaUI stylesheet
import "zmp-ui/zaui.css";
// Tailwind stylesheet
import "@/css/tailwind.scss";
// Your stylesheet
import "@/css/app.scss";

// React core
import React from "react";
import { createRoot } from "react-dom/client";

// Mount the app
const Layout = React.lazy(() => import("@/components/layout"));

// Expose app configuration
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig as any;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', { style: { padding: 20, color: 'red' } },
        React.createElement('h1', null, 'Something went wrong.'),
        React.createElement('pre', null, this.state.error?.toString()),
        React.createElement('pre', null, this.state.error?.stack)
      );
    }

    return this.props.children;
  }
}

console.log('[App] Starting app initialization...');
console.log('[App] APP_CONFIG:', window.APP_CONFIG);

const appElement = document.getElementById("app");
console.log('[App] App element:', appElement);

if (!appElement) {
  console.error('[App] CRITICAL: #app element not found!');
  document.body.innerHTML = '<div style="padding: 20px; color: red;"><h1>Error: App container not found</h1><p>The #app div is missing from index.html</p></div>';
} else {
  console.log('[App] Creating React root...');
  const root = createRoot(appElement);

  console.log('[App] Rendering app...');
  root.render(
    React.createElement(ErrorBoundary, null,
      React.createElement(React.Suspense, { fallback: React.createElement('div', { style: { padding: 20, background: 'white' } }, 'Loading App...') },
        React.createElement(Layout)
      )
    )
  );

  console.log('[App] App rendered successfully');
}

