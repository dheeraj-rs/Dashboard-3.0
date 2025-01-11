interface Window {
  gtag?: (
    command: string,
    action: string,
    params: {
      component: string;
      duration_ms: number;
      event_category: string;
    }
  ) => void;
} 