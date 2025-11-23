import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { WarningGraphic } from './warning-graphic';

// This component will be used as a last resort
const ErrorFallback = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (event) => {
      const message = event.message || event.error?.message || '';
      if (message.includes('You are given a task to integrate')) {
        console.error('ErrorFallback caught component integration error');
        setHasError(true);
        setError(event.error || event);
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleRejection = (event) => {
      const reason = event.reason?.message || event.reason || '';
      if (reason.includes('You are given a task to integrate')) {
        console.error('ErrorFallback caught component integration rejection');
        setHasError(true);
        setError(event.reason);
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleRejection, true);

    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleRejection, true);
    };
  }, []);

  if (hasError) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 z-[9999]">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
          {/* Animated Warning Graphic */}
          <div className="flex justify-center mb-6">
            <WarningGraphic 
              width={280}
              height={90}
              color="#3B82F6"
              enableAnimations={true}
              animationSpeed={1}
            />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Component Error
          </h1>
          
          <p className="text-gray-300 mb-6">
            There was an issue loading a component. This has been blocked for your security.
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

  return children;
};

export default ErrorFallback;
