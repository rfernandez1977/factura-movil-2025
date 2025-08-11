# COMPONENTES DEL PROYECTO

## 📱 COMPONENTES REUTILIZABLES

### 1. **Header Component**
**Archivo**: `components/Header.tsx`

**Props**:
```typescript
interface HeaderProps {
  title: string;
  showBack?: boolean;
  showProfile?: boolean;
  onBackPress?: () => void;
}
```

**Funcionalidades**:
- Header con título personalizable
- Botón de retroceso opcional
- Notificaciones con badge
- Botón de perfil opcional
- Adaptación automática para iOS/Android

**Ejemplo de uso**:
```typescript
<Header 
  title="Clientes" 
  showBack={true} 
  showProfile={true}
  onBackPress={() => router.back()}
/>
```

### 2. **ClientCard Component**
**Archivo**: `components/ClientCard.tsx`

**Props**:
```typescript
interface ClientCardProps {
  item: Client;
  onPress: () => void;
}
```

**Funcionalidades**:
- Muestra información del cliente (nombre, RUT, actividad)
- Icono diferenciado para empresas vs personas
- Información de contacto (email, dirección)
- Diseño responsive con sombras
- Indicador visual de tipo de cliente

**Estructura de datos**:
```typescript
interface Client {
  id: number;
  code: string;        // RUT
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  municipality?: Municipality;
  activity?: Activity;
  line?: string;       // "Empresa" o "Persona"
}
```

### 3. **StatCard Component**
**Archivo**: `components/StatCard.tsx`

**Props**:
```typescript
interface StatCardProps {
  title: string;
  value: string;
  trend?: number;      // Porcentaje de cambio
  icon: React.ReactNode;
}
```

**Funcionalidades**:
- Muestra estadísticas con icono
- Indicador de tendencia (positivo/negativo)
- Colores automáticos según tendencia
- Diseño de tarjeta con sombras

**Ejemplo de uso**:
```typescript
<StatCard
  title="Ventas del Día"
  value="S/ 2,580.00"
  trend={+12.5}
  icon={<TrendingUp size={24} color="#0066CC" />}
/>
```

### 4. **RecentDocumentsSection Component**
**Archivo**: `components/RecentDocumentsSection.tsx`

**Props**:
```typescript
interface RecentDocumentsSectionProps {
  invoices: Invoice[];
  router: any;
}
```

**Funcionalidades**:
- Lista de documentos recientes
- Navegación a detalles del documento
- Diseño de lista con iconos
- Información de cliente y monto

**Estructura de datos**:
```typescript
interface Invoice {
  id: string;
  number: string;      // Número de documento
  client: string;      // Nombre del cliente
  amount: number;      // Monto total
}
```

### 5. **LazyImage Component**
**Archivo**: `components/LazyImage.tsx`

**Props**:
```typescript
interface LazyImageProps extends Omit<ImageProps, 'source'> {
  src: string;
  placeholderColor?: string;
  width: number;
  height: number;
}
```

**Funcionalidades**:
- Carga diferida de imágenes
- Placeholder mientras carga
- Intersection Observer para web
- Manejo de errores de carga
- Optimización de rendimiento

**Ejemplo de uso**:
```typescript
<LazyImage
  src="https://example.com/image.jpg"
  width={100}
  height={100}
  placeholderColor="#e1e1e1"
/>
```

### 6. **LoadingSkeleton Component**
**Archivo**: `components/LoadingSkeleton.tsx`

**Funcionalidades**:
- Esqueleto de carga para componentes
- Animación de pulso
- Diseño adaptable
- Mejora UX durante carga

### 7. **LazyLoadSection Component**
**Archivo**: `components/LazyLoadSection.tsx`

**Funcionalidades**:
- Sección con carga diferida
- Optimización de rendimiento
- Intersection Observer
- Fallback mientras carga

## 🎨 COMPONENTES DE PANTALLA

### 1. **Dashboard (Home)**
**Archivo**: `app/(tabs)/index.tsx`

**Funcionalidades**:
- Resumen de estadísticas diarias
- Acciones rápidas (VozPos, Quick, VisionPos, TouchPos)
- Documentos recientes
- Saludo personalizado con fecha
- Avatar de usuario

**Componentes utilizados**:
- `StatCard` (lazy loaded)
- `RecentDocumentsSection`
- `ActionCard` (interno)

### 2. **Clientes Screen**
**Archivo**: `app/(tabs)/clients/index.tsx`

**Funcionalidades**:
- Lista de clientes con búsqueda
- Filtros y ordenamiento
- Creación de nuevos clientes
- Pull-to-refresh
- Estados de carga y error
- FAB para crear cliente

**Componentes utilizados**:
- `Header`
- `ClientCard` (lazy loaded)

