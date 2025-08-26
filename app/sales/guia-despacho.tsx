import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Platform,
  Modal,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, User, MapPin, Plus, X, CircleMinus as MinusCircle, Search, Check } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { api, Client, Product, WaybillRequest, TransferType, DispatchType } from '../../services/api';
import { generateWaybill } from '../../services/invoiceService';

// Interfaces
interface ProductDetail {
  id: number;
  code: string;
  name: string;
  price: number;
  quantity: number;
  unit?: {
    id: number;
    code: string;
    name: string;
  };
  category?: {
    id: number;
    code: string;
    name: string;
    otherTax?: {
      id: number;
      code: string;
      name: string;
      percent: number;
    };
  };
  total: number;
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

export default function GuiaDespachoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const waybillId = params.id as string;
  
  // Estado de la cabecera
  const [emissionDate, setEmissionDate] = useState(new Date());
  
  // Estado de tipos de transferencia y despacho
  const [transferTypes, setTransferTypes] = useState<TransferType[]>([]);
  const [dispatchTypes, setDispatchTypes] = useState<DispatchType[]>([]);
  const [selectedTransferType, setSelectedTransferType] = useState<TransferType | null>(null);
  const [selectedDispatchType, setSelectedDispatchType] = useState<DispatchType | null>(null);
  
  // Estado del cliente
  const [client, setClient] = useState<SelectedClient | null>(null);
  
  // Estado de productos
  const [products, setProducts] = useState<ProductDetail[]>([]);
  
