# PROYECTO FACTURA MÓVIL - OVERVIEW

## 🎯 PROPÓSITO PRINCIPAL
Aplicación móvil de **Facturación Electrónica** para gestión empresarial que permite:
- Emitir facturas y boletas electrónicas
- Gestionar clientes y productos
- Generar reportes de ventas
- Usar asistente IA para tareas
- Imprimir documentos vía Bluetooth

## 🏗️ ARQUITECTURA TÉCNICA

### Stack Tecnológico
- **Framework**: React Native con Expo
- **Navegación**: Expo Router (file-based routing)
- **Estado**: Context API (Auth + Theme)
- **API**: REST con Axios y cache inteligente
- **Almacenamiento**: AsyncStorage para persistencia
- **UI**: Lucide React Native + React Native Chart Kit

### Estructura de Carpetas
```
project/
├── app/                    # Pantallas y rutas (Expo Router)
│   ├── (auth)/            # Flujo de autenticación
│   ├── (tabs)/            # Navegación principal
│   ├── assistant/         # Asistente IA
│   ├── chat/              # Chat IA
│   ├── reports/           # Reportes
│   └── sales/             # Gestión de ventas
├── components/            # Componentes reutilizables
├── context/               # Contextos globales
├── hooks/                 # Hooks personalizados
├── services/              # Servicios de API
├── utils/                 # Utilidades (impresión, permisos)
├── types/                 # Tipos TypeScript
└── assets/                # Imágenes y fuentes
```

## 📱 FUNCIONALIDADES IMPLEMENTADAS

### ✅ COMPLETAMENTE FUNCIONAL
1. **Autenticación**: Login, registro, recuperación de contraseña
2. **Gestión de Clientes**: Lista, búsqueda, creación
3. **Gestión de Productos**: Lista, búsqueda, categorías
4. **Ventas**: Listado de documentos, estados, detalles
5. **Configuración**: Tema oscuro/claro, impresora, IA
6. **Reportes**: Gráficos de ventas, estadísticas
7. **Asistente IA**: Chat con sugerencias automáticas

### 🔧 CARACTERÍSTICAS TÉCNICAS AVANZADAS
- **Lazy Loading**: Componentes y imágenes
- **Cache Inteligente**: API con fallback offline
- **Optimización Web**: Webpack con code splitting
- **Impresión Bluetooth**: Mock en Expo, real en nativo
- **Responsive Design**: Adaptable a diferentes pantallas

## 📊 ESTRUCTURA DE DATOS

### Entidades Principales
- **Clientes**: RUT, nombre, email, dirección, actividad
- **Productos**: Código, nombre, precio, categoría, impuestos
- **Documentos**: Facturas/boletas con estados (ACCEPTED/PENDING)
- **Usuario**: Multi-empresa, roles, configuración

### Estados de Documentos
- `ACCEPTED`: Documento aceptado por SII
- `PENDING`: Documento pendiente de procesamiento

## 🔌 INTEGRACIÓN API

### Configuración
- **Base URL**: `http://produccion.facturamovil.cl`
- **Autenticación**: Token-based con headers personalizados
- **Cache**: 5 minutos en memoria + AsyncStorage

### Endpoints Principales
- `/services/common/product` - Productos
- `/services/common/client` - Clientes
- `/services/common/company/{id}/lastsales/` - Ventas
- `/services/raw/company/{id}/invoice` - Crear factura
- `/services/raw/company/{id}/ticket` - Crear boleta

## 🎨 UI/UX

### Diseño
- **Iconografía**: Lucide React Native
- **Gráficos**: React Native Chart Kit
- **Fuentes**: Poppins (Regular, Medium, Bold)
- **Tema**: Soporte completo para modo oscuro
- **Navegación**: Tab-based con stack navigation

### Colores Principales
- **Primario**: #0066CC (Azul)
- **Secundario**: #4CAF50 (Verde)
- **Acento**: #FF9800 (Naranja)
- **Error**: #FF3B30 (Rojo)

## 📋 ESTADO DE DESARROLLO

### ✅ COMPLETADO
- Arquitectura sólida y escalable
- Funcionalidades core completas
- UI/UX moderna y responsive
- Integración API robusta
- Manejo de errores y estados de carga
- Optimizaciones de rendimiento

### 🚀 PRÓXIMOS PASOS SUGERIDOS
1. **Testing**: Implementar tests unitarios y de integración
2. **PWA**: Optimizar para Progressive Web App
3. **Notificaciones**: Push notifications para documentos
4. **Analytics**: Tracking de uso y métricas
5. **CI/CD**: Pipeline de deployment automatizado

## 🔐 SEGURIDAD

### Autenticación
- Credenciales codificadas en Base64
- Tokens JWT para sesiones
- Persistencia segura en AsyncStorage
- Manejo de múltiples empresas por usuario

### Permisos
- Bluetooth para impresión
- Ubicación para dispositivos Bluetooth (Android)
- Configuración automática según plataforma

## 📱 PLATAFORMAS SOPORTADAS

### Desarrollo
- **iOS**: Simulator y dispositivos físicos
- **Android**: Emulador y dispositivos físicos
- **Web**: Navegadores modernos

### Características Específicas
- **iOS**: Soporte nativo para impresión
- **Android**: Permisos Bluetooth dinámicos
- **Web**: Optimizaciones de rendimiento específicas

---

**Última actualización**: $(date)
**Versión del proyecto**: 1.0.0
**Estado**: En desarrollo activo
