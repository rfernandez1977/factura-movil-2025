import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { ChartProps } from '../types';
import { colors, typography, spacing } from '../utils/designSystem';

const { width } = Dimensions.get('window');

/**
 * Componente de gráfico reutilizable
 * Por ahora muestra un placeholder, pero está preparado para integración con librerías de gráficos
 */
export default function Chart({ 
  type, 
  data, 
  options = {}, 
  onDataPointClick 
}: ChartProps) {
  const {
    title,
    height = 200,
    colors: chartColors = [colors.primary, colors.secondary, colors.accent],
    showLegend = true,
    showGrid = true
  } = options;

  const renderChartContent = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      case 'area':
        return renderAreaChart();
      default:
        return renderDefaultChart();
    }
  };

  const renderLineChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>📈 Gráfico de Línea</Text>
        <Text style={styles.dataInfo}>Datos: {data.length} puntos</Text>
      </View>
    </View>
  );

  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>📊 Gráfico de Barras</Text>
        <Text style={styles.dataInfo}>Datos: {data.length} categorías</Text>
      </View>
    </View>
  );

  const renderPieChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>🥧 Gráfico Circular</Text>
        <Text style={styles.dataInfo}>Datos: {data.length} segmentos</Text>
      </View>
    </View>
  );

  const renderAreaChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>📈 Gráfico de Área</Text>
        <Text style={styles.dataInfo}>Datos: {data.length} puntos</Text>
      </View>
    </View>
  );

  const renderDefaultChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>📊 Gráfico</Text>
        <Text style={styles.dataInfo}>Datos: {data.length} elementos</Text>
      </View>
    </View>
  );

  const renderLegend = () => {
    if (!showLegend || !data.length) return null;

    return (
      <View style={styles.legendContainer}>
        {data.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: chartColors[index % chartColors.length] }
              ]} 
            />
            <Text style={styles.legendText}>
              {item.label || `Item ${index + 1}`}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { height }]}>
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}
      
      <View style={styles.chartWrapper}>
        {renderChartContent()}
      </View>
      
      {renderLegend()}
      
      {data.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay datos para mostrar</Text>
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center' as const,
  },
  chartWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: {
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed' as const,
    minHeight: 120,
  },
  placeholderText: {
    ...typography.body1,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dataInfo: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  legendContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  legendText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body2,
    color: colors.textTertiary,
    fontStyle: 'italic' as const,
  },
};
