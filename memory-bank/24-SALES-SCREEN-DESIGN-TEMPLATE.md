# 🎨 PLANTILLA DE DISEÑO - PANTALLA DE VENTAS

## 📋 INFORMACIÓN GENERAL

**Archivo Analizado**: `app/(tabs)/sales/index.tsx`  
**Fecha de Análisis**: Diciembre 2024  
**Versión**: 1.0  
**Estado**: Implementado y Funcional  

---

## 🎯 OBJETIVO DEL DOCUMENTO

Este documento proporciona una guía completa y profesional para implementar la plantilla de diseño de la pantalla de ventas, incluyendo todos los componentes, colores, layout y patrones de interacción. Sirve como referencia para mantener consistencia visual en toda la aplicación.

---

## 🎨 ESQUEMA DE COLORES CORPORATIVO

### 🎨 **Paleta de Colores Principal**

```typescript
const CORPORATE_COLORS = {
  // Colores Base
  background: {
    primary: '#f9f9f9',    // Fondo principal (Gris muy claro)
    secondary: '#fff',     // Fondo de tarjetas (Blanco puro)
    card: '#fff',          // Fondo de componentes
  },
  
  // Color Corporativo Principal
  primary: '#0066CC',      // Azul corporativo principal
  
  // Colores de Texto
  text: {
    primary: '#333',       // Texto principal (Gris oscuro)
    secondary: '#666',     // Texto secundario (Gris medio)
    tertiary: '#999',      // Texto terciario (Gris claro)
    action: '#0066CC',     // Texto de acción (Azul)
    white: '#FFFFFF',      // Texto blanco
  },
  
  // Colores de Estado
  status: {
    success: '#4CAF50',    // Verde - Aceptado/Éxito
    warning: '#FF9800',    // Naranja - Pendiente
    error: '#FF3B30',      // Rojo - Error
    errorDark: '#D32F2F',  // Rojo oscuro - Advertencia
  },
  
  // Colores de Opciones de Venta
  salesOptions: {
    quick: '#1E40AF',      // Azul oscuro
    vozpos: '#2D3748',     // Gris muy oscuro
    visionpos: '#4CAF50',  // Verde
    touchpos: '#FF9800',   // Naranja
  },
  
  // Colores de Separadores
  borders: {
    light: '#f0f0f0',      // Separadores sutiles
    medium: '#e0e0e0',     // Separadores medios
  }
};
```

### 🎨 **Uso de Colores por Contexto**

| Contexto | Color Principal | Color Secundario | Color de Texto |
|----------|----------------|------------------|----------------|
| Header | `#fff` | `#f0f0f0` (borde) | `#333` |
| Tarjetas | `#fff` | `#f9f9f9` (sombra) | `#333` |
| Estados | Variable | Variable | `#fff` |
| Acciones | `#0066CC` | `#fff` | `#fff` |

---

## 📐 SISTEMA DE LAYOUT

### 🏗️ **Estructura Principal**

```typescript
const LAYOUT_STRUCTURE = {
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  
  // Header principal
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  // Sección de opciones de venta
  salesOptions: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 20,
    marginBottom: 10,
  },
  
  // Sección de contenido principal
  content: {
    flex: 1,
    backgroundColor: '#fff',
  }
};
```

### 📏 **Sistema de Espaciado**

```typescript
const SPACING_SYSTEM = {
  // Espaciado horizontal
  horizontal: {
    small: 10,
    medium: 15,
    large: 20,
    xlarge: 25,
  },
  
  // Espaciado vertical
  vertical: {
    small: 8,
    medium: 12,
    large: 15,
    xlarge: 20,
  },
  
  // Padding de componentes
  padding: {
    card: 15,
    button: 12,
    input: 10,
  },
  
  // Márgenes entre elementos
  margin: {
    card: 15,
    section: 10,
    element: 8,
  }
};
```

### 🔄 **Patrones de Layout**

#### **1. Header Pattern**
```typescript
const headerPattern = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButton: {
    padding: 8,
  }
};
```

#### **2. Card Pattern**
```typescript
const cardPattern = {
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  content: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  }
};
```

---

## 🎯 COMPONENTES DE DISEÑO

### 📱 **Opciones de Venta (Quick, VozPos, VisionPos, TouchPos)**

