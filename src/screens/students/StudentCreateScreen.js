import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { StudentsApi } from "../../api/students";
import theme from "../../ui/theme";

export default function StudentCreateScreen({ navigation }) {
  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const n = name.trim();
    const r = registration.trim();
    const e = email.trim().toLowerCase();
    const p = password;

    if (!n || !r || !e || !p) {
      Alert.alert("Campos obrigatórios", "Preencha Nome, Matrícula, Email e Senha.");
      return;
    }

    setSaving(true);
    try {
      await StudentsApi.create({
        name: n,
        registration: r,
        email: e,
        password: p,
      });
      navigation.goBack();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Falha ao criar aluno";
      Alert.alert("Erro", msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Ana Silva"
          placeholderTextColor="rgba(255,255,255,0.45)"
        />

        <Text style={styles.label}>Matrícula</Text>
        <TextInput
          style={styles.input}
          value={registration}
          onChangeText={setRegistration}
          placeholder="Ex: RM12345"
          placeholderTextColor="rgba(255,255,255,0.45)"
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Ex: ana@fiap.com"
          placeholderTextColor="rgba(255,255,255,0.45)"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Defina uma senha"
          placeholderTextColor="rgba(255,255,255,0.45)"
          secureTextEntry
        />

        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveBtn,
            pressed && { opacity: 0.85 },
            saving && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.screen,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  label: {
    color: theme.colors.text,
    fontWeight: "700",
    marginTop: 6,
  },

  input: {
    backgroundColor: theme.colors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  saveBtn: {
    marginTop: 14,
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});
