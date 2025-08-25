import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { 
  ArrowLeft, 
  Save, 
  X,
  Plus,
  MapPin,
  Building
} from 'lucide-react-native';
import { router } from 'expo-router';

import { 
  ActionButton 
} from './components';
import { 
  colors, 
  typography, 
  spacing, 
  borders,
  componentStyles
} from './utils/designSystem';
// import { createClient, getMunicipalities, getActivities } from './services/api';

interface NewClientForm {
  name: string;
  code: string;
  email: string;
  address: string;
  municipality: string;
  activity: string;
  line: string;
  additionalAddresses: Array<{
    id: number;
    address: string;
    municipality: string;
  }>;
}

export default function NewClient() {
  const [form, setForm] = useState<NewClientForm>({
    name: '',
    code: '',
    email: '',
    address: '',
    municipality: '',
    activity: '',
    line: '',
    additionalAddresses: [],
  });

  const [loading, setLoading] = useState(false);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // Cargar datos de municipios y actividades al montar el componente
  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    // TODO: Implementar cuando las APIs estén disponibles
    console.log('Using mock data for form');
    
    // Datos mock para municipios
    setMunicipalities([
      { id: 1, name: 'Santiago' },
      { id: 2, name: 'Valparaíso' },
      { id: 3, name: 'Concepción' },
      { id: 4, name: 'San Antonio' },
      { id: 5, name: 'Curicó' }
    ]);

    // Datos mock para actividades
    setActivities([
      { id: 1, name: 'Desarrollo de Software' },
      { id: 2, name: 'Agricultura' },
      { id: 3, name: 'Construcción' },
      { id: 4, name: 'Comercio' },
      { id: 5, name: 'Servicios' }
    ]);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Preparar datos del cliente
      const clientData = {
        name: form.name,
        code: form.code,
        email: form.email,
        address: form.address,
        municipality: form.municipality,
        activity: form.activity,
        line: form.line,
        additionalAddresses: form.additionalAddresses.map(addr => ({
          address: addr.address,
          municipality: addr.municipality
        }))
      };

      // TODO: Implementar cuando la API esté disponible
      console.log('Mock client creation:', clientData);
      
      Alert.alert(
        'Éxito',
        'Cliente creado correctamente (modo demo)',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating client:', error);
      Alert.alert('Error', 'No se pudo crear el cliente. Verifique los datos e intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    if (!form.code.trim()) {
      Alert.alert('Error', 'El RUT es requerido');
      return false;
    }
    if (!form.address.trim()) {
      Alert.alert('Error', 'La dirección es requerida');
      return false;
    }
    if (!form.municipality.trim()) {
      Alert.alert('Error', 'El municipio es requerido');
      return false;
    }
    if (!form.activity.trim()) {
      Alert.alert('Error', 'La actividad es requerida');
      return false;
    }
    return true;
  };

  const addAdditionalAddress = () => {
    const newAddress = {
      id: Date.now(),
      address: '',
      municipality: '',
    };
    setForm(prev => ({
      ...prev,
      additionalAddresses: [...prev.additionalAddresses, newAddress],
    }));
  };

  const removeAdditionalAddress = (id: number) => {
    setForm(prev => ({
      ...prev,
      additionalAddresses: prev.additionalAddresses.filter(addr => addr.id !== id),
    }));
  };

  const updateAdditionalAddress = (id: number, field: 'address' | 'municipality', value: string) => {
    setForm(prev => ({
      ...prev,
      additionalAddresses: prev.additionalAddresses.map(addr =>
        addr.id === id ? { ...addr, [field]: value } : addr
      ),
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Cliente</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Información Básica */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Básica</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre/Razón Social *</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
            placeholder="Ingrese el nombre o razón social"
            placeholderTextColor={colors.textDisabled}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>RUT *</Text>
          <TextInput
            style={styles.input}
            value={form.code}
            onChangeText={(text) => setForm(prev => ({ ...prev, code: text }))}
            placeholder="12345678-9"
            placeholderTextColor={colors.textDisabled}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
            placeholder="correo@ejemplo.cl"
            placeholderTextColor={colors.textDisabled}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Dirección *</Text>
          <TextInput
            style={styles.input}
            value={form.address}
            onChangeText={(text) => setForm(prev => ({ ...prev, address: text }))}
            placeholder="Ingrese la dirección principal"
            placeholderTextColor={colors.textDisabled}
          />
        </View>
      </View>

      {/* Ubicación y Actividad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ubicación y Actividad</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Municipio *</Text>
          <View style={styles.selectContainer}>
            <TextInput
              style={styles.selectInput}
              value={form.municipality}
              onChangeText={(text) => setForm(prev => ({ ...prev, municipality: text }))}
              placeholder="Seleccione municipio"
              placeholderTextColor={colors.textDisabled}
            />
            <MapPin size={20} color={colors.textSecondary} style={styles.selectIcon} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Actividad *</Text>
          <View style={styles.selectContainer}>
            <TextInput
              style={styles.selectInput}
              value={form.activity}
              onChangeText={(text) => setForm(prev => ({ ...prev, activity: text }))}
              placeholder="Seleccione actividad"
              placeholderTextColor={colors.textDisabled}
            />
            <Building size={20} color={colors.textSecondary} style={styles.selectIcon} />
          </View>
        </View>
      </View>

      {/* Direcciones Adicionales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Direcciones Adicionales</Text>
        
        {form.additionalAddresses.map((address) => (
          <View key={address.id} style={styles.additionalAddressCard}>
            <View style={styles.additionalAddressHeader}>
              <Text style={styles.additionalAddressTitle}>Dirección Adicional</Text>
              <TouchableOpacity
                onPress={() => removeAdditionalAddress(address.id)}
                style={styles.removeButton}
              >
                <X size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={styles.input}
                value={address.address}
                onChangeText={(text) => updateAdditionalAddress(address.id, 'address', text)}
                placeholder="Ingrese dirección adicional"
                placeholderTextColor={colors.textDisabled}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Municipio</Text>
              <TextInput
                style={styles.input}
                value={address.municipality}
                onChangeText={(text) => updateAdditionalAddress(address.id, 'municipality', text)}
                placeholder="Ingrese municipio"
                placeholderTextColor={colors.textDisabled}
              />
            </View>
          </View>
        ))}
        
        <ActionButton
          title="Agregar Dirección Adicional"
          icon={<Plus size={20} color={colors.surface} />}
          variant="outline"
          size="medium"
          onPress={addAdditionalAddress}
        />
      </View>

      {/* Línea de Negocio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Línea de Negocio</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.line}
            onChangeText={(text) => setForm(prev => ({ ...prev, line: text }))}
            placeholder="Describa la línea de negocio"
            placeholderTextColor={colors.textDisabled}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actionsSection}>
        <View style={styles.actionsContainer}>
          <ActionButton
            title="Cancelar"
            variant="outline"
            size="large"
            onPress={handleBack}
            disabled={loading}
          />
          <ActionButton
            title="Guardar Cliente"
            icon={<Save size={20} color={colors.surface} />}
            variant="primary"
            size="large"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
          />
        </View>
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
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  
  formGroup: {
    marginBottom: spacing.md,
  },
  
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  input: {
    ...componentStyles.input,
    borderColor: colors.textDisabled,
  },
  
  textArea: {
    height: 80,
    paddingTop: spacing.sm,
  },
  
  selectContainer: {
    position: 'relative',
  },
  
  selectInput: {
    ...componentStyles.input,
    borderColor: colors.textDisabled,
    paddingRight: 40,
  },
  
  selectIcon: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -10,
  },
  
  additionalAddressCard: {
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
  
  additionalAddressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  additionalAddressTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  
  removeButton: {
    padding: spacing.xs,
  },
  
  actionsSection: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
