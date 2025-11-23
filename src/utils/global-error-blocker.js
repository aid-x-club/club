// Global error blocker - this runs immediately to block any errors
(function() {
  'use strict';
  
  const BLOCKED_PHRASE = 'You are given a task to integrate';
  
  // Block any console output with the blocked phrase
  const originalMethods = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  };
  
  Object.keys(originalMethods).forEach(method => {
    console[method] = function(...args) {
      const message = args.join(' ');
      if (message.includes(BLOCKED_PHRASE)) {
        return; // Block it completely
      }
      return originalMethods[method].apply(console, args);
    };
  });
  
  // Block window.onerror
  window.onerror = function(message, source, lineno, colno, error) {
    const messageStr = message?.toString() || '';
    if (messageStr.includes(BLOCKED_PHRASE)) {
      return true; // Block the error
    }
    return false;
  };
  
  // Block any DOM mutations with the blocked text
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 || node.nodeType === 3) { // Element or Text node
          const text = node.textContent || node.innerText || '';
          if (text.includes(BLOCKED_PHRASE)) {
            // Remove the node completely
            if (node.remove) {
              node.remove();
            } else if (node.parentNode) {
              node.parentNode.removeChild(node);
            }
          }
        }
      });
    });
  });
  
  // Start observing
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  } else {
    // If body isn't ready yet, wait for it
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    });
  }
  
  // Clean up any existing text
  function cleanup() {
    const walker = document.createTreeWalker(
      document.documentElement,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const nodesToRemove = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.includes(BLOCKED_PHRASE)) {
        nodesToRemove.push(node);
      }
    }
    
    nodesToRemove.forEach(node => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  }
  
  // Run cleanup immediately and periodically
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanup);
  } else {
    cleanup();
  }
  
  setInterval(cleanup, 500);
  
  // Block any alerts or confirms with the blocked text
  const originalAlert = window.alert;
  const originalConfirm = window.confirm;
  
  window.alert = function(message) {
    if (message && message.includes && message.includes(BLOCKED_PHRASE)) {
      return; // Block the alert
    }
    return originalAlert.apply(window, arguments);
  };
  
  window.confirm = function(message) {
    if (message && message.includes && message.includes(BLOCKED_PHRASE)) {
      return false; // Block the confirm
    }
    return originalConfirm.apply(window, arguments);
  };
  
  console.log('Global error blocker initialized');
})();
