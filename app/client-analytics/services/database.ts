import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Client, 
  ClientPurchase, 
  ClientProduct, 
  ClientAnalytics,
  ClientSummary,
  TopProducts,
  SalesStatistics,
  TemporalComparisons,
  TopClients,
  BusinessMetrics
} from '../types';

// ========================================
// SERVICIO DE BASE DE DATOS LOCAL
// ========================================

const STORAGE_KEYS = {
  CLIENTS: 'client_analytics_clients',
  PURCHASES: 'client_analytics_purchases',
  PRODUCTS: 'client_analytics_products',
  ANALYTICS: 'client_analytics_data',
  SUMMARIES: 'client_analytics_summaries',
  TOP_PRODUCTS: 'client_analytics_top_products',
  SALES_STATS: 'client_analytics_sales_stats',
  TEMPORAL_COMPARISONS: 'client_analytics_temporal',
  TOP_CLIENTS: 'client_analytics_top_clients',
  BUSINESS_METRICS: 'client_analytics_business_metrics',
  LAST_SYNC: 'client_analytics_last_sync',
  CACHE_EXPIRY: 'client_analytics_cache_expiry'
};

// ========================================
// FUNCIONES DE ALMACENAMIENTO
// ========================================

/**
 * Guarda clientes en caché local
 */
export const saveClients = async (clients: Client[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    await updateLastSync();
  } catch (error) {
    console.error('Error saving clients to cache:', error);
  }
};

/**
 * Obtiene clientes del caché local
 */
export const getCachedClients = async (): Promise<Client[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting cached clients:', error);
    return [];
  }
};

/**
 * Guarda compras en caché local
 */
export const savePurchases = async (clientId: number, purchases: ClientPurchase[]): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.PURCHASES}_${clientId}`;
    await AsyncStorage.setItem(key, JSON.stringify(purchases));
  } catch (error) {
    console.error('Error saving purchases to cache:', error);
  }
};

/**
 * Obtiene compras del caché local
 */
export const getCachedPurchases = async (clientId: number): Promise<ClientPurchase[]> => {
  try {
    const key = `${STORAGE_KEYS.PURCHASES}_${clientId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting cached purchases:', error);
    return [];
  }
};

/**
 * Guarda productos en caché local
 */
export const saveProducts = async (clientId: number, products: ClientProduct[]): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.PRODUCTS}_${clientId}`;
    await AsyncStorage.setItem(key, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to cache:', error);
  }
};

/**
 * Obtiene productos del caché local
 */
export const getCachedProducts = async (clientId: number): Promise<ClientProduct[]> => {
  try {
    const key = `${STORAGE_KEYS.PRODUCTS}_${clientId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting cached products:', error);
    return [];
  }
};

/**
 * Guarda análisis de cliente en caché local
 */
export const saveClientAnalytics = async (clientId: number, analytics: ClientAnalytics): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.ANALYTICS}_${clientId}`;
    await AsyncStorage.setItem(key, JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving client analytics to cache:', error);
  }
};

/**
 * Obtiene análisis de cliente del caché local
 */
export const getCachedClientAnalytics = async (clientId: number): Promise<ClientAnalytics | null> => {
  try {
    const key = `${STORAGE_KEYS.ANALYTICS}_${clientId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached client analytics:', error);
    return null;
  }
};

/**
 * Guarda resumen de cliente en caché local
 */
export const saveClientSummary = async (clientId: number, summary: ClientSummary): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.SUMMARIES}_${clientId}`;
    await AsyncStorage.setItem(key, JSON.stringify(summary));
  } catch (error) {
    console.error('Error saving client summary to cache:', error);
  }
};

/**
 * Obtiene resumen de cliente del caché local
 */
export const getCachedClientSummary = async (clientId: number): Promise<ClientSummary | null> => {
  try {
    const key = `${STORAGE_KEYS.SUMMARIES}_${clientId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached client summary:', error);
    return null;
  }
};

/**
 * Guarda productos más comprados en caché local
 */
export const saveTopProducts = async (clientId: number, topProducts: TopProducts): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.TOP_PRODUCTS}_${clientId}`;
    await AsyncStorage.setItem(key, JSON.stringify(topProducts));
  } catch (error) {
    console.error('Error saving top products to cache:', error);
  }
};

/**
 * Obtiene productos más comprados del caché local
 */
export const getCachedTopProducts = async (clientId: number): Promise<TopProducts | null> => {
  try {
    const key = `${STORAGE_KEYS.TOP_PRODUCTS}_${clientId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached top products:', error);
    return null;
  }
};

