// ========================================
// INTERFACES PARA ANÁLISIS DE CLIENTES
// ========================================

// ========================================
// INTERFACES DE BASE DE DATOS
// ========================================

export interface Client {
  id: number;
  code: string; // RUT del cliente
  name: string;
  address: string;
  email: string;
  municipality_id: number;
  municipality_name: string;
  activity_id: number;
  activity_name: string;
  line: string;
  created_at: string;
  updated_at: string;
  last_purchase_date: string;
  total_purchases: number;
  total_amount: number;
  average_purchase: number;
  purchase_frequency: number;
}

export interface ClientPurchase {
  id: number;
  client_id: number;
  invoice_id: number;
  assigned_folio: string;
  invoice_type: string;
  date: string;
  net_total: number;
  taxes: number;
  other_taxes: number;
  total_amount: number;
  paid: boolean;
  validation: string;
  created_at: string;
}

export interface ClientProduct {
  id: number;
  client_id: number;
  product_id: number;
  product_code: string;
  product_name: string;
  category_id: number;
  category_name: string;
  total_quantity: number;
  total_amount: number;
  average_price: number;
  last_purchase_date: string;
  purchase_count: number;
  percentage_of_total: number;
  created_at: string;
  updated_at: string;
}

export interface ClientAnalytics {
  id: number;
  client_id: number;
  period_type: 'month' | 'quarter' | 'year';
  period_start: string;
  period_end: string;
  total_purchases: number;
  total_amount: number;
  average_purchase: number;
  growth_percentage: number;
  top_product_id: number;
  top_product_name: string;
  top_product_percentage: number;
  purchase_frequency: number;
  created_at: string;
}

export interface ClientComparison {
  id: number;
  client_id: number;
  comparison_type: 'month_over_month' | 'quarter_over_quarter' | 'year_over_year';
  current_period_start: string;
  current_period_end: string;
  previous_period_start: string;
  previous_period_end: string;
  current_amount: number;
  previous_amount: number;
  growth_amount: number;
  growth_percentage: number;
  current_purchases: number;
  previous_purchases: number;
  purchase_growth: number;
  created_at: string;
}

// ========================================
// INTERFACES DE REPORTES
// ========================================

export interface ClientSummary {
  clientInfo: {
    id: number;
    name: string;
    code: string;
    email: string;
    municipality: string;
    activity: string;
  };
  
  keyMetrics: {
    totalPurchases: number;
    totalAmount: number;
    averagePurchase: number;
    lastPurchaseDate: Date;
    purchaseFrequency: number;
    customerLifetime: number;
  };
  
  performanceIndicators: {
    growthRate: number;
    loyaltyScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    potentialValue: number;
  };
}

export interface PurchaseHistory {
  purchases: Array<{
    id: number;
    date: Date;
    folio: string;
    type: string;
    amount: number;
    products: number;
    status: 'paid' | 'pending';
    growth: number;
  }>;
  
  temporalAnalysis: {
    monthlyTrend: 'increasing' | 'decreasing' | 'stable';
    seasonalPattern: string;
    bestMonth: string;
    worstMonth: string;
  };
}

