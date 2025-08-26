import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Plus, Minus, Calendar, X, CircleMinus as MinusCircle, User, MapPin, Check } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { generateTicket, formatTicketData } from '../../services/invoiceService';
import { api, Client, Product } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

interface ProductItem extends Product {
  quantity: number;
}

interface Address {
  id: number;
  address: string;
  municipality?: {
    id: number;
    code: string;
    name: string;
  };
}

interface SelectedClient {
  id: number;
  code: string;
  name: string;
  address?: string;
  additionalAddress?: Address[];
  email?: string;
  selectedAddressId?: number;
  line?: string;
}

export default function BoletaElectronicaScreen() {
  const router = useRouter();
  const { isDark, offlineMode } = useTheme();
  
  // State for header information
  const [emissionDate, setEmissionDate] = useState(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Contado' | 'Crédito'>('Contado');
  
  // State for date pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'emission' | 'due'>('emission');
  
  // State for client
  const [client, setClient] = useState<SelectedClient | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [isSearchingClient, setIsSearchingClient] = useState(false);
  const [debouncedClientSearch, setDebouncedClientSearch] = useState('');
  
  // State for products
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [debouncedProductSearch, setDebouncedProductSearch] = useState('');
  
  // State for selected product
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState('1');
  
  // State for address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  // State for loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate totals
  const netTotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const iva = netTotal * 0.19; // 19% IVA (tax) in Chile
  const otherTaxes = products.reduce((sum, product) => {
    if (product.category?.otherTax) {
      return sum + (product.price * product.quantity * (product.category.otherTax.percent / 100));
    }
    return sum;
  }, 0);
  const grandTotal = netTotal + iva + otherTaxes;

  // Debounce client search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedClientSearch(clientSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [clientSearch]);

  // Debounce product search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [productSearch]);

  // Search clients when debounced search term changes
  useEffect(() => {
    const searchClients = async () => {
      if (!showClientModal) return;
      
      if (debouncedClientSearch) {
        setIsSearchingClient(true);
        try {
          const data = await api.getClients(true, debouncedClientSearch);
          setClientsList(data);
        } catch (error) {
          console.error('Error searching clients:', error);
          // If API search fails, try local filtering
          try {
            const allClients = await api.getClients(false);
            const filteredClients = allClients.filter(client => 
              client.name.toLowerCase().includes(debouncedClientSearch.toLowerCase()) ||
              client.code.toLowerCase().includes(debouncedClientSearch.toLowerCase()) ||
              (client.email && client.email.toLowerCase().includes(debouncedClientSearch.toLowerCase()))
            );
            setClientsList(filteredClients);
          } catch (err) {
            Alert.alert('Error', 'No se pudieron buscar los clientes');
          }
        } finally {
          setIsSearchingClient(false);
        }
      } else if (showClientModal) {
        // If search is cleared, load all clients
        loadClients();
      }
    };

    searchClients();
  }, [debouncedClientSearch, showClientModal]);

  // Search products when debounced search term changes
  useEffect(() => {
    const searchProducts = async () => {
      if (!showProductModal) return;
      
      if (debouncedProductSearch) {
        setIsSearchingProduct(true);
        try {
          const data = await api.getProducts(true, debouncedProductSearch);
          setProductsList(data);
        } catch (error) {
          console.error('Error searching products:', error);
          // If API search fails, try local filtering
          try {
            const allProducts = await api.getProducts(false);
            const filteredProducts = allProducts.filter(product => 
              product.name.toLowerCase().includes(debouncedProductSearch.toLowerCase()) ||
              product.code.toLowerCase().includes(debouncedProductSearch.toLowerCase())
            );
            setProductsList(filteredProducts);
          } catch (err) {
            Alert.alert('Error', 'No se pudieron buscar los productos');
          }
        } finally {
          setIsSearchingProduct(false);
        }
      } else if (showProductModal) {
        // If search is cleared, load all products
        loadProducts();
      }
    };

    searchProducts();
  }, [debouncedProductSearch, showProductModal]);
  
  // Load clients
  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const clientsData = await api.getClients(true);
      setClientsList(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setLoadingClients(false);
    }
  };
  
  // Load products
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const productsData = await api.getProducts(true);
      setProductsList(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoadingProducts(false);
    }
  };
  
  // Handle date picker changes
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      if (datePickerMode === 'emission') {
        setEmissionDate(selectedDate);
      } else if (datePickerMode === 'due') {
        setDueDate(selectedDate);
      }
    }
  };
  
  // Select client
  const selectClient = (client: Client) => {
    // Create a normalized client object with proper address handling
    const newClient: SelectedClient = {
      id: client.id,
      code: client.code,
      name: client.name,
      address: client.address || '',
      line: client.line,
      email: client.email,
      // Initialize additionalAddress array properly
      additionalAddress: []
    };

    // Add primary address if it exists
    if (client.address) {
      newClient.additionalAddress!.push({
        id: 0,
        address: client.address,
        municipality: client.municipality
      });
    }

    // Add additional addresses if they exist
    if (client.additionalAddress && Array.isArray(client.additionalAddress)) {
      // Combine addresses, ensuring no duplicates by ID
      const existingIds = newClient.additionalAddress!.map(addr => addr.id);
      const additionalAddresses = client.additionalAddress.filter(addr => !existingIds.includes(addr.id));
      
      newClient.additionalAddress = [
        ...newClient.additionalAddress!,
        ...additionalAddresses
      ];
    }

    // Set the first address as selected by default
    if (newClient.additionalAddress && newClient.additionalAddress.length > 0) {
      newClient.selectedAddressId = newClient.additionalAddress[0].id;
    }

    setClient(newClient);
    setShowClientModal(false);
  };
  
  // Select address
  const selectAddress = (addressId: number) => {
    if (client) {
      setClient({
        ...client,
        selectedAddressId: addressId
      });
    }
    setShowAddressModal(false);
  };
  
  // Prepare product for adding
  const prepareAddProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductQuantity('1');
    setShowProductModal(false);
  };
  
  // Validate product quantity
  const validateProductQuantity = (quantity: string): { isValid: boolean; value: number; error?: string } => {
    const sanitizedValue = quantity.replace(',', '.');
    const numValue = parseFloat(sanitizedValue);
    
    if (isNaN(numValue)) {
      return { isValid: false, value: 0, error: 'La cantidad debe ser un número válido' };
    }
    
    if (numValue <= 0) {
      return { isValid: false, value: 0, error: 'La cantidad debe ser mayor a 0' };
    }
    
    if (numValue > 999999) {
      return { isValid: false, value: 0, error: 'La cantidad no puede exceder 999,999' };
    }
    
    return { isValid: true, value: numValue };
  };
  
  // Add product
  const addProduct = () => {
    if (!selectedProduct) return;
    
    // Validate quantity
    const quantityValidation = validateProductQuantity(productQuantity);
    if (!quantityValidation.isValid) {
      Alert.alert('Error', quantityValidation.error || 'Cantidad inválida');
      return;
    }
    
    const quantity = quantityValidation.value;
    
    // Check if product already exists in the list
    const existingProductIndex = products.findIndex(p => p.id === selectedProduct.id);
    
    if (existingProductIndex >= 0) {
      // Update quantity if product already exists
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex].quantity += quantity;
      setProducts(updatedProducts);
    } else {
      // Add new product with quantity
      setProducts([...products, { ...selectedProduct, quantity }]);
    }
    
    setSelectedProduct(null);
    setProductQuantity('1');
  };
  
  // Remove product from list
  const removeProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
  };
  
  // Update product quantity
  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      // Remove product if quantity is 0 or negative
      removeProduct(productId);
      return;
    }
    
    const updatedProducts = products.map(product => 
      product.id === productId ? { ...product, quantity } : product
    );
    
    setProducts(updatedProducts);
  };
  
  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return 'No aplica';
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Format integer amounts
  const formatInteger = (amount: number) => {
    return Math.round(amount).toLocaleString('es-CL');
  };
  
  // Submit boleta
  const submitBoleta = async () => {
    // Validate data
    if (products.length === 0) {
      Alert.alert('Error', 'Debe agregar al menos un producto a la boleta');
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare ticket data
    const ticketData = formatTicketData(
      client,
      products,
      {
        date: emissionDate.toISOString().split('T')[0],
        paymentMethod,
        ticketTypeCode: '3', // Code for Boleta Electrónica
        netAmounts: false,
        hasTaxes: true
      }
    );
    
    try {
      // Generate ticket
      const response = await generateTicket(ticketData);
      
      if (response) {
        Alert.alert(
          'Boleta Generada',
          `La boleta N° ${response.assignedFolio} ha sido generada exitosamente.`,
          [
            { 
              text: 'Ver Detalles', 
              onPress: () => router.push(`/sales/invoice-details?id=${response.id}`) 
            },
            {
              text: 'Volver al Inicio',
              onPress: () => router.back(),
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error submitting boleta:', error);
      Alert.alert('Error', 'Ocurrió un error al generar la boleta. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle client modal open
  useEffect(() => {
    if (showClientModal) {
      // Reset search when modal opens
      setClientSearch('');
      setDebouncedClientSearch('');
    }
  }, [showClientModal]);

  // Handle product modal open
  useEffect(() => {
    if (showProductModal) {
      // Reset search when modal opens
      setProductSearch('');
      setDebouncedProductSearch('');
    }
  }, [showProductModal]);
  
  // Load data on mount
  useEffect(() => {
    loadClients();
    loadProducts();
  }, []);
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={isDark ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>
          Boleta Electrónica
        </Text>
        <View style={{ width: 24 }}></View>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Header Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Cabecera</Text>
          
          {/* Date Fields Row */}
          <View style={styles.formRow}>
            {/* Emission Date */}
            <View style={styles.formCol}>
              <Text style={[styles.inputLabel, isDark && styles.darkText]}>
                Fecha de Emisión *
              </Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => {
                  setDatePickerMode('emission');
                  setShowDatePicker(true);
                }}
              >
                <Text style={styles.dateText}>
                  {formatDate(emissionDate)}
                </Text>
                <Calendar size={18} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Due Date */}
            <View style={styles.formCol}>
              <Text style={[styles.inputLabel, isDark && styles.darkText]}>
                Fecha de Vencimiento
              </Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => paymentMethod === 'Crédito' ? (() => {
                  setDatePickerMode('due');
                  setShowDatePicker(true);
                })() : null}
                disabled={paymentMethod !== 'Crédito'}
              >
                <Text style={[
                  styles.dateText,
                  paymentMethod !== 'Crédito' && styles.disabledText
                ]}>
                  {paymentMethod === 'Crédito' ? formatDate(dueDate) : 'No aplica'}
                </Text>
                {paymentMethod === 'Crédito' && (
                  <Calendar size={18} color="#666" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Payment Method */}
          <Text style={[styles.inputLabel, isDark && styles.darkText]}>
            Forma de Pago *
          </Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity 
              style={[
                styles.paymentOption,
                paymentMethod === 'Contado' && styles.paymentOptionSelected
              ]}
              onPress={() => setPaymentMethod('Contado')}
            >
              <Text style={[
                styles.paymentOptionText,
                paymentMethod === 'Contado' && styles.paymentOptionTextSelected
              ]}>
                Contado
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.paymentOption,
                paymentMethod === 'Crédito' && styles.paymentOptionSelected
              ]}
              onPress={() => setPaymentMethod('Crédito')}
            >
              <Text style={[
                styles.paymentOptionText,
                paymentMethod === 'Crédito' && styles.paymentOptionTextSelected
              ]}>
                Crédito
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Client Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Cliente</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowClientModal(true)}
            >
              <Search size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {client ? (
            <View style={styles.clientCard}>
              <View style={styles.clientHeader}>
                <View style={styles.clientIcon}>
                  <User size={24} color="#0066CC" />
                </View>
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName} numberOfLines={1} ellipsizeMode="tail">{client.name}</Text>
                  <Text style={styles.clientRut}>RUT: {client.code}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.addressButton}
                onPress={() => {
                  if (client.additionalAddress && client.additionalAddress.length > 0) {
                    setShowAddressModal(true);
                  }
                }}
                disabled={!client.additionalAddress || client.additionalAddress.length === 0}
              >
                <MapPin size={18} color="#666" style={{ marginRight: 8 }} />
                <View style={styles.addressTextContainer}>
                  <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
                    {client.selectedAddressId !== undefined && client.additionalAddress && client.additionalAddress.length > 0 ? 
                      (client.additionalAddress.find(a => a.id === client.selectedAddressId)?.address || 
                       client.additionalAddress[0]?.address || 'Sin dirección')
                      : 
                      client.address || 'Sin dirección'
                    }
                  </Text>
                  {client.additionalAddress && client.additionalAddress.length > 0 && 
                   client.selectedAddressId !== undefined && 
                   client.additionalAddress.find(a => a.id === client.selectedAddressId)?.municipality && (
                    <Text style={styles.municipalityText} numberOfLines={1} ellipsizeMode="tail">
                      {client.additionalAddress.find(a => a.id === client.selectedAddressId)?.municipality?.name}
                    </Text>
                  )}
                </View>
                {client.additionalAddress && client.additionalAddress.length > 1 && (
                  <View style={styles.multipleAddressBadge}>
                    <Text style={styles.multipleAddressText}>{client.additionalAddress.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.emptyClientCard}
              onPress={() => setShowClientModal(true)}
            >
              <User size={32} color="#999" />
              <Text style={styles.emptyClientText}>Seleccionar Cliente</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Productos</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowProductModal(true)}
            >
              <Plus size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {selectedProduct && (
            <View style={styles.selectedProductCard}>
              <View style={styles.selectedProductHeader}>
                <Text style={styles.selectedProductTitle} numberOfLines={1} ellipsizeMode="tail">{selectedProduct.name}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedProduct(null)}
                >
                  <X size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.selectedProductDetails}>
                <View style={styles.selectedProductInfo}>
                  <Text style={styles.selectedProductLabel} numberOfLines={1} ellipsizeMode="tail">Código: {selectedProduct.code}</Text>
                  <Text style={styles.selectedProductLabel}>
                    Precio: ${selectedProduct.price.toFixed(2)}
                  </Text>
                  {selectedProduct.category?.otherTax && (
                    <Text style={styles.selectedProductTax} numberOfLines={1} ellipsizeMode="tail">
                      Impuesto: {selectedProduct.category.otherTax.name} ({selectedProduct.category.otherTax.percent}%)
                    </Text>
                  )}
                </View>
                
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Cantidad:</Text>
                  <TextInput
                    style={styles.quantityInput}
                    value={productQuantity}
                    onChangeText={setProductQuantity}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.addProductButton}
                onPress={addProduct}
              >
                <Text style={styles.addProductButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {products.length > 0 ? (
            <View style={styles.productsList}>
              <View style={styles.productsListHeader}>
                <Text style={[styles.productCol, { flex: 2 }]}>Producto</Text>
                <Text style={[styles.productCol, { flex: 1, textAlign: 'right' }]}>Precio</Text>
                <Text style={[styles.productCol, { flex: 1, textAlign: 'right' }]}>Total</Text>
                <View style={{ width: 24 }} />
              </View>
              
              {products.map((product, index) => (
                <View key={product.id} style={styles.productItem}>
                  <View style={styles.productItemMainContent}>
                    <View style={styles.productNameContainer}>
                      <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                        {product.name}
                      </Text>
                      <Text style={styles.productCode} numberOfLines={1} ellipsizeMode="tail">{product.code}</Text>
                      
                      {/* Quantity shown below product name */}
                      <View style={styles.productQuantityRow}>
                        <Text style={styles.productQuantityLabel}>Cant.: </Text>
                        <Text style={styles.productQuantityValue}>
                          {product.quantity % 1 === 0 ? product.quantity.toFixed(0) : product.quantity.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.productPriceContainer}>
                      <Text style={styles.productPrice}>
                        ${product.price.toLocaleString('es-CL')}
                      </Text>
                    </View>
                    
                    <View style={styles.productTotalContainer}>
                      <Text style={styles.productTotal}>
                        ${formatInteger(product.price * product.quantity)}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => removeProduct(product.id)}
                      style={styles.removeProductButton}
                    >
                      <MinusCircle size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.emptyProductsList}
              onPress={() => setShowProductModal(true)}
            >
              <Plus size={32} color="#999" />
              <Text style={styles.emptyProductsText}>Agregar Productos</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Totals Section */}
        {products.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Totales</Text>
              <View style={styles.totalItemsBadge}>
                <Text style={styles.totalItemsText}>{products.length} productos</Text>
              </View>
            </View>
            
            <View style={styles.totalsContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Monto Neto</Text>
                <Text style={styles.totalValue}>${formatInteger(netTotal)}</Text>
              </View>
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>IVA (19%)</Text>
                <Text style={styles.totalValue}>${formatInteger(iva)}</Text>
              </View>
              
              {otherTaxes > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Otros Impuestos</Text>
                  <Text style={styles.totalValue}>${formatInteger(otherTaxes)}</Text>
                </View>
              )}
              
              <View style={[styles.totalRow, styles.grandTotalRow]}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>${formatInteger(grandTotal)}</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Estado de la Boleta */}
        <View style={styles.invoiceStatusContainer}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, client ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={styles.statusText}>Cliente seleccionado</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, products.length > 0 ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={styles.statusText}>Productos agregados</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, grandTotal > 0 ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={styles.statusText}>Totales calculados</Text>
          </View>
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.saveButton, 
            isSubmitting && styles.saveButtonDisabled,
            (!client || products.length === 0) && styles.saveButtonDisabled
          ]}
          onPress={submitBoleta}
          disabled={isSubmitting || !client || products.length === 0}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Generar Boleta</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      {/* Modal para búsqueda de cliente */}
      <Modal
        visible={showClientModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buscar Cliente</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowClientModal(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={clientSearch}
                onChangeText={setClientSearch}
                placeholder="Buscar por nombre o RUT"
              />
              <View style={styles.searchIconContainer}>
                {isSearchingClient ? (
                  <ActivityIndicator size="small" color="#0066CC" />
                ) : (
                  <Search size={18} color="#666" />
                )}
              </View>
            </View>
            
            {loadingClients ? (
              <ActivityIndicator size="large" color="#0066CC" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={clientsList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.clientListItem}
                    onPress={() => selectClient(item)}
                  >
                    <View style={styles.clientListIcon}>
                      <User size={20} color="#0066CC" />
                    </View>
                    <View style={styles.clientListInfo}>
                      <Text style={styles.clientListName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                      <Text style={styles.clientListRut}>RUT: {item.code}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.modalList}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    No se encontraron clientes
                  </Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>
      
      {/* Modal para búsqueda de producto */}
      <Modal
        visible={showProductModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buscar Producto</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowProductModal(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={productSearch}
                onChangeText={setProductSearch}
                placeholder="Buscar por nombre o código"
              />
              <View style={styles.searchIconContainer}>
                {isSearchingProduct ? (
                  <ActivityIndicator size="small" color="#0066CC" />
                ) : (
                  <Search size={18} color="#666" />
                )}
              </View>
            </View>
            
            {loadingProducts ? (
              <ActivityIndicator size="large" color="#0066CC" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={productsList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.productListItem}
                    onPress={() => prepareAddProduct(item)}
                  >
                    <View style={styles.productListInfo}>
                      <Text style={styles.productListName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                      <View style={styles.productListDetails}>
                        <Text style={styles.productListCode} numberOfLines={1} ellipsizeMode="tail">Código: {item.code}</Text>
                        <Text style={styles.productListPrice}>
                          ${item.price.toLocaleString('es-CL')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.modalList}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    No se encontraron productos
                  </Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>
      
      {/* Modal para selección de dirección */}
      <Modal
        visible={showAddressModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Dirección</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddressModal(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {client && client.additionalAddress && (
              <FlatList
                data={client.additionalAddress}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.addressListItem,
                      client.selectedAddressId === item.id && styles.addressListItemSelected
                    ]}
                    onPress={() => selectAddress(item.id)}
                  >
                    <View style={styles.addressListIcon}>
                      <MapPin size={20} color="#0066CC" />
                    </View>
                    <View style={styles.addressListInfo}>
                      <Text style={styles.addressListText} numberOfLines={1} ellipsizeMode="tail">{item.address}</Text>
                      {item.municipality && (
                        <Text style={styles.addressListMunicipality} numberOfLines={1} ellipsizeMode="tail">
                          {item.municipality.name}
                        </Text>
                      )}
                    </View>
                    {client.selectedAddressId === item.id && (
                      <View style={styles.addressSelectedIcon}>
                        <Check size={18} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
                style={styles.modalList}
              />
            )}
          </View>
        </View>
      </Modal>
      
      {/* DatePicker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={datePickerMode === 'emission' ? emissionDate : (dueDate || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // Máximo 1 año en el futuro
          minimumDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)} // Mínimo 1 año en el pasado
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkText: {
    color: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  formCol: {
    flex: 1,
    marginRight: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  disabledText: {
    color: '#999',
  },
  paymentOptions: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    alignItems: 'center',
  },
  paymentOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#0066CC',
    borderWidth: 1,
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#666',
  },
  paymentOptionTextSelected: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#0066CC',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  clientRut: {
    fontSize: 14,
    color: '#666',
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    padding: 10,
    flexWrap: 'nowrap',
  },
  addressTextContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  addressText: {
    fontSize: 14,
    color: '#555',
    overflow: 'hidden',
  },
  municipalityText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  multipleAddressBadge: {
    backgroundColor: '#0066CC',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    flexShrink: 0,
  },
  multipleAddressText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyClientCard: {
    height: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emptyClientText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  productsList: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  productsListHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  productCol: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  productItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productItemMainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productNameContainer: {
    flex: 2,
    paddingRight: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  productCode: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  productQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  productQuantityLabel: {
    fontSize: 12,
    color: '#666',
  },
  productQuantityValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  productPriceContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
  },
  productTotalContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  productTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  removeProductButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    flexShrink: 0,
  },
  emptyProductsList: {
    height: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emptyProductsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  totalsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'nowrap',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  totalValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    minWidth: 80,
  },
  grandTotalRow: {
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066CC',
    textAlign: 'right',
    minWidth: 100,
  },
  totalItemsBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalItemsText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: 'bold',
  },
  invoiceStatusContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusDotActive: {
    backgroundColor: '#4CAF50',
  },
  statusDotInactive: {
    backgroundColor: '#E0E0E0',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#0066CC',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  selectedProductCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  selectedProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedProductTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  selectedProductDetails: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'nowrap',
  },
  selectedProductInfo: {
    flex: 2,
    overflow: 'hidden',
  },
  selectedProductLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  selectedProductTax: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
  },
  quantityContainer: {
    flex: 1,
    marginLeft: 10,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  quantityInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  addProductButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addProductButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIconContainer: {
    position: 'absolute',
    right: 25,
  },
  clientListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  clientListIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  clientListInfo: {
    flex: 1,
    overflow: 'hidden',
  },
  clientListName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  clientListRut: {
    fontSize: 14,
    color: '#666',
  },
  modalList: {
    flex: 1,
  },
  emptyListText: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
    fontStyle: 'italic',
  },
  productListItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productListInfo: {
    flex: 1,
  },
  productListName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  productListDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  productListCode: {
    fontSize: 14,
    color: '#888',
    flex: 1,
  },
  productListPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066CC',
    textAlign: 'right',
    minWidth: 80,
  },
  addressListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexWrap: 'nowrap',
  },
  addressListItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  addressListIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  addressListInfo: {
    flex: 1,
    overflow: 'hidden',
  },
  addressListText: {
    fontSize: 14,
    color: '#333',
  },
  addressListMunicipality: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  addressSelectedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
});