import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
          <p className="text-white font-semibold text-lg">Something went wrong</p>
          <p className="text-slate-500 text-sm">An unexpected error occurred.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
