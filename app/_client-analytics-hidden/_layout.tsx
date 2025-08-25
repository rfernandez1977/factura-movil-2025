import { useEffect } from 'react';
import { router } from 'expo-router';

export default function ClientAnalyticsLayout() {
  useEffect(() => {
    // Redirigir automáticamente a la pantalla principal
    router.replace('/(tabs)');
  }, []);

  return null;
}
