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
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  MapPin,
  Briefcase,
  Calendar,
  Star
} from 'lucide-react-native';
import { router } from 'expo-router';

import { 
  MetricCard, 
  ActionButton, 
  SearchableList 
} from './components';
import { 
  colors, 
  typography, 
  spacing, 
  borders,
  layoutStyles,
  formatCurrency,
  formatNumber,
  formatDate,
  getTrendColor
} from './utils/designSystem';
import { getClients, generateTopClients, generateBusinessMetrics } from './services/api';
import { 
  getCachedClients, 
  saveClients, 
  getCachedTopClients, 
  saveTopClients,
  getCachedBusinessMetrics,
  saveBusinessMetrics,
  isCacheExpired
} from './services/database';

// Datos de ejemplo para demostración
const mockGlobalMetrics = [
  {
    title: 'Total Clientes',
    value: 1234,
    change: 15,
    trend: 'up' as const,
    icon: <Users size={24} color={colors.primary} />,
    color: colors.primary,
    format: 'number' as const,
  },
  {
    title: 'Ingresos Totales',
    value: 12345678,
    change: 8.5,
    trend: 'up' as const,
    icon: <DollarSign size={24} color={colors.success} />,
    color: colors.success,
    format: 'currency' as const,
  },
  {
    title: 'Promedio por Cliente',
    value: 9876,
    change: -2.1,
    trend: 'down' as const,
    icon: <TrendingUp size={24} color={colors.warning} />,
    color: colors.warning,
    format: 'currency' as const,
  },
  {
    title: 'Crecimiento',
    value: 12.5,
    change: 3.2,
    trend: 'up' as const,
    icon: <TrendingUp size={24} color={colors.info} />,
    color: colors.info,
    format: 'percentage' as const,
  },
];

const mockTopClients = [
  {
    id: 1,
    name: 'FACTURA MOVIL SPA',
    code: '76212889-6',
    municipality: 'San Antonio',
    activity: 'Desarrollo de Software',
    totalAmount: 50000,
    totalPurchases: 12,
    lastPurchaseDate: new Date('2025-08-23'),
    growth: 25,
    topProduct: 'Wisky',
  },
  {
    id: 2,
    name: 'AGRICOLA LOS DOS LIMITADA',
    code: '76071974-9',
    municipality: 'Curico',
    activity: 'Agricultura',
    totalAmount: 45000,
    totalPurchases: 8,
    lastPurchaseDate: new Date('2025-08-22'),
    growth: 12,
    topProduct: 'Fertilizante',
  },
  {
    id: 3,
    name: 'CONSTRUCTORA EJEMPLO LTDA',
    code: '76543210-1',
    municipality: 'Santiago',
    activity: 'Construcción',
    totalAmount: 40000,
    totalPurchases: 15,
    lastPurchaseDate: new Date('2025-08-21'),
    growth: 18,
    topProduct: 'Cemento',
  },
];