### 3. **Productos Screen**
**Archivo**: `app/(tabs)/products/index.tsx`

**Funcionalidades**:
- Lista de productos con búsqueda
- Información detallada (precio, categoría, impuestos)
- Filtros por categoría
- Estados de carga y error
- Pull-to-refresh

### 4. **Ventas Screen**
**Archivo**: `app/(tabs)/sales/index.tsx`

**Funcionalidades**:
- Lista de documentos de venta
- Estados de documentos (ACCEPTED/PENDING)
- Opciones de venta (Quick, VozPos, VisionPos, TouchPos)
- Navegación a detalles
- Pull-to-refresh

### 5. **Configuración Screen**
**Archivo**: `app/(tabs)/settings/index.tsx`

**Funcionalidades**:
- Perfil de usuario y empresa
- Configuración de tema (oscuro/claro)
- Configuración de impresora
- Configuración de IA
- Configuración de VozPos
- Cerrar sesión

## 🔐 COMPONENTES DE AUTENTICACIÓN

### 1. **Login Screen**
**Archivo**: `app/(auth)/login.tsx`

**Funcionalidades**:
- Formulario de login
- Validación de campos
- Manejo de errores
- Indicador de carga
- Navegación a registro/recuperación
- Toggle de visibilidad de contraseña

### 2. **Register Screen**
**Archivo**: `app/(auth)/register.tsx`

**Funcionalidades**:
- Formulario de registro
- Validación de contraseñas
- Confirmación de contraseña
- Navegación a login

### 3. **Forgot Password Screen**
**Archivo**: `app/(auth)/forgot-password.tsx`

**Funcionalidades**:
- Formulario de recuperación
- Validación de email
- Pantalla de confirmación
- Navegación de regreso

## 🤖 COMPONENTES DE IA

### 1. **Assistant Screen**
**Archivo**: `app/assistant/index.tsx`

**Funcionalidades**:
- Chat con asistente IA
- Mensajes simulados
- Limpiar conversación
- Indicador de "pensando"
- Interfaz de chat moderna

### 2. **Chat Screen**
**Archivo**: `app/chat/index.tsx`

**Funcionalidades**:
- Chat IA avanzado
- Sugerencias automáticas
- Configuración de IA
- Mensajes con imágenes
- Verificación de IA habilitada

## 📊 COMPONENTES DE REPORTES

### 1. **Reports Screen**
**Archivo**: `app/reports/index.tsx`

**Funcionalidades**:
- Gráficos de ventas
- Selector de período
- Estadísticas resumidas
- Descarga de reportes
- Gráficos interactivos

**Librerías utilizadas**:
- `react-native-chart-kit` para gráficos

## 🎯 PATRONES DE COMPONENTES

### 1. **Lazy Loading Pattern**
```typescript
// Importación lazy
const StatCard = lazy(() => import('../../components/StatCard'));

// Fallback mientras carga
<Suspense fallback={<StatCardFallback title="Ventas del Día" />}>
  <StatCard {...props} />
</Suspense>
```

### 2. **Memo Pattern**
```typescript
// Memoización para evitar re-renders
const RecentDocumentsSection = memo(({ invoices, router }) => (
  // Component implementation
));
```

### 3. **Error Boundary Pattern**
```typescript
// Manejo de errores con fallback
{error ? (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity onPress={handleRetry}>
      <Text>Reintentar</Text>
    </TouchableOpacity>
  </View>
) : (
  // Normal content
)}
```

### 4. **Loading State Pattern**
```typescript
// Estados de carga consistentes
{isLoading ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0066CC" />
    <Text>Cargando...</Text>
  </View>
) : (
  // Content
)}
```

## 🎨 SISTEMA DE ESTILOS

### 1. **Colores del Sistema**
```typescript
const colors = {
  primary: '#0066CC',      // Azul principal
  secondary: '#4CAF50',    // Verde
  accent: '#FF9800',       // Naranja
  error: '#FF3B30',        // Rojo
  success: '#4CAF50',      // Verde éxito
  warning: '#FF9800',      // Naranja advertencia
  text: {
    primary: '#333',
    secondary: '#666',
    disabled: '#999'
  },
  background: {
    primary: '#fff',
    secondary: '#f9f9f9',
    dark: '#1a1a1a'
  }
};
```

### 2. **Sombras Consistentes**
```typescript
// Reemplazo de shadowProps con boxShadow
const shadowStyles = {
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  elevation: 2,
};
```

### 3. **Responsive Design**
```typescript
// Adaptación por plataforma
const platformStyles = {
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  }
};
```

---

**Los componentes están diseñados para ser reutilizables, mantenibles y seguir patrones consistentes de UI/UX.**
