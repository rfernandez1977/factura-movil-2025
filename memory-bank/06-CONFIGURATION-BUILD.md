# CONFIGURACIÓN Y BUILD

## 📦 DEPENDENCIAS PRINCIPALES

### **React Native / Expo Core**
```json
{
  "expo": "^53.0.7",
  "react": "^18.3.1",
  "react-native": "0.76.6",
  "expo-router": "4.0.17",
  "expo-font": "^13.0.3",
  "expo-status-bar": "^2.0.1",
  "expo-print": "^12.8.1",
  "expo-sharing": "^11.7.0",
  "expo-linking": "^7.0.5",
  "expo-constants": "^17.0.5",
  "expo-system-ui": "^4.0.7"
}
```

### **Navegación y UI**
```json
{
  "react-native-screens": "^4.4.0",
  "react-native-safe-area-context": "4.12.0",
  "react-native-reanimated": "^3.16.7",
  "react-native-svg": "^15.11.1",
  "lucide-react-native": "^0.489.0",
  "react-native-chart-kit": "^6.12.0"
}
```

### **Estado y Almacenamiento**
```json
{
  "@react-native-async-storage/async-storage": "^1.21.0",
  "@react-native-community/datetimepicker": "^7.6.2"
}
```

### **Red y Utilidades**
```json
{
  "axios": "^1.6.7",
  "crypto-js": "^4.2.0"
}
```

### **Web y Desarrollo**
```json
{
  "react-native-web": "^0.19.13",
  "react-native-webview": "13.12.5"
}
```

### **Dev Dependencies**
```json
{
  "@babel/core": "^7.25.2",
  "@types/react": "~18.3.12",
  "@types/crypto-js": "^4.2.2",
  "@types/react-datepicker": "^4.19.6",
  "typescript": "^5.3.3",
  "file-loader": "^6.2.0",
  "image-webpack-loader": "^8.1.0",
  "webpack-bundle-analyzer": "^4.10.2"
}
```

## ⚙️ CONFIGURACIÓN DE EXPO

### **app.config.js**
```javascript
export default {
  name: "Factura Móvil",
  slug: "factura-movil",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/images/favicon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
    output: "static",
    optimization: {
      splitChunks: true
    }
  },
  plugins: [
    [
      "expo-router",
      {
        asyncRoutes: true
      }
    ]
  ],
  experiments: {
    tsconfigPaths: true
  }
};
```

### **app.json**
```json
{
  "expo": {
    "name": "facturamovil-app",
    "slug": "facturamovil-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "output": "server",
      "favicon": "./assets/images/favicon.png",
      "bundler": "metro"
    }
  }
}
```

## 🔧 CONFIGURACIÓN DE BABEL

### **babel.config.js**
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'react-native-reanimated/plugin'
    ],
  };
};
```

**Plugins utilizados**:
- `babel-preset-expo`: Preset base para Expo
- `expo-router/babel`: Soporte para file-based routing
- `react-native-reanimated/plugin`: Soporte para animaciones

## 🌐 CONFIGURACIÓN DE WEBPACK

### **webpack.config.js**
```javascript
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Optimización de chunks
  config.optimization.splitChunks = {
    chunks: 'all',
    maxInitialRequests: Infinity,
    minSize: 20000,
    maxSize: 200000,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
          
          if (packageName === 'react' || packageName === 'react-dom' || packageName === 'react-native-web') {
            return `npm.${packageName}`;
          }
          
          return `npm.${packageName.replace('@', '')}`;
        },
      },
    },
  };
  
  // Optimización de imágenes
  config.module.rules.forEach(rule => {
    if (rule.oneOf) {
      rule.oneOf.forEach(oneOfRule => {
        if (oneOfRule.loader && oneOfRule.loader.indexOf('file-loader') >= 0) {
          oneOfRule.options = {
            ...oneOfRule.options,
            name: 'static/media/[name].[hash:8].[ext]',
          };
        }
      });
    }
  });
  
  // Optimización de imágenes para web
  config.module.rules.push({
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
      loader: 'image-webpack-loader',
      options: {
        disable: process.env.NODE_ENV !== 'production',
        mozjpeg: {
          progressive: true,
          quality: 65,
        },
        optipng: {
          enabled: true,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4,
        },
        gifsicle: {
          interlaced: false,
        },
        webp: {
          quality: 75,
        },
      },
    },
    enforce: 'pre',
  });
  
  // Bundle analyzer
  if (process.env.ANALYZE === 'true') {
    config.plugins.push(new BundleAnalyzerPlugin());
  }
  
  // Optimizaciones adicionales
  config.optimization.usedExports = true;
  config.optimization.sideEffects = true;
  
  // Cache de archivos
  config.cache = {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  };
  
  return config;
};
```

## 📝 CONFIGURACIÓN DE TYPESCRIPT

### **tsconfig.json**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

### **types/env.d.ts**
```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_API_KEY: string;
      EXPO_PUBLIC_API_TOKEN: string;
      EXPO_PUBLIC_COMPANY_ID: string;
    }
  }
}

