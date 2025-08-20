import { useEffect } from "react";

// Temporary component to clean up old service workers and caches
export function UnregisterSWOnce() {
  useEffect(() => {
    // Unregister any existing service workers
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
          console.log('Unregistered service worker:', registration);
        });
      });
    }
    
    // Clear old caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
          console.log('Deleted cache:', cacheName);
        });
      });
    }
    
    // Clear localStorage and sessionStorage
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('Cleared browser storage');
    } catch (error) {
      console.log('Could not clear storage:', error);
    }
  }, []);

  return null;
}