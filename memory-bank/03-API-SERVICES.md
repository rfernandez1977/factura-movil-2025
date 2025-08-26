# SERVICIOS DE API

## 🔌 CONFIGURACIÓN GENERAL

### Base URL y Configuración
```typescript
// services/api.ts
let API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://produccion.facturamovil.cl';
let API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN || '431ab8e9-7867-416b-9aab-0c32c924973c';
let COMPANY_ID = process.env.EXPO_PUBLIC_COMPANY_ID || '29';
```

### Headers de Autenticación
```typescript
// Headers personalizados
config.headers['FACMOV_T'] = token;
config.headers['Content-Type'] = 'application/json';
```

## 📡 ENDPOINTS PRINCIPALES

### 1. **Autenticación**
```typescript
// Login con credenciales codificadas en Base64
POST /services/common/user/{encodedCredentials}
```

**Ejemplo de uso**:
```typescript
const encodedCredentials = encodeLoginCredentials(email, password);
const response = await fetch(`${API_BASE}/services/common/user/${encodedCredentials}`);
```

### 2. **Productos**
```typescript
// Obtener todos los productos
GET /services/common/product

// Buscar productos por término
GET /services/common/product/{searchTerm}
```

**Respuesta**:
```typescript
interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  price: number;
  unit: Unit;
  category: Category;
}

interface Category {
  id: number;
  code: string;
  name: string;
  otherTax?: {
    id: number;
    code: string;
    name: string;
    percent: number;
  };
}
```

### 3. **Clientes**
```typescript
// Obtener todos los clientes
GET /services/common/client

// Buscar clientes por término
GET /services/common/client/{searchTerm}
```

**Respuesta**:
```typescript
interface Client {
  id: number;
  code: string;        // RUT
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  municipality?: Municipality;
  activity?: Activity;
  line?: string;       // "Empresa" o "Persona"
}

interface Municipality {
  code: string;
  name: string;
  regionalEntity?: {
    code: string;
    name: string;
  };
}
```

### 4. **Ventas/Documentos**
```typescript
// Obtener ventas recientes
GET /services/common/company/{companyId}/lastsales/
```

**Respuesta**:
```typescript
interface Document {
  id: number;
  type: string;        // "FACTURA", "BOLETA", etc.
  assignedFolio: string;
  externalFolio: string | null;
  date: string;
  state: string[];     // ["ACCEPTED", "Aceptado"] o ["PENDING", "Pendiente"]
  client: {
    id: number;
    rut: string;
    name: string;
    email?: string;
  };
  total: number;
  validation: string;
  details?: ProductDetail[];
}
```

### 5. **Crear Factura**
```typescript
// Crear factura electrónica
POST /services/raw/company/{companyId}/invoice
```

**Request Body**:
```typescript
interface InvoiceRequest {
  currency: string;        // "CLP"
  hasTaxes: boolean;
  client: {
    code: string;          // RUT
    name: string;
    address?: string;
    municipality?: string;
    line?: string;
  };
  date: string;            // YYYY-MM-DD
  details: ProductDetail[];
  paymentMethod?: string;
  paymentCondition?: string;
}

interface ProductDetail {
  position: number;
  product: {
    code: string;
    name: string;
    price: number;
    unit?: { code: string };
    category?: {
      id: number;
      code: string;
      name: string;
      otherTax?: {
        id: number;
        code: string;
        name: string;
        percent: number;
      };
    };
  };
  quantity: number;
  description?: string;
}
```

### 6. **Crear Boleta**
```typescript
// Crear boleta electrónica
POST /services/raw/company/{companyId}/ticket
```

**Request Body**:
```typescript
interface TicketRequest {
  netAmounts: boolean;
  hasTaxes: boolean;
  ticketType: {
    code: string;          // "3" para Boleta Electrónica
  };
  client?: {
    code: string;          // RUT (opcional para boletas)
    name: string;
    address?: string;
    municipality?: string;
  };
  date: string;
  details: ProductDetail[];
  paymentMethod?: string;
  paymentCondition?: string;
}
```

### 7. **Detalles de Factura**
```typescript
// Obtener detalles de factura por folio
GET /services/common/company/{companyId}/invoice/{assignedFolio}/getInfo
```

### 8. **PDF de Documento**
```typescript
// Generar URL de PDF
GET /document/toPdf/{id}?v={validation}
```

## 🔄 PATRONES DE CACHE

