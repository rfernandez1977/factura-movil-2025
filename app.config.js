export default ({ config }) => ({
    ...config,
    name: "Factura Móvil",
    slug: "factura-movil",
    version: "1.0.0", // Versión visible de la app
    orientation: "portrait",
    scheme: "facturamovil", // Necesario para Expo Router y deep linking
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rfernandez1977.facturamovil"
    },
    android: {
      package: "com.rfernandez1977.facturamovil",
      versionCode: 1, // Incrementar cada vez que subas a Play Store
      permissions: [
        "INTERNET",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ],
      networkSecurityConfig: "./android/app/src/main/res/xml/network_security_config.xml"
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
  