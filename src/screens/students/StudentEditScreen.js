import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { StudentsApi } from "../../api/students";

export default function StudentEditScreen({ route, navigation }) {
  const { id } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await StudentsApi.getById(id);

      setName(data?.name || "");
      setEmail(data?.email || "");
      setRegistration(data?.registration || "");
      setPassword("");
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar aluno");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleSave() {
    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        registration: registration.trim(),
      };

      if (password.trim()) payload.password = password;

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
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Editar Aluno</Text>

      <Text style={{ fontWeight: "600" }}>Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ex: Maria Souza"
        style={{
          borderWidth: 1,
          borderColor: "#333",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      />

      <Text style={{ fontWeight: "600" }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Ex: maria@fiap.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: "#333",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      />

      <Text style={{ fontWeight: "600" }}>Nova senha (opcional)</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Preencha só se quiser trocar"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#333",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      />

      <Text style={{ fontWeight: "600" }}>Matrícula (opcional)</Text>
      <TextInput
        value={registration}
        onChangeText={setRegistration}
        placeholder="Ex: RM123456"
        autoCapitalize="characters"
        style={{
          borderWidth: 1,
          borderColor: "#333",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      />

      <Pressable
        onPress={handleSave}
        disabled={saving}
        style={{
          marginTop: 6,
          backgroundColor: "#111",
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: "center",
          opacity: saving ? 0.6 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
          Salvar
        </Text>
      </Pressable>
    </View>
  );
}
