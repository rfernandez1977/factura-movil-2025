# 📁 ASSETS - RECURSOS DE LA APLICACIÓN

## 🎯 **PROPÓSITO**

Esta carpeta contiene todos los recursos estáticos de la aplicación **Factura Móvil 2025**, organizados por tipo para facilitar el mantenimiento y la gestión de archivos.

---

## 📂 **ESTRUCTURA DE CARPETAS**

```
assets/
├── 📁 images/          # Imágenes de la aplicación
├── 📁 icons/           # Iconos y logos
├── 📁 fonts/           # Fuentes personalizadas
├── 📁 data/            # Datos estáticos y configuraciones
└── 📄 README.md        # Este archivo
```

---

## 🖼️ **IMAGES/**

### **Propósito**
Almacena todas las imágenes utilizadas en la aplicación.

### **Tipos de Archivos**
- **PNG**: Iconos, logos, imágenes con transparencia
- **JPG/JPEG**: Fotografías y imágenes complejas
- **SVG**: Iconos vectoriales escalables
- **WebP**: Imágenes optimizadas para web

### **Estructura Sugerida**
```
images/
├── 📁 logos/           # Logos de la empresa y aplicación
├── 📁 backgrounds/     # Imágenes de fondo
├── 📁 products/        # Imágenes de productos
├── 📁 avatars/         # Avatares de usuarios
└── 📁 placeholders/    # Imágenes placeholder
```

### **Convenciones de Nomenclatura**
- Usar nombres descriptivos en minúsculas
- Separar palabras con guiones: `product-image.png`
- Incluir dimensiones si es relevante: `logo-200x200.png`

---

## 🎨 **ICONS/**

### **Propósito**
Contiene iconos específicos de la aplicación y recursos gráficos.

### **Tipos de Archivos**
- **SVG**: Iconos vectoriales (preferidos)
- **PNG**: Iconos rasterizados
- **ICO**: Iconos para favicon

### **Estructura Sugerida**
```
icons/
├── 📁 navigation/      # Iconos de navegación
├── 📁 actions/         # Iconos de acciones
├── 📁 status/          # Iconos de estado
└── 📁 categories/      # Iconos por categoría
```

---

## 🔤 **FONTS/**

### **Propósito**
Almacena fuentes tipográficas personalizadas utilizadas en la aplicación.

### **Tipos de Archivos**
- **TTF**: TrueType Fonts
- **OTF**: OpenType Fonts
- **WOFF/WOFF2**: Web Open Font Format

### **Estructura Sugerida**
```
fonts/
├── 📁 primary/         # Fuente principal
├── 📁 secondary/       # Fuente secundaria
└── 📁 special/         # Fuentes especiales
```

### **Configuración en React Native**
Para usar fuentes personalizadas en React Native:

1. **Agregar al `app.json`**:
```json
{
  "expo": {
    "fonts": [
      {
        "asset": "./assets/fonts/primary/MyFont-Regular.ttf"
      }
    ]
  }
}
```

2. **Usar en el código**:
```javascript
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  'MyFont-Regular': require('./assets/fonts/primary/MyFont-Regular.ttf'),
});
```

---

## 📊 **DATA/**

### **Propósito**
Contiene datos estáticos, configuraciones y archivos de referencia.

### **Tipos de Archivos**
- **JSON**: Datos estructurados
- **CSV**: Datos tabulares
- **TXT**: Textos y configuraciones
- **YAML**: Configuraciones complejas

### **Estructura Sugerida**
```
data/
├── 📁 config/          # Configuraciones
├── 📁 samples/         # Datos de ejemplo
├── 📁 translations/    # Archivos de idiomas
└── 📁 templates/       # Plantillas
```

### **Ejemplos de Uso**
```javascript
// Cargar configuración
import config from '../assets/data/config/app-config.json';

// Cargar datos de ejemplo
import sampleProducts from '../assets/data/samples/products.json';

// Cargar traducciones
import translations from '../assets/data/translations/es.json';
```

---

## 🚀 **MEJORES PRÁCTICAS**

### **1. Optimización de Imágenes**
- **Comprimir imágenes** antes de agregarlas
- **Usar formatos apropiados** (PNG para transparencia, JPG para fotos)
- **Considerar diferentes densidades** para dispositivos móviles
- **Mantener tamaños razonables** para no afectar el rendimiento

### **2. Organización**
- **Usar nombres descriptivos** para todos los archivos
- **Mantener una estructura consistente**
- **Documentar cambios importantes**
- **Versionar archivos cuando sea necesario**

### **3. Rendimiento**
- **Lazy load** para imágenes grandes
- **Cache** de recursos frecuentemente usados
- **Optimizar** para diferentes tamaños de pantalla
- **Considerar** el uso de CDN para producción

### **4. Mantenimiento**
- **Revisar regularmente** archivos no utilizados
- **Actualizar** recursos obsoletos
- **Mantener** consistencia en el estilo
- **Documentar** cambios importantes

---

## 📝 **CONVENCIONES DE NOMBRES**

### **Imágenes**
```
✅ Correcto:
- logo-primary.png
- background-home.jpg
- icon-user-active.svg
- product-thumbnail-150x150.png

❌ Incorrecto:
- IMG_001.png
- background.jpg
- icon.png
- product.jpg
```

### **Iconos**
```
✅ Correcto:
- nav-home.svg
- action-delete.png
- status-success.svg
- category-electronics.svg

❌ Incorrecto:
- home.png
- delete.svg
- success.png
- electronics.svg
```

### **Fuentes**
```
✅ Correcto:
- Roboto-Regular.ttf
- OpenSans-Bold.otf
- Montserrat-Light.ttf

❌ Incorrecto:
- font.ttf
- bold.otf
- light.ttf
```

---

## 🔧 **HERRAMIENTAS ÚTILES**

### **Optimización de Imágenes**
- **TinyPNG**: Compresión online
- **ImageOptim**: Optimización local (macOS)
- **Squoosh**: Herramienta de Google

### **Conversión de Formatos**
- **Convertio**: Conversión online
- **FFmpeg**: Herramienta de línea de comandos
- **GIMP**: Editor de imágenes gratuito

### **Gestión de Iconos**
- **Figma**: Diseño de iconos
- **Inkscape**: Editor SVG gratuito
- **Iconify**: Biblioteca de iconos

---

## 📞 **CONTACTO**

Para preguntas sobre la gestión de assets:
- Revisar este README
- Consultar la documentación del proyecto
- Verificar las convenciones establecidas

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Estado**: ✅ Estructura creada  

---

> **Esta carpeta assets es fundamental para mantener organizados todos los recursos de la aplicación y facilitar el desarrollo y mantenimiento del proyecto.**
