import React, { Component, ErrorInfo, ReactNode } from "react";
import { withTranslation } from "react-i18next";


interface Props {
  children: ReactNode;
  t?: any;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryBase extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 text-center">
          <div className="max-w-md p-8 bg-card rounded-3xl shadow-xl border border-destructive/20">
            <h2 className="text-2xl font-display font-bold text-destructive mb-4">{t('errorBoundary.title')}</h2>
            <p className="text-muted-foreground mb-6">{t('errorBoundary.desc')}</p>
            <div className="bg-muted p-4 rounded-xl text-left mb-6 overflow-auto max-h-40">
              <code className="text-xs text-rose-600 font-mono">
                {this.state.error?.toString()}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-xl font-bold"
            >
              {t('errorBoundary.reload')}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryBase);
