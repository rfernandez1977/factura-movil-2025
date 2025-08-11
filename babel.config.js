module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin'
      // Removed expo-router/babel as it's deprecated in SDK 50+
      // Removed the transform-inline-environment-variables plugin
    ],
  };
};