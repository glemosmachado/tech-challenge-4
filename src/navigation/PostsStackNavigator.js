import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostCreateScreen from "../screens/posts/PostCreateScreen";
import PostEditScreen from "../screens/posts/PostEditScreen";
import PostReadScreen from "../screens/posts/PostReadScreen";
import PostsListScreen from "../screens/posts/PostsListScreen";

import { theme as ui } from "../ui/theme";

const Stack = createNativeStackNavigator();

export default function PostsStackNavigator() {
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
        name="PostsList"
        component={PostsListScreen}
        options={{ title: "Posts" }}
      />

      <Stack.Screen
        name="PostRead"
        component={PostReadScreen}
        options={{ title: "Leitura" }}
      />

      <Stack.Screen
        name="PostCreate"
        component={PostCreateScreen}
        options={{ title: "Novo post" }}
      />

      <Stack.Screen
        name="PostEdit"
        component={PostEditScreen}
        options={{ title: "Editar post" }}
      />
    </Stack.Navigator>
  );
}
