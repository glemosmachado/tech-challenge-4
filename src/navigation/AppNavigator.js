import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useAuth } from "../context/AuthContext";
import AccountScreen from "../screens/account/AccountScreen";
import AdminStackNavigator from "./AdminStackNavigator";
import PeopleStackNavigator from "./PeopleStackNavigator";
import PostsStackNavigator from "./PostsStackNavigator";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { role } = useAuth();

  const isTeacher = role === "teacher";
  const isStudent = role === "student";

  return (
    <Tab.Navigator>
      {/* STUDENT: pode ver Posts */}
      {isStudent ? (
        <Tab.Screen
          name="PostsTab"
          component={PostsStackNavigator}
          options={{ title: "Posts", headerShown: false }}
        />
      ) : null}

      {/* TEACHER: Admin + Pessoas */}
      {isTeacher ? (
        <>
          <Tab.Screen
            name="People"
            component={PeopleStackNavigator}
            options={{ title: "Pessoas", headerShown: false }}
          />
          <Tab.Screen
            name="Admin"
            component={AdminStackNavigator}
            options={{ title: "Admin", headerShown: false }}
          />
        </>
      ) : null}

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: "Conta" }}
      />
    </Tab.Navigator>
  );
}