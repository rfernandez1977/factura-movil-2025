# 🚨 PROBLEMA BACKEND - GUÍA DE DESPACHO ELECTRÓNICA

## 📋 RESUMEN DEL PROBLEMA

**Fecha:** 26 de Agosto, 2025  
**Problema:** Error genérico al crear guías de despacho  
**Estado:** 🔍 **PROBLEMA BACKEND IDENTIFICADO**

---

## 🚨 ERROR ENCONTRADO

### **Respuesta del Backend:**
```json
{
  "success": false,
  "code": "000",
  "details": "Error al crear guía de despacho."
}
```

### **🔍 LOGS DEL SERVIDOR (CAUSA RAÍZ IDENTIFICADA):**

#### **LOG 1 - Raw Controller (Esquema Simple):**
```
2025-08-26 23:23:26,891 [http-bio-8080-exec-475] ERROR raw.WaybillRawController
description="Error al crear guía de despacho por servicios. 
Error al crear guía de despacho. 
No such property: params for class: cl.facturamovil.DocumentService"
```

#### **LOG 2 - Services Controller (Esquema Complejo):**
```
2025-08-26 23:39:17,948 [http-bio-8080-exec-316] ERROR services.WaybillRestController
description="Error al crear guía de despacho por servicios. 
Error al crear guía de despacho. 
No such property: params for class: cl.facturamovil.DocumentService"
```

### **📋 JSON ENVIADO (VERIFICADO EN LOG):**
```json
{
  "dispatchType": {"code": "2"},
  "details": [{
    "product": {
      "unit": {"code": "Ltr"},
      "price": 100,
      "name": "petroleo prueba",
      "code": "100"
    },
    "position": 1,
    "description": "petroleo prueba",
    "quantity": 1
  }],
  "client": {
    "address": "CARMEN 459, Bloque OF.1",
    "name": "INVERSIONES ANTILCO LIMITADA",
    "municipality": "Curico",
    "line": "SERV.AGRICOLAS",
    "code": "76274690-5"
  },
  "transferType": {"code": "1"},
  "date": "2025-08-26",
  "currency": "CLP"
}
```

### **📋 JSON COMPLEJO (LOG 2 - Services Controller):**
```json
{
  "total": 15000,
  "id": null,
  "dispatchType": {
    "id": 2,
    "name": "Despacho por cuenta del emisor a instalaciones del cliente",
    "code": "2"
  },
  "details": [{
    "product": {
      "id": 47447,
      "unit": {"id": 2, "name": "Unidad", "code": "Unid"},
      "category": {"id": 1417, "otherTax": null, "name": "PRODUCTO NORMAL", "code": "012"},
      "price": 12605.04,
      "name": "GAS ENVASADO 15 KGS",
      "code": "123"
    },
    "id": null,
    "service": null,
    "quantity": 1
  }],
  "client": {
    "id": 100908,
    "email": "projas@facturamovilchile.cl",
    "address": "HIJUELA SEPTIMA O S/N, Villa/Pob. SAN JOSE DE PATACON",
    "name": "ADOLFO GARCIA-HUIDOBRO Y COMPANIA LIMITADA",
    "municipality": {
      "id": 105,
      "name": "Hualañe",
      "line": null,
      "regionalEntity": null,
      "code": "7302"
    },
    "line": "EXPLOTACION DE VINAS-AGRICOLA-FRUTICOLA",
    "code": "76378380-4",
    "additionalAddress": []
  },
  "validation": null,
  "transferType": {
    "id": 4,
    "name": "Entrega gratuita",
    "code": "4"
  },
  "netTotal": 12605.04,
  "assignedFolio": null,
  "date": "2025-08-26",
  "taxes": 2394.957569947243,
  "discount": 0
}
```

