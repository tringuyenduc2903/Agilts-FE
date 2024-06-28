function registerServiceWorker() {
  if (typeof window !== 'undefined') {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/config-sw.js').then(
          (registration) => {
            console.log(
              'Service Worker registered with scope:',
              registration.scope
            );
          },
          (error) => {
            console.error('Service Worker registration failed:', error);
          }
        );
      });
    }
  }
}

registerServiceWorker();
