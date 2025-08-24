import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { 
  ActionButtonProps, 
  colors, 
  typography, 
  spacing, 
  borders,
  DESIGN_CONSTANTS
} from '../utils/designSystem';

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  icon,
  variant = 'primary',
  size = 'medium',
  onPress,
  disabled = false,
  loading = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: borders.radius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
    };

    const sizeStyle = {
      small: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        minHeight: DESIGN_CONSTANTS.BUTTON_HEIGHT,
      },
      large: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        minHeight: 56,
      },
    };

    const variantStyle = {
      primary: {
        backgroundColor: disabled ? colors.textDisabled : colors.primary,
      },
      secondary: {
        backgroundColor: disabled ? colors.textDisabled : colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? colors.textDisabled : colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyle[size],
      ...variantStyle[variant],
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    };

    const sizeTextStyle = {
      small: {
        fontSize: 14,
      },
      medium: {
        fontSize: 16,
      },
      large: {
        fontSize: 18,
      },
    };

    const variantTextStyle = {
      primary: {
        color: colors.surface,
      },
      secondary: {
        color: colors.surface,
      },
      outline: {
        color: disabled ? colors.textDisabled : colors.primary,
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyle[size],
      ...variantTextStyle[variant],
    };
  };

  const getIconStyle = () => {
    const iconSize = {
      small: 16,
      medium: 20,
      large: 24,
    };

    return {
      marginRight: icon ? spacing.xs : 0,
      opacity: disabled ? 0.5 : 1,
    };
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? colors.primary : colors.surface} 
        />
      ) : (
        <>
          {icon && (
            <Text style={getIconStyle()}>
              {React.cloneElement(icon as React.ReactElement, {
                size: size === 'small' ? 16 : size === 'medium' ? 20 : 24,
                color: variant === 'outline' ? colors.primary : colors.surface,
              })}
            </Text>
          )}
          <Text style={[styles.text, getTextStyle()]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  text: {
    ...typography.body1,
  },
});

export default ActionButton;
