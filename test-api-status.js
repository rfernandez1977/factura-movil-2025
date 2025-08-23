const axios = require('axios');

// Configuración de la API
const API_BASE = 'http://produccion.facturamovil.cl';
const API_TOKEN = '61b93157-44f1-4ab1-bc38-f55861b7febb';

async function testAPIStatus() {
  try {
    console.log('🔍 Verificando estado de la API...');
    
    // Test 1: Verificar endpoint de productos general
    console.log('\n📋 Test 1: Endpoint de productos general');
    try {
      const response1 = await axios.get(`${API_BASE}/services/common/product`, {
        headers: {
          'FACMOV_T': API_TOKEN
        }
      });
      console.log('✅ Productos generales:', response1.data?.products?.length || 0, 'productos encontrados');
    } catch (error) {
      console.log('❌ Error en productos generales:', error.response?.status, error.response?.data);
    }
    
    // Test 2: Verificar endpoint de productos específico (Wisky)
    console.log('\n📋 Test 2: Endpoint de producto específico (Wisky)');
    try {
      const response2 = await axios.get(`${API_BASE}/services/common/product/878765568`, {
        headers: {
          'FACMOV_T': API_TOKEN
        }
      });
      console.log('✅ Producto Wisky encontrado:', response2.data?.products?.[0]?.name);
    } catch (error) {
      console.log('❌ Error en producto específico:', error.response?.status, error.response?.data);
    }
    
    // Test 3: Verificar endpoint de clientes
    console.log('\n📋 Test 3: Endpoint de clientes');
    try {
      const response3 = await axios.get(`${API_BASE}/services/common/client`, {
        headers: {
          'FACMOV_T': API_TOKEN
        }
      });
      console.log('✅ Clientes:', response3.data?.clients?.length || 0, 'clientes encontrados');
    } catch (error) {
      console.log('❌ Error en clientes:', error.response?.status, error.response?.data);
    }
    
    // Test 4: Verificar autenticación
    console.log('\n📋 Test 4: Verificar autenticación');
    try {
      const response4 = await axios.get(`${API_BASE}/services/common/user/eyJsb2dpbiI6InJmZXJuYW5kZXoiLCJwYXNzd29yZCI6IjgzNTU5NzA0In0=`, {
        headers: {
          'FACMOV_T': API_TOKEN
        }
      });
      console.log('✅ Autenticación válida:', response4.data?.users?.[0]?.name);
    } catch (error) {
      console.log('❌ Error en autenticación:', error.response?.status, error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testAPIStatus();