  // Modales
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showTransferTypeModal, setShowTransferTypeModal] = useState(false);
  const [showDispatchTypeModal, setShowDispatchTypeModal] = useState(false);
  
  // Carga de datos
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingTransferTypes, setLoadingTransferTypes] = useState(false);
  const [loadingDispatchTypes, setLoadingDispatchTypes] = useState(false);
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  
  // Búsqueda
  const [clientSearch, setClientSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [isSearchingClient, setIsSearchingClient] = useState(false);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [debouncedClientSearch, setDebouncedClientSearch] = useState('');
  const [debouncedProductSearch, setDebouncedProductSearch] = useState('');
  
  // Para calendario
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Para producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState('1');
  
  // Cálculos de totales
  const [netTotal, setNetTotal] = useState(0);
  
  // Estado para controlar cuando se está generando la guía
  const [isGeneratingWaybill, setIsGeneratingWaybill] = useState(false);

  // Cargar tipos de transferencia y despacho
  const loadTransferTypes = async () => {
    setLoadingTransferTypes(true);
    try {
      const data = await api.getTransferTypes();
      setTransferTypes(data);
    } catch (error) {
      console.error('Error loading transfer types:', error);
      Alert.alert('Error', 'No se pudieron cargar los tipos de transferencia');
    } finally {
      setLoadingTransferTypes(false);
    }
  };

  const loadDispatchTypes = async () => {
    setLoadingDispatchTypes(true);
    try {
      const data = await api.getDispatchTypes();
      setDispatchTypes(data);
    } catch (error) {
      console.error('Error loading dispatch types:', error);
      Alert.alert('Error', 'No se pudieron cargar los tipos de despacho');
    } finally {
      setLoadingDispatchTypes(false);
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    loadTransferTypes();
    loadDispatchTypes();
    loadClients();
    loadProducts();
  }, []);

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
        loadProducts();
      }
    };
    searchProducts();
  }, [debouncedProductSearch, showProductModal]);
  
  // Cargar clientes
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
  
  // Cargar productos
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

  // Seleccionar cliente
  const selectClient = (client: Client) => {
    const newClient: SelectedClient = {
      id: client.id,
      code: client.code,
      name: client.name,
      address: client.address || '',
      line: client.line,
      email: client.email,
      additionalAddress: []
    };

    if (client.address) {
      newClient.additionalAddress!.push({
        id: 0,
        address: client.address,
        municipality: client.municipality
      });
    }

    if (client.additionalAddress && Array.isArray(client.additionalAddress)) {
      const existingIds = newClient.additionalAddress!.map(addr => addr.id);
      const additionalAddresses = client.additionalAddress.filter(addr => !existingIds.includes(addr.id));
      
      newClient.additionalAddress = [
        ...newClient.additionalAddress!,
        ...additionalAddresses
      ];
    }

    if (newClient.additionalAddress && newClient.additionalAddress.length > 0) {
      newClient.selectedAddressId = newClient.additionalAddress[0].id;
    }

    setClient(newClient);
    setShowClientModal(false);
  };
  
  // Seleccionar dirección
  const selectAddress = (addressId: number) => {
    if (client) {
      setClient({
        ...client,
        selectedAddressId: addressId
      });
    }
    setShowAddressModal(false);
  };
  
  // Preparar producto para agregar
  const prepareAddProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductQuantity('1');
    setShowProductModal(false);
  };
  
  // Validar cantidad de producto
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
  
  // Validar precio de producto
  const validateProductPrice = (price: number): { isValid: boolean; error?: string } => {
    if (price <= 0) {
      return { isValid: false, error: 'El precio debe ser mayor a 0' };
    }
    
    if (price > 999999999) {
      return { isValid: false, error: 'El precio no puede exceder 999,999,999' };
    }
    
    return { isValid: true };
  };
  
  // Agregar producto
  const addProduct = () => {
    if (!selectedProduct) return;
    
    const quantityValidation = validateProductQuantity(productQuantity);
    if (!quantityValidation.isValid) {
      Alert.alert('Error', quantityValidation.error || 'Cantidad inválida');
      return;
    }
    
    const priceValidation = validateProductPrice(selectedProduct.price);
    if (!priceValidation.isValid) {
      Alert.alert('Error', priceValidation.error || 'Precio inválido');
      return;
    }
    
    const quantity = quantityValidation.value;
    const price = selectedProduct.price;
    const total = quantity * price;
    
    const newProduct: ProductDetail = {
      id: selectedProduct.id,
      code: selectedProduct.code,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: quantity,
      unit: selectedProduct.unit,
      category: selectedProduct.category,
      total: total
    };
    
    setProducts([...products, newProduct]);
    setSelectedProduct(null);
    calculateTotals([...products, newProduct]);
  };
  
  // Remover producto
  const removeProduct = (index: number) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
    calculateTotals(updatedProducts);
  };
  
  // Calcular totales con memoización
  const calculateTotals = useCallback((productList: ProductDetail[]) => {
    let net = 0;
    
    productList.forEach(product => {
      net += product.total;
    });
    
    setNetTotal(net);
  }, []);

  // Formatear fecha
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  // Manejar cambio de fecha en DatePicker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      setEmissionDate(selectedDate);
    }
  };
  
  // Formatear fecha para API (YYYY-MM-DD)
  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Formatear montos enteros (sin decimales)
  const formatInteger = (amount: number) => {
    return Math.round(amount).toLocaleString('es-CL');
  };
  
  // Preparar los datos para la API
  const prepareWaybillData = useCallback((): WaybillRequest => {
    if (!client) {
      throw new Error('Debe seleccionar un cliente');
    }
    
    if (!selectedTransferType) {
      throw new Error('Debe seleccionar un tipo de transferencia');
    }
    
    if (products.length === 0) {
      throw new Error('Debe agregar al menos un producto');
    }
    
    // Preparar información del cliente
    const clientData: any = {
      id: client.id,
      code: client.code,
      name: client.name,
      email: client.email,
      line: client.line,
      additionalAddress: client.additionalAddress || []
    };
    
    // Agregar dirección y municipalidad basado en la dirección seleccionada
    if (client.additionalAddress && client.additionalAddress.length > 0) {
      const selectedAddress = client.selectedAddressId !== undefined
        ? client.additionalAddress.find(addr => addr.id === client.selectedAddressId)
        : client.additionalAddress[0];
        
      if (selectedAddress) {
        clientData.address = selectedAddress.address;
        
        if (selectedAddress.municipality) {
          clientData.municipality = {
            id: selectedAddress.municipality.id,
            name: selectedAddress.municipality.name,
            code: selectedAddress.municipality.code
          };
        }
      }
    } else if (client.address) {
      clientData.address = client.address;
    }
    
    // Preparar detalles de productos
    const details = products.map((product) => {
      const detail = {
        product: {
          id: product.id,
          code: product.code,
          name: product.name,
          price: product.price,
          unit: {
            id: product.unit?.id || 1,
            name: product.unit?.name || 'Unidad',
            code: product.unit?.code || 'Unid'
          },
          category: {
            id: product.category?.id || 1,
            code: product.category?.code || '001',
            name: product.category?.name || 'Default Category',
            otherTax: product.category?.otherTax
          }
        },
        quantity: product.quantity
      };
      
      return detail;
    });
    
    // Crear objeto de guía de despacho - Estructura exacta según esquema
    const waybillData: WaybillRequest = {
      currency: 'CLP', // Moneda por defecto
      transferType: {
        code: selectedTransferType.code
      },
      client: {
        municipality: clientData.municipality?.name || '',
        code: clientData.code,
        name: clientData.name,
        line: clientData.line || '',
        address: clientData.address || ''
      },
      details: details.map((detail, index) => ({
        position: index + 1,
        product: {
          code: detail.product.code,
          name: detail.product.name,
          unit: {
            code: detail.product.unit.code
          },
          price: detail.product.price
        },
        quantity: detail.quantity,
        description: detail.product.name
      })),
      date: formatDateForAPI(emissionDate)
    };
    
    // Agregar tipo de despacho si está seleccionado
    if (selectedDispatchType) {
      waybillData.dispatchType = {
        code: selectedDispatchType.code
      };
    }
    
    // Agregar folio externo si estamos editando una guía existente
    if (waybillId) {
      waybillData.externalFolio = waybillId;
    }
    
    return waybillData;
  }, [client, selectedTransferType, selectedDispatchType, products, emissionDate, waybillId]);
  
  // Validar fechas
  const validateDates = useCallback((): { isValid: boolean; error?: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (emissionDate < today) {
      return { isValid: false, error: 'La fecha de emisión no puede ser anterior a hoy' };
    }
    
    return { isValid: true };
  }, [emissionDate]);
  
  // Validar cliente
  const validateClient = (): { isValid: boolean; error?: string } => {
    if (!client) {
      return { isValid: false, error: 'Debe seleccionar un cliente' };
    }
    
    if (!client.name || client.name.trim().length === 0) {
      return { isValid: false, error: 'El cliente debe tener un nombre válido' };
    }
    
    if (!client.code || client.code.trim().length === 0) {
      return { isValid: false, error: 'El cliente debe tener un código válido' };
    }
    
    return { isValid: true };
  };
  
  // Validar productos
  const validateProducts = (): { isValid: boolean; error?: string } => {
    if (products.length === 0) {
      return { isValid: false, error: 'Debe agregar al menos un producto' };
    }
    
    for (const product of products) {
      if (product.quantity <= 0) {
        return { isValid: false, error: `La cantidad del producto "${product.name}" debe ser mayor a 0` };
      }
      
      if (product.price <= 0) {
        return { isValid: false, error: `El precio del producto "${product.name}" debe ser mayor a 0` };
      }
    }
    
    return { isValid: true };
  };
  
  // Generar guía de despacho
  const handleGenerateWaybill = async () => {
    // Validar fechas
    const dateValidation = validateDates();
    if (!dateValidation.isValid) {
      Alert.alert('Error', dateValidation.error || 'Error en las fechas');
      return;
    }
    
    // Validar cliente
    const clientValidation = validateClient();
    if (!clientValidation.isValid) {
      Alert.alert('Error', clientValidation.error || 'Error en el cliente');
      return;
    }
    
    // Validar productos
    const productValidation = validateProducts();
    if (!productValidation.isValid) {
      Alert.alert('Error', productValidation.error || 'Error en los productos');
      return;
    }
    
    // Validar tipo de transferencia
    if (!selectedTransferType) {
      Alert.alert('Error', 'Debe seleccionar un tipo de transferencia');
      return;
    }
    
    setIsGeneratingWaybill(true);
    
    try {
      console.log('🚀 Generando guía de despacho');
      const waybillData = prepareWaybillData();
      const response = await generateWaybill(waybillData);
      
      if (!response) {
        setIsGeneratingWaybill(false);
        return;
      }
      
      // Mostrar mensaje de éxito
      Alert.alert(
        'Guía de Despacho Generada',
        `La guía de despacho se ha generado correctamente`,
        [
          { 
            text: 'Ver Detalle', 
            onPress: () => {
              // Navegar a la pantalla de detalles con el tipo correcto
              router.push(`/sales/invoice-details?type=WAYBILL`);
            } 
          },
          {
            text: 'Volver', 
            onPress: () => router.replace('/sales')
          }
        ]
      );
      
    } catch (error) {
      console.error('Error generating waybill:', error);
      Alert.alert(
        'Error',
        'No se pudo generar la guía de despacho. Por favor, intente nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGeneratingWaybill(false);
    }
  };

  // Handle client modal open
  useEffect(() => {
    if (showClientModal) {
      setClientSearch('');
      setDebouncedClientSearch('');
    }
  }, [showClientModal]);

  // Handle product modal open
  useEffect(() => {
    if (showProductModal) {
      setProductSearch('');
      setDebouncedProductSearch('');
    }
  }, [showProductModal]);
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guía de Despacho Electrónica</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Mostrar el ID de Guía si existe */}
        {waybillId && (
          <View style={styles.waybillIdContainer}>
            <Text style={styles.waybillIdLabel}>ID de Guía:</Text>
            <Text style={styles.waybillIdValue}>{waybillId}</Text>
          </View>
        )}
        
        {/* Cabecera */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cabecera</Text>
          
          <Text style={styles.inputLabel}>Fecha de Emisión *</Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(emissionDate)}</Text>
            <Calendar size={18} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Tipos de Transferencia y Despacho */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Documento</Text>
          
          <Text style={styles.inputLabel}>Tipo de Transferencia *</Text>
          <TouchableOpacity 
            style={styles.typeSelectorButton}
            onPress={() => setShowTransferTypeModal(true)}
          >
            <Text style={styles.typeSelectorText}>
              {selectedTransferType ? selectedTransferType.name : 'Seleccionar tipo de transferencia'}
            </Text>
            <Search size={18} color="#666" />
          </TouchableOpacity>
          
          <Text style={styles.inputLabel}>Tipo de Despacho (Opcional)</Text>
          <TouchableOpacity 
            style={styles.typeSelectorButton}
            onPress={() => setShowDispatchTypeModal(true)}
          >
            <Text style={styles.typeSelectorText}>
              {selectedDispatchType ? selectedDispatchType.name : 'Seleccionar tipo de despacho'}
            </Text>
            <Search size={18} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Cliente */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cliente</Text>
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
        
        {/* Productos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos</Text>
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
                <View key={index} style={styles.productItem}>
                  <View style={styles.productItemMainContent}>
                    <View style={styles.productNameContainer}>
                      <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                        {product.name}
                      </Text>
                      <Text style={styles.productCode} numberOfLines={1} ellipsizeMode="tail">{product.code}</Text>
                      
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
                        ${formatInteger(product.total)}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => removeProduct(index)}
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
        
        {/* Totales */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Totales</Text>
            <View style={styles.totalItemsBadge}>
              <Text style={styles.totalItemsText}>{products.length} productos</Text>
            </View>
          </View>
          
          <View style={styles.totalsContainer}>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Total Neto</Text>
              <Text style={styles.grandTotalValue}>${formatInteger(netTotal)}</Text>
            </View>
          </View>
        </View>
        
        {/* Estado de la Guía */}
        <View style={styles.waybillStatusContainer}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, selectedTransferType ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={styles.statusText}>Tipo de transferencia seleccionado</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, client ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={styles.statusText}>Cliente seleccionado</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, products.length > 0 ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={styles.statusText}>Productos agregados</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, netTotal > 0 ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={styles.statusText}>Totales calculados</Text>
          </View>
        </View>
        
        {/* Botón de Guardar */}
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            isGeneratingWaybill && styles.saveButtonDisabled,
            (!client || products.length === 0 || !selectedTransferType) && styles.saveButtonDisabled
          ]}
          onPress={handleGenerateWaybill}
          disabled={isGeneratingWaybill || !client || products.length === 0 || !selectedTransferType}
        >
          {isGeneratingWaybill ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>
              Generar Guía de Despacho
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      {/* Modales */}
      
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
      
      {/* Modal para selección de tipo de transferencia */}
      <Modal
        visible={showTransferTypeModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tipo de Transferencia</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTransferTypeModal(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {loadingTransferTypes ? (
              <ActivityIndicator size="large" color="#0066CC" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={transferTypes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.typeListItem}
                    onPress={() => {
                      setSelectedTransferType(item);
                      setShowTransferTypeModal(false);
                    }}
                  >
                    <View style={styles.typeListInfo}>
                      <Text style={styles.typeListName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                      <Text style={styles.typeListCode}>Código: {item.code}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.modalList}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    No se encontraron tipos de transferencia
                  </Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>
      
      {/* Modal para selección de tipo de despacho */}
      <Modal
        visible={showDispatchTypeModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tipo de Despacho</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDispatchTypeModal(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {loadingDispatchTypes ? (
              <ActivityIndicator size="large" color="#0066CC" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={dispatchTypes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.typeListItem}
                    onPress={() => {
                      setSelectedDispatchType(item);
                      setShowDispatchTypeModal(false);
                    }}
                  >
                    <View style={styles.typeListInfo}>
                      <Text style={styles.typeListName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                      <Text style={styles.typeListCode}>Código: {item.code}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.modalList}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    No se encontraron tipos de despacho
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
          value={emissionDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
          minimumDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  waybillIdContainer: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  waybillIdLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066CC',
    marginRight: 8,
  },
  waybillIdValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
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
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  typeSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 10,
  },
  typeSelectorText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
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
    marginBottom: 12,
  },
  clientIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  clientInfo: {
    flex: 1,
    flexWrap: 'nowrap',
    overflow: 'hidden',
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
  saveButton: {
    backgroundColor: '#0066CC',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonDisabled: {
    backgroundColor: '#99CCFF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
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
  modalList: {
    flex: 1,
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
    color: '#333',
    marginBottom: 2,
  },
  clientListRut: {
    fontSize: 14,
    color: '#888',
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
    color: '#333',
    marginBottom: 5,
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
  typeListItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  typeListInfo: {
    flex: 1,
  },
  typeListName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  typeListCode: {
    fontSize: 14,
    color: '#888',
  },
  emptyListText: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
    fontStyle: 'italic',
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
  totalItemsBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalItemsText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500',
  },
  waybillStatusContainer: {
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
});