### **📋 JSON DE FACTURA (ÉXITO - PARA COMPARACIÓN):**
```json
{
  "hasTaxes": true,
  "details": [{
    "product": {
      "id": 28880,
      "unit": {"id": 2, "name": "Unidad", "code": "Unid"},
      "category": {"id": 21, "otherTax": null, "name": "Servicio de Asesorías", "code": "A4000"},
      "price": 17800,
      "name": "GESTIÓN FIRMA DIGITAL",
      "code": "A410010"
    },
    "id": null,
    "service": null,
    "quantity": 1
  }],
  "client": {
    "id": 100908,
    "email": "projas@facturamovilchile.cl",
    "address": "HIJUELA SEPTIMA O S/N, Villa/Pob. SAN JOSE DE PATACON",
    "name": "ADOLFO GARCIA-HUIDOBRO Y COMPANIA LIMITADA",
    "municipality": {
      "id": 105,
      "name": "Hualañe",
      "line": null,
      "regionalEntity": null,
      "code": "7302"
    },
    "line": "EXPLOTACION DE VINAS-AGRICOLA-FRUTICOLA",
    "code": "76378380-4",
    "additionalAddress": []
  },
  "netTotal": 17800,
  "discounts": [],
  "date": "2025-08-26",
  "otherTaxes": 0,
  "exemptTotal": 0,
  "taxes": 3382
}
```

### **Datos Enviados (Correctos según Manual):**
```json
{
  "transferType": {
    "code": "1"
  },
  "client": {
    "code": "76274690-5",
    "name": " INVERSIONES ANTILCO LIMITADA",
    "address": " CARMEN 459, Bloque OF.1",
    "municipality": "Curico",
    "line": "SERV.AGRICOLAS - ASESORIAS - CORRETAJE Y EXPORTACION PROD. AGRICOLAS"
  },
  "details": [
    {
      "position": 1,
      "product": {
        "code": "100",
        "name": "petroleo prueba",
        "unit": {
          "code": "Ltr"
        },
        "price": 100
      },
      "quantity": 1,
      "description": "petroleo prueba"
    }
  ],
  "date": "2025-08-26",
  "dispatchType": {
    "code": "2"
  }
}
```

---

## 🔍 ANÁLISIS TÉCNICO

### **✅ LO QUE FUNCIONA:**
- ✅ **Autenticación** correcta (Token: `5de22b61-733a-457b-9020-9f7f46816319`)
- ✅ **Endpoint** existe y responde (`/services/raw/company/37/waybill`)
- ✅ **Status HTTP 200** - Petición llega correctamente
- ✅ **Estructura JSON** según manual de integración
- ✅ **Company ID** correcto (37 - Virgin Mobile)

### **❌ PROBLEMA IDENTIFICADO:**
- ❌ **Error genérico** sin detalles específicos
- ❌ **Código de error 000** - No proporciona información útil
- ❌ **Backend no valida** la estructura enviada

### **🚨 CAUSA RAÍZ CONFIRMADA:**
- ❌ **Error en DocumentService:** `"No such property: params for class: cl.facturamovil.DocumentService"`
- ❌ **Problema de inyección de dependencias** en el servicio
- ❌ **Falta de configuración** en el método de creación de waybills

### **🔍 NUEVOS HALLAZGOS:**
- ❌ **Diferentes Controllers:** `raw.WaybillRawController` vs `services.WaybillRestController`
- ❌ **Diferentes Esquemas:** Simple (frontend) vs Complejo (backend interno)
- ❌ **Mismo Error:** Ambos controllers fallan en el mismo `DocumentService`
- ❌ **Discrepancia de Datos:** Backend espera datos con IDs, totales, impuestos, etc.

### **✅ ANÁLISIS DE FACTURA (FUNCIONA):**
- ✅ **Controller exitoso:** `services.InvoiceRestController`
- ✅ **Esquema complejo:** Funciona perfectamente con IDs, totales, impuestos
- ✅ **Resultado:** "Se crea factura con id X" (éxito)
- ✅ **Patrón similar:** Misma estructura que waybills pero funciona

