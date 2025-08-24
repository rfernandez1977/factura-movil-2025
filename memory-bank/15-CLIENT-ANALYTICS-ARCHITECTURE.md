# 🏗️ **ARQUITECTURA DE DATOS - ANÁLISIS DE CLIENTES**

## 📋 **RESUMEN EJECUTIVO**

**Fecha:** 23 de Agosto, 2025  
**Proyecto:** Factura Movil 2025  
**Fase:** CREATIVE MODE - Arquitectura de Datos  
**Estado:** 🎨 **DISEÑO EN PROGRESO**

---

## 🗄️ **ESQUEMA DE BASE DE DATOS LOCAL**

### **📊 TABLAS PRINCIPALES:**

#### **1. 📋 `clients` - Información Básica de Clientes**
```sql
CREATE TABLE clients (
  id INTEGER PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,           -- RUT del cliente
  name TEXT NOT NULL,                  -- Nombre del cliente
  address TEXT,                        -- Dirección principal
  email TEXT,                          -- Email del cliente
  municipality_id INTEGER,             -- ID del municipio
  municipality_name TEXT,              -- Nombre del municipio
  activity_id INTEGER,                 -- ID de la actividad
  activity_name TEXT,                  -- Nombre de la actividad
  line TEXT,                           -- Línea de negocio
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_purchase_date DATETIME,         -- Última fecha de compra
  total_purchases INTEGER DEFAULT 0,   -- Total de compras
  total_amount REAL DEFAULT 0,         -- Monto total gastado
  average_purchase REAL DEFAULT 0,     -- Promedio por compra
  purchase_frequency REAL DEFAULT 0    -- Frecuencia de compras (días)
);
```

