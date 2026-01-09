import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useAuth } from "../context/AuthContext";
import { theme as ui } from "../ui/theme";

import AdminStackNavigator from "./AdminStackNavigator";
import PeopleStackNavigator from "./PeopleStackNavigator";
import PostsStackNavigator from "./PostsStackNavigator";

import AccountScreen from "../screens/account/AccountScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { role } = useAuth(); // "teacher" | "student"

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: ui.colors.bg },
        headerTintColor: ui.colors.text,
        headerTitleStyle: { fontWeight: "900" },

        tabBarStyle: {
          backgroundColor: ui.colors.bg,
          borderTopColor: ui.colors.border,
        },
        tabBarActiveTintColor: ui.colors.primary2,
        tabBarInactiveTintColor: ui.colors.faint,
      }}
    >
      {role === "student" ? (
        <Tab.Screen
          name="Posts"
          component={PostsStackNavigator}
          options={{ title: "Posts", headerShown: false }}
        />
      ) : null}

      <Tab.Screen
        name="Pessoas"
        component={PeopleStackNavigator}
        options={{ title: "Pessoas", headerShown: false }}
      />

      {role === "teacher" ? (
        <Tab.Screen
          name="Admin"
          component={AdminStackNavigator}
          options={{ title: "Admin", headerShown: false }}
        />
      ) : null}

      <Tab.Screen
        name="Conta"
        component={AccountScreen}
        options={{ title: "Conta" }}
      />
    </Tab.Navigator>
  );
}
