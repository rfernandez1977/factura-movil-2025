import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { 
  MetricCardProps, 
  colors, 
  typography, 
  spacing, 
  borders,
  formatCurrency,
  formatNumber,
  formatPercentage,
  getTrendColor
} from '../utils/designSystem';

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  color,
  format = 'number',
  onPress,
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      case 'number':
        return formatNumber(val);
      default:
        return val.toString();
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    const iconSize = 16;
    const iconColor = getTrendColor(trend);
    
    switch (trend) {
      case 'up':
        return <TrendingUp size={iconSize} color={iconColor} />;
      case 'down':
        return <TrendingDown size={iconSize} color={iconColor} />;
      case 'stable':
        return <Minus size={iconSize} color={iconColor} />;
      default:
        return null;
    }
  };

  const getChangeText = () => {
    if (change === undefined) return null;
    
    const changeText = formatPercentage(change);
    const changeColor = getTrendColor(trend || 'stable');
    
    return (
      <View style={[styles.changeContainer, { backgroundColor: `${changeColor}15` }]}>
        {getTrendIcon()}
        <Text style={[styles.changeText, { color: changeColor }]}>
          {changeText}
        </Text>
      </View>
    );
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent 
      style={[styles.container, { borderLeftColor: color }]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          {icon}
        </View>
        {getChangeText()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{formatValue(value)}</Text>
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borders.radius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 100,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borders.radius.sm,
  },
  
  changeText: {
    ...typography.caption,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  
  content: {
    flex: 1,
  },
  
  title: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  
  value: {
    ...typography.metricSmall,
    color: colors.textPrimary,
  },
});

export default MetricCard;
