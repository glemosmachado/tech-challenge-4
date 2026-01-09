import { DarkTheme as NavDarkTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import { theme } from "../ui/theme";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";

const navTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: theme.colors.accent,
    background: theme.colors.bg,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.accent,
  },
};

export default function RootNavigator() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
