import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { TeachersApi } from "../../api/teachers";

export default function TeacherEditScreen({ route, navigation }) {
  const { id } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await TeachersApi.getById(id);

      setName(data?.name || "");
      setEmail(data?.email || "");
      setArea(data?.area || "");
      setPassword("");
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar professor");
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
        area: area.trim(),
      };

      if (password.trim()) payload.password = password;

      await TeachersApi.update(id, payload);

      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao salvar professor");
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
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Editar Professor</Text>

      <Text style={{ fontWeight: "600" }}>Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ex: João Silva"
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
        placeholder="Ex: joao@fiap.com"
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

      <Text style={{ fontWeight: "600" }}>Área (opcional)</Text>
      <TextInput
        value={area}
        onChangeText={setArea}
        placeholder="Ex: Matemática, TI, História..."
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
