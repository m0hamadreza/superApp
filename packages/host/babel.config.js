module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // react-native-worklets/plugin powers react-native-reanimated v4 and must be listed last.
  plugins: [
    'transform-inline-environment-variables',
    'react-native-worklets/plugin',
  ],
};