### 1. **Cache en Memoria**
```typescript
const responseCache = new Map();

// Interceptor para cache automático
axiosInstance.interceptors.response.use(
  (response) => {
    const requestUrl = response.config.url;
    if (requestUrl && 
        (requestUrl.includes('/services/common/product') || 
         requestUrl.includes('/services/common/client') ||
         requestUrl.includes('/lastsales/')) &&
        response.status === 200) {
      responseCache.set(requestUrl, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  }
);
```

### 2. **Cache Persistente con AsyncStorage**
```typescript
const getFromCache = async <T>(
  cacheKey: string,
  networkFetcher: () => Promise<T>,
  forceRefresh = false
): Promise<T> => {
  try {
    if (!forceRefresh) {
      // Check memory cache first (5 minutes)
      const cachedResult = responseCache.get(cacheKey);
      if (cachedResult && Date.now() - cachedResult.timestamp < 300000) {
        return cachedResult.data;
      }
      
      // Then check AsyncStorage
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }
    
    // Fetch fresh data
    const result = await networkFetcher();
    
    // Cache result
    if (result) {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
    }
    
    return result;
  } catch (error) {
    // Fallback to cached data if network fails
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    throw error;
  }
};
```

### 3. **Keys de Cache**
```typescript
const CACHE_KEYS = {
  PRODUCTS: '@products_cache',
  CLIENTS: '@clients_cache',
  SALES: '@sales_cache',
  INVOICE_DETAILS: '@invoice_details',
  AUTH_USER: '@auth_user',
  ACTIVE_COMPANY: '@active_company',
  SETTINGS: '@settings'
};
```

## 🛡️ MANEJO DE ERRORES

### 1. **Tipos de Error**
```typescript
// Errores de red
if (err.code === 'ECONNABORTED') {
  setError('Tiempo de espera agotado. La conexión al servidor tardó demasiado.');
}

// Errores del servidor
if (err.response && err.response.status === 500) {
  setError('Error en el servidor. Por favor intente nuevamente más tarde.');
}

// Errores de autenticación
if (err.response && err.response.status === 401) {
  // Redirigir a login
  router.replace('/(auth)/login');
}

// Errores 404 específicos
if (err.response?.status === 404) {
  throw new Error(`Factura con folio ${assignedFolio} no encontrada`);
}
```

### 2. **Retry Pattern**
```typescript
// Reintentos automáticos con backoff exponencial
useEffect(() => {
  if (error && retryCount < 3) {
    const retryTimeout = setTimeout(() => {
      console.log(`Automatically retrying (attempt ${retryCount + 1})`);
      loadData(true);
      setRetryCount(prev => prev + 1);
    }, 5000 * (retryCount + 1)); // 5s, 10s, 15s
    
    return () => clearTimeout(retryTimeout);
  }
}, [error, retryCount]);
```

## 🔐 AUTENTICACIÓN

### 1. **Codificación de Credenciales**
```typescript
const encodeLoginCredentials = (login: string, password: string): string => {
  const json = JSON.stringify({ login, password });
  
  if (typeof btoa === 'function') {
    return btoa(json);
  } else {
    // Implementación manual para React Native
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    // ... implementación Base64
  }
};
```

### 2. **Gestión de Tokens**
```typescript
// Inicialización de auth
const initializeAuthHeader = async () => {
  const userJson = await AsyncStorage.getItem(AUTH_USER_KEY);
  if (userJson) {
    const userData = JSON.parse(userJson);
    if (userData.token) {
      USER_TOKEN = userData.token;
    }
    // ... configuración de empresa activa
  }
  AUTH_INITIALIZED = true;
};

// Actualización de auth
const updateAuthData = (token: string, companyId: number | string) => {
  USER_TOKEN = token;
  USER_COMPANY_ID = companyId.toString();
  AUTH_INITIALIZED = true;
};
```

## 📊 MÉTODOS DE API

### 1. **Productos**
```typescript
const getProducts = async (forceRefresh = false, searchTerm = ''): Promise<Product[]> => {
  const cacheKey = searchTerm ? 
    `${PRODUCTS_CACHE_KEY}_search_${searchTerm}` : 
    PRODUCTS_CACHE_KEY;
  
  const endpoint = searchTerm ? 
    `/services/common/product/${searchTerm}` : 
    '/services/common/product';
  
  const fetcher = async () => {
    const response = await axiosInstance.get(endpoint);
    return response.data?.products || response.data || [];
  };
  
  return await getFromCache<Product[]>(cacheKey, fetcher, forceRefresh);
};
```

