import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  Star
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { 
  MetricCard, 
  ActionButton,
  Chart
} from '../components';
import { 
  colors, 
  typography, 
  spacing, 
  borders,
  formatCurrency,
  formatDate,
  getTrendColor
} from '../utils/designSystem';
// import { generateClientAnalytics, generateClientSummary, generateTopProducts, generateSalesStatistics, generateTemporalComparisons } from '../services/api';
// import { 
//   getCachedClientAnalytics, 
//   saveClientAnalytics,
//   getCachedClientSummary,
//   saveClientSummary,
//   getCachedTopProducts,
//   saveTopProducts,
//   getCachedSalesStatistics,
//   saveSalesStatistics,
//   getCachedTemporalComparisons,
//   saveTemporalComparisons
// } from '../services/database';

// Datos de ejemplo
const mockClientData = {
  id: 1,
  name: 'FACTURA MOVIL SPA',
  code: '76212889-6',
  email: 'contacto@facturamovil.cl',
  municipality: 'San Antonio',
  activity: 'Desarrollo de Software',
  totalAmount: 50000,
  totalPurchases: 12,
  averagePurchase: 4167,
  lastPurchaseDate: new Date('2025-08-23'),
  growthRate: 25,
  loyaltyScore: 85,
};

// Datos mock para gráficos y análisis
const mockAnalyticsData = {
  overview: {
    totalPurchases: 12,
    totalAmount: 50000,
    averagePurchase: 4167,
    growthRate: 25
  }
};

const mockTopProductsData = {
  products: [
    { name: 'Producto A', quantity: 10, amount: 15000 },
    { name: 'Producto B', quantity: 8, amount: 12000 },
    { name: 'Producto C', quantity: 6, amount: 8000 }
  ]
};

const mockSalesData = {
  monthlySales: [
    { month: 'Ene', totalAmount: 5000, totalPurchases: 2 },
    { month: 'Feb', totalAmount: 7500, totalPurchases: 3 },
    { month: 'Mar', totalAmount: 12000, totalPurchases: 4 },
    { month: 'Abr', totalAmount: 8500, totalPurchases: 2 },
    { month: 'May', totalAmount: 15000, totalPurchases: 1 }
  ]
};

const mockTemporalData = {
  monthToMonth: [
    { period: 'Mes Actual', value: 15000 },
    { period: 'Mes Anterior', value: 12000 },
    { period: 'Mismo Mes Año Pasado', value: 10000 }
  ]
};

