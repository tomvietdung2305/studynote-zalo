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
import Layout from "@/components/layout";

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

const root = createRoot(document.getElementById("app")!);
root.render(
  React.createElement(ErrorBoundary, null, React.createElement(Layout))
);
