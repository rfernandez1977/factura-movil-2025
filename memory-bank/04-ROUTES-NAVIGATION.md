# RUTAS Y NAVEGACIÓN

## 🗂️ ESTRUCTURA DE ARCHIVOS (EXPO ROUTER)

### Layout Principal
```
app/
├── _layout.tsx              # Layout raíz con providers
├── index.tsx                # Redirige a /(tabs)
├── +not-found.tsx           # Página 404
├── (auth)/                  # Grupo de autenticación
│   ├── _layout.tsx          # Layout de auth
│   ├── login.tsx            # Login
│   ├── register.tsx         # Registro
│   └── forgot-password.tsx  # Recuperar contraseña
├── (tabs)/                  # Grupo de tabs principales
│   ├── _layout.tsx          # Layout con tabs
│   ├── index.tsx            # Dashboard (Home)
│   ├── clients/
│   │   └── index.tsx        # Lista de clientes
│   ├── products/
│   │   └── index.tsx        # Lista de productos
│   ├── sales/
│   │   └── index.tsx        # Lista de ventas
│   └── settings/
│       └── index.tsx        # Configuración
├── assistant/
│   └── index.tsx            # Asistente IA
├── chat/
│   └── index.tsx            # Chat IA
├── reports/
│   └── index.tsx            # Reportes
├── sales/                   # Subrutas de ventas
│   ├── quick.tsx            # Venta rápida
│   ├── touchpos.tsx         # TouchPos
│   ├── vozpos.tsx           # VozPos
│   ├── boleta-electronica.tsx
│   ├── factura-electronica.tsx
│   └── invoice-details.tsx  # Detalles de factura
├── clients/
│   └── new.tsx              # Crear cliente
└── settings/                # Subrutas de configuración
    ├── ai-config.tsx        # Configuración IA
    ├── gemini-api.tsx       # API Gemini
    ├── payment-gateway.tsx  # Pasarela de pago
    ├── print-config.tsx     # Configuración impresora
    ├── speech-to-text.tsx   # Speech-to-Text
    └── text-to-speech.tsx   # Text-to-Speech
```

## 🎯 LAYOUTS Y GRUPOS

### 1. **Layout Raíz** (`app/_layout.tsx`)
```typescript
export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </Suspense>
  );
}
```

**Funcionalidades**:
- Providers globales (Theme, Auth)
- Suspense para lazy loading
- Stack navigation principal
- Status bar configurado

### 2. **Layout de Autenticación** (`app/(auth)/_layout.tsx`)
```typescript
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
```

### 3. **Layout de Tabs** (`app/(tabs)/_layout.tsx`)
```typescript
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: 'Ventas',
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

## 🚀 FLUJOS DE NAVEGACIÓN

### 1. **Flujo de Autenticación**
```
App Launch → Check Auth State → 
├── Authenticated → Navigate to /(tabs)
└── Not Authenticated → Navigate to /(auth)/login
```

**Navegación entre pantallas de auth**:
```
Login → Register
Login → Forgot Password
Register → Login
Forgot Password → Login
```

### 2. **Flujo Principal (Tabs)**
```
Dashboard (/) → 
├── Clients (/clients) → New Client (/clients/new)
├── Products (/products)
├── Sales (/sales) → 
│   ├── Quick Sale (/sales/quick)
│   ├── TouchPos (/sales/touchpos)
│   ├── VozPos (/sales/vozpos)
│   ├── Boleta (/sales/boleta-electronica)
│   ├── Factura (/sales/factura-electronica)
│   └── Invoice Details (/sales/invoice-details)
└── Settings (/settings) → 
    ├── AI Config (/settings/ai-config)
    ├── Gemini API (/settings/gemini-api)
    ├── Payment Gateway (/settings/payment-gateway)
    ├── Print Config (/settings/print-config)
    ├── Speech-to-Text (/settings/speech-to-text)
    └── Text-to-Speech (/settings/text-to-speech)
