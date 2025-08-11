# ARQUITECTURA DEL PROYECTO

## 🏗️ PATRONES DE DISEÑO

### 1. **File-Based Routing (Expo Router)**
```
app/
├── _layout.tsx              # Layout raíz con providers
├── (auth)/
│   ├── _layout.tsx          # Layout de autenticación
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (tabs)/
│   ├── _layout.tsx          # Layout de tabs principales
│   ├── index.tsx            # Dashboard
│   ├── clients/
│   ├── products/
│   ├── sales/
│   └── settings/
└── +not-found.tsx           # Página 404
```

### 2. **Context Pattern (Estado Global)**
```typescript
// AuthContext - Manejo de autenticación
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setActiveCompany: (companyId: number) => void;
  activeCompany: Company | null;
}

// ThemeContext - Configuración global
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  isDark: boolean;
  offlineMode: boolean;
  aiConfig: AIConfig;
  printerConfig: PrinterConfig;
  // ... otros settings
}
```

### 3. **Service Layer Pattern**
```typescript
// services/api.ts - Capa de servicios
export const api = {
  getProducts: async (forceRefresh = false, searchTerm = '') => Promise<Product[]>,
  getClients: async (forceRefresh = false, searchTerm = '') => Promise<Client[]>,
  getSales: async (forceRefresh = false) => Promise<Document[]>,
  createInvoice: async (invoiceData: InvoiceRequest) => Promise<any>,
  createTicket: async (ticketData: TicketRequest) => Promise<any>,
  // ... otros métodos
};
```

## 🔄 FLUJOS DE DATOS

### 1. **Flujo de Autenticación**
```
Login Screen → AuthContext.signIn() → API Call → AsyncStorage → Update State → Navigate to Tabs
```

### 2. **Flujo de Carga de Datos**
```
Component → useOptimizedQuery() → Cache Check → API Call → Update Cache → Update State → Render
```

### 3. **Flujo de Creación de Documentos**
```
Form → Validation → invoiceService.formatData() → API Call → Update Sales Cache → Navigate to Details
```

## 🎯 DECISIONES TÉCNICAS

### 1. **Gestión de Estado**
- **Context API** en lugar de Redux para simplicidad
- **AsyncStorage** para persistencia local
- **Cache en memoria** para optimización de rendimiento

### 2. **Optimización de Rendimiento**
```typescript
// Lazy Loading de componentes
const StatCard = lazy(() => import('../../components/StatCard'));

// Memoización de componentes
const RecentDocumentsSection = memo(({ invoices, router }) => (
  // Component implementation
));

// Debounce en búsquedas
useEffect(() => {
  const timerId = setTimeout(() => {
    setDebouncedSearchTerm(searchQuery);
  }, 500);
  return () => clearTimeout(timerId);
}, [searchQuery]);
```

### 3. **Manejo de Errores**
```typescript
// Error boundaries y fallbacks
try {
  const data = await api.getProducts(forceRefresh, searchTerm);
  setProducts(data);
} catch (err) {
  // Fallback a cache
  const cached = await AsyncStorage.getItem(PRODUCTS_CACHE_KEY);
  if (cached) {
    setProducts(JSON.parse(cached));
  }
  setError('Error al cargar productos');
}
```

## 🔧 CONFIGURACIÓN DE BUILD

### 1. **Webpack Optimization**
```javascript
// webpack.config.js
config.optimization.splitChunks = {
  chunks: 'all',
  maxInitialRequests: Infinity,
  minSize: 20000,
  maxSize: 200000,
  cacheGroups: {
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      name(module) {
        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
        return `npm.${packageName}`;
      },
    },
  },
};
```

### 2. **Babel Configuration**
```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'react-native-reanimated/plugin'
    ],
  };
};
```

## 📱 PATRONES DE UI/UX

### 1. **Componentes Reutilizables**
```typescript
// StatCard - Componente de estadísticas
interface StatCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
}

// ClientCard - Componente de cliente
interface ClientCardProps {
  item: Client;
  onPress: () => void;
}
```

### 2. **Sistema de Temas**
```typescript
// Soporte para modo oscuro/claro
const isDark = 
  settings.theme === 'system' 
    ? systemColorScheme === 'dark'
    : settings.theme === 'dark';

// Estilos condicionales
<View style={[styles.container, isDark && styles.darkContainer]}>
```

### 3. **Navegación Responsive**
```typescript
// Adaptación según plataforma
const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
});
```

## 🔐 SEGURIDAD Y PERMISOS

### 1. **Autenticación Segura**
```typescript
// Codificación Base64 de credenciales
const encodeLoginCredentials = (login: string, password: string): string => {
  const json = JSON.stringify({ login, password });
  return btoa(json);
};

// Headers de autenticación
config.headers['FACMOV_T'] = token;
```

### 2. **Manejo de Permisos**
```typescript
// Permisos Bluetooth (Android)
export const requestBluetoothPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== "android") return true;
  
  const apiLevel = parseInt(Platform.Version.toString(), 10);
  if (apiLevel >= 31) {
    // Android 12+ permissions
    return true;
  }
  // Location permission for older versions
  return await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
};
```

## 📊 PATRONES DE CACHE

### 1. **Cache en Memoria**
```typescript
const responseCache = new Map();

// Interceptor para cache automático
axiosInstance.interceptors.response.use(
  (response) => {
    const requestUrl = response.config.url;
    if (requestUrl && response.status === 200) {
      responseCache.set(requestUrl, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  }
);
```

### 2. **Cache Persistente**
```typescript
const getFromCache = async <T>(
  cacheKey: string,
  networkFetcher: () => Promise<T>,
  forceRefresh = false
): Promise<T> => {
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
  
  // Fetch fresh data
  const result = await networkFetcher();
  await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
  return result;
};
```

## 🚀 OPTIMIZACIONES ESPECÍFICAS

### 1. **Lazy Loading de Imágenes**
```typescript
// LazyImage component
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  placeholderColor = '#e1e1e1',
  width,
  height,
  ...rest
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({ 
    threshold: 0.1, 
    freezeOnceVisible: true 
  });
  
  // Load image only when visible
  useEffect(() => {
    if (isIntersecting && !imgSrc) {
      setImgSrc(src);
    }
  }, [isIntersecting, src]);
};
```

### 2. **Optimización de Listas**
```typescript
// FlatList optimizations
<FlatList
  data={clients}
  renderItem={renderItem}
  keyExtractor={item => item.id.toString()}
  initialNumToRender={8}
  maxToRenderPerBatch={5}
  windowSize={5}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
/>
```

---

**Esta arquitectura proporciona una base sólida, escalable y mantenible para la aplicación de facturación móvil.**
