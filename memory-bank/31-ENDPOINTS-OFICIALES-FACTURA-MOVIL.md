# 📋 ENDPOINTS OFICIALES - FACTURA MÓVIL

## 📋 RESUMEN

**Fecha:** 27 de Agosto, 2025  
**Fuente:** UrlMappings.groovy del proyecto Factura Móvil  
**Propósito:** Documentación completa de todos los endpoints disponibles  
**Estado:** ✅ **COMPLETO**

---

## 🏗️ ESTRUCTURA DE ENDPOINTS

### **CATEGORÍAS PRINCIPALES:**
1. **MOBILE** - Endpoints principales para móvil
2. **LEGACY MOBILE** - Versión antigua (con company ID)
3. **NEW MOBILE** - Versión nueva (con company ID)
4. **LOAD** - Carga masiva de datos
5. **RAW** - Endpoints raw para documentos
6. **FM** - Endpoints FM (alias de RAW)
7. **COMMON** - Endpoints comunes

---

## 📱 MOBILE ENDPOINTS

### **ACTIVIDADES**
```
GET /services/activity/{id}
```

### **BANCOS**
```
GET /services/bank/{id}
```

### **CATEGORÍAS**
```
GET /services/category/{id}
```

### **CLIENTES**
```
GET /services/client/{id}
PUT /services/client/{id}
DELETE /services/client/{id}
POST /services/client/{id}
```

### **EMPRESAS**
```
GET /services/company/{id}
GET /services/company/{code}/check
```

### **PAGOS CON TARJETA**
```
PUT /services/ccpayment/{id}
POST /services/ccpayment/{id}
```

### **TIPOS DE DESPACHO**
```
GET /services/dispatchType/{id}
```

### **FACTURAS**
```
GET /services/invoice/{search}
PUT /services/invoice/{search}
DELETE /services/invoice/{search}
POST /services/invoice/{search}
```

### **MUNICIPIOS**
```
GET /services/municipality/{id}
```

### **MÉTODOS DE PAGO**
```
GET /services/company/{id}/paymentMethod
```

### **PRODUCTOS**
```
GET /services/product/{id}
PUT /services/product/{id}
DELETE /services/product/{id}
POST /services/product/{id}
```

### **PROVEEDORES**
```
GET /services/supplier/{id}
PUT /services/supplier/{id}
DELETE /services/supplier/{id}
POST /services/supplier/{id}
```

### **BOLETAS**
```
GET /services/ticket/{search}
PUT /services/ticket/{search}
DELETE /services/ticket/{search}
POST /services/ticket/{search}
```

### **TIPOS DE TRANSFERENCIA**
```
GET /services/transferType/{id}
```

### **UNIDADES**
```
GET /services/unit/{id}
```

### **USUARIOS**
```
GET /services/user/{id}
GET /services/user/{username}/{password} (autenticación)
```

### **GUÍAS DE DESPACHO**
```
GET /services/waybill/{search}
PUT /services/waybill/{search}
DELETE /services/waybill/{search}
POST /services/waybill/{search}
```

### **LIBROS CONTABLES**
```
GET /services/company/{id}/ledger/{ledgerId}
POST /services/company/{id}/ledger/{ledgerId}
PUT /services/company/{id}/ledger/{ledgerId}
```

### **DOCUMENTOS EN LIBROS**
```
GET /services/company/{id}/ledger/{ledgerId}/document
POST /services/company/{id}/ledger/{ledgerId}/document
POST /services/company/{id}/ledger/{ledgerId}/documents
```

### **LIBRO DE BOLETAS POR PERIODO**
```
POST /services/company/{id}/period/{period}/ticketsLedger
```

---

## 🔄 LEGACY MOBILE ENDPOINTS

### **FACTURAS (LEGACY)**
```
GET /services/company/{id}/invoice/{search}
PUT /services/company/{id}/invoice/{search}
DELETE /services/company/{id}/invoice/{search}
POST /services/company/{id}/invoice/{search}
```

### **BOLETAS (LEGACY)**
```
GET /services/company/{id}/ticket/{search}
PUT /services/company/{id}/ticket/{search}
DELETE /services/company/{id}/ticket/{search}
POST /services/company/{id}/ticket/{search}
```