```

### 3. **Flujos Especiales**
```
Dashboard → Assistant (/assistant)
Dashboard → Chat (/chat)
Dashboard → Reports (/reports)
Sales → Invoice Details (con parámetros)
Settings → Logout → Auth Flow
```

## 📱 PANTALLAS PRINCIPALES

### 1. **Dashboard** (`app/(tabs)/index.tsx`)
**Ruta**: `/`
**Funcionalidades**:
- Resumen de estadísticas
- Acciones rápidas
- Documentos recientes
- Saludo personalizado

**Navegación desde aquí**:
```typescript
// Acciones rápidas
router.push('/sales/vozpos')      // VozPos
router.push('/sales/quick')       // Quick Sale
router.push('/sales/touchpos')    // TouchPos
router.push('/assistant')         // Assistant
```

### 2. **Clientes** (`app/(tabs)/clients/index.tsx`)
**Ruta**: `/clients`
**Funcionalidades**:
- Lista de clientes
- Búsqueda y filtros
- Crear nuevo cliente

**Navegación**:
```typescript
// Ver detalles de cliente
router.push(`/clients/${item.id}`)

// Crear nuevo cliente
router.push('/clients/new')
```

### 3. **Productos** (`app/(tabs)/products/index.tsx`)
**Ruta**: `/products`
**Funcionalidades**:
- Lista de productos
- Búsqueda por nombre/código
- Información detallada

### 4. **Ventas** (`app/(tabs)/sales/index.tsx`)
**Ruta**: `/sales`
**Funcionalidades**:
- Lista de documentos
- Estados de documentos
- Opciones de venta

**Navegación**:
```typescript
// Ver detalles de documento
router.push(`/sales/invoice-details?id=${document.id}&folio=${document.assignedFolio}`)

// Crear nuevo documento
router.push('/sales/quick')       // Venta rápida
router.push('/sales/touchpos')    // TouchPos
router.push('/sales/vozpos')      // VozPos
```

### 5. **Configuración** (`app/(tabs)/settings/index.tsx`)
**Ruta**: `/settings`
**Funcionalidades**:
- Perfil de usuario
- Configuración de tema
- Configuración de impresora
- Configuración de IA

**Navegación**:
```typescript
// Subconfiguraciones
router.push('/settings/ai-config')
router.push('/settings/print-config')
router.push('/settings/payment-gateway')

// Cerrar sesión
router.replace('/(auth)/login')
```

## 🔐 PANTALLAS DE AUTENTICACIÓN

### 1. **Login** (`app/(auth)/login.tsx`)
**Ruta**: `/login`
**Funcionalidades**:
- Formulario de login
- Validación de campos
- Manejo de errores
- Navegación a registro/recuperación

**Navegación**:
```typescript
// Login exitoso
router.replace('/(tabs)')

// Ir a registro
router.push('/register')

