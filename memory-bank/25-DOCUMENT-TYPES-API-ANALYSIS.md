# 🚨 **ANÁLISIS - APIs PARA DIFERENTES TIPOS DE DOCUMENTOS**

## 📋 **RESUMEN EJECUTIVO**

**Fecha:** 23 de Agosto, 2025  
**Problema:** Error al seleccionar documentos que no son facturas (boletas, notas de crédito, guías de despacho)  
**Estado:** 🔍 **ANÁLISIS EN CURSO**

---

## 🚨 **PROBLEMA IDENTIFICADO**

### **❌ Error Actual:**
```
ERROR  Error fetching invoice detail by id: [Error: Invoice with id NaN not found in sales list]
ERROR  Error fetching invoice details: [AxiosError: Request failed with status code 500]
```

### **🔍 Causa Raíz:**
- **API única** para todos los tipos de documento
- **Endpoint específico** para facturas: `/services/common/company/{companyId}/invoice/{assignedFolio}/getInfo`
- **No existe** endpoint específico para otros tipos de documento
- **Confusión** entre tipos de documento en la pantalla de detalles

---

## 📊 **ANÁLISIS DE APIs ACTUALES**

### **✅ API 1: Listado de Últimas Ventas**
```typescript
// Endpoint: /services/common/company/{companyId}/lastsales/
// Método: GET
// Función: api.getSales()

// Respuesta:
interface Document {
  id: number;
  type: string;           // "FACTURA", "BOLETA", "NOTE", "WAYBILL"
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
```

### **❌ API 2: Detalles de Documento (PROBLEMÁTICA)**
```typescript
// Endpoint actual: /services/common/company/{companyId}/invoice/{assignedFolio}/getInfo
// Método: GET
// Función: api.getInvoiceDetail(assignedFolio)

// PROBLEMA: Solo funciona para facturas (invoice)
// ERROR: 500 cuando se usa para otros tipos de documento
```

---

## 🔍 **INVESTIGACIÓN REQUERIDA**

### **📋 Pregunta 1: ¿Qué API responde el listado de Últimas Ventas?**

#### **✅ Respuesta Conocida:**
```typescript
// Endpoint: /services/common/company/{companyId}/lastsales/
// Respuesta: Array de documentos de diferentes tipos
// Funciona correctamente para todos los tipos
```

#### **🔍 Información Necesaria:**
- ✅ **Endpoint:** Confirmado
- ✅ **Método:** GET
- ✅ **Headers:** FACMOV_T requerido
- ✅ **Respuesta:** Array de Document[]
- ✅ **Tipos soportados:** FACTURA, BOLETA, NOTE, WAYBILL

### **📋 Pregunta 2: ¿Qué API responde los detalles de cada tipo de documento?**

#### **❌ Problema Identificado:**
```typescript
// Endpoint actual: /services/common/company/{companyId}/invoice/{assignedFolio}/getInfo
// Solo funciona para: FACTURA
// Falla para: BOLETA, NOTE, WAYBILL
```

#### **🔍 APIs Necesarias:**
```typescript
// 1. Para Facturas (EXISTE)
GET /services/common/company/{companyId}/invoice/{assignedFolio}/getInfo

// 2. Para Boletas (NECESARIA)
GET /services/common/company/{companyId}/ticket/{assignedFolio}/getInfo

// 3. Para Notas de Crédito (NECESARIA)
GET /services/common/company/{companyId}/note/{assignedFolio}/getInfo

// 4. Para Guías de Despacho (NECESARIA)
GET /services/common/company/{companyId}/waybill/{assignedFolio}/getInfo

// 5. Para Documentos Genéricos (ALTERNATIVA)
GET /services/common/company/{companyId}/document/{assignedFolio}/getInfo?type={documentType}
```

---

## 🔧 **SOLUCIÓN PROPUESTA**

### **✅ SOLUCIÓN 1: APIs Específicas por Tipo**