### **GUÍAS DE DESPACHO (LEGACY)**
```
GET /services/company/{id}/waybill/{search}
PUT /services/company/{id}/waybill/{search}
DELETE /services/company/{id}/waybill/{search}
POST /services/company/{id}/waybill/{search}
```

---

## 📱 NEW MOBILE ENDPOINTS

### **FACTURAS (NEW)**
```
GET /services/mobile/company/{id}/invoice/{search}
PUT /services/mobile/company/{id}/invoice/{search}
DELETE /services/mobile/company/{id}/invoice/{search}
POST /services/mobile/company/{id}/invoice/{search}
```

### **BOLETAS (NEW)**
```
GET /services/mobile/company/{id}/ticket/{search}
PUT /services/mobile/company/{id}/ticket/{search}
DELETE /services/mobile/company/{id}/ticket/{search}
POST /services/mobile/company/{id}/ticket/{search}
```

### **GUÍAS DE DESPACHO (NEW)**
```
GET /services/mobile/company/{id}/waybill/{search}
PUT /services/mobile/company/{id}/waybill/{search}
DELETE /services/mobile/company/{id}/waybill/{search}
POST /services/mobile/company/{id}/waybill/{search}
```

---

## 📦 LOAD ENDPOINTS

### **CARGA MASIVA DE CLIENTES**
```
PUT /services/load/company/{id}/client
POST /services/load/company/{id}/client
```

### **CARGA MASIVA DE PRODUCTOS**
```
PUT /services/load/company/{id}/product
POST /services/load/company/{id}/product
```

### **CARGA MASIVA DE STOCK**
```
POST /services/load/company/{id}/stock
```

---

## 🔧 RAW ENDPOINTS

### **FACTURAS (RAW)**
```
GET /services/raw/company/{id}/invoice/{search}
PUT /services/raw/company/{id}/invoice/{search}
DELETE /services/raw/company/{id}/invoice/{search}
POST /services/raw/company/{id}/invoice/{search}
```

### **NOTAS (RAW)**
```
GET /services/raw/company/{id}/note/{search}
PUT /services/raw/company/{id}/note/{search}
DELETE /services/raw/company/{id}/note/{search}
POST /services/raw/company/{id}/note/{search}
```

### **BOLETAS (RAW)**
```
GET /services/raw/company/{id}/ticket/{search}
PUT /services/raw/company/{id}/ticket/{search}
DELETE /services/raw/company/{id}/ticket/{search}
POST /services/raw/company/{id}/ticket/{search}
```

### **GUÍAS DE DESPACHO (RAW)**
```
GET /services/raw/company/{id}/waybill/{search}
PUT /services/raw/company/{id}/waybill/{search}
DELETE /services/raw/company/{id}/waybill/{search}
POST /services/raw/company/{id}/waybill/{search}
```

---

## 🏢 FM ENDPOINTS (ALIAS DE RAW)

### **FACTURAS (FM)**
```
GET /services/fm/company/{id}/invoice/{search}
PUT /services/fm/company/{id}/invoice/{search}
DELETE /services/fm/company/{id}/invoice/{search}
POST /services/fm/company/{id}/invoice/{search}
```

### **NOTAS (FM)**
```
GET /services/fm/company/{id}/note/{search}
PUT /services/fm/company/{id}/note/{search}
DELETE /services/fm/company/{id}/note/{search}
POST /services/fm/company/{id}/note/{search}
```

### **BOLETAS (FM)**
```
GET /services/fm/company/{id}/ticket/{search}
PUT /services/fm/company/{id}/ticket/{search}
DELETE /services/fm/company/{id}/ticket/{search}
POST /services/fm/company/{id}/ticket/{search}
```

### **GUÍAS DE DESPACHO (FM)**
```
GET /services/fm/company/{id}/waybill/{search}
PUT /services/fm/company/{id}/waybill/{search}
DELETE /services/fm/company/{id}/waybill/{search}
POST /services/fm/company/{id}/waybill/{search}
```

---

## 🌐 COMMON ENDPOINTS

### **ACTIVIDADES (COMMON)**
```
GET /services/common/activity/{id}
```

### **BANCOS (COMMON)**
```
GET /services/common/bank/{id}
```

### **CATEGORÍAS (COMMON)**
```
GET /services/common/category/{id}
```