export default function ClientProfile() {
  const params = useLocalSearchParams();
  const id = params?.id || params?.id?.[0] || '1'; // Fallback a '1' si no hay ID
  
  const [refreshing, setRefreshing] = useState(false);
  const [client, setClient] = useState(mockClientData);
  const [analytics, setAnalytics] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any>(null);
  const [salesStats, setSalesStats] = useState<any>(null);
  const [temporalComparisons, setTemporalComparisons] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos al montar el componente
  useEffect(() => {
    console.log('ClientProfile useEffect - id:', id, 'type:', typeof id);
    if (id) {
      loadClientData();
    }
  }, [id]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      
      // Validar que id existe y es válido
      if (!id) {
        console.error('No client ID provided, using default');
        // Usar un ID por defecto para evitar errores
        const defaultId = '1';
        console.log('Using default client ID:', defaultId);
        await loadClientDataWithId(defaultId);
        return;
      }
      
      // Convertir a string si es necesario
      const clientIdString = String(id);
      console.log('Loading data for client:', clientIdString);
      
      await loadClientDataWithId(clientIdString);
      
    } catch (error) {
      console.error('Error loading client data:', error);
      // No mostrar alerta para datos mock
    } finally {
      setLoading(false);
    }
  };

  const loadClientDataWithId = async (clientIdString: string) => {
    try {
      // El parámetro id ahora puede ser RUT o ID
      const clientId = Number(clientIdString);
      const isNumericId = !isNaN(clientId);
      
      console.log('Processing client data:', clientIdString, isNumericId ? '(numeric ID)' : '(RUT)');
      
      // TODO: Implementar cuando las APIs estén disponibles
      // Por ahora, usar datos mock personalizados según el ID
      
      const clientNames = {
        1: 'FACTURA MOVIL SPA',
        2: 'AGRICOLA LOS DOS LIMITADA', 
        3: 'CONSTRUCTORA EJEMPLO LTDA'
      };
      
      const clientCodes = {
        1: '76212889-6',
        2: '76071974-9',
        3: '76543210-1'
      };
      
      const clientMunicipalities = {
        1: 'San Antonio',
        2: 'Curicó',
        3: 'Santiago'
      };
      
      const clientActivities = {
        1: 'Desarrollo de Software',
        2: 'Agricultura',
        3: 'Construcción'
      };

      // Personalizar datos según el ID o RUT del cliente
      const clientKey = isNumericId ? clientId : clientIdString;
      setClient({
        ...mockClientData,
        id: isNumericId ? clientId : 0,
        name: clientNames[clientKey] || `Cliente ${clientIdString}`,
        code: clientCodes[clientKey] || clientIdString, // Usar el RUT como code
        municipality: clientMunicipalities[clientKey] || 'N/A',
        activity: clientActivities[clientKey] || 'N/A',
      });

      // TODO: Implementar llamadas reales cuando las APIs estén disponibles
      // Por ahora, usar datos mock
      setAnalytics(mockAnalyticsData);
      setTopProducts(mockTopProductsData);
      setSalesStats(mockSalesData);
      setTemporalComparisons(mockTemporalData);
      
      // TODO: Descomentar cuando las APIs estén listas
      // const analytics = await generateClientAnalytics(id);
      // const summary = await generateClientSummary(id);
      // const topProducts = await generateTopProducts(id);
      // const salesStats = await generateSalesStatistics(id);
      // const temporalComparisons = await generateTemporalComparisons(id);
      // 
      // setAnalytics(analytics);
      // setTopProducts(topProducts);
      // setSalesStats(salesStats);
      // setTemporalComparisons(temporalComparisons);

    } catch (error) {
      console.error('Error loading client data:', error);
      // No mostrar alerta para datos mock
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadClientData();
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{client.name}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Resumen Ejecutivo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen Ejecutivo</Text>
        
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientCode}>{client.code}</Text>
          <Text style={styles.clientEmail}>{client.email}</Text>
          <Text style={styles.clientLocation}>{client.municipality}</Text>
          <Text style={styles.clientActivity}>{client.activity}</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <MetricCard
              title="Total Ventas"
              value={client.totalAmount}
              change={client.growthRate}
              trend="up"
              icon={<DollarSign size={24} color={colors.success} />}
              color={colors.success}
              format="currency"
            />
          </View>
          <View style={styles.metricCard}>
            <MetricCard
              title="Promedio por Compra"
              value={client.averagePurchase}
              change={-2.1}
              trend="down"
              icon={<ShoppingCart size={24} color={colors.warning} />}
              color={colors.warning}
              format="currency"
            />
          </View>
          <View style={styles.metricCard}>
            <MetricCard
              title="Crecimiento Mensual"
              value={client.growthRate}
              change={3.2}
              trend="up"
              icon={<TrendingUp size={24} color={colors.info} />}
              color={colors.info}
              format="percentage"
            />
          </View>
          <View style={styles.metricCard}>
            <MetricCard
              title="Fidelidad"
              value={client.loyaltyScore}
              change={5.5}
              trend="up"
              icon={<Star size={24} color={colors.accent} />}
              color={colors.accent}
              format="percentage"
            />
          </View>
        </View>
      </View>

      {/* Gráficos y análisis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de Ventas</Text>
        {salesStats ? (
          <Chart
            type="line"
            data={salesStats.monthlySales.map((month: any) => ({
              label: month.month,
              value: month.totalAmount,
              purchases: month.totalPurchases
            }))}
            options={{
              title: 'Ventas Mensuales',
              height: 200,
              showLegend: true
            }}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Cargando gráfico de ventas...</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Productos Más Comprados</Text>
        {topProducts ? (
          <Chart
            type="bar"
            data={topProducts.byAmount.slice(0, 5).map((product: any) => ({
              label: product.productName,
              value: product.totalAmount,
              percentage: product.percentage
            }))}
            options={{
              title: 'Top 5 Productos por Monto',
              height: 200,
              showLegend: true
            }}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Cargando análisis de productos...</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comparaciones Temporales</Text>
        {temporalComparisons ? (
          <Chart
            type="area"
            data={temporalComparisons.monthOverMonth.map((comparison: any) => ({
              label: comparison.currentMonth,
              current: comparison.currentAmount,
              previous: comparison.previousAmount,
              growth: comparison.growthPercentage
            }))}
            options={{
              title: 'Comparación Mes a Mes',
              height: 200,
              showLegend: true
            }}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Cargando comparaciones...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.textDisabled,
  },
  
  backButton: {
    padding: spacing.xs,
  },
  
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  
  headerSpacer: {
    width: 40,
  },
  
  section: {
    padding: spacing.md,
  },
  
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  
  clientInfo: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  clientName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  clientCode: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  
  clientEmail: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  
  clientLocation: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  
  clientActivity: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  metricCard: {
    width: '48%',
    marginBottom: spacing.md,
  },
  
  placeholder: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  placeholderText: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