export {};
```

## 🚀 SCRIPTS DE DESARROLLO

### **package.json scripts**
```json
{
  "scripts": {
    "start": "EXPO_NO_TELEMETRY=1 expo start",
    "dev": "EXPO_NO_TELEMETRY=1 expo start",
    "build:web": "EXPO_NO_TELEMETRY=1 expo export --platform web",
    "analyze": "ANALYZE=true expo export --platform web",
    "lint": "expo lint",
    "test:api": "node test/api-test.ts"
  }
}
```

**Descripción de scripts**:
- `start`: Inicia el servidor de desarrollo
- `dev`: Alias para start
- `build:web`: Construye la aplicación para web
- `analyze`: Analiza el bundle con webpack-bundle-analyzer
- `lint`: Ejecuta el linter
- `test:api`: Pruebas de API

## 🔧 CONFIGURACIÓN DE METRO

### **metro.config.js** (implícito)
Metro se configura automáticamente con Expo, pero se puede personalizar:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuraciones personalizadas
config.resolver.assetExts.push('db');
config.resolver.sourceExts.push('cjs');

module.exports = config;
```

## 📱 CONFIGURACIÓN DE PLATAFORMAS

### **iOS**
- Soporte para tablets
- Configuración de iconos adaptativos
- Permisos en Info.plist (manejados por Expo)

### **Android**
- Iconos adaptativos
- Permisos en AndroidManifest.xml
- Configuración de versiones de API

### **Web**
- Optimizaciones específicas para web
- Bundle analyzer
- Code splitting
- Optimización de imágenes

## 🔐 VARIABLES DE ENTORNO

### **Configuración**
```bash
# .env (no incluido en el repo)
EXPO_PUBLIC_API_URL=http://produccion.facturamovil.cl
EXPO_PUBLIC_API_KEY=your_api_key
EXPO_PUBLIC_API_TOKEN=431ab8e9-7867-416b-9aab-0c32c924973c
EXPO_PUBLIC_COMPANY_ID=29
```

### **Uso en el código**
```typescript
// services/api.ts
let API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://produccion.facturamovil.cl';
let API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN || '431ab8e9-7867-416b-9aab-0c32c924973c';
let COMPANY_ID = process.env.EXPO_PUBLIC_COMPANY_ID || '29';
```

## 🎨 CONFIGURACIÓN DE FUENTES

### **Carga de fuentes**
```typescript
// app/_layout.tsx
const [fontsLoaded] = useFonts({
  'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
  'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
  'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
});
```

### **Fuentes incluidas**
- `Poppins-Regular.ttf`
- `Poppins-Medium.ttf`
- `Poppins-Bold.ttf`

## 🖼️ CONFIGURACIÓN DE IMÁGENES

### **Assets incluidos**
```
assets/
├── images/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   └── icon.png
└── fonts/
    ├── Poppins-Bold.ttf
    ├── Poppins-Medium.ttf
    └── Poppins-Regular.ttf
```

## 🔧 OPTIMIZACIONES DE BUILD

### **1. Code Splitting**
```javascript
// webpack.config.js
config.optimization.splitChunks = {
  chunks: 'all',
  maxInitialRequests: Infinity,
  minSize: 20000,
  maxSize: 200000,
  // ...
};
```

### **2. Optimización de Imágenes**
```javascript
// webpack.config.js
config.module.rules.push({
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'image-webpack-loader',
    options: {
      mozjpeg: { progressive: true, quality: 65 },
      optipng: { enabled: true },
      pngquant: { quality: [0.65, 0.90], speed: 4 },
      // ...
    },
  },
  enforce: 'pre',
});
```

### **3. Tree Shaking**
```javascript
// webpack.config.js
config.optimization.usedExports = true;
config.optimization.sideEffects = true;
```

### **4. Cache de Archivos**
```javascript
// webpack.config.js
config.cache = {
  type: 'filesystem',
  buildDependencies: {
    config: [__filename],
  },
};
```

## 📊 ANÁLISIS DE BUNDLE

### **Bundle Analyzer**
```bash
# Ejecutar análisis
npm run analyze
```

Esto genera un reporte visual del bundle que muestra:
- Tamaño de cada módulo
- Dependencias
- Chunks generados
- Optimizaciones aplicadas

## 🚀 DEPLOYMENT

### **Web**
```bash
# Build para producción
npm run build:web

# Los archivos se generan en dist/
```

### **Mobile**
```bash
# Build para iOS
expo build:ios

# Build para Android
expo build:android

# O usar EAS Build
eas build --platform ios
eas build --platform android
```

## 🔍 DEBUGGING

### **Configuración de debugging**
```typescript
// Habilitar logs detallados
console.log('=== DEBUG INFO ===');
console.log('API URL:', process.env.EXPO_PUBLIC_API_URL);
console.log('User Token:', userData.token ? `${userData.token.substring(0, 10)}...` : 'No token');
```

### **Herramientas de desarrollo**
- React Native Debugger
- Flipper
- Chrome DevTools (para web)
- Expo DevTools

## 📋 CHECKLIST DE CONFIGURACIÓN

### **Pre-requisitos**
- [ ] Node.js 18+
- [ ] Expo CLI
- [ ] Xcode (para iOS)
- [ ] Android Studio (para Android)

### **Configuración inicial**
- [ ] Variables de entorno configuradas
- [ ] Fuentes cargadas
- [ ] Iconos generados
- [ ] Permisos configurados

### **Optimizaciones**
- [ ] Code splitting habilitado
- [ ] Tree shaking configurado
- [ ] Imágenes optimizadas
- [ ] Cache configurado

---

**La configuración está optimizada para desarrollo eficiente y builds de producción de alta calidad.**
