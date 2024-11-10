import theme from '@/styles/theme';
import React, { SVGProps } from 'react';
import { TouchableOpacity, Text, View, ViewStyle } from 'react-native';
import {styles} from './styles';

// Define the button sizes as a union type
type ButtonSize = 'small' | 'medium' | 'large';
type DimensionValue = ViewStyle['width'];

interface CustomButtonProps {
  onPress: () => void;
  size?: ButtonSize;
  buttonColor?: string;
  labelColor?: string;
  label: string;
  width?: DimensionValue; // Accept width as number or specific string values
  leftIcon?: React.ComponentType<SVGProps<SVGSVGElement>>;
  rightIcon?: React.ComponentType<SVGProps<SVGSVGElement>>;
  style?: ViewStyle;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'; // Add fontWeight prop
  disabled?: boolean;
}

/**
 * A customizable button component with features such as:
 * - size (small, medium, large)
 * - button color
 * - label color
 * - label text
 * - width (accepts number or specific string values)
 * - left icon
 * - right icon
 * - custom styles
 * - font weight
 * - disabled property
 *
 * @param {{onPress: () => void, size?: ButtonSize, buttonColor?: string, labelColor?: string, label: string, width?: DimensionValue, leftIcon?: React.ComponentType<SVGProps<SVGSVGElement>>, rightIcon?: React.ComponentType<SVGProps<SVGSVGElement>>, style?: ViewStyle, fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', disabled?: boolean}} props
 * @returns {React.ReactElement} A React element representing the button
 */
const Button: React.FC<CustomButtonProps> = ({
  onPress,
  size = 'small',
  buttonColor = theme.colors.primary,
  labelColor = theme.colors.white,
  label,
  width = '100%', // Default width is full width
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  style,
  fontWeight = 'bold', // Set a default font weight
  disabled = false,
}) => {
  // Set styles based on size prop
  const sizeStyles = {
    small: styles.smallButton,
    medium: styles.mediumButton,
    large: styles.largeButton,
  };

  // Define height based on the size prop
  const heightStyles = {
    small: { height: 24 },
    medium: { height: 32 },
    large: { height: 40 },
  };

  // Define font size based on the size prop
  const fontSizeStyles = {
    small: { fontSize: 11 },
    medium: { fontSize: 14 },
    large: { fontSize: 14 },
  };
  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        heightStyles[size], // Apply height based on size
        { backgroundColor: buttonColor, width }, // Apply the width prop
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        {LeftIcon && <LeftIcon width={16} height={16} />}
        <Text style={[styles.label, { color: labelColor, fontWeight }, fontSizeStyles[size]]}>
          {label}
        </Text>
        {RightIcon && <RightIcon width={16} height={16} />}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