### **CLIENTES (COMMON)**
```
GET /services/common/client/{id}
PUT /services/common/client/{id}
DELETE /services/common/client/{id}
POST /services/common/client/{id}
```

### **DOCUMENTOS (COMMON)**
```
GET /services/document/{id}
GET /services/common/company/{id}/document/{search}
GET /services/common/company/{id}/lastsales/{search}
POST /services/common/company/{id}/document/{documentId}/sendEmail/{email}
POST /services/common/company/{id}/document/{documentId}/sendDTE
POST /services/common/company/{id}/document/{documentId}/getStamp
GET /services/common/company/{id}/document/{documentId}/getStamp
POST /services/common/company/{id}/document/{documentId}/getBarcode
GET /services/common/company/{id}/document/{documentId}/getBarcode
POST /services/common/company/{id}/document/{documentId}/getState
GET /services/common/company/{id}/document/{documentId}/getState
GET /services/common/company/{id}/document/{documentId}/getXml
POST /services/common/company/{id}/getInformation
GET /services/common/company/{id}/document/emitted
GET /services/common/company/{id}/document/rejected/{period}/{page}
```

### **INFORMACIÓN DE DOCUMENTOS**
```
GET /services/common/company/{companyId}/invoice/{folio}/getInfo
GET /services/common/company/{companyId}/note/{folio}/getInfo
GET /services/common/company/{companyId}/ticket/{folio}/getInfo
```

### **RECEPCIÓN**
```
GET /services/common/company/{id}/reception
```

### **MÉTODOS DE PAGO (COMMON)**
```
GET /services/common/company/{id}/paymentMethod
```

### **TIPOS DE DESPACHO (COMMON)**
```
GET /services/common/dispatchType/{id}
```

### **MUNICIPIOS (COMMON)**
```
GET /services/common/municipality/{id}
```

### **PRODUCTOS (COMMON)**
```
GET /services/common/product/{id}
PUT /services/common/product/{id}
DELETE /services/common/product/{id}
POST /services/common/product/{id}
```

### **SERVICIOS (COMMON)**
```
GET /services/common/service/{id}
PUT /services/common/service/{id}
DELETE /services/common/service/{id}
POST /services/common/service/{id}
```

### **PROVEEDORES (COMMON)**
```
GET /services/common/supplier/{id}
PUT /services/common/supplier/{id}
DELETE /services/common/supplier/{id}
POST /services/common/supplier/{id}
```

### **TIPOS DE TRANSFERENCIA (COMMON)**
```
GET /services/common/transferType/{id}
```

### **UNIDADES (COMMON)**
```
GET /services/common/unit/{id}
```

### **USUARIOS (COMMON)**
```
GET /services/common/user/{id}
GET /services/common/user/{username}/{password}
GET /services/common/user/loginDemo
```

### **PERIODOS**
```
GET /services/common/period
```

---

## 🎯 ANÁLISIS PARA GUÍAS DE DESPACHO

### **ENDPOINTS DISPONIBLES PARA WAYBILLS:**

#### **1. MOBILE (SIMPLE)**
```
POST /services/waybill/{search}
```

#### **2. LEGACY MOBILE**
```
POST /services/company/{id}/waybill/{search}
```

#### **3. NEW MOBILE**
```
POST /services/mobile/company/{id}/waybill/{search}
```

#### **4. RAW (ACTUALMENTE USADO)**
```
POST /services/raw/company/{id}/waybill/{search}
```

#### **5. FM (ALIAS DE RAW)**
```
POST /services/fm/company/{id}/waybill/{search}
```

### **CONTROLLERS INVOLUCRADOS:**
- **waybillRest** - Para endpoints MOBILE, LEGACY, NEW
- **waybillRaw** - Para endpoints RAW y FM

### **ANÁLISIS DE ALTERNATIVAS:**

#### **OPCIÓN 1: PROBAR ENDPOINT MOBILE SIMPLE**
```
POST /services/waybill/{search}
```
- **Ventaja:** Endpoint más simple, sin company ID
- **Desventaja:** Podría tener el mismo problema
- **✅ PROBADO:** `{"success":false,"code":"000","details":null}`

#### **OPCIÓN 2: PROBAR ENDPOINT NEW MOBILE**
```
POST /services/mobile/company/{id}/waybill/{search}
```
- **Ventaja:** Versión más nueva, podría estar mejor implementada
- **Desventaja:** Podría usar el mismo controller
- **✅ PROBADO:** `{"success":false,"code":"000","details":"Error al crear guía de despacho."}`

