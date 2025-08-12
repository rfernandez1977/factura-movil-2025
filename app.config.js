export default ({ config }) => ({
    ...config,
    name: "Factura Móvil",
    slug: "factura-movil",
    version: "1.0.0", // Versión visible de la app
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "facturamovil", // Necesario para Expo Router y deep linking
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rfernandez1977.facturamovil"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.rfernandez1977.facturamovil",
      versionCode: 1, // Incrementar cada vez que subas a Play Store
      permissions: [
        "INTERNET",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    extra: {
      ...config.extra,
      eas: {
        projectId: "1a538017-5dcc-483c-9651-c41cc52047c9"
      }
    },
    experiments: {
      typedRoutes: true // Optimiza Expo Router con TypeScript
    }
  });
  