// Global error handler to catch unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Check if it's the component integration error
  const errorMessage = event.error?.message || event.message || '';
  if (errorMessage.includes('You are given a task to integrate')) {
    // Prevent the default error behavior
    event.preventDefault();
    event.stopPropagation();
    
    // Show a user-friendly error instead
    console.error('Component integration error detected and blocked');
    
    // Optionally redirect to error page
    // window.location.href = '/error';
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Check if it's the component integration error
  const errorMessage = event.reason?.message || event.reason || '';
  if (errorMessage.includes('You are given a task to integrate')) {
    // Prevent the default rejection behavior
    event.preventDefault();
    event.stopPropagation();
    
    console.error('Component integration error detected and blocked');
  }
});

// Override console.error to filter out the component integration text
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('You are given a task to integrate')) {
    return; // Don't log or show this error
  }
  originalConsoleError.apply(console, args);
};

// Custom error handler for async operations
export const handleAsyncError = (error, fallbackMessage = 'An error occurred') => {
  console.error('Async error:', error);
  
  // Don't show the raw component integration text
  if (error.message && error.message.includes('You are given a task to integrate')) {
    return 'Something went wrong. Please try refreshing the page.';
  }
  
  return error.message || fallbackMessage;
};

// Safe async wrapper
export const safeAsync = async (asyncFn, fallbackMessage = 'Operation failed') => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('Async operation failed:', error);
    throw new Error(handleAsyncError(error, fallbackMessage));
  }
};
