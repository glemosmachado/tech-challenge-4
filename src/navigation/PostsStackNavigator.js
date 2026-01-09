import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostReadScreen from "../screens/posts/PostReadScreen";
import PostsListScreen from "../screens/posts/PostsListScreen";

const Stack = createNativeStackNavigator();

export default function PostsStackNavigator() {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}
