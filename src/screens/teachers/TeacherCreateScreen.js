import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { TeachersApi } from "../../api/teachers";

export default function TeacherCreateScreen({ navigation }) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      await TeachersApi.create({
        name: name.trim(),
        area: area.trim() || undefined,
        email: email.trim(),
        password,
      });

      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Failed to create teacher");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Novo Professor</Text>

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

      <Text style={{ fontWeight: "600" }}>Senha</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Defina uma senha"
        secureTextEntry
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
