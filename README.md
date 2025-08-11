# 📱 Factura Móvil 2025

## 🎯 Descripción

Aplicación móvil de **Facturación Electrónica** para gestión empresarial desarrollada con React Native y Expo. Permite emitir facturas y boletas electrónicas, gestionar clientes y productos, generar reportes de ventas, y usar asistente IA para tareas.

## ✨ Características Principales

- 🔐 **Autenticación completa** con multi-empresa
- 👥 **Gestión de clientes** con búsqueda avanzada
- 📦 **Gestión de productos** con categorías
- 💰 **Gestión de ventas** y documentos electrónicos
- 📊 **Reportes y gráficos** interactivos
- 🤖 **Asistente IA** con chat inteligente
- 🖨️ **Impresión Bluetooth** de documentos
- ⚙️ **Configuración avanzada** personalizable
- 📱 **Multiplataforma** (iOS, Android, Web)

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Framework**: React Native con Expo
- **Navegación**: Expo Router (file-based routing)
- **Estado**: Context API (Auth + Theme)
- **API**: REST con Axios y cache inteligente
- **Almacenamiento**: AsyncStorage para persistencia
- **UI**: Lucide React Native + React Native Chart Kit
- **Lenguaje**: TypeScript

### Características Avanzadas
- **Lazy Loading**: Componentes y imágenes
- **Cache Inteligente**: API con fallback offline
- **Optimización Web**: Webpack con code splitting
- **Responsive Design**: Adaptable a diferentes pantallas
- **Tema Oscuro/Claro**: Soporte completo

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Expo CLI
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/factura-movil-2025.git
   cd factura-movil-2025
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env
   EXPO_PUBLIC_API_URL=http://produccion.facturamovil.cl
   EXPO_PUBLIC_API_TOKEN=tu_token_aqui
   EXPO_PUBLIC_COMPANY_ID=487
   EXPO_NO_TELEMETRY=1
   ```

4. **Iniciar el proyecto**
   ```bash
   npm start
   ```

## 📱 Uso

### Plataformas Soportadas
- **iOS**: Simulator y dispositivos físicos
- **Android**: Emulador y dispositivos físicos
- **Web**: Navegadores modernos

### Comandos Útiles
```bash
# Desarrollo
npm start              # Iniciar servidor de desarrollo
npm run dev           # Alias para start

# Build
npm run build:web     # Build para web
npm run analyze       # Analizar bundle

# Mantenimiento
npm run lint          # Ejecutar linter
npm audit fix         # Corregir vulnerabilidades
```

## 🔧 Configuración

### Variables de Entorno
- `EXPO_PUBLIC_API_URL`: URL base de la API
- `EXPO_PUBLIC_API_TOKEN`: Token de autenticación
- `EXPO_PUBLIC_COMPANY_ID`: ID de la empresa
- `EXPO_NO_TELEMETRY`: Deshabilitar telemetría

### Configuración de API
- **Base URL**: `http://produccion.facturamovil.cl`
- **Autenticación**: Token-based con header `FACMOV_T`
- **Cache**: 5 minutos en memoria + AsyncStorage

## 📊 Estado del Proyecto

### ✅ Funcionalidades Completadas
- [x] Autenticación y autorización
- [x] Gestión de clientes
- [x] Gestión de productos
- [x] Creación de documentos
- [x] Reportes y estadísticas
- [x] Asistente IA
- [x] Configuración de impresora
- [x] Tema oscuro/claro
- [x] Cache inteligente
- [x] Optimizaciones de rendimiento

### 🚧 En Desarrollo
- [ ] Tests unitarios
- [ ] Push notifications
- [ ] Analytics
- [ ] CI/CD pipeline

## 📁 Estructura del Proyecto

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
├── utils/                 # Utilidades
├── types/                 # Tipos TypeScript
├── assets/                # Imágenes y fuentes
└── memory-bank/           # Documentación técnica
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Revisar la documentación en `memory-bank/`
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

## 🏆 Créditos

Desarrollado con ❤️ por el equipo de Factura Móvil 2025

---

**Versión**: 1.0.1  
**Última actualización**: $(date)  
**Estado**: ✅ Funcionando correctamente
