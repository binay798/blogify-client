import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: Error | {};
}
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, errorInfo: { name: '' } };

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorInfo: error };
  }

  componentDidCatch(error: Error) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    this.setState({ hasError: true, errorInfo: error });
  }

  render() {
    if (this.state.hasError && this.state.errorInfo) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          {this.state.errorInfo.name}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
