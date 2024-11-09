import theme from '@/styles/theme';
import React, { SVGProps } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';

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
}

/**
 * A customizable button component that can be used to display text with optional icons.
 *
 * @param {object} props Component props
 * @prop {function} onPress The function to call when the button is pressed
 * @prop {'small' | 'medium' | 'large'} [size='small'] The size of the button
 * @prop {string} [buttonColor=theme.colors.primary] The background color of the button
 * @prop {string} [labelColor=theme.colors.white] The color of the button text
 * @prop {string} label The text to display on the button
 * @prop {number|string} [width='100%'] The width of the button
 * @prop {React.ComponentType<SVGProps<SVGSVGElement>>} [leftIcon] The left icon
 * @prop {React.ComponentType<SVGProps<SVGSVGElement>>} [rightIcon] The right icon
 * @prop {ViewStyle} [style] Additional styles for the button
 * @prop {'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'} [fontWeight='bold'] The font weight of the button text
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

// Define styles
const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Gap between text and icons
  },
  smallButton: {
    paddingVertical: 0, // Set padding as per the new height
    paddingHorizontal: 10,
  },
  mediumButton: {
    paddingVertical: 0, // Set padding as per the new height
    paddingHorizontal: 15,
  },
  largeButton: {
    paddingVertical: 0, // Set padding as per the new height
    paddingHorizontal: 20,
  },
  label: {
    // No default font weight here, it's set dynamically
  },
});

export default Button;