export default function ClientAnalyticsDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [clients, setClients] = useState(mockTopClients);
  const [globalMetrics, setGlobalMetrics] = useState(mockGlobalMetrics);
  const [topClients, setTopClients] = useState(mockTopClients);
  const [loading, setLoading] = useState(true);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Verificar si necesitamos refrescar datos
      const cacheExpired = await isCacheExpired(24); // 24 horas
      
      if (forceRefresh || cacheExpired) {
        await loadFromAPI();
      } else {
        await loadFromCache();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos. Verificando caché...');
      await loadFromCache();
    } finally {
      setLoading(false);
    }
  };

  const loadFromAPI = async () => {
    try {
      // Cargar clientes
      const clientsData = await getClients();
      const clientsList = clientsData.clients || [];
      setClients(clientsList);
      await saveClients(clientsList);

      // Cargar métricas de negocio
      const businessMetrics = await generateBusinessMetrics();
      const metrics = [
        {
          title: 'Total Clientes',
          value: businessMetrics.overview.totalClients,
          change: 15,
          trend: 'up' as const,
          icon: <Users size={24} color={colors.primary} />,
          color: colors.primary,
          format: 'number' as const,
        },
        {
          title: 'Ingresos Totales',
          value: businessMetrics.overview.totalRevenue,
          change: 8.5,
          trend: 'up' as const,
          icon: <DollarSign size={24} color={colors.success} />,
          color: colors.success,
          format: 'currency' as const,
        },
        {
          title: 'Promedio por Cliente',
          value: businessMetrics.overview.averageRevenuePerClient,
          change: -2.1,
          trend: 'down' as const,
          icon: <TrendingUp size={24} color={colors.warning} />,
          color: colors.warning,
          format: 'currency' as const,
        },
        {
          title: 'Crecimiento',
          value: 12.5,
          change: 3.2,
          trend: 'up' as const,
          icon: <TrendingUp size={24} color={colors.info} />,
          color: colors.info,
          format: 'percentage' as const,
        },
      ];
      setGlobalMetrics(metrics);
      await saveBusinessMetrics(businessMetrics);

      // Cargar top clientes
      const topClientsData = await generateTopClients();
      const topClientsList = topClientsData.byTotalAmount.slice(0, 3).map(client => ({
        id: client.clientId,
        name: client.clientName,
        code: 'N/A', // Se puede obtener del cliente original
        municipality: 'N/A',
        activity: 'N/A',
        totalAmount: client.totalAmount,
        totalPurchases: client.totalPurchases,
        lastPurchaseDate: client.lastPurchase,
        growth: client.growthRate,
        topProduct: 'N/A',
      }));
      setTopClients(topClientsList);
      await saveTopClients(topClientsData);

    } catch (error) {
      console.error('Error loading from API:', error);
      throw error;
    }
  };

  const loadFromCache = async () => {
    try {
      // Cargar clientes del caché
      const cachedClients = await getCachedClients();
      if (cachedClients.length > 0) {
        setClients(cachedClients);
      }

      // Cargar métricas del caché
      const cachedMetrics = await getCachedBusinessMetrics();
      if (cachedMetrics) {
        const metrics = [
          {
            title: 'Total Clientes',
            value: cachedMetrics.overview.totalClients,
            change: 15,
            trend: 'up' as const,
            icon: <Users size={24} color={colors.primary} />,
            color: colors.primary,
            format: 'number' as const,
          },
          {
            title: 'Ingresos Totales',
            value: cachedMetrics.overview.totalRevenue,
            change: 8.5,
            trend: 'up' as const,
            icon: <DollarSign size={24} color={colors.success} />,
            color: colors.success,
            format: 'currency' as const,
          },
          {
            title: 'Promedio por Cliente',
            value: cachedMetrics.overview.averageRevenuePerClient,
            change: -2.1,
            trend: 'down' as const,
            icon: <TrendingUp size={24} color={colors.warning} />,
            color: colors.warning,
            format: 'currency' as const,
          },
          {
            title: 'Crecimiento',
            value: 12.5,
            change: 3.2,
            trend: 'up' as const,
            icon: <TrendingUp size={24} color={colors.info} />,
            color: colors.info,
            format: 'percentage' as const,
          },
        ];
        setGlobalMetrics(metrics);
      }

      // Cargar top clientes del caché
      const cachedTopClients = await getCachedTopClients();
      if (cachedTopClients) {
        const topClientsList = cachedTopClients.byTotalAmount.slice(0, 3).map(client => ({
          id: client.clientId,
          name: client.clientName,
          code: 'N/A',
          municipality: 'N/A',
          activity: 'N/A',
          totalAmount: client.totalAmount,
          totalPurchases: client.totalPurchases,
          lastPurchaseDate: client.lastPurchase,
          growth: client.growthRate,
          topProduct: 'N/A',
        }));
        setTopClients(topClientsList);
      }

    } catch (error) {
      console.error('Error loading from cache:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(true); // Forzar refresco
    setRefreshing(false);
  };

  const handleClientPress = (client: any) => {
    router.push(`/client-analytics/profile/${client.id}`);
  };

  const handleNewClient = () => {
    router.push('/client-analytics/new-client');
  };

  const renderClientCard = (client: any) => (
    <View style={styles.clientCard}>
      <View style={styles.clientHeader}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientCode}>{client.code}</Text>
        </View>
        <View style={styles.clientLocation}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.locationText}>{client.municipality}</Text>
        </View>
      </View>
      
      <View style={styles.clientDetails}>
        <View style={styles.detailRow}>
          <Briefcase size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{client.activity}</Text>
        </View>
        
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{formatCurrency(client.totalAmount)}</Text>
            <Text style={styles.metricLabel}>Total</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{client.totalPurchases}</Text>
            <Text style={styles.metricLabel}>Compras</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{formatDate(client.lastPurchaseDate)}</Text>
            <Text style={styles.metricLabel}>Última</Text>
          </View>
        </View>
        
        <View style={styles.growthRow}>
          <View style={[styles.growthBadge, { backgroundColor: `${getTrendColor('up')}15` }]}>
            <TrendingUp size={14} color={getTrendColor('up')} />
            <Text style={[styles.growthText, { color: getTrendColor('up') }]}>
              +{client.growth}%
            </Text>
          </View>
          <View style={styles.topProduct}>
            <Star size={14} color={colors.accent} />
            <Text style={styles.topProductText}>{client.topProduct}</Text>
          </View>
        </View>
      </View>
    </View>
  );

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
        <View style={styles.headerContent}>
          <Text style={styles.title}>Análisis de Clientes</Text>
          <ActionButton
            title="Nuevo Cliente"
            icon={<Plus size={20} color={colors.surface} />}
            variant="primary"
            size="small"
            onPress={handleNewClient}
          />
        </View>
      </View>

      {/* Métricas Globales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Métricas Globales</Text>
        <View style={styles.metricsGrid}>
          {globalMetrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <MetricCard {...metric} />
            </View>
          ))}
        </View>
      </View>

      {/* Top Clientes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Clientes</Text>
        <View style={styles.topClientsContainer}>
          {topClients.map((client) => (
            <TouchableOpacity
              key={client.id}
              style={styles.clientCardContainer}
              onPress={() => handleClientPress(client)}
              activeOpacity={0.7}
            >
              {renderClientCard(client)}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lista de Clientes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Todos los Clientes</Text>
        <SearchableList
          data={clients}
          searchPlaceholder="Buscar por RUT o nombre..."
          renderItem={renderClientCard}
          onItemPress={handleClientPress}
          onRefresh={handleRefresh}
          emptyMessage="No se encontraron clientes"
        />
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
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.textDisabled,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  
  section: {
    padding: spacing.md,
  },
  
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
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
  
  topClientsContainer: {
    gap: spacing.md,
  },
  
  clientCardContainer: {
    marginBottom: spacing.sm,
  },
  
  clientCard: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  
  clientInfo: {
    flex: 1,
  },
  
  clientName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  clientCode: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  
  clientLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  locationText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  
  clientDetails: {
    gap: spacing.sm,
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  detailText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  metric: {
    alignItems: 'center',
  },
  
  metricValue: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  
  growthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borders.radius.sm,
  },
  
  growthText: {
    ...typography.caption,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  
  topProduct: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  topProductText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
});