#### **2. 📈 `client_purchases` - Historial de Compras**
```sql
CREATE TABLE client_purchases (
  id INTEGER PRIMARY KEY,
  client_id INTEGER NOT NULL,          -- ID del cliente
  invoice_id INTEGER NOT NULL,         -- ID de la factura
  assigned_folio TEXT NOT NULL,        -- Folio asignado
  invoice_type TEXT NOT NULL,          -- Tipo de factura
  date DATETIME NOT NULL,              -- Fecha de la compra
  net_total REAL NOT NULL,             -- Total neto
  taxes REAL NOT NULL,                 -- Impuestos
  other_taxes REAL DEFAULT 0,          -- Otros impuestos
  total_amount REAL NOT NULL,          -- Total final
  paid BOOLEAN DEFAULT FALSE,          -- Estado de pago
  validation TEXT,                     -- Validación para PDF
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

#### **3. 🏆 `client_products` - Productos por Cliente**
```sql
CREATE TABLE client_products (
  id INTEGER PRIMARY KEY,
  client_id INTEGER NOT NULL,          -- ID del cliente
  product_id INTEGER NOT NULL,         -- ID del producto
  product_code TEXT NOT NULL,          -- Código del producto
  product_name TEXT NOT NULL,          -- Nombre del producto
  category_id INTEGER,                 -- ID de la categoría
  category_name TEXT,                  -- Nombre de la categoría
  total_quantity INTEGER DEFAULT 0,    -- Cantidad total comprada
  total_amount REAL DEFAULT 0,         -- Monto total gastado
  average_price REAL DEFAULT 0,        -- Precio promedio
  last_purchase_date DATETIME,         -- Última compra del producto
  purchase_count INTEGER DEFAULT 0,    -- Número de veces comprado
  percentage_of_total REAL DEFAULT 0,  -- Porcentaje del total del cliente
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

#### **4. 📊 `client_analytics` - Métricas Calculadas**
```sql
CREATE TABLE client_analytics (
  id INTEGER PRIMARY KEY,
  client_id INTEGER NOT NULL,          -- ID del cliente
  period_type TEXT NOT NULL,           -- 'month', 'quarter', 'year'
  period_start DATE NOT NULL,          -- Inicio del período
  period_end DATE NOT NULL,            -- Fin del período
  total_purchases INTEGER DEFAULT 0,   -- Total de compras en el período
  total_amount REAL DEFAULT 0,         -- Monto total en el período
  average_purchase REAL DEFAULT 0,     -- Promedio por compra
  growth_percentage REAL DEFAULT 0,    -- Crecimiento vs período anterior
  top_product_id INTEGER,              -- Producto más comprado
  top_product_name TEXT,               -- Nombre del producto más comprado
  top_product_percentage REAL DEFAULT 0, -- Porcentaje del producto top
  purchase_frequency REAL DEFAULT 0,   -- Frecuencia de compras (días)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

#### **5. 🔄 `client_comparisons` - Comparaciones Temporales**
```sql
CREATE TABLE client_comparisons (
  id INTEGER PRIMARY KEY,
  client_id INTEGER NOT NULL,          -- ID del cliente
  comparison_type TEXT NOT NULL,       -- 'month_over_month', 'quarter_over_quarter', 'year_over_year'
  current_period_start DATE NOT NULL,  -- Inicio período actual
  current_period_end DATE NOT NULL,    -- Fin período actual
  previous_period_start DATE NOT NULL, -- Inicio período anterior
  previous_period_end DATE NOT NULL,   -- Fin período anterior
  current_amount REAL DEFAULT 0,       -- Monto período actual
  previous_amount REAL DEFAULT 0,      -- Monto período anterior
  growth_amount REAL DEFAULT 0,        -- Crecimiento en monto
  growth_percentage REAL DEFAULT 0,    -- Crecimiento en porcentaje
  current_purchases INTEGER DEFAULT 0, -- Compras período actual
  previous_purchases INTEGER DEFAULT 0, -- Compras período anterior
  purchase_growth INTEGER DEFAULT 0,   -- Crecimiento en compras
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

---

## 🧮 **ALGORITMOS DE ANÁLISIS ESTADÍSTICO**

### **📊 1. CÁLCULO DE MÉTRICAS BÁSICAS**

#### **🎯 Total de Ventas por Cliente:**
```typescript
const calculateClientTotals = (clientId: number) => {
  const purchases = getClientPurchases(clientId);
  
  return {
    totalPurchases: purchases.length,
    totalAmount: purchases.reduce((sum, p) => sum + p.total_amount, 0),
    averagePurchase: purchases.length > 0 ? 
      purchases.reduce((sum, p) => sum + p.total_amount, 0) / purchases.length : 0,
    lastPurchaseDate: purchases.length > 0 ? 
      Math.max(...purchases.map(p => new Date(p.date).getTime())) : null
  };
};
```

#### **📈 Frecuencia de Compras:**
```typescript
const calculatePurchaseFrequency = (clientId: number) => {
  const purchases = getClientPurchases(clientId);
  if (purchases.length < 2) return 0;
  
  const sortedDates = purchases
    .map(p => new Date(p.date).getTime())
    .sort((a, b) => a - b);
  
  const totalDays = (sortedDates[sortedDates.length - 1] - sortedDates[0]) / (1000 * 60 * 60 * 24);
  return totalDays / (purchases.length - 1);
};
```

### **🏆 2. ANÁLISIS DE PRODUCTOS MÁS COMPRADOS**

#### **📊 Productos por Cantidad:**
```typescript
const getTopProductsByQuantity = (clientId: number, limit: number = 10) => {
  const products = getClientProducts(clientId);
  
  return products
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, limit)
    .map(product => ({
      ...product,
      percentage: (product.total_quantity / 
        products.reduce((sum, p) => sum + p.total_quantity, 0)) * 100
    }));
};
```

#### **💰 Productos por Monto:**
```typescript
const getTopProductsByAmount = (clientId: number, limit: number = 10) => {
  const products = getClientProducts(clientId);
  
  return products
    .sort((a, b) => b.total_amount - a.total_amount)
    .slice(0, limit)
    .map(product => ({
      ...product,
      percentage: (product.total_amount / 
        products.reduce((sum, p) => sum + p.total_amount, 0)) * 100
    }));
};
```

### **📈 3. ANÁLISIS TEMPORAL**

#### **📅 Ventas por Período:**
```typescript
const getSalesByPeriod = (clientId: number, periodType: 'month' | 'quarter' | 'year') => {
  const purchases = getClientPurchases(clientId);
  const grouped = groupByPeriod(purchases, periodType);
  
  return Object.entries(grouped).map(([period, periodPurchases]) => ({
    period,
    totalAmount: periodPurchases.reduce((sum, p) => sum + p.total_amount, 0),
    totalPurchases: periodPurchases.length,
    averagePurchase: periodPurchases.length > 0 ? 
      periodPurchases.reduce((sum, p) => sum + p.total_amount, 0) / periodPurchases.length : 0
  }));
};
```

#### **🔄 Cálculo de Crecimiento:**
```typescript
const calculateGrowth = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
```

---

## 💾 **ESTRATEGIA DE CACHE INTELIGENTE**

### **📊 NIVELES DE CACHE:**

#### **1. 🧠 CACHE EN MEMORIA (React State)**
```typescript
// Para datos que cambian frecuentemente
const [clientList, setClientList] = useState<Client[]>([]);
const [clientAnalytics, setClientAnalytics] = useState<ClientAnalytics[]>([]);
```

#### **2. 📱 CACHE EN ASYNCSTORAGE**
```typescript
// Para datos que persisten entre sesiones
const CLIENT_CACHE_KEY = 'client_analytics_cache';
const CLIENT_PURCHASES_CACHE_KEY = 'client_purchases_cache';
const CLIENT_PRODUCTS_CACHE_KEY = 'client_products_cache';
```

#### **3. 🗄️ CACHE EN BASE DE DATOS LOCAL**
```typescript
// Para datos históricos y análisis complejos
const db = await openDatabase('client_analytics.db');
```

### **🔄 ESTRATEGIA DE SINCRONIZACIÓN:**

#### **📊 Actualización Inteligente:**
```typescript
const syncClientData = async (clientId: number) => {
  // 1. Verificar última actualización
  const lastSync = await getLastSyncTime(clientId);
  const now = new Date();
  
  // 2. Si han pasado más de 24 horas, actualizar
  if (now.getTime() - lastSync.getTime() > 24 * 60 * 60 * 1000) {
    await updateClientData(clientId);
    await updateLastSyncTime(clientId, now);
  }
  
  // 3. Retornar datos del cache
  return await getClientDataFromCache(clientId);
};
```

---

## 🎯 **OPTIMIZACIÓN DE CONSULTAS**

### **📊 ÍNDICES RECOMENDADOS:**
```sql
-- Índices para consultas frecuentes
CREATE INDEX idx_client_purchases_client_id ON client_purchases(client_id);
CREATE INDEX idx_client_purchases_date ON client_purchases(date);
CREATE INDEX idx_client_products_client_id ON client_products(client_id);
CREATE INDEX idx_client_analytics_client_period ON client_analytics(client_id, period_type, period_start);
CREATE INDEX idx_client_comparisons_client_type ON client_comparisons(client_id, comparison_type);
```

### **🔍 CONSULTAS OPTIMIZADAS:**

#### **📊 Top Clientes por Ventas:**
```sql
SELECT 
  c.id, c.name, c.code,
  SUM(cp.total_amount) as total_sales,
  COUNT(cp.id) as total_purchases,
  AVG(cp.total_amount) as average_purchase
FROM clients c
JOIN client_purchases cp ON c.id = cp.client_id
WHERE cp.date >= date('now', '-30 days')
GROUP BY c.id
ORDER BY total_sales DESC
LIMIT 10;
```

#### **📈 Crecimiento Mensual:**
```sql
SELECT 
  strftime('%Y-%m', cp.date) as month,
  SUM(cp.total_amount) as total_amount,
  COUNT(cp.id) as total_purchases
FROM client_purchases cp
WHERE cp.client_id = ? AND cp.date >= date('now', '-12 months')
GROUP BY month
ORDER BY month;
```

---

## 🚀 **IMPLEMENTACIÓN PROPUESTA**

### **📋 FASE 1: CONFIGURACIÓN DE BASE DE DATOS**
1. **Crear** esquema de tablas
2. **Implementar** índices optimizados
3. **Configurar** sistema de migraciones

### **📋 FASE 2: ALGORITMOS DE ANÁLISIS**
1. **Implementar** cálculos de métricas básicas
2. **Crear** análisis de productos
3. **Desarrollar** análisis temporal

### **📋 FASE 3: SISTEMA DE CACHE**
1. **Configurar** cache en memoria
2. **Implementar** cache en AsyncStorage
3. **Optimizar** estrategia de sincronización

---

**📅 Fecha de Diseño:** 23 de Agosto, 2025  
**👨‍💻 Desarrollador:** Rodrigo Fernández  
**🏢 Proyecto:** Factura Movil 2025  
**🎯 Estado:** 🎨 **ARQUITECTURA DISEÑADA - LISTO PARA SIGUIENTE FASE**
