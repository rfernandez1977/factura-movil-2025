# HOOKS Y UTILIDADES

## 🎣 HOOKS PERSONALIZADOS

### 1. **useFrameworkReady**
**Archivo**: `hooks/useFrameworkReady.ts`

**Propósito**: Llama a `window.frameworkReady` cuando el componente se monta.

**Implementación**:
```typescript
import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    window.frameworkReady?.()
  }, [])
}
```

**Uso**:
```typescript
// En el layout raíz
export default function RootLayout() {
  useFrameworkReady();
  // ... resto del componente
}
```

### 2. **useIntersectionObserver**
**Archivo**: `hooks/useIntersectionObserver.ts`

**Propósito**: Hook para Intersection Observer API, usado para lazy loading en web.

**Interfaz**:
```typescript
interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: RefObject<T>;
  isIntersecting: boolean;
}
```

**Implementación**:
```typescript
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverOptions = {},
  targetRef?: RefObject<T>
): UseIntersectionObserverReturn {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const localRef = useRef<T>(null);
  const ref = targetRef || localRef;
  const frozen = useRef<boolean>(false);

  useEffect(() => {
    const element = ref?.current;
    if (!element || (freezeOnceVisible && frozen.current)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);

        if (freezeOnceVisible && entry.isIntersecting) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, root, rootMargin, freezeOnceVisible]);

  return { ref, isIntersecting };
}
```

**Uso en LazyImage**:
```typescript
const LazyImage: React.FC<LazyImageProps> = ({ src, ...props }) => {
  const { ref, isIntersecting } = Platform.OS === 'web' 
    ? useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true }) 
    : { ref: null, isIntersecting: true };

  useEffect(() => {
    if (isIntersecting && !imgSrc) {
      setImgSrc(src);
    }
  }, [isIntersecting, src]);
  
  // ... resto del componente
};
```

### 3. **useOptimizedQuery**
**Archivo**: `hooks/useOptimizedQuery.ts`

**Propósito**: Hook para queries optimizadas con cache y reintentos automáticos.

