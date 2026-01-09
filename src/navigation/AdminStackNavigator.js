import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostCreateScreen from "../screens/posts/PostCreateScreen";
import PostEditScreen from "../screens/posts/PostEditScreen";
import PostReadScreen from "../screens/posts/PostReadScreen";
import PostsAdminScreen from "../screens/posts/PostsAdminScreen";

import { theme as ui } from "../ui/theme";

const Stack = createNativeStackNavigator();

export default function AdminStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: ui.colors.bg },
        headerTintColor: ui.colors.text,
        headerTitleStyle: { fontWeight: "900" },
        contentStyle: { backgroundColor: ui.colors.bg },
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={PostsAdminScreen}
        options={{ title: "Admin" }}
      />

      <Stack.Screen
        name="AdminPostRead"
        component={PostReadScreen}
        options={{ title: "Leitura" }}
      />

      <Stack.Screen
        name="AdminPostCreate"
        component={PostCreateScreen}
        options={{ title: "Novo post" }}
      />

      <Stack.Screen
        name="AdminPostEdit"
        component={PostEditScreen}
        options={{ title: "Editar post" }}
      />
    </Stack.Navigator>
  );
}
