import { useContext } from "react";
import { Button, Text, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";

export default function LoginScreen() {
  const { signInFakeAsTeacher } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Login (placeholder)</Text>
      <Button title="Entrar (fake professor)" onPress={signInFakeAsTeacher} />
    </View>
  );
}
