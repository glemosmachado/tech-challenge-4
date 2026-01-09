import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostCreateScreen from "../screens/posts/PostCreateScreen";
import PostEditScreen from "../screens/posts/PostEditScreen";
import PostReadScreen from "../screens/posts/PostReadScreen";
import PostsListScreen from "../screens/posts/PostsListScreen";

const Stack = createNativeStackNavigator();

export default function PostsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostsList" component={PostsListScreen} options={{ title: "Posts" }} />
      <Stack.Screen name="PostRead" component={PostReadScreen} options={{ title: "Leitura" }} />
      <Stack.Screen name="PostCreate" component={PostCreateScreen} options={{ title: "Novo Post" }} />
      <Stack.Screen name="PostEdit" component={PostEditScreen} options={{ title: "Editar Post" }} />
    </Stack.Navigator>
  );
}
