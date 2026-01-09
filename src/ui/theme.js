import { Platform } from "react-native";

export const colors = {
  bg: "#0B0B10",
  surface: "#12121A",
  surface2: "#171726",
  border: "#26263A",

  text: "#F2F3F7",
  muted: "#A7A9B8",
  placeholder: "#6F7286",

  purple: "#9B6DFF",
  orange: "#FF7A18",

  danger: "#FF3B5C",
  success: "#2ED47A",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.2,
    color: colors.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.2,
    color: colors.text,
  },
  h3: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.1,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  muted: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.muted,
  },
  small: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
  },
};

export const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  android: {
    elevation: 8,
  },
  default: {},
});

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadow,

  nav: {
    screen: {
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: {
        color: colors.text,
        fontWeight: "800",
      },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: colors.bg },

      tabBarStyle: {
        backgroundColor: colors.bg,
        borderTopColor: colors.border,
      },
      tabBarActiveTintColor: colors.purple,
      tabBarInactiveTintColor: colors.muted,
    },
  },

  navigation: {
    screen: {
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: {
        color: colors.text,
        fontWeight: "800",
      },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: colors.bg },

      tabBarStyle: {
        backgroundColor: colors.bg,
        borderTopColor: colors.border,
      },
      tabBarActiveTintColor: colors.purple,
      tabBarInactiveTintColor: colors.muted,
    },
  },

  components: {
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: spacing.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    input: {
      backgroundColor: colors.surface2,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      color: colors.text,
    },
    inputMeta: {
      placeholderTextColor: colors.placeholder,
      selectionColor: colors.purple,
    },
    buttonPrimary: {
      backgroundColor: colors.purple,
      borderRadius: radius.xl,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonPrimaryText: {
      color: "#0B0B10",
      fontWeight: "900",
      fontSize: 16,
    },
    buttonSecondary: {
      backgroundColor: "transparent",
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonSecondaryText: {
      color: colors.text,
      fontWeight: "800",
      fontSize: 16,
    },
    buttonDanger: {
      backgroundColor: "transparent",
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.danger,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonDangerText: {
      color: colors.danger,
      fontWeight: "900",
      fontSize: 16,
    },
  },
};

export default theme;