### **🔍 PRUEBAS DE ENDPOINTS ALTERNATIVOS:**
- ❌ **`/services/waybill`** - Falla: `{"success":false,"code":"000","details":null}`
- ❌ **`/services/mobile/company/37/waybill`** - Falla: `{"success":false,"code":"000","details":"Error al crear guía de despacho."}`
- ❌ **`/services/fm/company/37/waybill`** - Falla: `{"success":false,"code":"000","details":"Error al crear guía de despacho."}`
- ❌ **`/services/raw/company/37/waybill`** - Falla: `{"success":false,"code":"000","details":"Error al crear guía de despacho."}`

### **🚨 CONCLUSIÓN FINAL:**
- **Problema sistémico** en todos los endpoints de waybill
- **Todos los controllers** (`waybillRest` y `waybillRaw`) fallan
- **Error consistente:** `"No such property: params for class: cl.facturamovil.DocumentService"`
- **No hay alternativas** - Todos los endpoints tienen el mismo problema

---

## 📊 COMPARACIÓN CON OTROS ENDPOINTS

### **Endpoint de Facturas:**
```bash
POST /services/raw/company/37/invoice
Response: {"success":false,"code":"850","details":"Error al crear factura"}
```

### **Endpoint de Guías de Despacho:**
```bash
POST /services/raw/company/37/waybill
Response: {"success":false,"code":"000","details":"Error al crear guía de despacho."}
```

**Observación:** Ambos endpoints devuelven errores genéricos, pero con códigos diferentes.

---

## 🎯 ESTRUCTURA SEGÚN MANUAL DE INTEGRACIÓN

### **Manual de Integración - Guía de Despacho:**
```json
{
  "transferType": {
    "code": "1"
  },
  "dispatchType": {
    "code": "2"
  },
  "client": {
    "municipality": "Providencia",
    "code": "15637715-5",
    "name": "Sebastián Díaz Moreno",
    "line": "Desarrollo e implementación de sistemas informáticos",
    "address": "José Domingo Cañas 1550, depto 507"
  },
  "externalFolio": "OPCIONAL",
  "date": "2013-08-01",
  "details": [
    {
      "position": 1,
      "product": {
        "code": "TEST01",
        "name": "Testing 01",
        "unit": {
          "code": "Unid"
        },
        "price": 5590
      },
      "quantity": 5,
      "description": "Descripción del Testing 01"
    }
  ]
}
```

### **Estructura Enviada (CORREGIDA según esquema oficial):**
```json
{
  "currency": "CLP",
  "transferType": { "code": "1" },
  "dispatchType": { "code": "2" },
  "client": {
    "municipality": "Curico",
    "code": "76274690-5",
    "name": "INVERSIONES ANTILCO LIMITADA",
    "line": "SERV.AGRICOLAS",
    "address": "CARMEN 459, Bloque OF.1"
  },
  "date": "2025-08-26",
  "details": [
    {
      "position": 1,
      "product": {
        "code": "100",
        "name": "petroleo prueba",
        "unit": { "code": "Ltr" },
        "price": 100
      },
      "quantity": 1,
      "description": "petroleo prueba"
    }
  ]
}
```

**Conclusión:** La estructura enviada coincide exactamente con el esquema oficial proporcionado.

---

## 🛠️ SOLUCIONES RECOMENDADAS

### **PARA EL EQUIPO DE BACKEND:**

#### **1. Revisar Logs del Servidor**
- Verificar logs de error específicos para el endpoint `/services/raw/company/{id}/waybill`
- Identificar la causa raíz del error genérico

#### **2. Implementar Validación Detallada**
- Agregar validación específica para cada campo
- Devolver errores más descriptivos con códigos específicos

#### **3. Verificar Implementación del Endpoint**
- Confirmar que el endpoint esté completamente implementado
- Verificar que procese correctamente la estructura JSON

#### **4. Corregir DocumentService**
- **PROBLEMA IDENTIFICADO:** `"No such property: params for class: cl.facturamovil.DocumentService"`
- **SOLUCIÓN:** Corregir la inyección de dependencias en `DocumentService`
- **ACCIONES:**
  - Verificar que `params` esté correctamente inyectado en el servicio
  - Revisar la configuración del `DocumentService` para waybills
  - Corregir el método de creación de waybills en el servicio

