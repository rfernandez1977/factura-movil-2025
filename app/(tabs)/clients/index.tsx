import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList, 
  TouchableOpacity, 
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Search, 
  ListFilter as Filter, 
  Plus, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Mail, 
  Briefcase, 
  X,
  Upload,
  Download,
  Users,
  FileText,
  Zap,
  Mic,
  Camera,
  CreditCard
} from 'lucide-react-native';
import { api, Client } from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';

// Configuración de opciones de acción para clientes
const CLIENT_ACTIONS_CONFIG = [
  {
    id: 'search',
    title: "Búsqueda",
    icon: Search,
    bgColor: "#1E40AF",
    description: "Buscar clientes",
    action: 'search'
  },
  {
    id: 'filter',
    title: "Filtros",
    icon: Filter,
    bgColor: "#2D3748",
    description: "Filtrar por tipo",
    action: 'filter'
  },
  {
    id: 'import',
    title: "Importar",
    icon: Upload,
    bgColor: "#4CAF50",
    description: "Importar clientes",
    action: 'import'
  },
  {
    id: 'export',
    title: "Exportar",
    icon: Download,
    bgColor: "#FF9800",
    description: "Exportar lista",
    action: 'export'
  }
];

// Configuración de opciones de venta (misma que en sales)
const SALES_OPTIONS_CONFIG = [
  {
    title: "Quick",
    icon: Zap,
    bgColor: "#1E40AF",
    route: "/sales/quick"
  },
  {
    title: "VozPos",
    icon: Mic,
    bgColor: "#2D3748",
    route: "/sales/vozpos"
  },
  {
    title: "VisionPos",
    icon: Camera,
    bgColor: "#4CAF50",
    route: "/sales/visionpos"
  },
  {
    title: "TouchPos",
    icon: CreditCard,
    bgColor: "#FF9800",
    route: "/sales/touchpos"
  }
];

