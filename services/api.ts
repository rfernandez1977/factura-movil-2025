import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

// Define API URLs - Use pure string literals for faster performance (no string interpolation)
let API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://produccion.facturamovil.cl';
let API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN || '65de4321-502f-451c-b7cb-90c8d5e738ba';
let COMPANY_ID = process.env.EXPO_PUBLIC_COMPANY_ID || '487';

// Auth state
let AUTH_INITIALIZED = false;
let USER_TOKEN: string | null = null;
let USER_COMPANY_ID: string | null = null;

// Storage keys
const AUTH_USER_KEY = '@auth_user';
const ACTIVE_COMPANY_KEY = '@active_company';
const PRODUCTS_CACHE_KEY = '@products_cache';
const CLIENTS_CACHE_KEY = '@clients_cache';
const SALES_CACHE_KEY = '@sales_cache';
const INVOICE_DETAILS_CACHE_KEY = '@invoice_details';

// Create axios instance with optimized config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  // Optimized axios config for faster requests
  decompress: true,
  maxRedirects: 5,
  responseType: 'json',
});

// Optimized request interceptor with reduced console logging
axiosInstance.interceptors.request.use(
  async (config) => {
    if (!AUTH_INITIALIZED) {
      await initializeAuthHeader();
    }
    const token = USER_TOKEN || API_TOKEN;
    config.headers['FACMOV_T'] = token;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optimized response caching logic
const responseCache = new Map();

// Use the response cache to store frequently accessed data in memory
axiosInstance.interceptors.response.use(
  (response) => {
    const requestUrl = response.config.url;
    if (
      requestUrl && 
      (requestUrl.includes('/services/common/product') || 
       requestUrl.includes('/services/common/client') ||
       requestUrl.includes('/lastsales/')) &&
      response.status === 200
    ) {
      // Store the response in memory cache to avoid fetching
      responseCache.set(requestUrl, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// Initialize auth data
const initializeAuthHeader = async () => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    const userJson = await AsyncStorage.getItem(AUTH_USER_KEY);
    if (userJson) {
      const userData = JSON.parse(userJson);
      if (userData.token) {
        USER_TOKEN = userData.token;
      }
      const activeCompanyJson = await AsyncStorage.getItem(ACTIVE_COMPANY_KEY);
      if (activeCompanyJson) {
        const activeCompany = JSON.parse(activeCompanyJson);
        if (activeCompany && activeCompany.id) {
          USER_COMPANY_ID = activeCompany.id.toString();
        }
      } else if (userData.mobileCompany && userData.mobileCompany.id) {
        USER_COMPANY_ID = userData.mobileCompany.id.toString();
      } else if (userData.companies && userData.companies.length > 0) {
        USER_COMPANY_ID = userData.companies[0].id.toString();
      }
    }
    AUTH_INITIALIZED = true;
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
};

// Update auth data
const updateAuthData = (token: string, companyId: number | string) => {
  USER_TOKEN = token;
  USER_COMPANY_ID = companyId.toString();
  AUTH_INITIALIZED = true;
};

// Clear auth data
const clearAuthData = () => {
  USER_TOKEN = null;
  USER_COMPANY_ID = null;
  AUTH_INITIALIZED = false;
  // Clear response cache when auth is cleared
  responseCache.clear();
};

// Interfaces
interface Municipality {
  code: string;
  name: string;
  regionalEntity?: {
    code: string;
    name: string;
  };
}

interface Activity {
  id: number;
  code: string;
  name: string;
}

interface Municipality {
  id: number;
  code: string;
  name: string;
}

interface Activity {
  id: number;
  code: string;
  name: string;
}

interface Address {
  id: number;
  address: string;
  municipality?: Municipality;
}

export interface Client {
  id: number;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  municipality?: Municipality;
  activity?: Activity;
  line?: string;
  additionalAddress?: Address[];
}

interface Unit {
  id: number;
  code: string;
  name: string;
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

export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  price: number;
  unit: Unit;
  category: Category;
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

export interface InvoiceClient {
  code: string;
  name: string;
  address?: string;
  municipality?: string;
  line?: string;
}

export interface InvoiceProductDetail {
  position: number;
  product: {
    code: string;
    name: string;
    price: number;
    unit?: {
      code: string;
    };
    category?: {
      id: number;
      code: string;
      name: string;
    };
  };
  quantity: number;
}

export interface InvoiceRequest {
  currency: string;
  hasTaxes: boolean;
  client: InvoiceClient;
  date: string;
  details: InvoiceProductDetail[];
  paymentMethod?: string;
  paymentCondition?: string;
  externalFolio?: string;
}

// NUEVO ESQUEMA MEJORADO CON IMPUESTOS ADICIONALES
export interface EnhancedInvoiceClient {
  id: number;
  code: string;
  name: string;
  address?: string;
  email?: string;
  municipality?: {
    id: number;
    name: string;
    code: string;
  };
  line?: string;
  additionalAddress?: Address[];
}

export interface EnhancedInvoiceProduct {
  id: number;
  code: string;
  name: string;
  price: number;
  unit: {
    id: number;
    name: string;
    code: string;
  };
  category: {
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
}

export interface EnhancedInvoiceDetail {
  product: EnhancedInvoiceProduct;
  quantity: number;
}

export interface EnhancedInvoiceRequest {
  hasTaxes: boolean;
  externalFolio?: string;
  client: EnhancedInvoiceClient;
  details: EnhancedInvoiceDetail[];
  netTotal: number;
  discounts?: number;
  date: string;
  exemptTotal?: number;
  otherTaxes?: number;
  taxes: number;
}

export interface TicketRequest {
  hasTaxes: boolean;
  ticketType: {
    code: string;
  };
  externalFolio?: string;
  client?: {
    id?: number;
    code: string;
    name: string;
    address?: string;
    email?: string;
    line?: string;
    municipality?: {
      id?: number;
      name: string;
      code: string;
    };
    additionalAddress?: any[];
  };
  date: string;
  details: ProductDetail[];
  paymentMethod?: string;
  paymentCondition?: string;
}

// Interfaces para Guía de Despacho
export interface TransferType {
  id: number;
  code: string;
  name: string;
}

export interface DispatchType {
  id: number;
  code: string;
  name: string;
}

export interface WaybillRequest {
  transferType: {
    code: string;
  };
  dispatchType?: {
    code: string;
  };
  client: {
    id?: number;
    code: string;
    name: string;
    address?: string;
    email?: string;
    line?: string;
    municipality?: {
      id?: number;
      name: string;
      code: string;
    };
    additionalAddress?: any[];
  };
  externalFolio?: string;
  date: string;
  details: ProductDetail[];
  references?: any[];
  payments?: any[];
}

export interface Document {
  id: number;
  type: string;
  assignedFolio: string;
  externalFolio: string | null;
  date: string;
  state: string[];
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

// Check memory cache first before making a network request
const getFromCache = async <T>(
  cacheKey: string,
  networkFetcher: () => Promise<T>,
  forceRefresh = false
): Promise<T> => {
  try {
    if (!forceRefresh) {
      // First check memory cache
      const cachedResult = responseCache.get(cacheKey);
      if (cachedResult && Date.now() - cachedResult.timestamp < 300000) { // 5 minutes cache
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
    
    // Cache result in AsyncStorage
    if (result) {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
    }
    
    return result;
  } catch (error) {
    // Try to use cached data if network request fails
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    throw error;
  }
};

// API methods - Optimized for faster execution

const getProducts = async (forceRefresh = false, searchTerm = ''): Promise<Product[]> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    
    // Use a different cache key for search terms
    const cacheKey = searchTerm ? 
      `${PRODUCTS_CACHE_KEY}_search_${searchTerm}` : 
      PRODUCTS_CACHE_KEY;
    
    // Generate the endpoint url
    const endpoint = searchTerm ? `/services/common/product/${searchTerm}` : '/services/common/product';
    
    // Create network fetcher function
    const fetcher = async () => {
      const response = await axiosInstance.get(endpoint);
      if (!response.data) {
        throw new Error('Invalid response format: No data received');
      }
      return response.data?.products || response.data || [];
    };
    
    // Get data with caching logic
    return await getFromCache<Product[]>(cacheKey, fetcher, forceRefresh);
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Check if there's cached data we can fall back to
    const cached = await AsyncStorage.getItem(PRODUCTS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    
    throw error;
  }
};

const searchProducts = async (query: string): Promise<Product[]> => {
  return getProducts(true, query);
};

const getClients = async (forceRefresh = false, searchTerm = ''): Promise<Client[]> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    
    // Use a different cache key for search terms
    const cacheKey = searchTerm ? 
      `${CLIENTS_CACHE_KEY}_search_${searchTerm}` : 
      CLIENTS_CACHE_KEY;
    
    // Generate endpoint url
    const endpoint = searchTerm ? `/services/common/client/${searchTerm}` : '/services/common/client';
    
    // Create network fetcher function
    const fetcher = async () => {
      const response = await axiosInstance.get(endpoint);
      if (!response.data) {
        throw new Error('Invalid response format: No data received for clients');
      }
      return response.data?.clients || response.data || [];
    };
    
    // Get data with caching logic
    return await getFromCache<Client[]>(cacheKey, fetcher, forceRefresh);
  } catch (error) {
    console.error('Error fetching clients:', error);
    
    // Try to use cached data
    const cached = await AsyncStorage.getItem(CLIENTS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    
    throw error;
  }
};

const getSales = async (forceRefresh = false): Promise<Document[]> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const companyId = USER_COMPANY_ID || COMPANY_ID;
    
    // Create endpoint url
    const endpoint = `/services/common/company/${companyId}/lastsales/`;
    
    // Create network fetcher function
    const fetcher = async () => {
      const response = await axiosInstance.get(endpoint);
      if (!response.data) {
        throw new Error('Invalid response format: No data received for sales');
      }
      return response.data?.documents || response.data || [];
    };
    
    // Get data with caching logic
    return await getFromCache<Document[]>(SALES_CACHE_KEY, fetcher, forceRefresh);
  } catch (error) {
    console.error('Error fetching sales:', error);
    
    // Try to use cached data
    const cached = await AsyncStorage.getItem(SALES_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    
    throw error;
  }
};

const searchSales = async (searchTerm: string): Promise<Document[]> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const companyId = USER_COMPANY_ID || COMPANY_ID;
    
    // Create endpoint url for search
    const endpoint = `/services/common/company/${companyId}/lastsales/${encodeURIComponent(searchTerm)}`;
    
    // Create network fetcher function
    const fetcher = async () => {
      const response = await axiosInstance.get(endpoint);
      if (!response.data) {
        throw new Error('Invalid response format: No data received for sales search');
      }
      return response.data?.documents || response.data || [];
    };
    
    // For search, we don't use cache to get fresh results
    return await fetcher();
  } catch (error) {
    console.error('Error searching sales:', error);
    
    // If search fails, try to filter from cached sales
    try {
      const cached = await AsyncStorage.getItem(SALES_CACHE_KEY);
      if (cached) {
        const allSales: Document[] = JSON.parse(cached);
        const searchLower = searchTerm.toLowerCase();
        
        // Filter by client name or RUT
        return allSales.filter(sale => 
          sale.client?.name?.toLowerCase().includes(searchLower) ||
          sale.client?.rut?.toLowerCase().includes(searchLower) ||
          sale.assignedFolio?.toLowerCase().includes(searchLower)
        );
      }
    } catch (cacheError) {
      console.error('Error filtering from cache:', cacheError);
    }
    
    throw error;
  }
};

const searchDocuments = async (searchTerm: string): Promise<Document[]> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const companyId = USER_COMPANY_ID || COMPANY_ID;
    
    // Try the more specific document search API first
    const documentEndpoint = `/services/common/company/${companyId}/document/${encodeURIComponent(searchTerm)}`;
    
    console.log('[API] Trying document search endpoint:', documentEndpoint);
    
    const response = await axiosInstance.get(documentEndpoint);
    if (response.data) {
      console.log('[API] Document search successful');
      return response.data?.documents || response.data || [];
    }
    
    throw new Error('No data received from document search');
  } catch (error) {
    console.log('[API] Document search failed, falling back to lastsales search');
    
    // Fallback to the original lastsales search
    return searchSales(searchTerm);
  }
};

const searchInvoices = async (searchTerm: string): Promise<Document[]> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    
    // Usar la API específica de facturas históricas
    const endpoint = `/services/invoice/${encodeURIComponent(searchTerm)}`;
    
    console.log('[API] Using invoice search endpoint:', endpoint);
    console.log('[API] Search term:', searchTerm);
    
    const response = await axiosInstance.get(endpoint);
    console.log('[API] Raw response status:', response.status);
    console.log('[API] Raw response data type:', typeof response.data);
    console.log('[API] Raw response data keys:', Object.keys(response.data || {}));
    console.log('[API] Raw response data:', JSON.stringify(response.data, null, 2));
    console.log('[API] response.data.data exists:', !!response.data?.data);
    console.log('[API] response.data.data is array:', Array.isArray(response.data?.data));
    console.log('[API] response.data.data length:', response.data?.data?.length);
    console.log('[API] response.data keys:', Object.keys(response.data || {}));
    console.log('[API] response.data.data keys:', Object.keys(response.data?.data || {}));
    
    if (response.data) {
      console.log('[API] Invoice search successful');
      console.log('[API] Response data structure:', {
        hasDocuments: !!response.data.documents,
        documentsLength: response.data.documents?.length,
        isArray: Array.isArray(response.data),
        isArrayDocuments: Array.isArray(response.data.documents),
        directLength: Array.isArray(response.data) ? response.data.length : 'not array'
      });
      
      // Extraer los datos de la respuesta
      let results = [];
      
      // Intentar diferentes estructuras de respuesta
      if (response.data?.invoices && Array.isArray(response.data.invoices)) {
        // Estructura correcta: { invoices: [...] }
        results = response.data.invoices;
        console.log('[API] ✅ Found data in response.data.invoices, length:', results.length);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Estructura alternativa: { data: [...] }
        results = response.data.data;
        console.log('[API] ✅ Found data in response.data.data, length:', results.length);
      } else if (Array.isArray(response.data)) {
        // Estructura: [...] (array directo)
        results = response.data;
        console.log('[API] ✅ Found data directly in response.data, length:', results.length);
      } else if (response.data?.documents && Array.isArray(response.data.documents)) {
        // Estructura: { documents: [...] }
        results = response.data.documents;
        console.log('[API] ✅ Found data in response.data.documents, length:', results.length);
      } else {
        console.log('[API] ❌ No valid data structure found');
        console.log('[API] response.data exists:', !!response.data);
        console.log('[API] response.data type:', typeof response.data);
        console.log('[API] response.data keys:', Object.keys(response.data || {}));
        results = [];
      }
      console.log('[API] Final results length:', results.length);
      // Normalizar los datos para que coincidan con la estructura esperada
      results = results.map(invoice => ({
        ...invoice,
        type: 'Factura electrónica', // Las facturas de esta API son siempre facturas
        total: (invoice.netTotal || 0) + (invoice.taxes || 0) + (invoice.otherTaxes || 0) + (invoice.exemptTotal || 0)
      }));
      
      console.log('[API] First result sample:', results[0] ? {
        id: results[0].id,
        type: results[0].type,
        assignedFolio: results[0].assignedFolio,
        clientName: results[0].client?.name,
        total: results[0].total
      } : 'no results');
      
      return results;
    }
    
    throw new Error('No data received from invoice search');
  } catch (error) {
    console.log('[API] Invoice search failed, falling back to lastsales search');
    console.log('[API] Error details:', error);
    
    // Fallback a búsqueda de últimas ventas
    return searchSales(searchTerm);
  }
};

const getInvoiceDetail = async (assignedFolio: string): Promise<Document> => {
  return getDocumentDetail(assignedFolio, 'FACTURA');
};

const getInvoiceDetailById = async (invoiceId: number): Promise<Document> => {
  try {
    // Try to get from cache first
    const cacheKey = `${INVOICE_DETAILS_CACHE_KEY}_id_${invoiceId}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // If not in cache, get from sales list
    const sales = await getSales();
    const document = sales.find(doc => doc.id === invoiceId);
    if (!document) {
      throw new Error(`Document with id ${invoiceId} not found in sales list`);
    }
    
    // Get detailed information using the generic function
    const details = await getDocumentDetail(document.assignedFolio, document.type);
    
    // Cache the result by ID as well
    await AsyncStorage.setItem(cacheKey, JSON.stringify(details));
    
    return details;
  } catch (error) {
    console.error('Error fetching document detail by id:', error);
    throw error;
  }
};

// Función genérica para obtener detalles de cualquier documento
const getDocumentDetail = async (assignedFolio: string, documentType: string): Promise<Document> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const companyId = USER_COMPANY_ID || COMPANY_ID;
    const cacheKey = `${INVOICE_DETAILS_CACHE_KEY}_${documentType}_${assignedFolio}`;
    
    // Logs de diagnóstico detallados
    console.log(`[API] 🔍 DIAGNÓSTICO - getDocumentDetail:`);
    console.log(`[API] 📋 Folio recibido: "${assignedFolio}"`);
    console.log(`[API] 📋 Tipo recibido: "${documentType}"`);
    console.log(`[API] 📋 Cache key: "${cacheKey}"`);
    
    // Determinar endpoint basado en el tipo de documento
    let endpoint: string;
    const docTypeUpper = documentType.toUpperCase();
    
    // Log para debugging
    console.log(`[API] Processing document type: "${documentType}" (${docTypeUpper})`);
    
    // Priorizar tipos específicos antes que los genéricos
    if (docTypeUpper.includes('NOTA') || docTypeUpper.includes('CRÉDITO') || docTypeUpper.includes('NOTE')) {
      endpoint = `/services/common/company/${companyId}/note/${assignedFolio}/getInfo`;
      console.log(`[API] Using note endpoint for: ${documentType}`);
    } else if (docTypeUpper.includes('BOLETA') || docTypeUpper.includes('TICKET')) {
      endpoint = `/services/common/company/${companyId}/ticket/${assignedFolio}/getInfo`;
      console.log(`[API] Using ticket endpoint for: ${documentType}`);
    } else if (docTypeUpper.includes('GUÍA') || docTypeUpper.includes('DESPACHO') || docTypeUpper.includes('WAYBILL')) {
      endpoint = `/services/common/company/${companyId}/waybill/${assignedFolio}/getInfo`;
      console.log(`[API] Using waybill endpoint for: ${documentType}`);
    } else if (docTypeUpper.includes('FACTURA')) {
      // Solo facturas específicas, no cualquier cosa con "ELECTRÓNICA"
      endpoint = `/services/common/company/${companyId}/invoice/${assignedFolio}/getInfo`;
      console.log(`[API] Using invoice endpoint for: ${documentType}`);
    } else {
      // Endpoint genérico como fallback
      endpoint = `/services/common/company/${companyId}/document/${assignedFolio}/getInfo?type=${encodeURIComponent(documentType)}`;
      console.log(`[API] Using generic endpoint for: ${documentType}`);
    }
    
    const fetcher = async () => {
      console.log(`[API] 🔍 DIAGNÓSTICO - Llamando endpoint: "${endpoint}"`);
      
      const response = await axiosInstance.get(endpoint);
      if (!response.data) {
        throw new Error(`Invalid ${documentType} detail response: No data received`);
      }
      
      // DEBUG: Log the raw API response
      console.log(`[API] Raw ${documentType} detail response:`, JSON.stringify(response.data, null, 2));
      console.log(`[API] ${documentType} detail type field:`, response.data.type);
      
      // Logs de diagnóstico detallados de la respuesta
      console.log(`[API] 🔍 DIAGNÓSTICO - Respuesta de API:`);
      console.log(`[API] 📋 Response success:`, response.data.success);
      console.log(`[API] 📋 Response id:`, response.data.id);
      console.log(`[API] 📋 Response assignedFolio:`, response.data.assignedFolio);
      console.log(`[API] 📋 Response type:`, response.data.type);
      console.log(`[API] 📋 Response validation:`, response.data.validation?.substring(0, 10) + '...');
      console.log(`[API] 📋 Response keys:`, Object.keys(response.data));
      
      return response.data;
    };
    
    return await getFromCache<Document>(cacheKey, fetcher, false);
  } catch (error: any) {
    console.error(`Error fetching ${documentType} detail:`, error);
    if (error.response?.status === 404) {
      throw new Error(`${documentType} con folio ${assignedFolio} no encontrada`);
    }
    throw error;
  }
};

// Funciones específicas para mantener compatibilidad
const getTicketDetail = async (assignedFolio: string): Promise<Document> => {
  return getDocumentDetail(assignedFolio, 'BOLETA');
};

const getNoteDetail = async (assignedFolio: string): Promise<Document> => {
  return getDocumentDetail(assignedFolio, 'NOTE');
};

const getWaybillDetail = async (assignedFolio: string): Promise<Document> => {
  return getDocumentDetail(assignedFolio, 'WAYBILL');
};

const getInvoicePdf = async (id: number, validation: string, documentType?: string): Promise<string> => {
  try {
    // Logs de diagnóstico detallados
    console.log(`[API] 🔍 DIAGNÓSTICO - getInvoicePdf:`);
    console.log(`[API] 📋 ID recibido: ${id}`);
    console.log(`[API] 📋 Validation recibido: ${validation?.substring(0, 10)}...`);
    console.log(`[API] 📋 DocumentType recibido: "${documentType}"`);
    console.log(`[API] 📋 DocumentType type: ${typeof documentType}`);
    
    // NUEVA ESTRATEGIA: Usar diferentes endpoints según el tipo de documento
    let pdfUrl: string;
    
    if (documentType) {
      const normalizedType = documentType.toUpperCase();
      
      if (normalizedType.includes('NO AFECTA') || normalizedType.includes('EXENTA')) {
        // Usar endpoint específico para facturas no afectas/exentas
        pdfUrl = `${API_BASE}/document/toPdf/${id}?v=${validation}&type=FACTURA_NO_AFECTA`;
        console.log(`[API] ✅ Usando endpoint específico para FACTURA_NO_AFECTA`);
      } else if (normalizedType.includes('FACTURA')) {
        // Usar endpoint específico para facturas electrónicas normales
        pdfUrl = `${API_BASE}/document/toPdf/${id}?v=${validation}&type=FACTURA`;
        console.log(`[API] ✅ Usando endpoint específico para FACTURA`);
      } else {
        // Fallback al endpoint genérico
        pdfUrl = `${API_BASE}/document/toPdf/${id}?v=${validation}`;
        console.log(`[API] ⚠️ Usando endpoint genérico (tipo no reconocido)`);
      }
    } else {
      // Sin tipo de documento, usar endpoint genérico
      pdfUrl = `${API_BASE}/document/toPdf/${id}?v=${validation}`;
      console.log(`[API] ⚠️ Usando endpoint genérico (sin tipo de documento)`);
    }
    
    console.log(`[API] 📋 URL final generada: ${pdfUrl}`);
    
    // PROBAR: Hacer una llamada de prueba al backend para verificar si procesa el tipo
    try {
      console.log(`[API] 🔍 DIAGNÓSTICO - Probando URL con fetch:`);
      const testResponse = await fetch(pdfUrl, {
        method: 'HEAD', // Solo verificar headers, no descargar contenido
        headers: {
          'FACMOV_T': API_TOKEN
        }
      });
      console.log(`[API] 📋 Test response status: ${testResponse.status}`);
      console.log(`[API] 📋 Test response headers:`, Object.fromEntries(testResponse.headers.entries()));
    } catch (testError) {
      console.log(`[API] ⚠️ Error en test de URL:`, testError);
    }
    
    return pdfUrl;
  } catch (error) {
    console.error('Error generating PDF URL:', error);
    throw error;
  }
};

const createInvoice = async (invoiceData: InvoiceRequest): Promise<any> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const companyId = USER_COMPANY_ID || COMPANY_ID;
    const endpoint = `/services/raw/company/${companyId}/invoice`;
    const response = await axiosInstance.post(endpoint, invoiceData);
    await AsyncStorage.removeItem(SALES_CACHE_KEY);
    responseCache.delete(`/services/common/company/${companyId}/lastsales/`);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

const createTicket = async (ticketData: TicketRequest): Promise<any> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const companyId = USER_COMPANY_ID || COMPANY_ID;
    const endpoint = `/services/raw/company/${companyId}/ticket`;
    const response = await axiosInstance.post(endpoint, ticketData);
    await AsyncStorage.removeItem(SALES_CACHE_KEY);
    responseCache.delete(`/services/common/company/${companyId}/lastsales/`);
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

const clearProductsCache = async () => {
  await AsyncStorage.removeItem(PRODUCTS_CACHE_KEY);
  
  // Also clear any search caches
  const keys = await AsyncStorage.getAllKeys();
  const productSearchKeys = keys.filter(key => key.startsWith(`${PRODUCTS_CACHE_KEY}_search_`));
  if (productSearchKeys.length > 0) {
    await AsyncStorage.multiRemove(productSearchKeys);
  }
  
  // Clear memory cache
  for (const [key] of responseCache.entries()) {
    if (key.includes('/services/common/product')) {
      responseCache.delete(key);
    }
  }
};

const clearClientsCache = async () => {
  await AsyncStorage.removeItem(CLIENTS_CACHE_KEY);
  
  // Also clear any search caches
  const keys = await AsyncStorage.getAllKeys();
  const clientSearchKeys = keys.filter(key => key.startsWith(`${CLIENTS_CACHE_KEY}_search_`));
  if (clientSearchKeys.length > 0) {
    await AsyncStorage.multiRemove(clientSearchKeys);
  }
  
  // Clear memory cache
  for (const [key] of responseCache.entries()) {
    if (key.includes('/services/common/client')) {
      responseCache.delete(key);
    }
  }
};

const clearSalesCache = async () => {
  await AsyncStorage.removeItem(SALES_CACHE_KEY);
  
  // Clear memory cache
  for (const [key] of responseCache.entries()) {
    if (key.includes('/lastsales/')) {
      responseCache.delete(key);
    }
  }
};

// ========================================
// FUNCIONES PARA CREACIÓN DE CLIENTES
// ========================================

const createClient = async (clientData: any): Promise<any> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const companyId = USER_COMPANY_ID || COMPANY_ID;
    const endpoint = `/services/common/company/${companyId}/client`;
    
    console.log('Creating client with data:', JSON.stringify(clientData, null, 2));
    
    const response = await axiosInstance.post(endpoint, clientData);
    
    // Clear clients cache after creating new client
    await clearClientsCache();
    
    console.log('Client created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

const getMunicipalities = async (): Promise<any[]> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const endpoint = '/services/common/municipality';
    
    const response = await axiosInstance.get(endpoint);
    return response.data?.municipalities || response.data || [];
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    // Return empty array if API fails
    return [];
  }
};

const getActivities = async (): Promise<any[]> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const endpoint = '/services/common/activity';
    
    const response = await axiosInstance.get(endpoint);
    return response.data?.activities || response.data || [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    // Return empty array if API fails
    return [];
  }
};

// ========================================
// FUNCIONES PARA GUÍA DE DESPACHO
// ========================================

const getTransferTypes = async (): Promise<TransferType[]> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const endpoint = '/services/transferType';
    
    const response = await axiosInstance.get(endpoint);
    return response.data?.transferTypes || response.data || [];
  } catch (error) {
    console.error('Error fetching transfer types:', error);
    // Return empty array if API fails
    return [];
  }
};

const getDispatchTypes = async (): Promise<DispatchType[]> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const endpoint = '/services/dispatchType';
    
    const response = await axiosInstance.get(endpoint);
    return response.data?.dispatchTypes || response.data || [];
  } catch (error) {
    console.error('Error fetching dispatch types:', error);
    // Return empty array if API fails
    return [];
  }
};

const createWaybill = async (waybillData: WaybillRequest): Promise<any> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
    const companyId = USER_COMPANY_ID || COMPANY_ID;
    const endpoint = `/services/raw/company/${companyId}/waybill`;
    
    console.log('🔍 Creating waybill with data:', JSON.stringify(waybillData, null, 2));
    console.log('🔍 Endpoint:', endpoint);
    console.log('🔍 Company ID:', companyId);
    console.log('🔍 Token:', USER_TOKEN ? 'Present' : 'Missing');
    
    const response = await axiosInstance.post(endpoint, waybillData);
    
    console.log('🔍 Raw response:', response);
    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response headers:', response.headers);
    
    // Clear sales cache after creating new waybill
    await clearSalesCache();
    
    console.log('✅ Waybill created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating waybill:', error);
    if (error.response) {
      console.error('❌ Error response:', error.response.data);
      console.error('❌ Error status:', error.response.status);
    }
    throw error;
  }
};

export const api = {
  axiosInstance,
  getProducts,
  searchProducts,
  getClients,
  getSales,
  searchSales,
  searchDocuments,
  searchInvoices,
  getInvoiceDetail,
  getInvoiceDetailById,
  getDocumentDetail,
  getTicketDetail,
  getNoteDetail,
  getWaybillDetail,
  getInvoicePdf,
  clearProductsCache,
  clearClientsCache,
  clearSalesCache,
  createInvoice,
  createTicket,
  createWaybill,
  createClient,
  getMunicipalities,
  getActivities,
  getTransferTypes,
  getDispatchTypes,
  updateAuthData,
  clearAuthData,
  initializeAuthHeader
};