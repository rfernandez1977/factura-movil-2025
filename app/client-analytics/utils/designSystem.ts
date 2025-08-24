// ========================================
// SISTEMA DE DISEÑO - ANÁLISIS DE CLIENTES
// ========================================

// ========================================
// PALETA DE COLORES
// ========================================

export const colors = {
  // Colores principales
  primary: '#0066CC',
  secondary: '#4CAF50',
  accent: '#FF9800',
  
  // Colores de estado
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  info: '#2196F3',
  
  // Colores de fondo
  background: '#F5F5F5',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Colores de texto
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  
  // Colores de gráficos
  chartColors: [
    '#0066CC', '#4CAF50', '#FF9800', '#9C27B0',
    '#F44336', '#2196F3', '#FF5722', '#795548'
  ],
  
  // Colores de tendencias
  trendUp: '#4CAF50',
  trendDown: '#F44336',
  trendStable: '#FF9800',
  
  // Colores de riesgo
  riskLow: '#4CAF50',
  riskMedium: '#FF9800',
  riskHigh: '#F44336',
};

// ========================================
// TIPOGRAFÍA
// ========================================

export const typography = {
  // Títulos
  h1: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  
  // Texto
  body1: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  
  // Especiales
  metric: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 36,
    color: colors.textPrimary,
  },
  metricSmall: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    color: colors.textSecondary,
  },
};

// ========================================
// ESPACIADO
// ========================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ========================================
// BORDES Y SOMBRAS
// ========================================

export const borders = {
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  shadows: {
    sm: '0px 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    lg: '0px 4px 16px rgba(0, 0, 0, 0.20)',
  },
};

// ========================================
// ESTILOS DE COMPONENTES
// ========================================

export const componentStyles = {
  // Tarjetas
  card: {
    backgroundColor: colors.card,
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
  
  // Botones
  button: {
    primary: {
      backgroundColor: colors.primary,
      borderRadius: borders.radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderRadius: borders.radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: borders.radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
  },
  
  // Inputs
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.textDisabled,
    borderRadius: borders.radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
  },
  
  // Badges
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borders.radius.sm,
    fontSize: 12,
    fontWeight: '500' as const,
  },
};

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('es-CL').format(number);
};

export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    
    return dateObj.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    
    return dateObj.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'N/A';
  }
};

// ========================================
// FUNCIONES DE COLORES
// ========================================

export const getTrendColor = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up':
      return colors.trendUp;
    case 'down':
      return colors.trendDown;
    case 'stable':
      return colors.trendStable;
    default:
      return colors.textSecondary;
  }
};

export const getRiskColor = (risk: 'low' | 'medium' | 'high'): string => {
  switch (risk) {
    case 'low':
      return colors.riskLow;
    case 'medium':
      return colors.riskMedium;
    case 'high':
      return colors.riskHigh;
    default:
      return colors.textSecondary;
  }
};

export const getChartColor = (index: number): string => {
  return colors.chartColors[index % colors.chartColors.length];
};

// ========================================
// CONSTANTES DE DISEÑO
// ========================================

export const DESIGN_CONSTANTS = {
  // Dimensiones
  CARD_HEIGHT: 120,
  CHART_HEIGHT: 200,
  BUTTON_HEIGHT: 48,
  INPUT_HEIGHT: 48,
  
  // Márgenes y padding
  CONTAINER_PADDING: spacing.md,
  SECTION_MARGIN: spacing.lg,
  ITEM_MARGIN: spacing.sm,
  
  // Tamaños de iconos
  ICON_SIZE_SM: 16,
  ICON_SIZE_MD: 24,
  ICON_SIZE_LG: 32,
  
  // Animaciones
  ANIMATION_DURATION: 300,
  ANIMATION_EASING: 'ease-in-out',
};

// ========================================
// ESTILOS DE LAYOUT
// ========================================

export const layoutStyles = {
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: DESIGN_CONSTANTS.CONTAINER_PADDING,
  },
  
  // Secciones
  section: {
    marginBottom: DESIGN_CONSTANTS.SECTION_MARGIN,
  },
  
  // Filas
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  
  // Columnas
  column: {
    flexDirection: 'column' as const,
  },
  
  // Centrado
  center: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  // Espaciado entre elementos
  spaceBetween: {
    justifyContent: 'space-between' as const,
  },
  
  // Espaciado uniforme
  spaceAround: {
    justifyContent: 'space-around' as const,
  },
};

// ========================================
// EXPORTACIÓN
// ========================================

export default {
  colors,
  typography,
  spacing,
  borders,
  componentStyles,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  getTrendColor,
  getRiskColor,
  getChartColor,
  DESIGN_CONSTANTS,
  layoutStyles,
};