#### **Configuración de Opciones**
```typescript
const SALES_OPTIONS_CONFIG = [
  {
    id: 'quick',
    title: "Quick",
    icon: 'Zap',
    bgColor: "#1E40AF",
    route: "/sales/quick",
    description: "Procesamiento rápido",
    iconSize: 32,
    iconColor: "#FFFFFF"
  },
  {
    id: 'vozpos',
    title: "VozPos",
    icon: 'Mic',
    bgColor: "#2D3748",
    route: "/sales/vozpos",
    description: "Ventas por voz",
    iconSize: 32,
    iconColor: "#FFFFFF"
  },
  {
    id: 'visionpos',
    title: "VisionPos",
    icon: 'Camera',
    bgColor: "#4CAF50",
    route: "/sales/visionpos",
    description: "Escaneo de documentos",
    iconSize: 32,
    iconColor: "#FFFFFF"
  },
  {
    id: 'touchpos',
    title: "TouchPos",
    icon: 'CreditCard',
    bgColor: "#FF9800",
    route: "/sales/touchpos",
    description: "Documentos electrónicos",
    iconSize: 32,
    iconColor: "#FFFFFF"
  }
];
```

#### **Estilos de Opciones**
```typescript
const salesOptionsStyles = {
  container: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 20,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  card: {
    width: 150,
    marginRight: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 15,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  }
};
```

#### **Implementación JSX**
```typescript
const SalesOptionsSection = () => (
  <View style={styles.salesOptionsContainer}>
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.salesOptionsContent}
    >
      {SALES_OPTIONS_CONFIG.map((option, index) => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionCard}
          onPress={() => router.push(option.route)}
        >
          <View style={[
            styles.optionIconContainer, 
            { backgroundColor: option.bgColor }
          ]}>
            <option.icon size={option.iconSize} color={option.iconColor} />
          </View>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);
```

### 📄 **Tarjetas de Documentos**

#### **Estructura de Datos**
```typescript
interface DocumentCardData {
  id: number;
  type: string;
  assignedFolio: string;
  date: string;
  state: string[];
  client: {
    name: string;
    rut: string;
  };
  total: number;
}
```

#### **Estilos de Tarjetas**
```typescript
const documentCardStyles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentType: {
    flex: 1,
    marginRight: 10,
  },
  documentTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  documentFolio: {
    fontSize: 14,
    color: '#666',
  },
  documentTypeDetail: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAccepted: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextAccepted: {
    color: '#4CAF50',
  },
  statusTextPending: {
    color: '#FF9800',
  },
  clientInfo: {
    marginBottom: 12,
  },
  clientName: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  clientRut: {
    fontSize: 13,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  documentDate: {
    fontSize: 13,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 5,
  }
};
```

#### **Implementación JSX**
```typescript
const DocumentCard = ({ item }: { item: DocumentCardData }) => (
  <TouchableOpacity 
    style={styles.documentCard} 
    onPress={() => handleDocumentPress(item)}
  >
    <View style={styles.documentHeader}>
      <View style={styles.documentType}>
        <Text style={styles.documentTypeText}>{item.type || 'Documento'}</Text>
        <Text style={styles.documentFolio}>N° {item.assignedFolio}</Text>
        {item.type && item.type !== 'Documento' && (
          <Text style={styles.documentTypeDetail}>
            {item.type === 'FACTURA' ? 'Electrónica' : 
             item.type === 'FACTURA_EXENTA' ? 'Exenta' :
             item.type === 'FACTURA_NO_AFECTA' ? 'No Afecta' :
             item.type}
          </Text>
        )}
      </View>
      <View style={[
        styles.statusBadge,
        item.state[0] === 'ACCEPTED' ? styles.statusAccepted : styles.statusPending
      ]}>
        {item.state[0] === 'ACCEPTED' ? (
          <Check size={16} color="#4CAF50" style={styles.statusIcon} />
        ) : (
          <AlertCircle size={16} color="#FF9800" style={styles.statusIcon} />
        )}
        <Text style={[
          styles.statusText,
          item.state[0] === 'ACCEPTED' ? styles.statusTextAccepted : styles.statusTextPending
        ]}>
          {item.state[1] || 'Pendiente'}
        </Text>
      </View>
    </View>

    <View style={styles.clientInfo}>
      <Text style={styles.clientName}>{item.client.name || 'Cliente sin nombre'}</Text>
      <Text style={styles.clientRut}>RUT: {item.client.rut || 'Sin RUT'}</Text>
    </View>

    <View style={styles.documentFooter}>
      <Text style={styles.documentDate}>{formatDate(item.date)}</Text>
      <View style={styles.actionsContainer}>
        <Text style={styles.amountText}>{formatAmount(item.total)}</Text>
        <View style={styles.actionButtons}>
          <FileText size={18} color="#0066CC" style={styles.actionIcon} />
          <ChevronRight size={20} color="#999" />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);
```

