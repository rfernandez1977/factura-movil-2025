# 📚 MANUAL DE INTEGRACIÓN - API FACTURA MÓVIL

## 🚀 INICIO RÁPIDO

### **🌐 Direcciones Base**
Para todas las consultas que se hagan a la API, se debe tener en cuenta la dirección base. Dicha dirección base se diferencia si el entorno es certificación o producción.

**Direcciones Base:**
- **Producción:** `http://produccion.facturamovil.cl`
- **Certificación:** `http://certificacion.facturamovil.cl`

---

## 🔐 AUTENTICACIÓN

### **1. Autenticarse**
Se envía el nombre de usuario y la contraseña en formato JSON y convertido a Base64. Si la autenticación es correcta, se devuelve la información del usuario. Los datos relevantes en la respuesta correcta son el token y el listado de compañías autorizadas.

**JSON de Autenticación:**
```json
{
  "login": "[USUARIO]",
  "password": "[CONTRASEÑA]"
}
```

**JSON Base64:**
```
eyJsb2dpbiI6IltVU1VBUklPXSIsInBhc3N3b3JkIjoiW0NPTlRSQVNFwUFdIn0=
```

**Request:**
```
[URL_BASE]/services/common/user/[JSON_BASE64]
```

**Response Success:**
```json
{
  "id": 123,
  "email": "user@domain.tld",
  "...": "...",
  "token": "[TOKEN]",
  "companies": [
    {
      "id": [COMPANY_ID],
      "...": "..."
    }
  ]
}
```

**Response Fail:**
```json
{
  "success": false,
  "details": "[DESCRIPCIÓN DEL ERROR]"
}
```

---

## 🔧 CONFIGURACIÓN

### **2. Agregar Token al Header**
Para todas las consultas que no sean autenticación, se debe incluir el token del usuario autenticado para que devuelva la información requerida. El token es devuelto al momento de autenticarse.

**Header Requerido:**
```
FACMOV_T: [TOKEN]
```

### **3. Selección de la Compañía**
Para la creación de cualquier tipo de documento, se debe indicar para qué compañía se quiere realizar la acción. Esto se indica en la ruta del servicio. El identificador de la compañía puede ser cualquiera de las devueltas en la autenticación.

**Rutas para los distintos documentos:**

#### **📄 Factura Afecta y Factura Exenta:**
```
[URL_BASE]/services/raw/company/[COMPANY_ID]/invoice
```

#### **📋 Nota de Crédito y Nota de Débito:**
```
[URL_BASE]/services/raw/company/[COMPANY_ID]/note
```

#### **🎫 Boleta y Boleta Exenta:**
```
[URL_BASE]/services/raw/company/[COMPANY_ID]/ticket
```

#### **📦 Guía de Despacho:**
```
[URL_BASE]/services/raw/company/[COMPANY_ID]/waybill
```

---

## 📝 CREACIÓN DE DOCUMENTOS

### **4. Creación de un Documento**
Para la creación de un documento se deben enviar los datos en formato JSON. El formato de cada documento se encuentra en el Anexo Nº1.

**Ejemplo de creación de una factura:**

**Request:**
```
[URL_BASE]/services/raw/company/[COMPANY_ID]/invoice
```

**JSON Value:**
```json
{
  "hasTaxes": true,
  "client": {
    "municipality": "Comuna",
    "code": "88888888-8",
    "name": "Nombre del cliente",
    "line": "Giro del cliente",
    "address": "Dirección del cliente"
  },
  "date": "2013-08-01",
  "details": [
    {
      "position": 1,
      "product": {
        "code": "Código del producto",
        "name": "Nombre del producto",
        "unit": {
          "code": "Unid"
        },
        "price": 5590
      },
      "quantity": 5,
      "description": "Descripción del producto"
    }
  ]
}
```

**Response Success:**
```json
{
  "success": true,
  "id": [NUMBER],
  "assignedFolio": "[STRING]",
  "v": "[STRING]"
}
```

**Response Fail:**
```json
{
  "success": false,
  "code": "[STRING]",
  "details": "[STRING]"
}
```

---

## 📄 CONSULTA DE ARCHIVOS IMPRIMIBLES

### **5. Consultar Archivo Imprimible**
Para obtener el documento en formato imprimible, se debe utilizar el id devuelto en la creación del DTE. Existe una versión PDF y una versión HTML. Cabe destacar que no es necesario autenticarse, ya que los documentos quedan de acceso público, sin embargo, llevan una validación para que no sean vistos de forma aleatoria.

**Validación:** La variable "v" devuelta al crear el documento.

**Rutas a consultar:**

#### **📄 Request PDF:**
```
[URL_BASE]/document/toPdf/[id]?v=[v]
```

#### **🌐 Request HTML:**
```
[URL_BASE]/document/visualization/[id]?v=[v]
```

---

## 📋 ANEXO Nº1 - FORMATOS DE DOCUMENTOS

### **📄 FACTURA AFECTA Y FACTURA EXENTA**

```json
{
  "currency": "USD",
  "hasTaxes": true,
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
  ],
  "references": [
    {
      "position": "1",
      "documentType": {
        "code": "33"
      },
      "referencedFolio": "122334",
      "date": "2013-08-01",
      "description": "Descripción de la referencia"
    }
  ],
  "payments": [
    {
      "position": 1,
      "date": "2013-08-20",
      "amount": 123123,
      "description": "Descripción del pago"
    }
  ]
}
```

