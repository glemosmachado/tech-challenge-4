import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, Text } from "react-native";
import { useAuth } from "../context/AuthContext";

import PostsAdminScreen from "../screens/posts/PostsAdminScreen";
import PeopleStackNavigator from "./PeopleStackNavigator";
import PostsStackNavigator from "./PostsStackNavigator";

import LoginScreen from "../screens/auth/LoginScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { token, logout } = useAuth();
  const isTeacher = !!token;

  return (
    <Tab.Navigator key={isTeacher ? "teacher-tabs" : "guest-tabs"}>
      <Tab.Screen
        name="PostsTab"
        component={PostsStackNavigator}
        options={{ title: "Posts", headerShown: false }}
      />

      {isTeacher ? (
        <>
          <Tab.Screen
            name="Pessoas"
            component={PeopleStackNavigator}
            options={{ title: "Pessoas", headerShown: false }}
          />

          <Tab.Screen
            name="Admin"
            component={PostsAdminScreen}
            options={{
              title: "Admin",
              headerRight: () => (
                <Pressable
                  onPress={logout}
                  style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                >
                  <Text style={{ fontWeight: "800" }}>Sair</Text>
                </Pressable>
              ),
            }}
          />
        </>
      ) : (
        <Tab.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
      )}
    </Tab.Navigator>
  );
}
