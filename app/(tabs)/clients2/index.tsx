import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Clients2Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes 2</Text>
      <Text style={styles.subtitle}>Página de prueba</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