**Campos Específicos:**
- `currency`: Código internacional o null
- `hasTaxes`: `true` para Factura afecta | `false` para Factura exenta

---

### **📋 NOTA DE CRÉDITO Y NOTA DE DÉBITO**

```json
{
  "currency": "USD",
  "credit": true,
  "noteType": {
    "code": 1
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
        "unit": "unidad",
        "price": 5590
      },
      "quantity": 5,
      "description": "Descripción del Testing 01"
    }
  ],
  "references": [
    {
      "position": "1",
      "documentType": {
        "code": "33"
      },
      "referencedFolio": "179",
      "date": "2013-08-01",
      "description": "Descripción de la referencia"
    }
  ]
}
```

**Campos Específicos:**
- `currency`: Código internacional o null
- `credit`: `true` para Nota de crédito | `false` para Nota de débito
- `noteType.code`: `1` para Anula | `2` para Corrige texto | `3` para Corrige monto

---

### **📦 GUÍA DE DESPACHO**

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
  ],
  "references": [
    {
      "position": "1",
      "documentType": {
        "code": "33"
      },
      "referencedFolio": "122334",
      "date": "2013-08-01",
      "description": "Descripción de la referencia"
    }
  ],
  "payments": [
    {
      "position": 1,
      "date": "2013-08-20",
      "amount": 123123,
      "description": "Descripción del pago"
    }
  ]
}
```

**Campos Específicos:**
- `transferType.code`: `1` a `9`
- `dispatchType.code`: `1` a `3` o null

---

### **🎫 BOLETA**

```json
{
  "netAmounts": "false",
  "hasTaxes": true,
  "ticketType": {
    "code": "3"
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
  ],
  "references": [
    {
      "position": "1",
      "documentType": {
        "code": "33"
      },
      "referencedFolio": "122334",
      "date": "2013-08-01",
      "description": "Descripción de la referencia"
    }
  ],
  "payments": [
    {
      "position": 1,
      "date": "2013-08-20",
      "amount": 123123,
      "description": "Descripción del pago"
    }
  ]
}
```

**Campos Específicos:**
- `netAmounts`: `"false"` (solo `true` para empresas autorizadas)
- `hasTaxes`: `true` para Boleta afecta | `false` para Boleta exenta
- `ticketType.code`: `1` a `4`

---

## 🔍 CAMPOS COMUNES

### **👤 Cliente (client)**
```json
{
  "municipality": "Providencia",
  "code": "15637715-5",
  "name": "Sebastián Díaz Moreno",
  "line": "Desarrollo e implementación de sistemas informáticos",
  "address": "José Domingo Cañas 1550, depto 507"
}
```

### **📦 Producto (product)**
```json
{
  "code": "TEST01",
  "name": "Testing 01",
  "unit": {
    "code": "Unid"
  },
  "price": 5590
}
```

### **📋 Detalle (details)**
```json
{
  "position": 1,
  "product": { /* objeto producto */ },
  "quantity": 5,
  "description": "Descripción del producto"
}
```

### **🔗 Referencias (references)**
```json
{
  "position": "1",
  "documentType": {
    "code": "33"
  },
  "referencedFolio": "122334",
  "date": "2013-08-01",
  "description": "Descripción de la referencia"
}
```

### **💰 Pagos (payments)**
```json
{
  "position": 1,
  "date": "2013-08-20",
  "amount": 123123,
  "description": "Descripción del pago"
}
```

---

## ⚠️ NOTAS IMPORTANTES

### **🔐 Seguridad**
- El token debe incluirse en todas las consultas excepto autenticación
- Los documentos PDF/HTML son de acceso público pero requieren validación
- La validación se maneja con la variable "v" devuelta al crear el documento

### **🏢 Compañías**
- Cada usuario puede tener acceso a múltiples compañías
- El COMPANY_ID debe ser uno de los devueltos en la autenticación
- Cada documento se crea para una compañía específica

### **📅 Fechas**
- Formato de fecha: `YYYY-MM-DD`
- Ejemplo: `"2013-08-01"`

### **💰 Monedas**
- Campo `currency` es opcional
- Usar códigos internacionales (USD, EUR, etc.)
- Si no se especifica, se usa la moneda por defecto

### **📄 Folios**
- `externalFolio` es opcional
- Si no se proporciona, el sistema asigna un folio automáticamente
- El folio asignado se devuelve en `assignedFolio`

---

## 🚀 FLUJO COMPLETO DE INTEGRACIÓN

### **Paso 1: Autenticación**
```bash
POST [URL_BASE]/services/common/user/[JSON_BASE64]
```

### **Paso 2: Configurar Headers**
```bash
FACMOV_T: [TOKEN_OBTENIDO]
```

### **Paso 3: Crear Documento**
```bash
POST [URL_BASE]/services/raw/company/[COMPANY_ID]/[TIPO_DOCUMENTO]
```

### **Paso 4: Obtener PDF/HTML**
```bash
GET [URL_BASE]/document/toPdf/[ID]?v=[VALIDACION]
GET [URL_BASE]/document/visualization/[ID]?v=[VALIDACION]
```

---

**Documentado por:** Assistant  
**Fecha:** 26 de Agosto, 2025  
**Versión:** 1.0  
**Estado:** ✅ **COMPLETO**
