import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { Pressable, Text } from "react-native";

import PostCreateScreen from "../screens/posts/PostCreateScreen";
import PostEditScreen from "../screens/posts/PostEditScreen";
import PostReadScreen from "../screens/posts/PostReadScreen";
import PostsListScreen from "../screens/posts/PostsListScreen";

import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

function HeaderNewButton({ navigation }) {
  const { role } = useContext(AuthContext);

  if (role !== "teacher") return null;

  return (
    <Pressable onPress={() => navigation.navigate("PostCreate")}>
      <Text style={{ fontSize: 16 }}>Novo</Text>
    </Pressable>
  );
}

export default function PostsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostsList"
        component={PostsListScreen}
        options={({ navigation }) => ({
          title: "Posts",
          headerRight: () => <HeaderNewButton navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="PostRead"
        component={PostReadScreen}
        options={{ title: "Leitura" }}
      />

      <Stack.Screen
        name="PostCreate"
        component={PostCreateScreen}
        options={{ title: "Novo post" }}
      />

      <Stack.Screen
        name="PostEdit"
        component={PostEditScreen}
        options={{ title: "Editar" }}
      />
    </Stack.Navigator>
  );
}