export default function ClientsScreen() {
  const router = useRouter();
  const { offlineMode } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term to avoid making too many API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchQuery);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Initial load of clients
  const loadClients = useCallback(async (forceRefresh = false, searchTerm = '') => {
    try {
      setError(null);
      if (searchTerm) {
        setIsSearching(true);
      }
      
      const data = await api.getClients(forceRefresh, searchTerm);
      setClients(data);
    } catch (err) {
      setError('Error al cargar los clientes. Por favor intente nuevamente.');
      Alert.alert(
        'Error',
        'No se pudieron cargar los clientes. Verifique su conexión.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsSearching(false);
    }
  }, []);

  // Load initial clients
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Load clients when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      loadClients(true, debouncedSearchTerm);
    } else if (debouncedSearchTerm === '' && searchQuery === '') {
      // Only reload all clients if search is completely cleared
      loadClients(true);
    }
  }, [debouncedSearchTerm, loadClients]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadClients(true);
  }, [loadClients]);

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchTerm('');
  };

  // Handle action button presses
  const handleActionPress = (actionId: string) => {
    switch (actionId) {
      case 'search':
        // Focus on search input
        Alert.alert('Búsqueda', 'La búsqueda ya está disponible en la barra superior');
        break;
      case 'filter':
        Alert.alert('Filtros', 'Funcionalidad de filtros próximamente disponible');
        break;
      case 'import':
        Alert.alert('Importar', 'Funcionalidad de importación próximamente disponible');
        break;
      case 'export':
        Alert.alert('Exportar', 'Funcionalidad de exportación próximamente disponible');
        break;
      default:
        break;
    }
  };

  const handleSalesOptionPress = (route: string) => {
    router.push(route);
  };

  const renderClientCard = ({ item }: { item: Client }) => (
    <TouchableOpacity 
      style={styles.clientCard}
      onPress={() => router.push(`/clients/${item.id}`)}
    >
      {/* Client Header */}
      <View style={styles.clientHeader}>
        <View style={[
          styles.clientIconContainer, 
          { backgroundColor: item.line?.toLowerCase().includes('empresa') ? '#E3F2FD' : '#F3E5F5' }
        ]}>
          {item.line?.toLowerCase().includes('empresa') ? (
            <Building2 size={24} color="#0066CC" />
          ) : (
            <User size={24} color="#9C27B0" />
          )}
        </View>
        
        <View style={styles.clientBasicInfo}>
          <Text style={styles.clientName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.clientRut}>RUT: {item.code}</Text>
          {item.line && (
            <Text style={styles.clientType}>{item.line}</Text>
          )}
        </View>
        
        <ChevronRight size={20} color="#999" />
      </View>

      {/* Client Details */}
      <View style={styles.clientDetails}>
        {/* Address */}
        {item.address && (
          <View style={styles.detailRow}>
            <MapPin size={16} color="#48BB78" style={styles.detailIcon} />
            <Text style={styles.detailText} numberOfLines={2}>
              {item.address}
              {item.municipality && `, ${item.municipality.name}`}
            </Text>
          </View>
        )}

        {/* Email */}
        {item.email && (
          <View style={styles.detailRow}>
            <Mail size={16} color="#F6AD55" style={styles.detailIcon} />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.email}
            </Text>
          </View>
        )}

        {/* Phone */}
        {item.phone && (
          <View style={styles.detailRow}>
            <Phone size={16} color="#4299E1" style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
        )}

        {/* Activity */}
        {item.activity && (
          <View style={styles.detailRow}>
            <Briefcase size={16} color="#805AD5" style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.activity.name}</Text>
          </View>
        )}

        {/* Additional Addresses Count */}
        {item.additionalAddress && item.additionalAddress.length > 0 && (
          <View style={styles.detailRow}>
            <MapPin size={16} color="#E53E3E" style={styles.detailIcon} />
            <Text style={styles.detailText}>
              +{item.additionalAddress.length} dirección{item.additionalAddress.length > 1 ? 'es' : ''} adicional{item.additionalAddress.length > 1 ? 'es' : ''}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderActionCard = ({ item }: { item: typeof CLIENT_ACTIONS_CONFIG[0] }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={() => handleActionPress(item.id)}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: item.bgColor }]}>
        <item.icon size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.actionTitle}>{item.title}</Text>
      <Text style={styles.actionDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderSalesOptionCard = ({ item }: { item: typeof SALES_OPTIONS_CONFIG[0] }) => (
    <TouchableOpacity
      style={styles.salesOptionCard}
      onPress={() => handleSalesOptionPress(item.route)}
    >
      <View style={[styles.salesOptionIconContainer, { backgroundColor: item.bgColor }]}>
        <item.icon size={32} color="#FFFFFF" />
      </View>
      <Text style={styles.salesOptionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Clientes</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Cargando clientes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clientes</Text>
        <TouchableOpacity 
          style={styles.newClientButton}
          onPress={() => router.push('/clients/new')}
        >
          <Plus size={22} color="#0066CC" />
        </TouchableOpacity>
      </View>
      
      {/* Sales Options Section */}
      <View style={styles.salesOptionsContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.salesOptionsContent}
        >
          {SALES_OPTIONS_CONFIG.map((option) => renderSalesOptionCard({ item: option }))}
        </ScrollView>
      </View>
      
      {/* Client Actions Section */}
      <View style={styles.clientActionsContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.clientActionsContent}
        >
          {CLIENT_ACTIONS_CONFIG.map((action) => renderActionCard({ item: action }))}
        </ScrollView>
      </View>
      
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, RUT, email o actividad"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color="#999" />
            </TouchableOpacity>
          )}
          {isSearching && (
            <ActivityIndicator size="small" color="#0066CC" style={styles.searchingIndicator} />
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#0066CC" />
        </TouchableOpacity>
      </View>
      
      {/* Results Info */}
      {searchQuery.length > 0 && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {clients.length === 0 
              ? 'No se encontraron clientes'
              : `${clients.length} cliente${clients.length > 1 ? 's' : ''} encontrado${clients.length > 1 ? 's' : ''}`
            }
          </Text>
        </View>
      )}
      
      {/* Clients List Section */}
      <View style={styles.recentClientsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Resultados de Búsqueda' : 'Todos los Clientes'}
          </Text>
          <TouchableOpacity onPress={() => router.push('/clients/history')}>
            <Text style={styles.viewAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {error && clients.length === 0 ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => loadClients(true)}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={clients}
            renderItem={renderClientCard}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={10}
            refreshControl={
              <RefreshControl 
                refreshing={isRefreshing} 
                onRefresh={onRefresh}
                colors={['#0066CC']}
                tintColor="#0066CC"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery 
                    ? 'No se encontraron clientes que coincidan con la búsqueda'
                    : 'No hay clientes registrados'
                  }
                </Text>
                {!searchQuery && (
                  <TouchableOpacity 
                    style={styles.createFirstClientButton}
                    onPress={() => router.push('/clients/new')}
                  >
                    <Plus size={16} color="#fff" style={styles.createFirstClientIcon} />
                    <Text style={styles.createFirstClientText}>Crear Primer Cliente</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        )}
      </View>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={() => router.push('/clients/new')}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
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
  newClientButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Client Actions Section
  clientActionsContainer: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 20,
    marginBottom: 10,
  },
  clientActionsContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  actionCard: {
    width: 120,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 10,
    color: '#666',
    lineHeight: 14,
    textAlign: 'center',
  },
  
  // Sales Options Section
  salesOptionsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  salesOptionsContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  salesOptionCard: {
    width: 100,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  salesOptionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  salesOptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
  },
  
  // Search Section
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  searchingIndicator: {
    marginLeft: 10
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  
  // Results Info
  resultsInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  
  // Recent Clients Container
  recentClientsContainer: {
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
  
  // Error Banner
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
  
  // List Container
  listContainer: {
    padding: 20,
  },
  
  // Client Cards
  clientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  clientIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clientBasicInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  clientRut: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  clientType: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500',
  },
  clientDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  
  // Floating Action Button
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  
  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  
  // Empty States
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  createFirstClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createFirstClientIcon: {
    marginRight: 8,
  },
  createFirstClientText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});