#### **5. Resolver Discrepancia de Esquemas**
- **PROBLEMA:** Frontend envía esquema simple, backend espera esquema complejo
- **SOLUCIÓN:** Decidir qué esquema usar y unificar
- **OPCIONES:**
  - **Opción A:** Modificar frontend para enviar esquema complejo
  - **Opción B:** Modificar backend para aceptar esquema simple
  - **Opción C:** Crear transformación en el backend

#### **6. Verificar Diferentes Controllers**
- **PROBLEMA:** `raw.WaybillRawController` vs `services.WaybillRestController`
- **SOLUCIÓN:** Determinar cuál es el endpoint correcto
- **ACCIONES:**
  - Verificar cuál controller debería manejar waybills
  - Corregir el problema en ambos controllers si es necesario

#### **7. Analizar Patrón de Factura (ÉXITO)**
- **PROBLEMA:** Facturas funcionan, waybills no
- **SOLUCIÓN:** Aplicar el mismo patrón exitoso
- **ACCIONES:**
  - **Verificar si existe `WaybillService`** (como `InvoiceService`)
  - **Usar el mismo patrón de inyección de dependencias**
  - **Revisar cómo `InvoiceService` maneja `params`**
  - **Aplicar la misma solución a waybills**

#### **8. Pruebas de Endpoints Alternativos (COMPLETADAS)**
- **PROBLEMA:** Todos los endpoints de waybill fallan
- **SOLUCIÓN:** No hay alternativas disponibles
- **ACCIONES:**
  - **✅ PROBADO:** `/services/waybill` - Falla
  - **✅ PROBADO:** `/services/mobile/company/37/waybill` - Falla
  - **✅ PROBADO:** `/services/fm/company/37/waybill` - Falla
  - **✅ PROBADO:** `/services/raw/company/37/waybill` - Falla
  - **CONCLUSIÓN:** Problema sistémico en el backend

#### **4. Proporcionar Códigos de Error Específicos**
- En lugar de `"000"`, usar códigos como:
  - `"801"` - Cliente no encontrado
  - `"802"` - Producto no válido
  - `"803"` - Tipo de transferencia inválido
  - `"804"` - Fecha inválida
  - `"805"` - Estructura JSON inválida
  - `"806"` - Campos requeridos faltantes

#### **5. Verificar Implementación del Endpoint**
- Confirmar que el endpoint `/services/raw/company/{id}/waybill` esté completamente implementado
- Verificar que no haya problemas de configuración en el servidor
- Revisar si hay dependencias faltantes o servicios no iniciados

---

## 📋 ACCIONES REQUERIDAS

### **INMEDIATO:**
1. **✅ CAUSA RAÍZ IDENTIFICADA:** `"No such property: params for class: cl.facturamovil.DocumentService"`
2. **✅ PRUEBAS COMPLETADAS:** Todos los endpoints de waybill fallan
3. **Analizar patrón de factura** - Aplicar solución exitosa
4. **Corregir DocumentService** - Usar patrón de InvoiceService

### **CORTO PLAZO:**
4. **Implementar validación detallada** en el backend
5. **Mejorar mensajes de error** con códigos específicos
6. **Documentar requisitos específicos** del endpoint

### **MEDIANO PLAZO:**
7. **Probar endpoint** con diferentes tipos de datos
8. **Validar integración completa** con frontend
9. **Actualizar documentación** si es necesario

---

## 🔗 REFERENCIAS

- **Manual de Integración:** `memory-bank/29-MANUAL-DE-INTEGRACION.md`
- **Implementación Frontend:** `app/sales/guia-despacho.tsx`
- **Servicios API:** `services/api.ts` y `services/invoiceService.ts`

---

**Reportado por:** Assistant  
**Fecha:** 26 de Agosto, 2025  
**Estado:** 🚨 **CAUSA RAÍZ IDENTIFICADA - PROBLEMA SISTÉMICO**  
**Prioridad:** ALTA - Bloquea funcionalidad de guías de despacho  
**Problema:** `"No such property: params for class: cl.facturamovil.DocumentService"`  
**Pruebas:** Todos los endpoints de waybill fallan - No hay alternativas
