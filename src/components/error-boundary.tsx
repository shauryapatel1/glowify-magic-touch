
import React, { Component, ErrorInfo, ReactNode } from "react";
import { GlowUpCard } from "@/components/ui/glow-up-card";
import { GlowUpButton } from "@/components/ui/glow-up-button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error boundary caught an error:", error, errorInfo);
    // Here you could also log to an error reporting service
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <GlowUpCard variant="glass" className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <h3 className="text-xl font-semibold">Something went wrong</h3>
            <p className="text-white/70 mb-4 max-w-md">
              We're sorry, but there was an error loading this component.
              {this.state.error && (
                <span className="block mt-2 text-sm opacity-75">
                  Error: {this.state.error.message}
                </span>
              )}
            </p>
            <GlowUpButton onClick={this.handleReset}>Try again</GlowUpButton>
          </div>
        </GlowUpCard>
      );
    }

    return this.props.children;
  }
}