**Interfaz**:
```typescript
interface QueryOptions<T> {
  queryKey: string;
  queryFn: () => Promise<T>;
  staleTime?: number;        // 5 minutos por defecto
  cacheTime?: number;        // 1 hora por defecto
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  forceRefresh?: boolean;
}

interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**Características**:
- Cache en memoria y AsyncStorage
- Reintentos automáticos con backoff exponencial
- Limpieza automática de cache expirado
- Fallback a cache en caso de error de red

**Implementación clave**:
```typescript
export function useOptimizedQuery<T>({
  queryKey,
  queryFn,
  staleTime = 5 * 60 * 1000,
  cacheTime = 60 * 60 * 1000,
  enabled = true,
  onSuccess,
  onError,
  forceRefresh = false,
}: QueryOptions<T>): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = `query_cache_${queryKey}`;
  const timestampKey = `query_timestamp_${queryKey}`;

  const fetchData = useCallback(async (skipCache: boolean = false) => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // Check cache first
      if (!skipCache && !forceRefresh) {
        const cachedTimestampStr = await AsyncStorage.getItem(timestampKey);
        const cachedTimestamp = cachedTimestampStr ? parseInt(cachedTimestampStr, 10) : 0;
        const now = Date.now();
        
        if (now - cachedTimestamp < staleTime) {
          const cachedDataStr = await AsyncStorage.getItem(cacheKey);
          if (cachedDataStr) {
            const cachedData = JSON.parse(cachedDataStr) as T;
            setData(cachedData);
            setIsLoading(false);
            if (onSuccess) onSuccess(cachedData);
            return;
          }
        }
      }

      // Fetch fresh data
      const result = await queryFn();
      setData(result);
      setIsLoading(false);
      
      // Update cache
      await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
      await AsyncStorage.setItem(timestampKey, Date.now().toString());
      
      if (onSuccess) onSuccess(result);
    } catch (fetchError) {
      setIsLoading(false);
      setIsError(true);
      
      const errorObject = fetchError instanceof Error 
        ? fetchError 
        : new Error(String(fetchError));
      
      setError(errorObject);
      
      // Try to load from cache even if it's stale
      try {
        const cachedDataStr = await AsyncStorage.getItem(cacheKey);
        if (cachedDataStr) {
          const cachedData = JSON.parse(cachedDataStr) as T;
          setData(cachedData);
        }
      } catch (cacheError) {
        console.warn('Cache read error during error recovery:', cacheError);
      }
      
      if (onError) onError(errorObject);
    }
  }, [queryKey, queryFn, staleTime, cacheKey, timestampKey, enabled, forceRefresh, onSuccess, onError]);

  // Cleanup old caches
  useEffect(() => {
    const cleanupCache = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const now = Date.now();
        
        for (const key of keys) {
          if (key.startsWith('query_timestamp_')) {
            const timestampStr = await AsyncStorage.getItem(key);
            if (timestampStr) {
              const timestamp = parseInt(timestampStr, 10);
              if (now - timestamp > cacheTime) {
                const cacheKey = `query_cache_${key.replace('query_timestamp_', '')}`;
                await AsyncStorage.removeItem(key);
                await AsyncStorage.removeItem(cacheKey);
              }
            }
          }
        }
      } catch (error) {
        console.warn('Cache cleanup error:', error);
      }
    };
    
    cleanupCache();
  }, [cacheTime]);

  return { data, isLoading, isError, error, refetch: () => fetchData(true) };
}
```

**Uso**:
```typescript
const { data: products, isLoading, isError, error, refetch } = useOptimizedQuery({
  queryKey: 'products',
  queryFn: () => api.getProducts(),
  staleTime: 5 * 60 * 1000, // 5 minutos
  onSuccess: (data) => console.log('Products loaded:', data.length),
  onError: (error) => console.error('Failed to load products:', error)
});
```

### 4. **useIsomorphicLayoutEffect**
**Archivo**: `hooks/useIsomorphicLayoutEffect.ts`

**Propósito**: Hook que usa `useLayoutEffect` en cliente y `useEffect` en servidor para compatibilidad SSR.

**Implementación**:
```typescript
import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
```

## 🛠️ UTILIDADES

### 1. **BluetoothPrinterService**
**Archivo**: `utils/BluetoothPrinterService.ts`

**Propósito**: Servicio para manejo de impresoras Bluetooth (mock en Expo, real en nativo).

**Interfaz**:
```typescript
interface PrinterDevice {
  id: string;
  name: string;
  address?: string;
  class?: number;
  rssi?: number;
}
```

**Métodos principales**:
```typescript
class BluetoothPrinterService {
  // Singleton pattern
  public static getInstance(): BluetoothPrinterService;
  
  // Check Bluetooth status
  public async isBluetoothEnabled(): Promise<boolean>;
  public async enableBluetooth(): Promise<boolean>;
  
  // Device management
  public async getPairedDevices(): Promise<PrinterDevice[]>;
  public async scanForDevices(timeoutMs?: number): Promise<PrinterDevice[]>;
  
  // Connection management
  public async connectToDevice(device: PrinterDevice): Promise<boolean>;
  public async disconnect(): Promise<boolean>;
  public isConnectedToPrinter(): boolean;
  
  // Printing
  public async printText(text: string): Promise<boolean>;
  public async printInvoice(invoice: any): Promise<boolean>;
  public async printPdf(pdfUrl: string): Promise<boolean>;
  public async printTestPage(): Promise<boolean>;
}
```

**Características**:
- Patrón Singleton
- Mock implementation para Expo
- Manejo de permisos automático
- Formateo de documentos para impresoras térmicas
- Reconocimiento automático de impresoras Woosim

**Uso**:
```typescript
import BluetoothPrinterService from '../utils/BluetoothPrinterService';

const printer = BluetoothPrinterService.getInstance();

// Check if connected
if (printer.isConnectedToPrinter()) {
  // Print invoice
  await printer.printInvoice(invoiceData);
} else {
  // Connect to printer
  const devices = await printer.getPairedDevices();
  const woosimPrinter = devices.find(d => d.name.includes('Woosim'));
  if (woosimPrinter) {
    await printer.connectToDevice(woosimPrinter);
  }
}
```

### 2. **Permissions Utility**
**Archivo**: `utils/permissions.ts`

**Propósito**: Manejo de permisos específicos por plataforma.

**Funciones**:
```typescript
// Request Bluetooth permissions for Android
export const requestBluetoothPermissions = async (): Promise<boolean>;

