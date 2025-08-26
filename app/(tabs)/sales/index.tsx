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
  ScrollView,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { Check, CircleAlert as AlertCircle, ChevronRight, FileText, Zap, Mic, Camera, CreditCard, CirclePlus as PlusCircle, Search, X } from 'lucide-react-native';
import { api, Document } from '../../../services/api';

export default function LastSalesScreen() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const fetchSales = async (forceRefresh = false) => {
    try {
      setError(null);
      const response = await api.getSales(forceRefresh);
      
      // Ensure we received valid data
      if (Array.isArray(response)) {
        setDocuments(response);
        setFilteredDocuments(response);
      } else {
        console.warn('Invalid sales data format:', response);
        setDocuments([]);
        setFilteredDocuments([]);
        setError('Formato de datos inválido recibido del servidor');
      }
    } catch (err: any) {
      console.error('Error fetching sales:', err);
      
      // Set specific error message based on error type
      if (err.code === 'ECONNABORTED') {
        setError('Tiempo de espera agotado. La conexión al servidor tardó demasiado.');
      } else if (err.response && err.response.status === 500) {
        setError('Error en el servidor. Por favor intente nuevamente más tarde.');
      } else {
        setError('Error al cargar las ventas. Por favor intente nuevamente.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Función para detectar si el término es un nombre (no RUT ni folio)
  const isNameSearch = (term: string): boolean => {
    const cleanTerm = term.trim();
    
    // Si es solo números, probablemente es un folio
    if (/^\d+$/.test(cleanTerm)) {
      return false;
    }
    
    // Si tiene formato de RUT (XX.XXX.XXX-X o XXXXXXXX-X)
    if (/^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/.test(cleanTerm) || /^\d{7,8}-[0-9kK]$/.test(cleanTerm)) {
      return false;
    }
    
    // Si tiene más de 2 caracteres y no es solo números, probablemente es un nombre
    return cleanTerm.length > 2;
  };

  // Función para buscar ventas
  const searchSales = async (term: string) => {
    if (!term.trim()) {
      setFilteredDocuments(documents);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      
      // Preparar término de búsqueda
      let searchTerm = term.trim();
      
      // Si es búsqueda por nombre, agregar "%" para búsqueda más amplia
      if (isNameSearch(searchTerm)) {
        searchTerm = `%${searchTerm}%`;
        console.log('[SALES] Name search detected, adding wildcards:', searchTerm);
      } else {
        console.log('[SALES] RUT/Folio search detected, using exact term:', searchTerm);
      }
      
      // Intentar búsqueda con la API de facturas históricas (mejor para RUT y nombre)
      console.log('[SALES] Starting search with term:', searchTerm);
      const searchResults = await api.searchInvoices(searchTerm);
      console.log('[SALES] Search results received:', {
        length: searchResults.length,
        isArray: Array.isArray(searchResults),
        firstResult: searchResults[0] ? {
          id: searchResults[0].id,
          type: searchResults[0].type,
          clientName: searchResults[0].client?.name,
          folio: searchResults[0].assignedFolio
        } : 'no results'
      });
      setFilteredDocuments(searchResults);
      console.log('[SALES] Filtered documents state updated with', searchResults.length, 'results');
    } catch (err: any) {
      console.error('Error searching sales:', err);
      
      // Fallback: búsqueda local
      const searchLower = term.toLowerCase();
      const localResults = documents.filter(doc => 
        doc.client?.name?.toLowerCase().includes(searchLower) ||
        doc.client?.rut?.toLowerCase().includes(searchLower) ||
        doc.assignedFolio?.toLowerCase().includes(searchLower) ||
        doc.type?.toLowerCase().includes(searchLower)
      );
      setFilteredDocuments(localResults);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Efecto para realizar búsqueda cuando cambia el término debounced
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      console.log('[SALES] Debounced search term changed:', debouncedSearchTerm);
      searchSales(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  // Efecto para actualizar documentos filtrados cuando cambian los documentos originales
  useEffect(() => {
    if (searchTerm.trim()) {
      searchSales(searchTerm);
    } else {
      setFilteredDocuments(documents);
    }
  }, [documents]);

  useEffect(() => {
    fetchSales();
  }, []);

  // Add effect for retrying on error with backoff
  useEffect(() => {
    if (error && retryCount < 3) {
      const retryTimeout = setTimeout(() => {
        console.log(`Automatically retrying to load sales (attempt ${retryCount + 1})`);
        fetchSales(true);
        setRetryCount(prev => prev + 1);
      }, 5000 * (retryCount + 1)); // Exponential backoff: 5s, 10s, 15s
      
      return () => clearTimeout(retryTimeout);
    }
  }, [error, retryCount]);

  const onRefresh = () => {
    setRefreshing(true);
    setRetryCount(0); // Reset retry count on manual refresh
    fetchSales(true);
  };

  const handleRetry = () => {
    setLoading(true);
    setRetryCount(0);
    fetchSales(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredDocuments(documents);
  };

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
      console.error('Error formatting date:', e);
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
      console.error('Error formatting amount:', e);
      return amount.toString();
    }
  };

  const handleDocumentPress = (document: Document) => {
    console.log('[SALES] Navigating to document details:', { 
      id: document.id, 
      folio: document.assignedFolio,
      type: document.type 
    });
    
    // Pasar el tipo de documento en la navegación
    router.push(`/sales/invoice-details?id=${document.id}&folio=${document.assignedFolio}&type=${document.type}`);
  };

  const salesOptions = [
    {
      title: "Quick",
      icon: <Zap size={32} color="#FFFFFF" />,
      bgColor: "#1E40AF",
      route: "/sales/quick"
    },
    {
      title: "VozPos",
      icon: <Mic size={32} color="#FFFFFF" />,
      bgColor: "#2D3748",
      route: "/sales/vozpos"
    },
    {
      title: "VisionPos",
      icon: <Camera size={32} color="#FFFFFF" />,
      bgColor: "#4CAF50",
      route: "/sales/visionpos"
    },
    {
      title: "TouchPos",
      icon: <CreditCard size={32} color="#FFFFFF" />,
      bgColor: "#FF9800",
      route: "/sales/touchpos"
    }
  ];

  const renderItem = ({ item }: { item: Document }) => {
    // Make sure item has all required properties
    if (!item || !item.client) {
      return null;
    }
    
    // Si no tiene state, crear uno por defecto basado en paid
    const documentState = item.state || (item.paid ? ['ACCEPTED', 'Pagada'] : ['PENDING', 'Pendiente']);
    
    return (
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
            documentState[0] === 'ACCEPTED' ? styles.statusAccepted : styles.statusPending
          ]}>
            {documentState[0] === 'ACCEPTED' ? (
              <Check size={16} color="#4CAF50" style={styles.statusIcon} />
            ) : (
              <AlertCircle size={16} color="#FF9800" style={styles.statusIcon} />
            )}
            <Text style={[
              styles.statusText,
              documentState[0] === 'ACCEPTED' ? styles.statusTextAccepted : styles.statusTextPending
            ]}>
              {documentState[1] || 'Pendiente'}
            </Text>
          </View>
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.client.name || 'Cliente sin nombre'}</Text>
          <Text style={styles.clientRut}>RUT: {item.client.rut || item.client.code || 'Sin RUT'}</Text>
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ventas</Text>
        <TouchableOpacity 
          style={styles.newSaleButton}
          onPress={() => router.push('/sales/new')}
        >
          <PlusCircle size={22} color="#0066CC" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.salesOptionsContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.salesOptionsContent}
        >
          {salesOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionCard}
              onPress={() => router.push(option.route)}
            >
              <View style={[styles.optionIconContainer, { backgroundColor: option.bgColor }]}>
                {option.icon}
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>
                {option.title === "Quick" ? "Procesamiento rápido" :
                 option.title === "VozPos" ? "Ventas por voz" :
                 option.title === "VisionPos" ? "Escaneo de documentos" :
                 "Documentos electrónicos"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar facturas por RUT o nombre del cliente..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        {isSearching && (
          <View style={styles.searchingIndicator}>
            <ActivityIndicator size="small" color="#0066CC" />
            <Text style={styles.searchingText}>Buscando...</Text>
          </View>
        )}
        {searchTerm.length > 0 && !isSearching && (
          <Text style={styles.resultsInfo}>
            {filteredDocuments.length === 1 
              ? '1 resultado encontrado' 
              : `${filteredDocuments.length} resultados encontrados`}
          </Text>
        )}
      </View>

      <View style={styles.recentSalesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchTerm.length > 0 ? 'Resultados de Búsqueda' : 'Últimas Ventas'}
          </Text>
          {searchTerm.length === 0 && (
            <TouchableOpacity onPress={() => router.push('/sales/history')}>
              <Text style={styles.viewAllText}>Ver todas</Text>
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Cargando ventas...</Text>
          </View>
        ) : error && documents.length === 0 ? (
          <View style={styles.errorContainer}>
            <AlertCircle size={48} color="#FF3B30" style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRetry}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredDocuments} // Use filteredDocuments for rendering
            renderItem={renderItem}
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
                <Text style={styles.emptyText}>
                  {searchTerm.length > 0 ? 'No se encontraron resultados' : 'No hay ventas registradas'}
                </Text>
              </View>
            }
            onLayout={() => {
              console.log('[SALES] FlatList rendered with', filteredDocuments.length, 'documents');
              console.log('[SALES] Search term:', searchTerm);
              console.log('[SALES] First document in list:', filteredDocuments[0] ? {
                id: filteredDocuments[0].id,
                type: filteredDocuments[0].type,
                clientName: filteredDocuments[0].client?.name
              } : 'no documents');
            }}
          />
        )}
      </View>
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
  newSaleButton: {
    padding: 8,
  },
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
    // Reemplazado shadowProps con boxShadow
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
  listContainer: {
    padding: 20,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    // Reemplazado shadowProps con boxShadow
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 5,
  },
  searchingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  searchingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  resultsInfo: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    paddingVertical: 8,
  },
});