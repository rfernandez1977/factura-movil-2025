import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Clock, Eye, Zap, Brain } from 'lucide-react-native';

export default function ViewPosScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ViewPos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Camera size={80} color="#4CAF50" />
        </View>

        <Text style={styles.title}>Próximamente</Text>
        <Text style={styles.subtitle}>Captura de productos con IA</Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Eye size={20} color="#A0AEC0" />
            <Text style={styles.featureText}>Reconocimiento visual de productos</Text>
          </View>
          <View style={styles.featureItem}>
            <Brain size={20} color="#A0AEC0" />
            <Text style={styles.featureText}>Inteligencia artificial avanzada</Text>
          </View>
          <View style={styles.featureItem}>
            <Zap size={20} color="#A0AEC0" />
            <Text style={styles.featureText}>Carga automática al carrito</Text>
          </View>
          <View style={styles.featureItem}>
            <Clock size={20} color="#A0AEC0" />
            <Text style={styles.featureText}>Múltiples productos simultáneos</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Estamos desarrollando una experiencia revolucionaria de captura de productos mediante visión artificial.
          Pronto podrás escanear productos con tu cámara y agregarlos automáticamente al carrito de compras.
        </Text>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => router.push('/quick')}
        >
          <Text style={styles.quickButtonText}>Usar Quick por ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D3748',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#A0AEC0',
    marginBottom: 40,
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#E2E8F0',
    marginLeft: 15,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  quickButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