---

## 🔤 SISTEMA DE TIPOGRAFÍA

### 📝 **Escala Tipográfica**

```typescript
const TYPOGRAPHY_SYSTEM = {
  // Títulos
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 24,
  },
  
  // Texto de cuerpo
  body: {
    large: {
      fontSize: 16,
      fontWeight: 'normal',
      color: '#333',
      lineHeight: 24,
    },
    medium: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#666',
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: 'normal',
      color: '#999',
      lineHeight: 16,
    },
  },
  
  // Texto de acción
  action: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
    lineHeight: 24,
  },
  
  // Texto de estado
  status: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  }
};
```

### 🎨 **Uso por Contexto**

| Contexto | Tamaño | Peso | Color |
|----------|--------|------|-------|
| Títulos principales | 24px | Bold | `#333` |
| Títulos de sección | 18px | Bold | `#333` |
| Títulos de tarjetas | 16px | Bold | `#333` |
| Texto de cuerpo | 14px | Normal | `#666` |
| Texto secundario | 12px | Normal | `#999` |
| Texto de acción | 16px | Bold | `#0066CC` |

---

## 🔄 ESTADOS Y INTERACCIONES

### 📱 **Estados de Carga**

#### **Loading State**
```typescript
const loadingStyles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  spinner: {
    color: '#0066CC',
  }
};
```

#### **Error State**
```typescript
const errorStyles = {
  banner: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFCDD2',
  },
  bannerText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 15,
    color: '#FF3B30',
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
};
```

#### **Empty State**
```typescript
const emptyStyles = {
  container: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
};
```

### 🎯 **Interacciones**

#### **Pull to Refresh**
```typescript
const refreshControlProps = {
  refreshing: refreshing,
  onRefresh: onRefresh,
  colors: ['#0066CC'],
  tintColor: "#0066CC"
};
```

#### **Touch Feedback**
```typescript
const touchableProps = {
  activeOpacity: 0.7,
  underlayColor: 'rgba(0, 102, 204, 0.1)',
};
```

---

## 🎨 PLANTILLA COMPLETA DE IMPLEMENTACIÓN

### 📋 **Template Base**

