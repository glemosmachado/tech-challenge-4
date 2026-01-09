import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, Text } from "react-native";
import { useAuth } from "../context/AuthContext";

import PostsAdminScreen from "../screens/posts/PostsAdminScreen";
import PeopleStackNavigator from "./PeopleStackNavigator";
import PostsStackNavigator from "./PostsStackNavigator";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { role, logout } = useAuth();
  const isTeacher = role === "teacher";
  const isStudent = role === "student";

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PostsTab"
        component={PostsStackNavigator}
        options={{
          title: "Posts",
          headerShown: false,
        }}
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
                <Pressable onPress={logout} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ fontWeight: "800" }}>Sair</Text>
                </Pressable>
              ),
            }}
          />
        </>
      ) : null}

      {isStudent ? (
        <Tab.Screen
          name="Conta"
          component={DummyAccountScreen}
          options={{
            title: "Conta",
            headerRight: () => (
              <Pressable onPress={logout} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={{ fontWeight: "800" }}>Sair</Text>
              </Pressable>
            ),
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
}

function DummyAccountScreen() {
  return (
    <Text style={{ padding: 16 }}>
      Logado como aluno. Você pode visualizar posts, mas não pode criar/editar/excluir.
    </Text>
  );
}
