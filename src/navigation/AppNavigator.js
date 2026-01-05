import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PostsAdminScreen from "../screens/posts/PostsAdminScreen";
import PostsListScreen from "../screens/posts/PostsListScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Posts" component={PostsListScreen} />
      <Tab.Screen name="Admin" component={PostsAdminScreen} />
    </Tab.Navigator>
  );
}
