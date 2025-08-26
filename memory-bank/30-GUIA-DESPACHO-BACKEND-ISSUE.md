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
1. **Revisar logs del servidor** para identificar el error específico
2. **Verificar implementación** del endpoint waybill
3. **Probar con datos de ejemplo** del esquema oficial
4. **Verificar configuración del servidor** y servicios dependientes

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
**Estado:** 🚨 **PROBLEMA BACKEND - PENDIENTE DE RESOLUCIÓN**  
**Prioridad:** ALTA - Bloquea funcionalidad de guías de despacho
