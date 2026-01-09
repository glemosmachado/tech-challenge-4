import { useState } from "react";
import { Alert, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Hint, Input, Label, Screen } from "../../ui/components";
import { theme } from "../../ui/theme";

export default function LoginScreen() {
  const { login } = useAuth();

  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("prof@fiap.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  function selectRole(nextRole) {
    setRole(nextRole);
    if (nextRole === "teacher") {
      setEmail("prof@fiap.com");
      setPassword("123456");
    } else {
      setEmail("alunoteste@fiap.com");
      setPassword("123456");
    }
  }

  async function onSubmit() {
    try {
      setLoading(true);
      await login({ role, email: email.trim(), password });
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title="Acesso">
      <Card style={{ gap: 12 }}>
        <Hint style={{ color: theme.colors.muted }}>
          Entre como professor ou aluno para acessar o sistema.
        </Hint>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Professor"
              variant={role === "teacher" ? "primary" : "secondary"}
              onPress={() => selectRole("teacher")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Aluno"
              variant={role === "student" ? "primary" : "secondary"}
              onPress={() => selectRole("student")}
            />
          </View>
        </View>

        <Label>Email</Label>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="seuemail@fiap.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Label>Senha</Label>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="sua senha"
          secureTextEntry
        />

        <Button title={loading ? "Entrando..." : "Entrar"} onPress={onSubmit} disabled={loading} />
      </Card>
    </Screen>
  );
}