#### **📊 Nuevas Funciones en `services/api.ts`:**
```typescript
// Función genérica para obtener detalles de cualquier documento
const getDocumentDetail = async (assignedFolio: string, documentType: string): Promise<Document> => {
  try {
    if (!AUTH_INITIALIZED) await initializeAuthHeader();
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
        // Endpoint genérico como fallback
        endpoint = `/services/common/company/${companyId}/document/${assignedFolio}/getInfo?type=${encodeURIComponent(documentType)}`;
    }
    
    const fetcher = async () => {
      const response = await axiosInstance.get(endpoint);
      if (!response.data) {
        throw new Error(`Invalid ${documentType} detail response: No data received`);
      }
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

### **✅ SOLUCIÓN 2: Actualizar Pantalla de Detalles**

#### **📊 Modificar `app/sales/invoice-details.tsx`:**
```typescript
const fetchInvoiceDetails = async () => {
  try {
    setLoading(true);
    let response: Document;
    
    if (assignedFolio) {
      // Obtener el tipo de documento del listado de ventas
      const sales = await api.getSales();
      const document = sales.find(doc => doc.assignedFolio === assignedFolio);
      
      if (!document) {
        throw new Error(`Documento con folio ${assignedFolio} no encontrado`);
      }
      
      // Usar la función genérica con el tipo correcto
      response = await api.getDocumentDetail(assignedFolio, document.type);
    } else if (invoiceId) {
      // Obtener de la lista de ventas por ID
      const sales = await api.getSales();
      const document = sales.find(doc => doc.id === parseInt(invoiceId));
      
      if (!document) {
        throw new Error(`Documento con ID ${invoiceId} no encontrado`);
      }
      
      // Usar la función genérica con el tipo correcto
      response = await api.getDocumentDetail(document.assignedFolio, document.type);
    } else {
      throw new Error('No invoice ID or folio provided');
    }
    
    setInvoice(response);
    setError(null);
    if (response.client?.email) {
      setEmailAddress(response.client.email);
    }
  } catch (err: any) {
    console.error('Error fetching document details:', err);
    setError(err.message || 'No se pudieron cargar los detalles del documento');
  } finally {
    setLoading(false);
  }
};
```

### **✅ SOLUCIÓN 3: Actualizar Navegación**

#### **📊 Modificar `app/(tabs)/sales/index.tsx`:**
```typescript
const handleDocumentPress = (document: Document) => {
  console.log('[SALES] Navigating to document details:', { 
    id: document.id, 
    folio: document.assignedFolio,
    type: document.type 
  });
  
  // Pasar el tipo de documento en la navegación
  router.push(`/sales/invoice-details?id=${document.id}&folio=${document.assignedFolio}&type=${document.type}`);
};
```

---

## 📋 **APIs NECESARIAS EN EL MEMORY-BANK**

### **🔧 API 1: Detalles de Boletas**
```typescript
// Endpoint: /services/common/company/{companyId}/ticket/{assignedFolio}/getInfo
// Método: GET
// Headers: FACMOV_T
// Respuesta: Document (misma estructura que facturas)
```

### **🔧 API 2: Detalles de Notas de Crédito**
```typescript
// Endpoint: /services/common/company/{companyId}/note/{assignedFolio}/getInfo
// Método: GET
// Headers: FACMOV_T
// Respuesta: Document (misma estructura que facturas)
```

### **🔧 API 3: Detalles de Guías de Despacho**
```typescript
// Endpoint: /services/common/company/{companyId}/waybill/{assignedFolio}/getInfo
// Método: GET
// Headers: FACMOV_T
// Respuesta: Document (misma estructura que facturas)
```

### **🔧 API 4: Detalles Genéricos (Alternativa)**
```typescript
// Endpoint: /services/common/company/{companyId}/document/{assignedFolio}/getInfo?type={documentType}
// Método: GET
// Headers: FACMOV_T
// Parámetros: type (FACTURA, BOLETA, NOTE, WAYBILL)
// Respuesta: Document (misma estructura que facturas)
```

---

## 🎯 **PLAN DE IMPLEMENTACIÓN**

### **📋 Fase 1: Investigación**
1. **Verificar** endpoints existentes en el backend
2. **Confirmar** estructura de respuesta para cada tipo
3. **Documentar** APIs en el memory-bank

### **📋 Fase 2: Desarrollo**
1. **Implementar** función genérica `getDocumentDetail`
2. **Actualizar** pantalla de detalles
3. **Modificar** navegación para incluir tipo de documento

### **📋 Fase 3: Pruebas**
1. **Probar** con facturas (debe seguir funcionando)
2. **Probar** con boletas
3. **Probar** con notas de crédito
4. **Probar** con guías de despacho

### **📋 Fase 4: Validación**
1. **Verificar** que no hay errores 500
2. **Confirmar** que se muestran los detalles correctos
3. **Validar** que los PDFs se generan correctamente

---

## 🚀 **PRÓXIMOS PASOS**

### **🔍 Inmediatos:**
1. **Investigar** endpoints disponibles en el backend
2. **Confirmar** estructura de respuesta para cada tipo
3. **Documentar** APIs en el memory-bank

### **🔧 Desarrollo:**
1. **Implementar** función genérica de detalles
2. **Actualizar** pantalla de detalles
3. **Probar** con diferentes tipos de documento

### **✅ Validación:**
1. **Resolver** errores 500
2. **Confirmar** funcionalidad completa
3. **Documentar** solución final

---

**📅 Fecha de Análisis:** 23 de Agosto, 2025  
**👨‍💻 Analista:** Rodrigo Fernández  
**🏢 Proyecto:** Factura Movil 2025  
**🎯 Estado:** 🔍 **ANÁLISIS EN CURSO - REQUIERE INVESTIGACIÓN DE BACKEND**
