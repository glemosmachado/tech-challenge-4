import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { StudentsApi } from "../../api/students";
import theme from "../../ui/theme";

export default function StudentEditScreen({ route, navigation }) {
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await StudentsApi.getById(id);
        setName(data?.name || "");
        setEmail(data?.email || "");
        setRegistration(data?.registration || data?.rm || "");
      } catch (e) {
        Alert.alert("Erro", "Falha ao carregar aluno");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        name: String(name || "").trim(),
        email: String(email || "").trim().toLowerCase(),
        registration: String(registration || "").trim(),
      };

      if (!payload.name || !payload.email || !payload.registration) {
        Alert.alert("Campos obrigatórios", "Preencha Nome, Matrícula e Email.");
        setSaving(false);
        return;
      }

      if (password) payload.password = password;

      await StudentsApi.update(id, payload);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao salvar aluno");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

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
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Nova senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Preencha só se quiser trocar"
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
  loading: {
    flex: 1,
    justifyContent: "center",
  },

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