```typescript
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Check, 
  CircleAlert as AlertCircle, 
  ChevronRight, 
  FileText, 
  Zap, 
  Mic, 
  Camera, 
  CreditCard, 
  CirclePlus as PlusCircle 
} from 'lucide-react-native';
import { api, Document } from '../../../services/api';

// Configuración de opciones de venta
const SALES_OPTIONS_CONFIG = [
  {
    id: 'quick',
    title: "Quick",
    icon: Zap,
    bgColor: "#1E40AF",
    route: "/sales/quick",
    description: "Procesamiento rápido"
  },
  {
    id: 'vozpos',
    title: "VozPos",
    icon: Mic,
    bgColor: "#2D3748",
    route: "/sales/vozpos",
    description: "Ventas por voz"
  },
  {
    id: 'visionpos',
    title: "VisionPos",
    icon: Camera,
    bgColor: "#4CAF50",
    route: "/sales/visionpos",
    description: "Escaneo de documentos"
  },
  {
    id: 'touchpos',
    title: "TouchPos",
    icon: CreditCard,
    bgColor: "#FF9800",
    route: "/sales/touchpos",
    description: "Documentos electrónicos"
  }
];

export default function SalesScreen() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funciones de utilidad
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatAmount = (amount: number) => {
    if (amount === undefined || amount === null) return '';
    try {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(amount);
    } catch (e) {
      return amount.toString();
    }
  };

  // Renderizado de componentes
  const renderSalesOption = ({ item }: { item: typeof SALES_OPTIONS_CONFIG[0] }) => (
    <TouchableOpacity
      style={styles.optionCard}
      onPress={() => router.push(item.route)}
    >
      <View style={[styles.optionIconContainer, { backgroundColor: item.bgColor }]}>
        <item.icon size={32} color="#FFFFFF" />
      </View>
      <Text style={styles.optionTitle}>{item.title}</Text>
      <Text style={styles.optionDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderDocument = ({ item }: { item: Document }) => (
    <TouchableOpacity 
      style={styles.documentCard} 
      onPress={() => router.push(`/sales/invoice-details?id=${item.id}&folio=${item.assignedFolio}`)}
    >
      {/* Implementación del documento */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ventas</Text>
        <TouchableOpacity 
          style={styles.newSaleButton}
          onPress={() => router.push('/sales/new')}
        >
          <PlusCircle size={22} color="#0066CC" />
        </TouchableOpacity>
      </View>
      
      {/* Opciones de Venta */}
      <View style={styles.salesOptionsContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.salesOptionsContent}
        >
          {SALES_OPTIONS_CONFIG.map((option) => renderSalesOption({ item: option }))}
        </ScrollView>
      </View>
      
      {/* Lista de Documentos */}
      <View style={styles.recentSalesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimas Ventas</Text>
          <TouchableOpacity onPress={() => router.push('/sales/history')}>
            <Text style={styles.viewAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={documents}
          renderItem={renderDocument}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0066CC']}
              tintColor="#0066CC"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay ventas registradas</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
```

### 🎨 **Estilos Completos**

```typescript
const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  newSaleButton: {
    padding: 8,
  },
  
  // Opciones de venta
  salesOptionsContainer: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 20,
    marginBottom: 10,
  },
  salesOptionsContent: {
    paddingHorizontal: 15,
  },
  optionCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 15,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  optionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  
  // Contenido principal
  recentSalesContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#0066CC',
  },
  
  // Lista
  listContainer: {
    padding: 20,
  },
  
  // Tarjetas de documentos
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentType: {
    flex: 1,
    marginRight: 10,
  },
  documentTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  documentFolio: {
    fontSize: 14,
    color: '#666',
  },
  documentTypeDetail: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAccepted: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextAccepted: {
    color: '#4CAF50',
  },
  statusTextPending: {
    color: '#FF9800',
  },
  clientInfo: {
    marginBottom: 12,
  },
  clientName: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  clientRut: {
    fontSize: 13,
    color: '#666',
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  documentDate: {
    fontSize: 13,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 5,
  },
  
  // Estados
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFCDD2',
  },
  errorBannerText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    marginBottom: 15,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### ✅ **Elementos Requeridos**

- [ ] **Header con título y botón de acción**
- [ ] **Sección de opciones de venta (Quick, VozPos, VisionPos, TouchPos)**
- [ ] **Lista de documentos con pull-to-refresh**
- [ ] **Estados de carga, error y vacío**
- [ ] **Navegación a detalles de documentos**
- [ ] **Formateo de fechas y montos**
- [ ] **Badges de estado (Aceptado/Pendiente)**

### 🎨 **Elementos de Diseño**

- [ ] **Colores corporativos aplicados**
- [ ] **Tipografía consistente**
- [ ] **Espaciado uniforme**
- [ ] **Sombras y elevación**
- [ ] **Border radius consistente**
- [ ] **Iconos apropiados**

### 🔧 **Funcionalidades**

- [ ] **API integration**
- [ ] **Error handling**
- [ ] **Loading states**
- [ ] **Navigation**
- [ ] **Data formatting**
- [ ] **Pull to refresh**

---

## 📚 REFERENCIAS

- **Archivo Original**: `app/(tabs)/sales/index.tsx`
- **API Service**: `services/api.ts`
- **Iconos**: `lucide-react-native`
- **Navegación**: `expo-router`

---

## 🔄 VERSIONES

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Diciembre 2024 | Documento inicial con análisis completo |

---

**Nota**: Este documento debe mantenerse actualizado con cualquier cambio en el diseño o implementación de la pantalla de ventas.
