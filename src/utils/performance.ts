export const measurePerformance = (componentName: string) => {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    const duration = end - start;
    
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${componentName}: ${duration.toFixed(2)}ms`);
    }
    
    // Send to analytics in production
    if (import.meta.env.PROD) {
      try {
        // Send performance metric to analytics
        window.gtag?.('event', 'performance_measure', {
          component: componentName,
          duration_ms: Math.round(duration),
          event_category: 'Performance',
        });
      } catch (error) {
        console.error('[Performance] Failed to send analytics:', error);
      }
    }
  };
}; 