import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PostsAdminScreen from "../screens/posts/PostsAdminScreen";
import PostsStackNavigator from "./PostsStackNavigator";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PostsTab"
        component={PostsStackNavigator}
        options={{ title: "Posts", headerShown: false }}
      />

      <Tab.Screen
        name="Admin"
        component={PostsAdminScreen}
        options={{ title: "Admin" }}
      />
    </Tab.Navigator>
  );
}
