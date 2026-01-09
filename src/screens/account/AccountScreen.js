import { Alert, Pressable, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function AccountScreen() {
  const { user, role, signOut } = useAuth();

  const email = user?.email || "—";
  const name = user?.name || "—";
  const effectiveRole = role || user?.role || "—";
  const id = user?.id || "—";

  function handleLogout() {
    Alert.alert("Sair", "Quer sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 14 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Conta</Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#222",
          borderRadius: 12,
          padding: 14,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700" }}>Dados</Text>
        <Text>ID: {id}</Text>
        <Text>Nome: {name}</Text>
        <Text>Email: {email}</Text>
        <Text>Tipo: {effectiveRole}</Text>
      </View>

      <Pressable
        onPress={handleLogout}
        style={{
          backgroundColor: "#111",
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
          Sair
        </Text>
      </Pressable>
    </View>
  );
}
