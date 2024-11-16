import theme from '@/styles/theme';
import React from 'react';
import { Text, StyleSheet, View, FlexAlignType } from 'react-native';

type IconType =
  | React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  | React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface TextViewProps {
  children: React.ReactNode;
  align?: 'flex-start' | 'flex-end' | 'center'; // Add or modify as needed
  fz?: number;
  fw?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  color?: string;
  mb?: number;
  leftIcon?: {
    icon: IconType;
    color?: string;
    width?: string;
    height?: string;
  };
  rightIcon?: {
    icon: IconType;
    color?: string;
    width?: string;
    height?: string;
  };
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  font?: 'regular' | 'medium' | 'bold' | 'semiBold';
  style?: object;
  lineHeight?: number;
}

export default function TextView({
  children,
  align = 'flex-start',
  fz = 12,
  fw = 'normal',
  color = `${theme.colors.black}`,
  mb = 0,
  leftIcon,
  rightIcon,
  textTransform = 'none',
  font = 'regular',
  style,
  lineHeight,
}: Readonly<TextViewProps>) {
/**
 * Determines the font family to use based on the `font` prop.
 *
 * @returns {string} The font family from the theme corresponding to the specified `font` prop value.
 *                   Returns `theme.fonts.bold` for 'bold', `theme.fonts.semibold` for 'semiBold',
 *                   `theme.fonts.medium` for 'medium', and `theme.fonts.regular` for any other value.
 */
  const handeFontFamily = () => {
    if (font === 'bold') {
      return theme.fonts.bold;
    } else if (font === 'semiBold') {
      return theme.fonts.semibold;
    } else if (font === 'medium') {
      return theme.fonts.medium;
    } else {
      return theme.fonts.regular;
    }
  };

  const textStyles = {
    fontSize: fz,
    color,
    fontWeight: fw,
    marginBottom: mb,
    textTransform: textTransform,
    fontFamily: handeFontFamily(),
    textAlign: align === 'center' ? 'center' : ('left' as 'center' | 'left'),
    lineHeight: lineHeight ?? undefined,  // Use lineHeight if provided
  };
  const ViewStyles = {
    justifyContent: align,
    gap: 2,
    alignItems: 'center' as FlexAlignType,
  };

  const LeftIcon = leftIcon?.icon;
  const RightIcon = rightIcon?.icon;
  return (
    <View style={[styles.view, ViewStyles, style]}>
      {LeftIcon && (
        <LeftIcon
          width={leftIcon.width ?? 16} // Adjust width and height as needed
          height={leftIcon.height ?? 16}
          color={leftIcon.color}
        />
      )}
      <Text style={[styles.text, textStyles]}>{children}</Text>
      {RightIcon && (
        <RightIcon
          width={rightIcon.width ?? 16} // Adjust width and height as needed
          height={rightIcon.height ?? 16}
          color={rightIcon.color}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    color: theme.colors.black,
    marginBottom: 0,
    width: 'auto',
  },
});
