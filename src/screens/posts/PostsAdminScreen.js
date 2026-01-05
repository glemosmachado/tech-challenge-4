import { useContext } from "react";
import { Button, Text, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";

export default function PostsAdminScreen() {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Admin de posts (placeholder)</Text>
      <Button title="Sair" onPress={signOut} />
    </View>
  );
}