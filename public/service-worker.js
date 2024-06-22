function registerServiceWorker() {
  if (typeof window !== 'undefined') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/config-sw.js').then((registration) => {
        console.log('Service Worker registration successful:', registration);
      });
    }
  }
}

registerServiceWorker();