/**
 * Guarda estadísticas de ventas en caché local
 */
export const saveSalesStatistics = async (clientId: number, stats: SalesStatistics): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.SALES_STATS}_${clientId}`;
    await AsyncStorage.setItem(key, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving sales statistics to cache:', error);
  }
};

/**
 * Obtiene estadísticas de ventas del caché local
 */
export const getCachedSalesStatistics = async (clientId: number): Promise<SalesStatistics | null> => {
  try {
    const key = `${STORAGE_KEYS.SALES_STATS}_${clientId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached sales statistics:', error);
    return null;
  }
};

/**
 * Guarda comparaciones temporales en caché local
 */
export const saveTemporalComparisons = async (clientId: number, comparisons: TemporalComparisons): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.TEMPORAL_COMPARISONS}_${clientId}`;
    await AsyncStorage.setItem(key, JSON.stringify(comparisons));
  } catch (error) {
    console.error('Error saving temporal comparisons to cache:', error);
  }
};

/**
 * Obtiene comparaciones temporales del caché local
 */
export const getCachedTemporalComparisons = async (clientId: number): Promise<TemporalComparisons | null> => {
  try {
    const key = `${STORAGE_KEYS.TEMPORAL_COMPARISONS}_${clientId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached temporal comparisons:', error);
    return null;
  }
};

/**
 * Guarda top de clientes en caché local
 */
export const saveTopClients = async (topClients: TopClients): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOP_CLIENTS, JSON.stringify(topClients));
  } catch (error) {
    console.error('Error saving top clients to cache:', error);
  }
};

/**
 * Obtiene top de clientes del caché local
 */
export const getCachedTopClients = async (): Promise<TopClients | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TOP_CLIENTS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached top clients:', error);
    return null;
  }
};

/**
 * Guarda métricas de negocio en caché local
 */
export const saveBusinessMetrics = async (metrics: BusinessMetrics): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BUSINESS_METRICS, JSON.stringify(metrics));
  } catch (error) {
    console.error('Error saving business metrics to cache:', error);
  }
};

/**
 * Obtiene métricas de negocio del caché local
 */
export const getCachedBusinessMetrics = async (): Promise<BusinessMetrics | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BUSINESS_METRICS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached business metrics:', error);
    return null;
  }
};

// ========================================
// FUNCIONES DE GESTIÓN DE CACHÉ
// ========================================

/**
 * Actualiza la fecha de última sincronización
 */
const updateLastSync = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (error) {
    console.error('Error updating last sync:', error);
  }
};

/**
 * Obtiene la fecha de última sincronización
 */
export const getLastSync = async (): Promise<Date | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return data ? new Date(data) : null;
  } catch (error) {
    console.error('Error getting last sync:', error);
    return null;
  }
};

/**
 * Verifica si el caché está expirado
 */
export const isCacheExpired = async (maxAgeHours: number = 24): Promise<boolean> => {
  try {
    const lastSync = await getLastSync();
    if (!lastSync) return true;
    
    const now = new Date();
    const hoursDiff = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff > maxAgeHours;
  } catch (error) {
    console.error('Error checking cache expiry:', error);
    return true;
  }
};

/**
 * Limpia todo el caché de análisis de clientes
 */
export const clearAnalyticsCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const analyticsKeys = keys.filter(key => key.startsWith('client_analytics_'));
    await AsyncStorage.multiRemove(analyticsKeys);
    console.log('Analytics cache cleared successfully');
  } catch (error) {
    console.error('Error clearing analytics cache:', error);
  }
};

/**
 * Limpia el caché de un cliente específico
 */
export const clearClientCache = async (clientId: number): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const clientKeys = keys.filter(key => key.includes(`_${clientId}`));
    await AsyncStorage.multiRemove(clientKeys);
    console.log(`Cache cleared for client ${clientId}`);
  } catch (error) {
    console.error('Error clearing client cache:', error);
  }
};

/**
 * Obtiene el tamaño del caché
 */
export const getCacheSize = async (): Promise<number> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const analyticsKeys = keys.filter(key => key.startsWith('client_analytics_'));
    return analyticsKeys.length;
  } catch (error) {
    console.error('Error getting cache size:', error);
    return 0;
  }
};

// Default export for Expo Router
export default function ClientAnalyticsDatabase() {
  return null;
}
