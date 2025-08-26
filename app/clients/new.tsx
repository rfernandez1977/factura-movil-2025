import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  KeyboardAvoidingView,
  Switch,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Building2, MapPin, Briefcase, Phone, Mail, CircleUser as UserCircle, Plus, Trash2, X, Check, ChevronDown } from 'lucide-react-native';
import { api } from '../../services/api';

// Interfaz para direcciones
interface Address {
  id: string;
  street: string;
  district: string;
  city: string;
  isMain: boolean;
}

export default function NewClientScreen() {
  const router = useRouter();
  
  // Estado para tipo de cliente (persona o empresa)
  const [isCompany, setIsCompany] = useState(true);
  
  // Estado para datos básicos
  const [rut, setRut] = useState('');
  const [name, setName] = useState('');
  const [businessActivity, setBusinessActivity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  
  // Estado para direcciones
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      street: '',
      district: '',
      city: '',
      isMain: true
    }
  ]);
  
  // Estado para modal de dirección
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  // Estados para integración con backend
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showMunicipalityModal, setShowMunicipalityModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  
  // Cargar datos del backend al montar el componente
  useEffect(() => {
    loadFormData();
  }, []);
  
  const loadFormData = async () => {
    try {
      setLoadingData(true);
      
      // Cargar municipios y actividades en paralelo
      const [municipalitiesData, activitiesData] = await Promise.all([
        api.getMunicipalities(),
        api.getActivities()
      ]);
      
      setMunicipalities(municipalitiesData);
      setActivities(activitiesData);
      
      console.log('Form data loaded:', {
        municipalities: municipalitiesData.length,
        activities: activitiesData.length
      });
    } catch (error) {
      console.error('Error loading form data:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los datos del formulario. Algunas opciones pueden no estar disponibles.'
      );
    } finally {
      setLoadingData(false);
    }
  };
  
  // Validación de RUT chileno
  const validateRut = (rutValue: string) => {
    if (!rutValue) return false;
    
    // Eliminar puntos y guión
    let cleanRut = rutValue.replace(/\./g, '').replace(/-/g, '');
    
    // Separar cuerpo y dígito verificador
    let body = cleanRut.slice(0, -1);
    let dv = cleanRut.slice(-1).toUpperCase();
    
    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i)) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    let expectedDV = 11 - (sum % 11);
    let expectedDVStr = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();
    
    return dv === expectedDVStr;
  };
  
  // Formatear RUT
  const formatRut = (rutValue: string) => {
    // Eliminar puntos y guión
    let cleanRut = rutValue.replace(/\./g, '').replace(/-/g, '');
    
    // Si está vacío, devolver vacío
    if (cleanRut.length === 0) return '';
    
    // Separar cuerpo y dígito verificador
    let body = cleanRut.slice(0, -1);
    let dv = cleanRut.slice(-1);
    
    // Formatear cuerpo con puntos
    let formattedBody = '';
    let count = 0;
    
    for (let i = body.length - 1; i >= 0; i--) {
      count++;
      formattedBody = body.charAt(i) + formattedBody;
      if (count === 3 && i !== 0) {
        formattedBody = '.' + formattedBody;
        count = 0;
      }
    }
    
    // Devolver RUT formateado
    return formattedBody + '-' + dv;
  };
  
  // Manejar cambio de RUT
  const handleRutChange = (text: string) => {
    // Permitir solo números y K
    const cleanedText = text.replace(/[^0-9kK]/g, '');
    setRut(cleanedText);
  };
  
  // Abrir modal para agregar dirección
  const openAddressModal = (address?: Address) => {
    if (address) {
      setCurrentAddress(address);
      setEditingAddressId(address.id);
    } else {
      setCurrentAddress({
        id: Date.now().toString(),
        street: '',
        district: '',
        city: '',
        isMain: addresses.length === 0
      });
      setEditingAddressId(null);
    }
    setShowAddressModal(true);
  };
  
  // Guardar dirección
  const saveAddress = () => {
    if (!currentAddress) return;
    
    if (!currentAddress.street || !currentAddress.district || !currentAddress.city) {
      Alert.alert('Error', 'Por favor complete todos los campos de la dirección');
      return;
    }
    
    if (editingAddressId) {
      // Actualizar dirección existente
      setAddresses(addresses.map(addr => 
        addr.id === editingAddressId ? currentAddress : addr
      ));
    } else {
      // Agregar nueva dirección
      setAddresses([...addresses, currentAddress]);
    }
    
    setShowAddressModal(false);
    setCurrentAddress(null);
    setEditingAddressId(null);
  };
  
  // Eliminar dirección
  const deleteAddress = (id: string) => {
    // Verificar si es la única dirección
    if (addresses.length === 1) {
      Alert.alert('Error', 'Debe tener al menos una dirección');
      return;
    }
    
    // Verificar si es la dirección principal
    const isMain = addresses.find(addr => addr.id === id)?.isMain;
    
    // Eliminar dirección
    const newAddresses = addresses.filter(addr => addr.id !== id);
    
    // Si era la dirección principal, establecer la primera como principal
    if (isMain && newAddresses.length > 0) {
      newAddresses[0].isMain = true;
    }
    
    setAddresses(newAddresses);
  };
  
  // Establecer dirección principal
  const setMainAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isMain: addr.id === id
    })));
  };
  
  // Validar formulario
  const validateForm = () => {
    if (!rut) {
      Alert.alert('Error', 'El RUT es obligatorio');
      return false;
    }
    
    if (!validateRut(rut)) {
      Alert.alert('Error', 'El RUT ingresado no es válido');
      return false;
    }
    
    if (!name) {
      Alert.alert('Error', isCompany ? 'La razón social es obligatoria' : 'El nombre es obligatorio');
      return false;
    }
    
    if (isCompany && !businessActivity) {
      Alert.alert('Error', 'La actividad económica es obligatoria');
      return false;
    }
    
    if (!phone) {
      Alert.alert('Error', 'El teléfono es obligatorio');
      return false;
    }
    
    if (!email) {
      Alert.alert('Error', 'El correo electrónico es obligatorio');
      return false;
    }
    
    // Validar que al menos una dirección tenga datos completos
    const validAddress = addresses.some(addr => 
      addr.street && addr.district && addr.city
    );
    
    if (!validAddress) {
      Alert.alert('Error', 'Debe ingresar al menos una dirección completa');
      return false;
    }
    
    return true;
  };
  
  // Guardar cliente
  const saveClient = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Preparar datos del cliente para el backend
      const clientData = {
        code: rut.replace(/\./g, '').replace(/-/g, ''), // RUT sin formato
        name: name,
        email: email,
        phone: phone,
        line: isCompany ? businessActivity : 'Persona Natural',
        address: addresses.find(addr => addr.isMain)?.street || '',
        municipality: selectedMunicipality ? {
          id: selectedMunicipality.id,
          name: selectedMunicipality.name,
          code: selectedMunicipality.code
        } : null,
        activity: selectedActivity ? {
          id: selectedActivity.id,
          name: selectedActivity.name,
          code: selectedActivity.code
        } : null,
        additionalAddress: addresses
          .filter(addr => !addr.isMain && addr.street && addr.district && addr.city)
          .map(addr => ({
            address: addr.street,
            municipality: {
              name: addr.city,
              code: addr.district
            }
          }))
      };
      
      console.log('Saving client with data:', JSON.stringify(clientData, null, 2));
      
      // Crear cliente en el backend
      const response = await api.createClient(clientData);
      
      console.log('Client created successfully:', response);
      
      Alert.alert(
        'Cliente Guardado',
        'El cliente ha sido registrado correctamente',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/clients') 
          }
        ]
      );
      
    } catch (error: any) {
      console.error('Error saving client:', error);
      
      let errorMessage = 'Error al guardar el cliente';
      
      if (error.response?.data?.message) {
        errorMessage += ': ' + error.response.data.message;
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Nuevo Cliente</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Tipo de Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Cliente</Text>
          <View style={styles.clientTypeContainer}>
            <TouchableOpacity
              style={[
                styles.clientTypeOption,
                isCompany && styles.clientTypeSelected
              ]}
              onPress={() => setIsCompany(true)}
            >
              <Building2 
                size={24} 
                color={isCompany ? '#0066CC' : '#666'} 
                style={styles.clientTypeIcon} 
              />
              <Text style={[
                styles.clientTypeText,
                isCompany && styles.clientTypeTextSelected
              ]}>Empresa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.clientTypeOption,
                !isCompany && styles.clientTypeSelected
              ]}
              onPress={() => setIsCompany(false)}
            >
              <User 
                size={24} 
                color={!isCompany ? '#0066CC' : '#666'} 
                style={styles.clientTypeIcon} 
              />
              <Text style={[
                styles.clientTypeText,
                !isCompany && styles.clientTypeTextSelected
              ]}>Persona</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Datos Básicos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos Básicos</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>RUT *</Text>
            <TextInput
              style={styles.input}
              value={rut}
              onChangeText={handleRutChange}
              placeholder="Ej. 12345678-9"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {isCompany ? 'Razón Social *' : 'Nombre Completo *'}
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={isCompany ? 'Ej. Empresa ABC S.A.C.' : 'Ej. Juan Pérez'}
            />
          </View>
          
          {isCompany && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Actividad Económica / Giro *</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setShowActivityModal(true)}
              >
                <Text style={[
                  styles.selectorButtonText,
                  !selectedActivity && styles.selectorButtonPlaceholder
                ]}>
                  {selectedActivity ? selectedActivity.name : 'Seleccionar actividad'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Municipio</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowMunicipalityModal(true)}
            >
              <Text style={[
                styles.selectorButtonText,
                !selectedMunicipality && styles.selectorButtonPlaceholder
              ]}>
                {selectedMunicipality ? selectedMunicipality.name : 'Seleccionar municipio'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Teléfono *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Ej. 912345678"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo Electrónico *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Ej. contacto@empresa.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          {isCompany && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre de Contacto</Text>
              <TextInput
                style={styles.input}
                value={contactName}
                onChangeText={setContactName}
                placeholder="Ej. María López"
              />
            </View>
          )}
        </View>
        
        {/* Direcciones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Direcciones</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => openAddressModal()}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {addresses.map((address, index) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={styles.addressTitleContainer}>
                  <MapPin size={18} color="#0066CC" style={styles.addressIcon} />
                  <Text style={styles.addressTitle}>
                    Dirección {index + 1}
                    {address.isMain && <Text style={styles.mainAddressTag}> (Principal)</Text>}
                  </Text>
                </View>
                <View style={styles.addressActions}>
                  {!address.isMain && (
                    <TouchableOpacity
                      style={styles.setMainButton}
                      onPress={() => setMainAddress(address.id)}
                    >
                      <Check size={16} color="#0066CC" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.editAddressButton}
                    onPress={() => openAddressModal(address)}
                  >
                    <Text style={styles.editAddressText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteAddressButton}
                    onPress={() => deleteAddress(address.id)}
                  >
                    <Trash2 size={16} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.addressDetails}>
                {address.street ? (
                  <>
                    <Text style={styles.addressText}>
                      <Text style={styles.addressLabel}>Calle: </Text>
                      {address.street}
                    </Text>
                    <Text style={styles.addressText}>
                      <Text style={styles.addressLabel}>Comuna: </Text>
                      {address.district}
                    </Text>
                    <Text style={styles.addressText}>
                      <Text style={styles.addressLabel}>Ciudad: </Text>
                      {address.city}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.emptyAddressText}>
                    Haga clic en "Editar" para completar los datos de esta dirección
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
        
        {/* Botón de Guardar */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={saveClient}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cliente</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      {/* Modal para agregar/editar dirección */}
      <Modal
        visible={showAddressModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddressId ? 'Editar Dirección' : 'Nueva Dirección'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddressModal(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalInputLabel}>Calle / Avenida *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={currentAddress?.street}
                  onChangeText={(text) => 
                    setCurrentAddress(prev => prev ? {...prev, street: text} : null)
                  }
                  placeholder="Ej. Av. Principal 123"
                />
              </View>
              
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalInputLabel}>Comuna *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={currentAddress?.district}
                  onChangeText={(text) => 
                    setCurrentAddress(prev => prev ? {...prev, district: text} : null)
                  }
                  placeholder="Ej. Las Condes"
                />
              </View>
              
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalInputLabel}>Ciudad *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={currentAddress?.city}
                  onChangeText={(text) => 
                    setCurrentAddress(prev => prev ? {...prev, city: text} : null)
                  }
                  placeholder="Ej. Santiago"
                />
              </View>
              
              <View style={styles.mainAddressContainer}>
                <Text style={styles.mainAddressLabel}>¿Es dirección principal?</Text>
                <Switch
                  value={currentAddress?.isMain || false}
                  onValueChange={(value) => 
                    setCurrentAddress(prev => prev ? {...prev, isMain: value} : null)
                  }
                  trackColor={{ false: '#ddd', true: '#0066CC' }}
                  thumbColor={Platform.OS === 'ios' ? '#fff' : currentAddress?.isMain ? '#fff' : '#f4f3f4'}
                  disabled={editingAddressId && addresses.find(a => a.id === editingAddressId)?.isMain}
                />
              </View>
              
              <TouchableOpacity
                style={styles.saveAddressButton}
                onPress={saveAddress}
              >
                <Text style={styles.saveAddressButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal para seleccionar municipio */}
      <Modal
        visible={showMunicipalityModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Municipio</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowMunicipalityModal(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              {loadingData ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0066CC" />
                  <Text style={styles.loadingText}>Cargando municipios...</Text>
                </View>
              ) : municipalities.length > 0 ? (
                <FlatList
                  data={municipalities}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedMunicipality(item);
                        setShowMunicipalityModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.name}</Text>
                      {selectedMunicipality?.id === item.id && (
                        <Check size={20} color="#0066CC" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={styles.emptyText}>No hay municipios disponibles</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal para seleccionar actividad */}
      <Modal
        visible={showActivityModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Actividad</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowActivityModal(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              {loadingData ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0066CC" />
                  <Text style={styles.loadingText}>Cargando actividades...</Text>
                </View>
              ) : activities.length > 0 ? (
                <FlatList
                  data={activities}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedActivity(item);
                        setShowActivityModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.name}</Text>
                      {selectedActivity?.id === item.id && (
                        <Check size={20} color="#0066CC" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={styles.emptyText}>No hay actividades disponibles</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clientTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clientTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius:  10,
    backgroundColor: '#f5f5f5',
  },
  clientTypeSelected: {
    backgroundColor: '#E3F2FD',
  },
  clientTypeIcon: {
    marginRight: 10,
  },
  clientTypeText: {
    fontSize: 16,
    color: '#666',
  },
  clientTypeTextSelected: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#0066CC',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    marginRight: 5,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mainAddressTag: {
    color: '#0066CC',
    fontStyle: 'italic',
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setMainButton: {
    padding: 5,
    marginRight: 5,
  },
  editAddressButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  editAddressText: {
    color: '#0066CC',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteAddressButton: {
    padding: 5,
  },
  addressDetails: {
    marginTop: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  addressLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  emptyAddressText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
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
  modalContent: {
    padding: 20,
  },
  modalInputContainer: {
    marginBottom: 15,
  },
  modalInputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
  },
  mainAddressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainAddressLabel: {
    fontSize: 14,
    color: '#666',
  },
  saveAddressButton: {
    backgroundColor: '#0066CC',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveAddressButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para selectores
  selectorButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectorButtonPlaceholder: {
    color: '#999',
  },
  // Estilos para botón deshabilitado
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  // Estilos para modales de selección
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});