// Check if Bluetooth permissions are granted
export const checkBluetoothPermissions = async (): Promise<boolean>;
```

**Implementación**:
```typescript
export const requestBluetoothPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== "android") {
    return true; // iOS doesn't need runtime permission requests
  }
  
  try {
    const apiLevel = parseInt(Platform.Version.toString(), 10);
    
    if (apiLevel >= 31) {
      // Android 12+ - simulated in Expo
      console.log('Simulating Bluetooth permission request in Expo managed workflow');
      return true;
    } else if (apiLevel >= 23) {
      // Location permission for older Android versions
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Acceso a ubicación",
          message: "Esta aplicación necesita acceso a su ubicación para buscar dispositivos Bluetooth cercanos.",
          buttonNeutral: "Preguntar después",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    
    return true;
  } catch (err) {
    console.error("Error requesting Bluetooth permissions:", err);
    return false;
  }
};
```

## 🎯 PATRONES IMPLEMENTADOS

### 1. **Singleton Pattern**
```typescript
// BluetoothPrinterService
class BluetoothPrinterService {
  private static instance: BluetoothPrinterService;
  
  private constructor() {
    // Private constructor
  }
  
  public static getInstance(): BluetoothPrinterService {
    if (!BluetoothPrinterService.instance) {
      BluetoothPrinterService.instance = new BluetoothPrinterService();
    }
    return BluetoothPrinterService.instance;
  }
}
```

### 2. **Observer Pattern**
```typescript
// useIntersectionObserver
const observer = new IntersectionObserver(
  (entries) => {
    const [entry] = entries;
    setIsIntersecting(entry.isIntersecting);
  },
  { threshold, root, rootMargin }
);
```

### 3. **Cache Pattern**
```typescript
// Cache en memoria + persistente
const responseCache = new Map();

// Check memory cache first
const cachedResult = responseCache.get(cacheKey);
if (cachedResult && Date.now() - cachedResult.timestamp < 300000) {
  return cachedResult.data;
}

// Then check AsyncStorage
const cached = await AsyncStorage.getItem(cacheKey);
if (cached) {
  return JSON.parse(cached);
}
```

### 4. **Retry Pattern**
```typescript
// Reintentos automáticos con backoff exponencial
useEffect(() => {
  if (error && retryCount < 3) {
    const retryTimeout = setTimeout(() => {
      loadData(true);
      setRetryCount(prev => prev + 1);
    }, 5000 * (retryCount + 1)); // 5s, 10s, 15s
    
    return () => clearTimeout(retryTimeout);
  }
}, [error, retryCount]);
```

## 🔧 OPTIMIZACIONES

### 1. **Lazy Loading**
```typescript
// Componentes lazy loaded
const StatCard = lazy(() => import('../../components/StatCard'));

// Con fallback
<Suspense fallback={<StatCardFallback title="Ventas del Día" />}>
  <StatCard {...props} />
</Suspense>
```

### 2. **Memoización**
```typescript
// Memoización de componentes
const RecentDocumentsSection = memo(({ invoices, router }) => (
  // Component implementation
));

// Memoización de callbacks
const navigate = useCallback((route: string) => () => {
  router.push(route);
}, [router]);
```

### 3. **Debounce**
```typescript
// Debounce en búsquedas
useEffect(() => {
  const timerId = setTimeout(() => {
    setDebouncedSearchTerm(searchQuery);
  }, 500);

  return () => clearTimeout(timerId);
}, [searchQuery]);
```

## 📱 ADAPTACIÓN POR PLATAFORMA

### 1. **Web vs Native**
```typescript
// Intersection Observer solo en web
const { ref, isIntersecting } = Platform.OS === 'web' 
  ? useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true }) 
  : { ref: null, isIntersecting: true };
```

### 2. **Permisos por Plataforma**
```typescript
// Permisos específicos por plataforma
if (Platform.OS !== "android") {
  return true; // iOS doesn't need runtime permission requests
}
```

---

**Los hooks y utilidades están diseñados para ser reutilizables, optimizados y compatibles con múltiples plataformas.**
