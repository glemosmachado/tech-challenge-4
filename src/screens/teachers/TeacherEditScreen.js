import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { TeachersApi } from "../../api/teachers";
import theme from "../../ui/theme";

export default function TeacherEditScreen({ route, navigation }) {
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function load() {
      const data = await TeachersApi.getById(id);
      setName(data.name || "");
      setEmail(data.email || "");
      setArea(data.area || "");
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { name, email, area };
      if (password) payload.password = password;
      await TeachersApi.update(id, payload);
      navigation.goBack();
    } catch {
      Alert.alert("Erro", "Falha ao salvar professor");
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

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Área</Text>
        <TextInput
          style={styles.input}
          value={area}
          onChangeText={setArea}
          placeholder="Ex: Matemática, TI..."
          placeholderTextColor={theme.colors.textMuted}
        />

        <Text style={styles.label}>Nova senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Preencha só se quiser trocar"
          placeholderTextColor={theme.colors.textMuted}
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
          <Text style={styles.saveText}>Salvar</Text>
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
