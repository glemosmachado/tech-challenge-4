import { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { TeachersApi } from "../../api/teachers";
import { Button, Card, H1, Input, Muted, Screen } from "../../ui/components";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function getApiErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Falha ao criar professor"
  );
}

export default function TeacherCreateScreen({ navigation }) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    const n = name.trim();
    const e = email.trim();
    const p = password;
    return n.length >= 2 && isValidEmail(e) && p.length >= 4;
  }, [name, email, password]);

  async function handleSave() {
    const n = name.trim();
    const a = area.trim();
    const e = email.trim();
    const p = password;

    if (n.length < 2) {
      Alert.alert("Erro", "Informe um nome válido.");
      return;
    }

    if (!isValidEmail(e)) {
      Alert.alert("Erro", "Informe um email válido (ex: joao@fiap.com).");
      return;
    }

    if (!p || p.length < 4) {
      Alert.alert("Erro", "Defina uma senha (mínimo 4 caracteres).");
      return;
    }

    try {
      setSaving(true);

      await TeachersApi.create({
        name: n,
        email: e,
        password: p,
        area: a || undefined,
      });

      Alert.alert("Sucesso", "Professor criado com sucesso.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <H1>Novo professor</H1>
          <Muted>Preencha os dados para cadastrar um novo docente.</Muted>
        </View>

        <Card style={styles.card}>
          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            placeholder="Ex: João Silva"
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Ex: joao@fiap.com"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Defina uma senha"
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="done"
          />

          <Input
            label="Área (opcional)"
            value={area}
            onChangeText={setArea}
            placeholder="Ex: Matemática, TI, História..."
            autoCapitalize="words"
          />

          <Button
            title={saving ? "Salvando..." : "Salvar"}
            onPress={handleSave}
            disabled={!canSubmit || saving}
          />
        </Card>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    gap: 6,
  },
  card: {
    marginHorizontal: 16,
    gap: 12,
    padding: 14,
  },
});
