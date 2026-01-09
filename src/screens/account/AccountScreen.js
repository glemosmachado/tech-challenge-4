import { Alert, Text } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Divider, Hint, Label, Screen } from "../../ui/components";
import { theme } from "../../ui/theme";

export default function AccountScreen() {
  const { user, role, signOut } = useAuth();

  const email = user?.email || "—";
  const name = user?.name || "—";
  const id = user?.id || "—";
  const effectiveRole = role || user?.role || "—";

  function handleLogout() {
    Alert.alert("Sair", "Quer sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <Screen title="Conta">
      <Card style={{ gap: 10 }}>
        <Label>Identidade</Label>
        <Text style={{ color: theme.colors.text, fontSize: theme.type.h2, fontWeight: "800" }}>
          {name}
        </Text>
        <Hint>{email}</Hint>

        <Divider />

        <Label>Detalhes</Label>
        <Hint>ID: {id}</Hint>
        <Hint>Tipo: {effectiveRole}</Hint>

        <Divider />

        <Button title="Sair" variant="danger" onPress={handleLogout} />
      </Card>
    </Screen>
  );
}