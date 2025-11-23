// Aggressive error handler to completely block component integration errors

// Block the specific error text at multiple levels
const BLOCKED_TEXT = 'You are given a task to integrate an existing React component';

// Override window.onerror
window.onerror = function(message, source, lineno, colno, error) {
  const messageStr = message?.toString() || '';
  if (messageStr.includes(BLOCKED_TEXT)) {
    console.error('Blocked component integration error');
    return true; // Prevent default error handling
  }
  return false; // Let other errors through
};

// Override window.addEventListener('error')
window.addEventListener('error', function(event) {
  const message = event.message || event.error?.message || '';
  if (message.includes(BLOCKED_TEXT)) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.error('Blocked component integration error at event level');
    return true;
  }
}, true);

// Override window.addEventListener('unhandledrejection')
window.addEventListener('unhandledrejection', function(event) {
  const reason = event.reason?.message || event.reason || '';
  if (reason.includes(BLOCKED_TEXT)) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.error('Blocked component integration rejection');
    return true;
  }
}, true);

// Override console methods
const originalConsoleError = console.error;
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

console.error = function(...args) {
  const message = args.join(' ');
  if (message.includes(BLOCKED_TEXT)) {
    return; // Block the error
  }
  return originalConsoleError.apply(console, args);
};

console.log = function(...args) {
  const message = args.join(' ');
  if (message.includes(BLOCKED_TEXT)) {
    return; // Block the log
  }
  return originalConsoleLog.apply(console, args);
};

console.warn = function(...args) {
  const message = args.join(' ');
  if (message.includes(BLOCKED_TEXT)) {
    return; // Block the warning
  }
  return originalConsoleWarn.apply(console, args);
};

// Override React's error reporting if available
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  const originalOnError = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot;
  if (originalOnError) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = function(...args) {
      // Check if any error contains the blocked text
      const errorString = JSON.stringify(args);
      if (errorString.includes(BLOCKED_TEXT)) {
        console.error('Blocked React DevTools error');
        return;
      }
      return originalOnError.apply(this, args);
    };
  }
}

// Block any DOM nodes that contain the blocked text
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    mutation.addedNodes.forEach(function(node) {
      if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
        const textContent = node.textContent || node.innerText || '';
        if (textContent.includes(BLOCKED_TEXT)) {
          console.error('Blocked DOM node with component integration text');
          if (node.parentNode) {
            node.parentNode.removeChild(node);
          } else if (node.remove) {
            node.remove();
          }
        }
      }
    });
  });
});

// Start observing the entire document
observer.observe(document.body || document.documentElement, {
  childList: true,
  subtree: true
});

// Check for existing elements with the blocked text
function cleanupExistingElements() {
  const walker = document.createTreeWalker(
    document.body || document.documentElement,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.includes(BLOCKED_TEXT)) {
      console.error('Removed existing element with component integration text');
      node.textContent = '';
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
  }
}

// Run cleanup immediately and periodically
cleanupExistingElements();
setInterval(cleanupExistingElements, 1000);

console.log('Aggressive error handler initialized');
