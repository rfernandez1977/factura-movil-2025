import { api } from '../../../services/api';
import { 
  InvoiceResponse, 
  ClientResponse, 
  Client, 
  ClientPurchase, 
  ClientProduct,
  ClientAnalytics,
  ClientSummary,
  TopProducts,
  SalesStatistics,
  TemporalComparisons,
  TopClients,
  BusinessMetrics
} from '../types';

// ========================================
// SERVICIOS DE INTEGRACIÓN CON APIs
// ========================================

/**
 * Obtiene facturas históricas por cliente
 */
export const getClientInvoices = async (search: string): Promise<InvoiceResponse> => {
  try {
    const response = await api.axiosInstance.get(`/services/invoice/${search}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client invoices:', error);
    throw error;
  }
};

/**
 * Obtiene las últimas ventas de la empresa
 */
export const getLastSales = async (search: string): Promise<any> => {
  try {
    const response = await api.axiosInstance.get(`/services/common/company/487/lastsales/${search}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching last sales:', error);
    throw error;
  }
};

/**
 * Obtiene lista de clientes
 */
export const getClients = async (search?: string): Promise<ClientResponse> => {
  try {
    const endpoint = search ? `/services/client/${search}` : '/services/client';
    const response = await api.axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

/**
 * Obtiene un cliente específico por RUT
 */
export const getClientById = async (clientRut: string): Promise<any> => {
  try {
    // Intentar usar API específica si existe
    try {
      const response = await api.axiosInstance.get(`/services/client/${clientRut}`);
      return response.data;
    } catch (apiError) {
      // Si la API no existe, buscar en la lista de clientes
      console.log('API /services/client/{rut} not available, searching in client list');
      const clients = await getClients();
      const client = clients.clients.find(c => c.code === clientRut || c.id.toString() === clientRut);
      if (!client) {
        throw new Error(`Client with RUT ${clientRut} not found`);
      }
      return client;
    }
  } catch (error) {
    console.error('Error fetching client by RUT:', error);
    throw error;
  }
};

/**
 * Crea un nuevo cliente
 */
export const createClient = async (clientData: any): Promise<any> => {
  try {
    const response = await api.axiosInstance.post('/services/client', clientData);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

/**
 * Obtiene municipios
 */
export const getMunicipalities = async (): Promise<any> => {
  try {
    const response = await api.axiosInstance.get('/services/municipality');
    return response.data;
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    throw error;
  }
};

/**
 * Obtiene actividades
 */
export const getActivities = async (): Promise<any> => {
  try {
    const response = await api.axiosInstance.get('/services/activity');
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};

/**
 * Obtiene productos
 */
export const getProducts = async (search?: string): Promise<any> => {
  try {
    const endpoint = search ? `/services/product/${search}` : '/services/product';
    const response = await api.axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// ========================================
// SERVICIOS DE ANÁLISIS Y REPORTES
// ========================================

/**
 * Genera análisis completo de un cliente
 */
export const generateClientAnalytics = async (clientRut: string): Promise<ClientAnalytics> => {
  try {
    // Intentar usar API específica si existe
    try {
      const response = await api.axiosInstance.get(`/services/client/${clientRut}/analytics`);
      return response.data;
    } catch (apiError) {
      // Si la API no existe, procesar localmente
      console.log('API /services/client/{rut}/analytics not available, processing locally');
      const invoices = await getClientInvoices(clientRut);
      const analytics = processClientData(invoices, clientRut);
      return analytics;
    }
  } catch (error) {
    console.error('Error generating client analytics:', error);
    throw error;
  }
};

/**
 * Genera resumen ejecutivo de un cliente
 */
export const generateClientSummary = async (clientRut: string): Promise<ClientSummary> => {
  try {
    // Intentar usar API específica si existe
    try {
      const response = await api.axiosInstance.get(`/services/client/${clientRut}/summary`);
      return response.data;
    } catch (apiError) {
      // Si la API no existe, procesar localmente
      console.log('API /services/client/{rut}/summary not available, processing locally');
      const analytics = await generateClientAnalytics(clientRut);
      const client = await getClientById(clientRut);
      
      return {
        clientInfo: {
          id: client.id,
          name: client.name,
          code: client.code,
          email: client.email || '',
          municipality: client.municipality.name,
          activity: client.activity.name
        },
        keyMetrics: {
          totalPurchases: analytics.total_purchases,
          totalAmount: analytics.total_amount,
          averagePurchase: analytics.average_purchase,
          lastPurchaseDate: new Date(analytics.last_purchase_date),
          purchaseFrequency: analytics.purchase_frequency,
          customerLifetime: calculateCustomerLifetime(analytics.created_at)
        },
        performanceIndicators: {
          growthRate: analytics.growth_percentage,
          loyaltyScore: calculateLoyaltyScore(analytics),
          riskLevel: calculateRiskLevel(analytics),
          potentialValue: calculatePotentialValue(analytics)
        }
      };
    }
  } catch (error) {
    console.error('Error generating client summary:', error);
    throw error;
  }
};

/**
 * Genera reporte de productos más comprados
 */
export const generateTopProducts = async (clientRut: string): Promise<TopProducts> => {
  try {
    // Intentar usar API específica si existe
    try {
      const response = await api.axiosInstance.get(`/services/client/${clientRut}/top-products`);
      return response.data;
    } catch (apiError) {
      // Si la API no existe, procesar localmente
      console.log('API /services/client/{rut}/top-products not available, processing locally');
      const invoices = await getClientInvoices(clientRut);
      return processTopProductsData(invoices);
    }
  } catch (error) {
    console.error('Error generating top products:', error);
    throw error;
  }
};

/**
 * Genera estadísticas de ventas
 */
export const generateSalesStatistics = async (clientRut: string): Promise<SalesStatistics> => {
  try {
    // Intentar usar API específica si existe
    try {
      const response = await api.axiosInstance.get(`/services/client/${clientRut}/sales-statistics`);
      return response.data;
    } catch (apiError) {
      // Si la API no existe, procesar localmente
      console.log('API /services/client/{rut}/sales-statistics not available, processing locally');
      const invoices = await getClientInvoices(clientRut);
      return processSalesStatisticsData(invoices);
    }
  } catch (error) {
    console.error('Error generating sales statistics:', error);
    throw error;
  }
};

/**
 * Genera comparaciones temporales
 */
export const generateTemporalComparisons = async (clientRut: string): Promise<TemporalComparisons> => {
  try {
    // Intentar usar API específica si existe
    try {
      const response = await api.axiosInstance.get(`/services/client/${clientRut}/temporal-comparisons`);
      return response.data;
    } catch (apiError) {
      // Si la API no existe, procesar localmente
      console.log('API /services/client/{rut}/temporal-comparisons not available, processing locally');
      const invoices = await getClientInvoices(clientRut);
      return processTemporalComparisonsData(invoices);
    }
  } catch (error) {
    console.error('Error generating temporal comparisons:', error);
    throw error;
  }
};

/**
 * Genera top de clientes
 */
export const generateTopClients = async (): Promise<TopClients> => {
  try {
    // Intentar usar API específica si existe
    try {
      const response = await api.axiosInstance.get('/services/business/top-clients');
      return response.data;
    } catch (apiError) {
      // Si la API no existe, procesar localmente
      console.log('API /services/business/top-clients not available, processing locally');
      const clients = await getClients();
      const topClients = await Promise.all(
        clients.clients.map(async (client) => {
          try {
            const analytics = await generateClientAnalytics(client.id);
            return {
              clientId: client.id,
              clientName: client.name,
              totalAmount: analytics.total_amount || 0,
              totalPurchases: analytics.total_purchases || 0,
              averagePurchase: analytics.average_purchase || 0,
              lastPurchase: new Date(analytics.last_purchase_date || Date.now()),
              growthRate: analytics.growth_percentage || 0,
              loyaltyScore: calculateLoyaltyScore(analytics) || 0
            };
          } catch (error) {
            console.error(`Error processing client ${client.id}:`, error);
            return {
              clientId: client.id,
              clientName: client.name,
              totalAmount: 0,
              totalPurchases: 0,
              averagePurchase: 0,
              lastPurchase: new Date(),
              growthRate: 0,
              loyaltyScore: 0
            };
          }
        })
      );
      
      // Filtrar clientes válidos y asegurar que topClients sea un array
      const validTopClients = topClients.filter(client => client !== null && client !== undefined);
      
      return {
        byTotalAmount: validTopClients.sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 10),
        byPurchaseFrequency: validTopClients.sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 10),
        byGrowth: validTopClients.sort((a, b) => b.growthRate - a.growthRate).slice(0, 10),
        byLoyalty: validTopClients.sort((a, b) => b.loyaltyScore - a.loyaltyScore).slice(0, 10)
      };
    }
  } catch (error) {
    console.error('Error generating top clients:', error);
    throw error;
  }
};

/**
 * Genera métricas de negocio
 */
export const generateBusinessMetrics = async (): Promise<BusinessMetrics> => {
  try {
    // Intentar usar API específica si existe
    try {
      const response = await api.axiosInstance.get('/services/business/metrics');
      return response.data;
    } catch (apiError) {
      // Si la API no existe, procesar localmente
      console.log('API /services/business/metrics not available, processing locally');
      
      try {
        const clients = await getClients();
        const allClients = clients?.clients || [];
        
        const totalRevenue = allClients.reduce((sum, client) => sum + (client.total_amount || 0), 0);
        const totalPurchases = allClients.reduce((sum, client) => sum + (client.total_purchases || 0), 0);
        
        return {
          overview: {
            totalClients: allClients.length,
            activeClients: allClients.filter(c => c.last_purchase_date).length,
            totalRevenue,
            averageRevenuePerClient: allClients.length > 0 ? totalRevenue / allClients.length : 0,
            totalPurchases,
            averagePurchaseValue: totalPurchases > 0 ? totalRevenue / totalPurchases : 0
          },
          geographicDistribution: processGeographicDistribution(allClients),
          activityDistribution: processActivityDistribution(allClients),
          segmentation: processClientSegmentation(allClients)
        };
      } catch (localError) {
        console.error('Error processing business metrics locally:', localError);
        // Retornar datos por defecto si todo falla
        return {
          overview: {
            totalClients: 0,
            activeClients: 0,
            totalRevenue: 0,
            averageRevenuePerClient: 0,
            totalPurchases: 0,
            averagePurchaseValue: 0
          },
          geographicDistribution: [],
          activityDistribution: [],
          segmentation: []
        };
      }
    }
  } catch (error) {
    console.error('Error generating business metrics:', error);
    // Retornar datos por defecto en caso de error
    return {
      overview: {
        totalClients: 0,
        activeClients: 0,
        totalRevenue: 0,
        averageRevenuePerClient: 0,
        totalPurchases: 0,
        averagePurchaseValue: 0
      },
      geographicDistribution: [],
      activityDistribution: [],
      segmentation: []
    };
  }
};

// ========================================
// FUNCIONES AUXILIARES DE PROCESAMIENTO
// ========================================

/**
 * Procesa datos de facturas para análisis de cliente
 */
const processClientData = (invoices: InvoiceResponse, clientRut: string): ClientAnalytics => {
  // Validar que invoices y invoices.invoices existan
  if (!invoices || !invoices.invoices || !Array.isArray(invoices.invoices)) {
    console.warn('Invalid invoices data, returning default analytics');
    return {
      id: 1,
      client_id: 0,
      period_type: 'month',
      total_amount: 0,
      total_purchases: 0,
      average_purchase: 0,
      last_purchase_date: new Date().toISOString(),
      growth_percentage: 0,
      purchase_frequency: 0,
      created_at: new Date().toISOString()
    };
  }
  
  const clientInvoices = invoices.invoices.filter(inv => inv.client.code === clientRut || inv.client.id.toString() === clientRut);
  
  const totalAmount = clientInvoices.reduce((sum, inv) => sum + inv.netTotal + inv.taxes + inv.otherTaxes, 0);
  const totalPurchases = clientInvoices.length;
  const averagePurchase = totalPurchases > 0 ? totalAmount / totalPurchases : 0;
  
  // Calcular crecimiento mensual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthInvoices = clientInvoices.filter(inv => {
    const invDate = new Date(inv.date);
    return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
  });
  const previousMonthInvoices = clientInvoices.filter(inv => {
    const invDate = new Date(inv.date);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return invDate.getMonth() === prevMonth && invDate.getFullYear() === prevYear;
  });
  
  const currentMonthAmount = currentMonthInvoices.reduce((sum, inv) => sum + inv.netTotal + inv.taxes + inv.otherTaxes, 0);
  const previousMonthAmount = previousMonthInvoices.reduce((sum, inv) => sum + inv.netTotal + inv.taxes + inv.otherTaxes, 0);
  const growthPercentage = previousMonthAmount > 0 ? ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100 : 0;
  
  return {
    id: 1,
    client_id: clientId,
    period_type: 'month',
    period_start: new Date(currentYear, currentMonth, 1).toISOString(),
    period_end: new Date(currentYear, currentMonth + 1, 0).toISOString(),
    total_purchases: totalPurchases,
    total_amount: totalAmount,
    average_purchase: averagePurchase,
    growth_percentage: growthPercentage,
    top_product_id: 0,
    top_product_name: '',
    top_product_percentage: 0,
    purchase_frequency: calculatePurchaseFrequency(clientInvoices),
    created_at: new Date().toISOString()
  };
};

/**
 * Procesa datos para productos más comprados
 */
const processTopProductsData = (invoices: InvoiceResponse): TopProducts => {
  // Validar que invoices y invoices.invoices existan
  if (!invoices || !invoices.invoices || !Array.isArray(invoices.invoices)) {
    console.warn('Invalid invoices data for top products, returning empty data');
    return {
      byQuantity: [],
      byAmount: [],
      categoryAnalysis: []
    };
  }
  
  const productMap = new Map();
  
  invoices.invoices.forEach(invoice => {
    invoice.details.forEach(detail => {
      const productId = detail.product.id;
      const productName = detail.product.name;
      const category = detail.product.category.name;
      const quantity = detail.quantity;
      const amount = detail.product.price * quantity;
      
      if (productMap.has(productId)) {
        const existing = productMap.get(productId);
        existing.totalQuantity += quantity;
        existing.totalAmount += amount;
        existing.purchaseCount++;
      } else {
        productMap.set(productId, {
          productId,
          productName,
          category,
          totalQuantity: quantity,
          totalAmount: amount,
          purchaseCount: 1,
          averagePrice: detail.product.price
        });
      }
    });
  });
  
  const products = Array.from(productMap.values());
  const totalAmount = products.reduce((sum, p) => sum + p.totalAmount, 0);
  
  const byQuantity = products
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 10)
    .map(p => ({
      ...p,
      percentage: (p.totalAmount / totalAmount) * 100,
      lastPurchase: new Date(),
      trend: 'stable' as const
    }));
    
  const byAmount = products
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10)
    .map(p => ({
      ...p,
      percentage: (p.totalAmount / totalAmount) * 100,
      trend: 'stable' as const
    }));
    
  return {
    byQuantity,
    byAmount,
    categoryAnalysis: processCategoryAnalysis(products)
  };
};

/**
 * Procesa análisis por categorías
 */
const processCategoryAnalysis = (products: any[]): any[] => {
  const categoryMap = new Map();
  
  products.forEach(product => {
    if (categoryMap.has(product.category)) {
      const existing = categoryMap.get(product.category);
      existing.totalAmount += product.totalAmount;
      existing.productCount++;
    } else {
      categoryMap.set(product.category, {
        categoryName: product.category,
        totalAmount: product.totalAmount,
        productCount: 1,
        averagePrice: product.averagePrice
      });
    }
  });
  
  const categories = Array.from(categoryMap.values());
  const totalAmount = categories.reduce((sum, c) => sum + c.totalAmount, 0);
  
  return categories.map(c => ({
    ...c,
    percentage: (c.totalAmount / totalAmount) * 100
  }));
};

/**
 * Procesa estadísticas de ventas
 */
const processSalesStatisticsData = (invoices: InvoiceResponse): SalesStatistics => {
  // Validar que invoices y invoices.invoices existan
  if (!invoices || !invoices.invoices || !Array.isArray(invoices.invoices)) {
    console.warn('Invalid invoices data for sales statistics, returning empty data');
    return {
      monthlyTrends: [],
      seasonalPatterns: [],
      growthAnalysis: {
        currentPeriod: 0,
        previousPeriod: 0,
        growthRate: 0,
        trend: 'stable'
      }
    };
  }
  
  const monthlyData = new Map();
  
  invoices.invoices.forEach(invoice => {
    const date = new Date(invoice.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthlyData.has(monthKey)) {
      const existing = monthlyData.get(monthKey);
      existing.totalAmount += invoice.netTotal + invoice.taxes + invoice.otherTaxes;
      existing.totalPurchases++;
    } else {
      monthlyData.set(monthKey, {
        month: monthKey,
        totalAmount: invoice.netTotal + invoice.taxes + invoice.otherTaxes,
        totalPurchases: 1,
        averagePurchase: invoice.netTotal + invoice.taxes + invoice.otherTaxes,
        growth: 0,
        topProduct: invoice.details[0]?.product.name || ''
      });
    }
  });
  
  const monthlySales = Array.from(monthlyData.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((month, index, array) => {
      if (index > 0) {
        const previous = array[index - 1];
        month.growth = previous.totalAmount > 0 ? ((month.totalAmount - previous.totalAmount) / previous.totalAmount) * 100 : 0;
      }
      return month;
    });
    
  return {
    monthlySales,
    quarterlySales: processQuarterlyData(monthlySales),
    yearlySales: processYearlyData(monthlySales)
  };
};

/**
 * Procesa datos trimestrales
 */
const processQuarterlyData = (monthlySales: any[]): any[] => {
  const quarterlyData = new Map();
  
  monthlySales.forEach(month => {
    const [year, monthNum] = month.month.split('-');
    const quarter = Math.ceil(parseInt(monthNum) / 3);
    const quarterKey = `${year}-Q${quarter}`;
    
    if (quarterlyData.has(quarterKey)) {
      const existing = quarterlyData.get(quarterKey);
      existing.totalAmount += month.totalAmount;
      existing.totalPurchases += month.totalPurchases;
    } else {
      quarterlyData.set(quarterKey, {
        quarter: quarterKey,
        year: parseInt(year),
        totalAmount: month.totalAmount,
        totalPurchases: month.totalPurchases,
        growth: 0,
        seasonalFactor: 1
      });
    }
  });
  
  return Array.from(quarterlyData.values())
    .sort((a, b) => a.quarter.localeCompare(b.quarter));
};

/**
 * Procesa datos anuales
 */
const processYearlyData = (monthlySales: any[]): any[] => {
  const yearlyData = new Map();
  
  monthlySales.forEach(month => {
    const year = month.month.split('-')[0];
    
    if (yearlyData.has(year)) {
      const existing = yearlyData.get(year);
      existing.totalAmount += month.totalAmount;
      existing.totalPurchases += month.totalPurchases;
    } else {
      yearlyData.set(year, {
        year: parseInt(year),
        totalAmount: month.totalAmount,
        totalPurchases: month.totalPurchases,
        growth: 0,
        averageMonthlyAmount: month.totalAmount
      });
    }
  });
  
  return Array.from(yearlyData.values())
    .sort((a, b) => a.year - b.year);
};

/**
 * Procesa comparaciones temporales
 */
const processTemporalComparisonsData = (invoices: InvoiceResponse): TemporalComparisons => {
  // Validar que invoices y invoices.invoices existan
  if (!invoices || !invoices.invoices || !Array.isArray(invoices.invoices)) {
    console.warn('Invalid invoices data for temporal comparisons, returning empty data');
    return {
      monthOverMonth: [],
      quarterOverQuarter: [],
      yearOverYear: []
    };
  }
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const currentMonthInvoices = invoices.invoices.filter(inv => {
    const invDate = new Date(inv.date);
    return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
  });
  
  const previousMonthInvoices = invoices.invoices.filter(inv => {
    const invDate = new Date(inv.date);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return invDate.getMonth() === prevMonth && invDate.getFullYear() === prevYear;
  });
  
  const currentAmount = currentMonthInvoices.reduce((sum, inv) => sum + inv.netTotal + inv.taxes + inv.otherTaxes, 0);
  const previousAmount = previousMonthInvoices.reduce((sum, inv) => sum + inv.netTotal + inv.taxes + inv.otherTaxes, 0);
  const growthAmount = currentAmount - previousAmount;
  const growthPercentage = previousAmount > 0 ? (growthAmount / previousAmount) * 100 : 0;
  
  return {
    monthOverMonth: [{
      currentMonth: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`,
      previousMonth: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`,
      currentAmount,
      previousAmount,
      growthAmount,
      growthPercentage,
      currentPurchases: currentMonthInvoices.length,
      previousPurchases: previousMonthInvoices.length,
      purchaseGrowth: previousMonthInvoices.length > 0 ? 
        ((currentMonthInvoices.length - previousMonthInvoices.length) / previousMonthInvoices.length) * 100 : 0
    }],
    quarterOverQuarter: [],
    yearOverYear: []
  };
};

/**
 * Procesa distribución geográfica
 */
const processGeographicDistribution = (clients: any[]): any[] => {
  // Validar que clients sea un array válido
  if (!clients || !Array.isArray(clients)) {
    console.warn('Invalid clients data for geographic distribution, returning empty array');
    return [];
  }
  
  const municipalityMap = new Map();
  
  clients.forEach(client => {
    const municipality = client.municipality?.name || 'Sin especificar';
    if (municipalityMap.has(municipality)) {
      const existing = municipalityMap.get(municipality);
      existing.clientCount++;
      existing.totalAmount += client.total_amount || 0;
    } else {
      municipalityMap.set(municipality, {
        municipality,
        clientCount: 1,
        totalAmount: client.total_amount || 0,
        percentage: 0,
        averageAmount: client.total_amount || 0
      });
    }
  });
  
  const totalAmount = Array.from(municipalityMap.values()).reduce((sum, m) => sum + m.totalAmount, 0);
  
  return Array.from(municipalityMap.values()).map(m => ({
    ...m,
    percentage: (m.totalAmount / totalAmount) * 100,
    averageAmount: m.totalAmount / m.clientCount
  }));
};

/**
 * Procesa distribución por actividad
 */
const processActivityDistribution = (clients: any[]): any[] => {
  // Validar que clients sea un array válido
  if (!clients || !Array.isArray(clients)) {
    console.warn('Invalid clients data for activity distribution, returning empty array');
    return [];
  }
  
  const activityMap = new Map();
  
  clients.forEach(client => {
    const activity = client.activity?.name || 'Sin especificar';
    if (activityMap.has(activity)) {
      const existing = activityMap.get(activity);
      existing.clientCount++;
      existing.totalAmount += client.total_amount || 0;
    } else {
      activityMap.set(activity, {
        activity,
        clientCount: 1,
        totalAmount: client.total_amount || 0,
        percentage: 0,
        averageAmount: client.total_amount || 0
      });
    }
  });
  
  const totalAmount = Array.from(activityMap.values()).reduce((sum, a) => sum + a.totalAmount, 0);
  
  return Array.from(activityMap.values()).map(a => ({
    ...a,
    percentage: (a.totalAmount / totalAmount) * 100,
    averageAmount: a.totalAmount / a.clientCount
  }));
};

/**
 * Procesa segmentación de clientes
 */
const processClientSegmentation = (clients: any[]): any => {
  // Validar que clients sea un array válido
  if (!clients || !Array.isArray(clients) || clients.length === 0) {
    console.warn('Invalid clients data for segmentation, returning default values');
    return {
      highValue: 0,
      mediumValue: 0,
      lowValue: 0,
      newClients: 0,
      atRisk: 0
    };
  }
  
  const totalAmount = clients.reduce((sum, c) => sum + (c.total_amount || 0), 0);
  const averageAmount = totalAmount / clients.length;
  
  const highValue = clients.filter(c => (c.total_amount || 0) > averageAmount * 2).length;
  const mediumValue = clients.filter(c => (c.total_amount || 0) > averageAmount && (c.total_amount || 0) <= averageAmount * 2).length;
  const lowValue = clients.filter(c => (c.total_amount || 0) <= averageAmount).length;
  const newClients = clients.filter(c => !c.last_purchase_date).length;
  const atRisk = clients.filter(c => {
    if (!c.last_purchase_date) return false;
    const lastPurchase = new Date(c.last_purchase_date);
    const monthsSinceLastPurchase = (new Date().getTime() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsSinceLastPurchase > 6;
  }).length;
  
  return {
    highValue,
    mediumValue,
    lowValue,
    newClients,
    atRisk
  };
};

// ========================================
// FUNCIONES DE CÁLCULO
// ========================================

const calculatePurchaseFrequency = (invoices: any[]): number => {
  if (invoices.length < 2) return 0;
  
  const sortedInvoices = invoices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstDate = new Date(sortedInvoices[0].date);
  const lastDate = new Date(sortedInvoices[sortedInvoices.length - 1].date);
  const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysDiff > 0 ? invoices.length / (daysDiff / 30) : 0; // Compras por mes
};

const calculateCustomerLifetime = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)); // Días
};

const calculateLoyaltyScore = (analytics: any): number => {
  // Algoritmo simple de fidelidad basado en frecuencia y monto
  const frequencyScore = Math.min(analytics.purchase_frequency * 10, 50); // Máximo 50 puntos
  const amountScore = Math.min((analytics.average_purchase / 10000) * 50, 50); // Máximo 50 puntos
  
  return Math.round(frequencyScore + amountScore);
};

const calculateRiskLevel = (analytics: any): 'low' | 'medium' | 'high' => {
  const monthsSinceLastPurchase = analytics.last_purchase_date ? 
    (new Date().getTime() - new Date(analytics.last_purchase_date).getTime()) / (1000 * 60 * 60 * 24 * 30) : 0;
  
  if (monthsSinceLastPurchase > 6) return 'high';
  if (monthsSinceLastPurchase > 3) return 'medium';
  return 'low';
};

const calculatePotentialValue = (analytics: any): number => {
  // Estimación basada en historial y crecimiento
  const baseValue = analytics.average_purchase * analytics.purchase_frequency * 12; // Valor anual
  const growthFactor = 1 + (analytics.growth_percentage / 100);
  
  return Math.round(baseValue * growthFactor);
};

// Función auxiliar getClientById ya está definida arriba como export

// Default export for Expo Router
export default function ClientAnalyticsAPI() {
  return null;
}
