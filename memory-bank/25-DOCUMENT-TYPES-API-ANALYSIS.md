# ANÁLISIS DE TIPOS DE DOCUMENTOS Y APIs

## PROBLEMA INICIAL

### ❌ Situación Original:
- **Pantalla de Ventas** solo mostraba "Últimas Ventas" sin funcionalidad de búsqueda
- **API única** para todos los tipos de documento causaba errores 500/404
- **Documentos no factura** (Boletas, Notas de Crédito, Guías) no se podían ver en detalle

### 🔍 APIs Identificadas:
1. **`/services/common/company/{id}/lastsales/`** - Últimas ventas (limitado)
2. **`/services/common/company/{id}/document/{search}`** - Búsqueda genérica (documentos antiguos)
3. **`/services/invoice/{search}`** - Búsqueda específica de facturas (RECOMENDADA)

## SOLUCIÓN IMPLEMENTADA Y PROBADA EXITOSAMENTE

### ✅ APIs de Detalles de Documentos (IMPLEMENTADO)

#### Función Genérica Principal:
```typescript
const getDocumentDetail = async (assignedFolio: string, documentType: string): Promise<Document>
```

#### Endpoints Específicos:
- **Facturas:** `/services/common/company/{id}/invoice/{folio}/getInfo`
- **Boletas:** `/services/common/company/{id}/ticket/{folio}/getInfo`
- **Notas de Crédito:** `/services/common/company/{id}/note/{folio}/getInfo`
- **Guías de Despacho:** `/services/common/company/{id}/waybill/{folio}/getInfo`

#### Lógica de Priorización:
```typescript
// Priorizar tipos específicos antes que los genéricos
if (docTypeUpper.includes('NOTA') || docTypeUpper.includes('CRÉDITO')) {
  endpoint = `/services/common/company/${companyId}/note/${assignedFolio}/getInfo`;
} else if (docTypeUpper.includes('BOLETA') || docTypeUpper.includes('TICKET')) {
  endpoint = `/services/common/company/${companyId}/ticket/${assignedFolio}/getInfo`;
} else if (docTypeUpper.includes('GUÍA') || docTypeUpper.includes('DESPACHO')) {
  endpoint = `/services/common/company/${companyId}/waybill/${assignedFolio}/getInfo`;
} else if (docTypeUpper.includes('FACTURA')) {
  endpoint = `/services/common/company/${companyId}/invoice/${assignedFolio}/getInfo`;
}
```

### ✅ Búsqueda de Ventas (IMPLEMENTADO)

#### API Principal Recomendada:
```typescript
const searchInvoices = async (searchTerm: string): Promise<Document[]>
```

**Endpoint:** `/services/invoice/{search}`

**Ventajas:**
- ✅ **Solo facturas** (no documentos antiguos)
- ✅ **Ordenadas por folio** (mayor a menor)
- ✅ **Búsqueda histórica** por RUT y nombre
- ✅ **Información completa** de la factura (productos, totales, fecha, TODO)
- ✅ **Respuesta JSON completa** de la factura

#### Estructura de Respuesta:
```json
{
  "invoices": [
    {
      "id": 9688101,
      "hasTaxes": false,
      "assignedFolio": "5379",
      "date": "2025-08-01T04:00:00Z",
      "paid": false,
      "client": {
        "code": "10977615-7",
        "name": "JAIME ANDRES MUNOZ GONZALEZ",
        "address": "...",
        "line": "...",
        "municipality": {...}
      },
      "exemptTotal": 51403,
      "netTotal": 0,
      "taxes": 0,
      "otherTaxes": 0,
      "details": [...],
      "discounts": [],
      "validation": "..."
    }
  ]
}
```

#### Estrategia de Fallback:
1. **Primero:** `/services/invoice/{search}` (búsqueda histórica de facturas)
2. **Si falla:** `/services/common/company/{id}/lastsales/{search}` (últimas ventas)
3. **Si no hay resultados:** Filtrado local desde cache

### ✅ Mejoras de Búsqueda Implementadas

#### Detección Automática de Tipo de Búsqueda:
```typescript
const isNameSearch = (term: string): boolean => {
  const cleanTerm = term.trim();
  
  // Si es solo números, probablemente es un folio
  if (/^\d+$/.test(cleanTerm)) {
    return false;
  }
  
  // Si tiene formato de RUT (XX.XXX.XXX-X o XXXXXXXX-X)
  if (/^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/.test(cleanTerm) || /^\d{7,8}-[0-9kK]$/.test(cleanTerm)) {
    return false;
  }
  
  // Si tiene más de 2 caracteres y no es solo números, probablemente es un nombre
  return cleanTerm.length > 2;
};
```