### 2. **Clientes**
```typescript
const getClients = async (forceRefresh = false, searchTerm = ''): Promise<Client[]> => {
  const cacheKey = searchTerm ? 
    `${CLIENTS_CACHE_KEY}_search_${searchTerm}` : 
    CLIENTS_CACHE_KEY;
  
  const endpoint = searchTerm ? 
    `/services/common/client/${searchTerm}` : 
    '/services/common/client';
  
  const fetcher = async () => {
    const response = await axiosInstance.get(endpoint);
    return response.data?.clients || response.data || [];
  };
  
  return await getFromCache<Client[]>(cacheKey, fetcher, forceRefresh);
};
```

### 3. **Ventas**
```typescript
const getSales = async (forceRefresh = false): Promise<Document[]> => {
  const companyId = USER_COMPANY_ID || COMPANY_ID;
  const endpoint = `/services/common/company/${companyId}/lastsales/`;
  
  const fetcher = async () => {
    const response = await axiosInstance.get(endpoint);
    return response.data?.documents || response.data || [];
  };
  
  return await getFromCache<Document[]>(SALES_CACHE_KEY, fetcher, forceRefresh);
};
```

### 4. **Detalles de Documentos**
```typescript
// Función genérica para obtener detalles de cualquier documento
const getDocumentDetail = async (assignedFolio: string, documentType: string): Promise<Document> => {
  const companyId = USER_COMPANY_ID || COMPANY_ID;
  const cacheKey = `${INVOICE_DETAILS_CACHE_KEY}_${documentType}_${assignedFolio}`;
  
  // Determinar endpoint basado en el tipo de documento
  let endpoint: string;
  switch (documentType.toUpperCase()) {
    case 'FACTURA':
    case 'FACTURA_EXENTA':
    case 'FACTURA_NO_AFECTA':
      endpoint = `/services/common/company/${companyId}/invoice/${assignedFolio}/getInfo`;
      break;
    case 'BOLETA':
      endpoint = `/services/common/company/${companyId}/ticket/${assignedFolio}/getInfo`;
      break;
    case 'NOTE':
      endpoint = `/services/common/company/${companyId}/note/${assignedFolio}/getInfo`;
      break;
    case 'WAYBILL':
      endpoint = `/services/common/company/${companyId}/waybill/${assignedFolio}/getInfo`;
      break;
    default:
      endpoint = `/services/common/company/${companyId}/document/${assignedFolio}/getInfo?type=${encodeURIComponent(documentType)}`;
  }
  
  const fetcher = async () => {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  };
  
  return await getFromCache<Document>(cacheKey, fetcher, false);
};

// Funciones específicas para mantener compatibilidad
const getInvoiceDetail = async (assignedFolio: string): Promise<Document> => {
  return getDocumentDetail(assignedFolio, 'FACTURA');
};

const getTicketDetail = async (assignedFolio: string): Promise<Document> => {
  return getDocumentDetail(assignedFolio, 'BOLETA');
};

const getNoteDetail = async (assignedFolio: string): Promise<Document> => {
  return getDocumentDetail(assignedFolio, 'NOTE');
};

const getWaybillDetail = async (assignedFolio: string): Promise<Document> => {
  return getDocumentDetail(assignedFolio, 'WAYBILL');
};
```

### 5. **Crear Documentos**
```typescript
const createInvoice = async (invoiceData: InvoiceRequest): Promise<any> => {
  const companyId = USER_COMPANY_ID || COMPANY_ID;
  const endpoint = `/services/raw/company/${companyId}/invoice`;
  
  const response = await axiosInstance.post(endpoint, invoiceData);
  
  // Limpiar cache de ventas
  await AsyncStorage.removeItem(SALES_CACHE_KEY);
  responseCache.delete(`/services/common/company/${companyId}/lastsales/`);
  
  return response.data;
};
```

## 🧹 LIMPIEZA DE CACHE

### 1. **Métodos de Limpieza**
```typescript
const clearProductsCache = async () => {
  await AsyncStorage.removeItem(PRODUCTS_CACHE_KEY);
  
  // Limpiar cache de búsquedas
  const keys = await AsyncStorage.getAllKeys();
  const productSearchKeys = keys.filter(key => 
    key.startsWith(`${PRODUCTS_CACHE_KEY}_search_`)
  );
  if (productSearchKeys.length > 0) {
    await AsyncStorage.multiRemove(productSearchKeys);
  }
  
  // Limpiar cache en memoria
  for (const [key] of responseCache.entries()) {
    if (key.includes('/services/common/product')) {
      responseCache.delete(key);
    }
  }
};
```

### 2. **Limpieza Automática**
```typescript
// Limpiar cache expirado
const cleanupCache = async () => {
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
};
```

---

**Los servicios de API están diseñados para ser robustos, con cache inteligente, manejo de errores y retry automático.**
