import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { WarningGraphic } from './warning-graphic';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's the component integration error
    const errorMessage = error?.message || '';
    if (errorMessage.includes('You are given a task to integrate')) {
      console.error('Component integration error caught by ErrorBoundary');
      return { hasError: true, isComponentError: true };
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Check if it's the component integration error
      const isComponentError = this.state.error?.message?.includes('You are given a task to integrate') || this.state.isComponentError;
      
      if (isComponentError) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
              {/* Animated Warning Graphic */}
              <div className="flex justify-center mb-6">
                <WarningGraphic 
                  width={280}
                  height={90}
                  color="#FDC221"
                  enableAnimations={true}
                  animationSpeed={1}
                />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Component Error
              </h1>
              
              <p className="text-gray-300 mb-6">
                There was an issue loading a component. This has been logged and our team will look into it.
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Page
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
            {/* Animated Warning Graphic */}
            <div className="flex justify-center mb-6">
              <WarningGraphic 
                width={280}
                height={90}
                color="#EF4444"
                enableAnimations={true}
                animationSpeed={1}
              />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-300 mb-6">
              We encountered an unexpected error. Please try refreshing the page or go back to the home page.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto bg-black/30 rounded p-3">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
