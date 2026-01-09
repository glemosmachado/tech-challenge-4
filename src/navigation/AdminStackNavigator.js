import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostCreateScreen from "../screens/posts/PostCreateScreen";
import PostEditScreen from "../screens/posts/PostEditScreen";
import PostReadScreen from "../screens/posts/PostReadScreen";
import PostsAdminScreen from "../screens/posts/PostsAdminScreen";

const Stack = createNativeStackNavigator();

export default function AdminStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostsAdmin"
        component={PostsAdminScreen}
        options={{ title: "Admin - Posts" }}
      />
      <Stack.Screen
        name="PostRead"
        component={PostReadScreen}
        options={{ title: "Leitura" }}
      />
      <Stack.Screen
        name="PostEdit"
        component={PostEditScreen}
        options={{ title: "Editar Post" }}
      />
      <Stack.Screen
        name="PostCreate"
        component={PostCreateScreen}
        options={{ title: "Novo Post" }}
      />
    </Stack.Navigator>
  );
}