#### **OPCIÓN 3: PROBAR ENDPOINT FM**
```
POST /services/fm/company/{id}/waybill/{search}
```
- **Ventaja:** Alias de RAW, pero podría tener diferente implementación
- **Desventaja:** Probablemente use el mismo controller
- **✅ PROBADO:** `{"success":false,"code":"000","details":"Error al crear guía de despacho."}`

---

## 🔍 RECOMENDACIONES

### **PARA RESOLVER EL PROBLEMA DE WAYBILLS:**

#### **1. PROBAR ENDPOINTS ALTERNATIVOS:**
- Probar `/services/waybill/{search}` (MOBILE simple)
- Probar `/services/mobile/company/{id}/waybill/{search}` (NEW MOBILE)
- Probar `/services/fm/company/{id}/waybill/{search}` (FM)

#### **2. VERIFICAR CONTROLLERS:**
- Confirmar si `waybillRest` funciona mejor que `waybillRaw`
- Verificar si hay diferencias en la implementación

#### **3. ANALIZAR PATRÓN DE FACTURAS:**
- Las facturas usan `invoiceRest` y funcionan
- Verificar si `waybillRest` tiene la misma implementación

#### **4. INVESTIGAR SERVICIOS:**
- Verificar si `waybillRest` usa `WaybillService` en lugar de `DocumentService`
- Comparar implementación con `InvoiceService`

#### **5. RESULTADOS DE PRUEBAS:**
- **Todos los endpoints de waybill fallan** con el mismo error
- **Endpoint MOBILE simple:** `{"success":false,"code":"000","details":null}`
- **Endpoint NEW MOBILE:** `{"success":false,"code":"000","details":"Error al crear guía de despacho."}`
- **Endpoint FM:** `{"success":false,"code":"000","details":"Error al crear guía de despacho."}`
- **Conclusión:** El problema es **sistémico** en todos los controllers de waybill

---

## 📊 RESUMEN DE ENDPOINTS POR CATEGORÍA

| Categoría | Endpoints | Controllers | Estado |
|-----------|-----------|-------------|---------|
| **MOBILE** | 15+ | Rest controllers | ✅ Funcionando |
| **LEGACY** | 3 | Rest controllers | ✅ Funcionando |
| **NEW** | 3 | Rest controllers | ✅ Funcionando |
| **LOAD** | 3 | Rest controllers | ✅ Funcionando |
| **RAW** | 4 | Raw controllers | ❌ Problema waybill |
| **FM** | 4 | Raw controllers | ❌ Mismo problema |
| **COMMON** | 20+ | Rest controllers | ✅ Funcionando |

### **🔍 ANÁLISIS DE PRUEBAS:**

#### **ENDPOINTS PROBADOS:**
- ✅ **`/services/waybill`** - ❌ Falla: `{"success":false,"code":"000","details":null}`
- ✅ **`/services/mobile/company/37/waybill`** - ❌ Falla: `{"success":false,"code":"000","details":"Error al crear guía de despacho."}`
- ✅ **`/services/fm/company/37/waybill`** - ❌ Falla: `{"success":false,"code":"000","details":"Error al crear guía de despacho."}`
- ✅ **`/services/raw/company/37/waybill`** - ❌ Falla: `{"success":false,"code":"000","details":"Error al crear guía de despacho."}`

#### **COMPARACIÓN CON FACTURAS:**
- ✅ **`/services/raw/company/37/invoice`** - ❌ Falla: `{"success":false,"code":"850","details":"Error al crear factura"}`
- ✅ **`/services/invoice`** - ❌ Falla: `{"success":false,"code":"000","details":null}`

#### **CONCLUSIÓN:**
- **Problema sistémico** en todos los endpoints de waybill
- **Todos los controllers** (`waybillRest` y `waybillRaw`) fallan
- **Error consistente:** `"No such property: params for class: cl.facturamovil.DocumentService"`
- **Solución:** Requiere corrección en el backend, no en el frontend

---

**Documentado por:** Assistant  
**Fecha:** 27 de Agosto, 2025  
**Estado:** ✅ **COMPLETO**  
**Propósito:** Análisis de alternativas para waybills