export interface TopProducts {
  byQuantity: Array<{
    productId: number;
    productName: string;
    category: string;
    totalQuantity: number;
    percentage: number;
    averagePrice: number;
    lastPurchase: Date;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  
  byAmount: Array<{
    productId: number;
    productName: string;
    category: string;
    totalAmount: number;
    percentage: number;
    quantity: number;
    averagePrice: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  
  categoryAnalysis: Array<{
    categoryName: string;
    totalAmount: number;
    percentage: number;
    productCount: number;
    averagePrice: number;
  }>;
}

export interface SalesStatistics {
  monthlySales: Array<{
    month: string;
    totalAmount: number;
    totalPurchases: number;
    averagePurchase: number;
    growth: number;
    topProduct: string;
  }>;
  
  quarterlySales: Array<{
    quarter: string;
    year: number;
    totalAmount: number;
    totalPurchases: number;
    growth: number;
    seasonalFactor: number;
  }>;
  
  yearlySales: Array<{
    year: number;
    totalAmount: number;
    totalPurchases: number;
    growth: number;
    averageMonthlyAmount: number;
  }>;
}

export interface TemporalComparisons {
  monthOverMonth: Array<{
    currentMonth: string;
    previousMonth: string;
    currentAmount: number;
    previousAmount: number;
    growthAmount: number;
    growthPercentage: number;
    currentPurchases: number;
    previousPurchases: number;
    purchaseGrowth: number;
  }>;
  
  quarterOverQuarter: Array<{
    currentQuarter: string;
    previousQuarter: string;
    currentAmount: number;
    previousAmount: number;
    growthAmount: number;
    growthPercentage: number;
    seasonalAdjustment: number;
  }>;
  
  yearOverYear: Array<{
    currentYear: number;
    previousYear: number;
    currentAmount: number;
    previousAmount: number;
    growthAmount: number;
    growthPercentage: number;
    compoundGrowth: number;
  }>;
}

export interface TopClients {
  byTotalAmount: Array<{
    clientId: number;
    clientName: string;
    totalAmount: number;
    totalPurchases: number;
    averagePurchase: number;
    lastPurchase: Date;
    growthRate: number;
    loyaltyScore: number;
  }>;
  
  byPurchaseFrequency: Array<{
    clientId: number;
    clientName: string;
    purchaseFrequency: number;
    totalPurchases: number;
    totalAmount: number;
    consistency: number;
  }>;
  
  byGrowth: Array<{
    clientId: number;
    clientName: string;
    growthRate: number;
    currentAmount: number;
    previousAmount: number;
    potentialValue: number;
  }>;
  
  byLoyalty: Array<{
    clientId: number;
    clientName: string;
    loyaltyScore: number;
    customerLifetime: number;
    totalPurchases: number;
    averagePurchase: number;
  }>;
}

export interface BusinessMetrics {
  overview: {
    totalClients: number;
    activeClients: number;
    totalRevenue: number;
    averageRevenuePerClient: number;
    totalPurchases: number;
    averagePurchaseValue: number;
  };
  
  geographicDistribution: Array<{
    municipality: string;
    clientCount: number;
    totalAmount: number;
    percentage: number;
    averageAmount: number;
  }>;
  
  activityDistribution: Array<{
    activity: string;
    clientCount: number;
    totalAmount: number;
    percentage: number;
    averageAmount: number;
  }>;
  
  segmentation: {
    highValue: number;
    mediumValue: number;
    lowValue: number;
    newClients: number;
    atRisk: number;
  };
}

// ========================================
// INTERFACES DE COMPONENTES
// ========================================

export interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  format?: 'currency' | 'number' | 'percentage';
  onPress?: () => void;
}

export interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  options: {
    title?: string;
    height?: number;
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
  };
  onDataPointClick?: (dataPoint: any) => void;
}

export interface SearchableListProps {
  data: any[];
  searchPlaceholder: string;
  renderItem: (item: any) => React.ReactNode;
  onItemPress: (item: any) => void;
  onRefresh?: () => void;
  emptyMessage?: string;
}

export interface ActionButtonProps {
  title: string;
  icon?: React.ReactNode;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// ========================================
// INTERFACES DE FILTROS Y BÚSQUEDA
// ========================================

export interface ClientFilters {
  activity: string[];
  municipality: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  minAmount: number;
  maxAmount: number;
  purchaseFrequency: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SearchOptions {
  query: string;
  filters: ClientFilters;
  sortBy: 'name' | 'amount' | 'purchases' | 'lastPurchase' | 'growth';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// ========================================
// INTERFACES DE API
// ========================================

export interface InvoiceResponse {
  invoices: Array<{
    id: number;
    hasTaxes: boolean;
    assignedFolio: string;
    date: string;
    paid: boolean;
    client: {
      code: string;
      name: string;
      address: string;
      line: string;
      municipality: {
        code: string;
        name: string;
      };
    };
    exemptTotal: number;
    netTotal: number;
    taxes: number;
    otherTaxes: number;
    constructionCreditTotal: number;
    details: Array<{
      id: number;
      product: {
        id: number;
        code: string;
        name: string;
        unit: {
          code: string;
          name: string;
        };
        price: number;
        category: {
          id: number;
          code: string;
          name: string;
          otherTax: {
            id: number;
            code: string;
            name: string;
            percent: number;
          } | null;
        };
      };
      service: any;
      quantity: number;
    }>;
    discounts: any[];
    validation: string;
  }>;
}

export interface ClientResponse {
  clients: Array<{
    id: number;
    code: string;
    name: string;
    address: string;
    additionalAddress: Array<{
      id: number;
      address: string;
      municipality: {
        id: number;
        code: string;
        name: string;
      };
    }>;
    email: string;
    municipality: {
      id: number;
      code: string;
      name: string;
    };
    activity: {
      id: number;
      code: string;
      name: string;
    };
    line: string;
  }>;
}

// ========================================
// TIPOS DE UTILIDAD
// ========================================

export type DateRange = {
  start: Date;
  end: Date;
};

export type PeriodType = 'month' | 'quarter' | 'year';

export type ComparisonType = 'month_over_month' | 'quarter_over_quarter' | 'year_over_year';

export type TrendType = 'increasing' | 'decreasing' | 'stable';

export type RiskLevel = 'low' | 'medium' | 'high';

export type PurchaseStatus = 'paid' | 'pending';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export type ButtonSize = 'small' | 'medium' | 'large';

export type FormatType = 'currency' | 'number' | 'percentage' | 'date';

export type SortOrder = 'asc' | 'desc';

// Default export for Expo Router
export default function ClientAnalyticsTypes() {
  return null;
}
