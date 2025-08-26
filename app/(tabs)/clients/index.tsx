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
  Zap,
  Mic,
  Camera,
  CreditCard
} from 'lucide-react-native';
import { api, Client } from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';



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



  const renderSalesOptionCard = ({ item }: { item: typeof SALES_OPTIONS_CONFIG[0] }) => (
    <TouchableOpacity
      style={styles.salesOptionCard}
      onPress={() => handleSalesOptionPress(item.route)}
    >
      <View style={[styles.salesOptionIconContainer, { backgroundColor: item.bgColor }]}>
        <item.icon size={32} color="#FFFFFF" />
      </View>
      <Text style={styles.salesOptionTitle}>{item.title}</Text>
      <Text style={styles.salesOptionDescription}>
        {item.title === "Quick" ? "Procesamiento rápido" :
         item.title === "VozPos" ? "Ventas por voz" :
         item.title === "VisionPos" ? "Escaneo de documentos" :
         "Documentos electrónicos"}
      </Text>
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
          {SALES_OPTIONS_CONFIG.map((option) => (
            <View key={option.title}>
              {renderSalesOptionCard({ item: option })}
            </View>
          ))}
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
  

  
  // Sales Options Section
  salesOptionsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  salesOptionsContent: {
    paddingHorizontal: 15,
  },
  salesOptionCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  salesOptionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  salesOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  salesOptionDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
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