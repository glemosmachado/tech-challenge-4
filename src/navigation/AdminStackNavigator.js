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
        name="AdminHome"
        component={PostsAdminScreen}
        options={{ title: "Admin" }}
      />
      <Stack.Screen name="PostRead" component={PostReadScreen} />
      <Stack.Screen name="PostCreate" component={PostCreateScreen} />
      <Stack.Screen name="PostEdit" component={PostEditScreen} />
    </Stack.Navigator>
  );
}