#### Búsqueda Inteligente con Wildcards:
- **Búsqueda por nombre:** Agrega automáticamente `%{término}%` para búsqueda más amplia
- **Búsqueda por RUT:** Usa término exacto
- **Búsqueda por folio:** Usa término exacto

#### Ejemplos de Uso:
- **"JAIME"** → `%JAIME%` (búsqueda amplia por nombre)
- **"76212889-6"** → `76212889-6` (búsqueda exacta por RUT)
- **"5379"** → `5379` (búsqueda exacta por folio)

### ✅ Normalización de Datos

#### Adaptación de Estructura:
```typescript
// Normalizar los datos para que coincidan con la estructura esperada
results = results.map(invoice => ({
  ...invoice,
  type: 'Factura electrónica', // Las facturas de esta API son siempre facturas
  total: (invoice.netTotal || 0) + (invoice.taxes || 0) + (invoice.otherTaxes || 0) + (invoice.exemptTotal || 0)
}));
```

#### Manejo de Estados:
```typescript
// Si no tiene state, crear uno por defecto basado en paid
const documentState = item.state || (item.paid ? ['ACCEPTED', 'Pagada'] : ['PENDING', 'Pendiente']);
```

## RESULTADO FINAL

### ✅ Funcionalidades Implementadas:

1. **Búsqueda por RUT:** Encuentra todas las facturas de un cliente específico
2. **Búsqueda por nombre:** Búsqueda amplia con wildcards automáticos
3. **Búsqueda por folio:** Encuentra facturas específicas
4. **Detalles de documentos:** Soporte completo para todos los tipos de documento
5. **Fallback automático:** Múltiples APIs con estrategia de respaldo
6. **UI mejorada:** Tarjetas con información completa y estados visuales

### ✅ Casos de Uso Soportados:

- **"76212889-6"** → Facturas de FACTURA MOVIL SPA
- **"JAIME"** → Facturas de JAIME ANDRES MUNOZ GONZALEZ (búsqueda amplia)
- **"5379"** → Factura específica con folio 5379
- **"servicios"** → Facturas de SERVICIOS GRAFICOS SPA (búsqueda amplia)

### ✅ Archivos Modificados:

1. **`services/api.ts`**:
   - `searchInvoices()` - API principal de búsqueda
   - `getDocumentDetail()` - Función genérica para detalles
   - `searchSales()` - Fallback a últimas ventas
   - Normalización de datos de respuesta

2. **`app/(tabs)/sales/index.tsx`**:
   - Funcionalidad de búsqueda con debounce
   - Detección automática de tipo de búsqueda
   - Agregado de wildcards para nombres
   - Manejo de estados de documentos
   - UI mejorada con contador de resultados

3. **`app/sales/invoice-details.tsx`**:
   - Soporte para diferentes tipos de documento
   - Navegación con parámetros de tipo

### ✅ APIs Documentadas:

#### Búsqueda de Ventas:
- **`/services/invoice/{search}`** - Búsqueda histórica de facturas (RECOMENDADA)
- **`/services/common/company/{id}/lastsales/{search}`** - Últimas ventas (fallback)
- **`/services/common/company/{id}/document/{search}`** - Búsqueda genérica (no recomendada)

#### Detalles de Documentos:
- **`/services/common/company/{id}/invoice/{folio}/getInfo`** - Detalles de factura
- **`/services/common/company/{id}/ticket/{folio}/getInfo`** - Detalles de boleta
- **`/services/common/company/{id}/note/{folio}/getInfo`** - Detalles de nota de crédito
- **`/services/common/company/{id}/waybill/{folio}/getInfo`** - Detalles de guía de despacho

## ESTADO ACTUAL

### ✅ COMPLETADO:
- ✅ Búsqueda de ventas funcional
- ✅ Soporte para todos los tipos de documento
- ✅ UI mejorada con resultados visibles
- ✅ Búsqueda inteligente con wildcards
- ✅ Fallback automático entre APIs
- ✅ Documentación completa

### 🎯 PRÓXIMOS PASOS:
- Considerar implementar filtros adicionales (fecha, estado, etc.)
- Optimizar rendimiento para grandes volúmenes de datos
- Implementar cache más sofisticado para búsquedas frecuentes
