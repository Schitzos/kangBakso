module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@assets': './assets',
          '@components': './src/app/components',
        },
      }],
    'react-native-reanimated/plugin',

  ],
};
