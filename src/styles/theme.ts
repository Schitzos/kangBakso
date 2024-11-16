import { Platform } from 'react-native';

const colors = {
  primary: '#ED0226',
  error: '#FF4267',
  error50: '#FFECF0',
  error100: '#FFC4D0',
  warning: '#FB6B18',
  warning50: '#FFF0E8',
  warning100: '#FED1B7',
  success: '#52D5BA',
  success50: '#EEFBF8',
  success100: '#C9F2EA',
  success200: '#3A9784',
  black: '#001A41',
  black50: 'rgba(18, 18, 18, 0.5)',
  white: '#FFFFFF',
  neutral: '#EFF1F4',
  neutral50: '#FFFFFF80',
  neutral100: '#9F9F9F',
  neutral200: '#7A7A7A',
  neutral300: '#EEEEEE',
  neutral400: '#B0B0B0',
  neutral500: '#6D6D6D',
  blue: '#0050AE',
  borderColor: '#CCCFD3',
};

const fonts = {
  regular: 'Poppins-Regular',
  medium: 'Nunito-Medium',
  semibold: 'Nunito-SemiBold',
  bold: 'Nunito-Bold',
  light: 'Nunito-Light',
};

const iosShadow = `
  shadow-color: rgba(18, 18, 18, 0.10);
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 4px;
`;

const androidShadow = `
  elevation: 1; 
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  shadow: 0px 2px 4px  #0060841a;
`;

const shadow = {
  shadows: {
    shadowStyle: {
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(18, 18, 18, 0.10)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.6,
          shadowRadius: 4,
          shadowColor: colors.black, // Android-specific shadow color
        },
      }),
    },
  },
};

export default {
  colors,
  fonts,
  iosShadow,
  androidShadow,
  shadow,
};
