import React, { lazy, Suspense, useCallback, memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, Camera, TrendingUp, Package, Users, Settings, CreditCard, Mic, Zap } from 'lucide-react-native';
import { api, Document } from '../../services/api';

// Lazy load the StatCard component with better chunking
const StatCard = lazy(() => import('../../components/StatCard'));

// Optimized placeholder with memo to prevent unnecessary re-renders
const StatCardFallback = memo(({ title }: { title: string }) => (
  <View style={styles.statCardPlaceholder}>
    <ActivityIndicator size="small" color="#0066CC" />
    <Text style={styles.statCardPlaceholderText}>{title}</Text>
  </View>
));

// Memo-ized RecentDocumentsSection to prevent unnecessary re-renders
const RecentDocumentsSection = memo(({ documents, router, loading }: any) => {
  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documentos Recientes</Text>
        <View style={styles.documentsList}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Cargando documentos...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documentos Recientes</Text>
        <View style={styles.documentsList}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay documentos recientes</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Documentos Recientes</Text>
      <View style={styles.documentsList}>
        {documents.slice(0, 3).map((document: Document, index: number) => (
          <TouchableOpacity 
            key={document.id}
            style={styles.documentItem}
            onPress={() => router.push({
              pathname: '/sales/invoice-details',
              params: { 
                id: document.id.toString(),
                folio: document.assignedFolio,
                type: document.type
              }
            })}
          >
            <View style={styles.documentIcon}>
              <FileText size={24} color="#0066CC" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>
                {document.type === 'FACTURA' ? 'Factura' : 
                 document.type === 'BOLETA' ? 'Boleta' :
                 document.type === 'NOTE' ? 'Nota de Crédito' :
                 document.type === 'WAYBILL' ? 'Guía de Despacho' :
                 document.type} N° {document.assignedFolio}
              </Text>
              <Text style={styles.documentMeta}>{document.client?.name || 'Cliente sin nombre'}</Text>
            </View>
            <Text style={styles.documentAmount}>
              S/ {document.total?.toFixed(2) || '0.00'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

// Optimized action card component
const ActionCard = memo(({ title, description, icon, bgColor, onPress }: any) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
      {icon}
    </View>
    <Text style={styles.actionTitle}>{title}</Text>
    <Text style={styles.actionDescription}>{description}</Text>
  </TouchableOpacity>
));

function HomeScreen() {
  const router = useRouter();
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar documentos recientes
  const loadRecentDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const documents = await api.getSales();
      setRecentDocuments(documents);
    } catch (err: any) {
      console.error('Error loading recent documents:', err);
      setError(err.message || 'Error al cargar documentos recientes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar documentos al montar el componente
  useEffect(() => {
    loadRecentDocuments();
  }, [loadRecentDocuments]);

  // Memoize navigation actions for better performance
  const navigate = useCallback((route: string) => () => {
    router.push(route);
  }, [router]);

  // Actions data with stable reference
  const actions = React.useMemo(() => [
    {
      title: "VozPos",
      description: "Próximamente - Emitir documentos por voz",
      icon: <Mic size={32} color="#FFFFFF" />,
      bgColor: "#2D3748",
      route: "/sales/vozpos"
    },
    {
      title: "Quick",
      description: "Procesamiento rápido de ventas",
      icon: <Zap size={32} color="#FFFFFF" />,
      bgColor: "#1E40AF",
      route: "/quick"
    },
    {
      title: "ViewPos",
      description: "Próximamente - Captura de productos con IA",
      icon: <Camera size={32} color="#4CAF50" />,
      bgColor: "#E8F5E9",
      route: "/sales/viewpos"
    },
    {
      title: "TouchPos",
      description: "Documentos electrónicos",
      icon: <CreditCard size={32} color="#FF9800" />,
      bgColor: "#FFF3E0",
      route: "/sales/touchpos"
    }
  ], []);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Buen día!</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>
        <Image
          source={{ 
            uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' 
          }}
          style={styles.avatar}
          width={50} 
          height={50}
        />
      </View>

      {/* Stats Section - with optimized lazy loading */}
      <View style={styles.statsContainer}>
        <Suspense fallback={<StatCardFallback title="Ventas del Día" />}>
          <StatCard
            title="Ventas del Día"
            value="S/ 2,580.00"
            trend={+12.5}
            icon={<TrendingUp size={24} color="#0066CC" />}
          />
        </Suspense>
        <Suspense fallback={<StatCardFallback title="Productos" />}>
          <StatCard
            title="Productos"
            value="145"
            trend={-2.3}
            icon={<Package size={24} color="#4CAF50" />}
          />
        </Suspense>
        <Suspense fallback={<StatCardFallback title="Clientes" />}>
          <StatCard
            title="Clientes"
            value="48"
            trend={+5.7}
            icon={<Users size={24} color="#9C27B0" />}
          />
        </Suspense>
      </View>

      {/* Quick Actions Section - using optimized components */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          {actions.map((action, index) => (
            <ActionCard 
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              bgColor={action.bgColor}
              onPress={navigate(action.route)}
            />
          ))}
        </View>
      </View>

      {/* Recent Documents Section - Lazy loaded and memoized */}
      <RecentDocumentsSection documents={recentDocuments} router={router} loading={loading} />
    </ScrollView>
  );
}

export default memo(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  statCardPlaceholder: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardPlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    // Reemplazado estilos de sombra con boxShadow
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  documentsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    // Reemplazado estilos de sombra con boxShadow
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  documentMeta: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  documentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 120,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 120,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});