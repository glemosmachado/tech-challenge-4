import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";

import theme from "../ui/theme";

import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";

export default function RootNavigator() {
  const { user, token } = useAuth();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme?.colors?.bg || "#000",
      card: theme?.colors?.bg || "#000",
      text: theme?.colors?.text || "#fff",
      border: theme?.colors?.border || "#222",
      primary: theme?.colors?.purple || "#9B6DFF",
      notification: theme?.colors?.orange || "#FF7A18",
    },
  };

  const safeScreenOptions =
    theme?.nav?.screen ||
    theme?.navigation?.screen || {
      headerStyle: { backgroundColor: theme?.colors?.bg || "#000" },
      headerTintColor: theme?.colors?.text || "#fff",
      contentStyle: { backgroundColor: theme?.colors?.bg || "#000" },
    };

  return (
    <NavigationContainer theme={navigationTheme}>
      {!token || !user ? (
        <AuthNavigator screenOptions={safeScreenOptions} />
      ) : (
        <AppNavigator screenOptions={safeScreenOptions} />
      )}
    </NavigationContainer>
  );
}
