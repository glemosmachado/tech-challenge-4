const theme = {
  colors: {
    bg: "#07060b",
    bg2: "#0d0b14",
    card: "#12111a",
    card2: "#171622",
    border: "rgba(255,255,255,0.10)",
    text: "rgba(255,255,255,0.92)",
    muted: "rgba(255,255,255,0.62)",
    subtle: "rgba(255,255,255,0.42)",
    danger: "#ff3b5c",
    success: "#38d68b",
    accent: "#9b87ff", // roxo
    accent2: "#c2b7ff",
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
  },

  radius: {
    sm: 12,
    md: 16,
    lg: 22,
    pill: 999,
  },

  screen: {
    padding: 18,
    gap: 12,
    maxWidth: 900,
  },

  nav: {
    screen: {
      headerStyle: { backgroundColor: "#07060b" },
      headerTintColor: "rgba(255,255,255,0.92)",
      headerTitleStyle: { color: "rgba(255,255,255,0.92)" },
      headerShadowVisible: false,
    },
    tab: {
      tabBarStyle: {
        backgroundColor: "#07060b",
        borderTopColor: "rgba(255,255,255,0.10)",
      },
      tabBarActiveTintColor: "#9b87ff",
      tabBarInactiveTintColor: "rgba(255,255,255,0.45)",
      tabBarLabelStyle: { paddingBottom: 4 },
    },
  },

  navigationTheme: {
    dark: true,
    colors: {
      primary: "#9b87ff",
      background: "#07060b",
      card: "#07060b",
      text: "rgba(255,255,255,0.92)",
      border: "rgba(255,255,255,0.10)",
      notification: "#9b87ff",
    },
  },
};

export { theme };
export default theme;