// Ir a recuperar contraseña
router.push('/forgot-password')
```

### 2. **Register** (`app/(auth)/register.tsx`)
**Ruta**: `/register`
**Funcionalidades**:
- Formulario de registro
- Validación de contraseñas
- Navegación a login

### 3. **Forgot Password** (`app/(auth)/forgot-password.tsx`)
**Ruta**: `/forgot-password`
**Funcionalidades**:
- Formulario de recuperación
- Validación de email
- Pantalla de confirmación

## 🤖 PANTALLAS DE IA

### 1. **Assistant** (`app/assistant/index.tsx`)
**Ruta**: `/assistant`
**Funcionalidades**:
- Chat con asistente IA
- Mensajes simulados
- Limpiar conversación

### 2. **Chat** (`app/chat/index.tsx`)
**Ruta**: `/chat`
**Funcionalidades**:
- Chat IA avanzado
- Sugerencias automáticas
- Configuración de IA

## 📊 PANTALLAS DE REPORTES

### 1. **Reports** (`app/reports/index.tsx`)
**Ruta**: `/reports`
**Funcionalidades**:
- Gráficos de ventas
- Selector de período
- Estadísticas resumidas
- Descarga de reportes

## 🛠️ PANTALLAS DE VENTAS

### 1. **Quick Sale** (`app/sales/quick.tsx`)
**Ruta**: `/sales/quick`
**Funcionalidades**:
- Venta rápida
- Selección de productos
- Cálculo automático

### 2. **TouchPos** (`app/sales/touchpos.tsx`)
**Ruta**: `/sales/touchpos`
**Funcionalidades**:
- Interfaz táctil
- Documentos electrónicos
- Selección de cliente

### 3. **VozPos** (`app/sales/vozpos.tsx`)
**Ruta**: `/sales/vozpos`
**Funcionalidades**:
- Venta por voz
- Reconocimiento de voz
- Procesamiento de comandos

### 4. **Boleta Electrónica** (`app/sales/boleta-electronica.tsx`)
**Ruta**: `/sales/boleta-electronica`
**Funcionalidades**:
- Crear boleta electrónica
- Selección de productos
- Validación de datos

### 5. **Factura Electrónica** (`app/sales/factura-electronica.tsx`)
**Ruta**: `/sales/factura-electronica`
**Funcionalidades**:
- Crear factura electrónica
- Selección de cliente
- Validación de datos

### 6. **Invoice Details** (`app/sales/invoice-details.tsx`)
**Ruta**: `/sales/invoice-details`
**Parámetros**: `id`, `folio`
**Funcionalidades**:
- Detalles del documento
- Información del cliente
- Lista de productos
- Estado del documento

## ⚙️ PANTALLAS DE CONFIGURACIÓN

### 1. **AI Config** (`app/settings/ai-config.tsx`)
**Ruta**: `/settings/ai-config`
**Funcionalidades**:
- Configuración de proveedor IA
- API keys
- Modelos disponibles

### 2. **Print Config** (`app/settings/print-config.tsx`)
**Ruta**: `/settings/print-config`
**Funcionalidades**:
- Configuración de impresora
- Tipo de impresora
- Configuración Bluetooth

### 3. **Payment Gateway** (`app/settings/payment-gateway.tsx`)
**Ruta**: `/settings/payment-gateway`
**Funcionalidades**:
- Configuración de pasarela
- Métodos de pago
- Configuración de API

## 🎯 PATRONES DE NAVEGACIÓN

### 1. **Navegación con Parámetros**
```typescript
// Con parámetros simples
router.push(`/clients/${clientId}`)

// Con múltiples parámetros
router.push({
  pathname: '/sales/invoice-details',
  params: { 
    id: document.id, 
    folio: document.assignedFolio 
  }
})
```

### 2. **Navegación de Reemplazo**
```typescript
// Reemplazar pantalla actual (no agregar al stack)
router.replace('/(tabs)')           // Después del login
router.replace('/(auth)/login')     // Después del logout
```

### 3. **Navegación de Regreso**
```typescript
// Regresar a pantalla anterior
router.back()

// Regresar con callback personalizado
router.back()
```

### 4. **Navegación Condicional**
```typescript
// Navegación basada en estado
if (isAuthenticated) {
  router.replace('/(tabs)')
} else {
  router.replace('/(auth)/login')
}
```

## 🔄 PROTECCIÓN DE RUTAS

### 1. **Verificación de Autenticación**
```typescript
// En componentes que requieren auth
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) {
  return <LoadingScreen />;
}

if (!isAuthenticated) {
  router.replace('/(auth)/login');
  return null;
}
```

### 2. **Verificación de IA Habilitada**
```typescript
// En pantallas de IA
const { aiEnabled } = useTheme();

useEffect(() => {
  if (!aiEnabled) {
    Alert.alert(
      'Asistente IA Desactivado',
      'El asistente IA está desactivado. Por favor actívelo en la configuración.',
      [
        { text: 'Ir a Configuración', onPress: () => router.push('/settings/ai-config') },
        { text: 'Volver', onPress: () => router.back() }
      ]
    );
  }
}, [aiEnabled]);
```

## 📱 ADAPTACIÓN POR PLATAFORMA

### 1. **Headers Responsive**
```typescript
const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
});
```

### 2. **Navegación por Plataforma**
```typescript
// Comportamiento específico por plataforma
if (Platform.OS === 'ios') {
  // Comportamiento iOS
} else {
  // Comportamiento Android
}
```

---

**La navegación está diseñada para ser intuitiva, con flujos claros y protección de rutas apropiada.**
