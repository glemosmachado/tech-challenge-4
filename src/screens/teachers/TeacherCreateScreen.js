import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { TeachersApi } from "../../api/teachers";

export default function TeacherCreateScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSave() {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Validação", "Nome e email são obrigatórios.");
      return;
    }

    try {
      setSaving(true);

      await TeachersApi.create({
        name: name.trim(),
        email: email.trim(),
        department: department.trim() || undefined,
      });

      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.response?.data?.message || e?.message || "Falha ao criar professor");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Novo Professor</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nome"
        style={{ borderWidth: 1, borderColor: "#333", padding: 12, borderRadius: 10 }}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: "#333", padding: 12, borderRadius: 10 }}
      />

      <TextInput
        value={department}
        onChangeText={setDepartment}
        placeholder="Departamento (opcional)"
        style={{ borderWidth: 1, borderColor: "#333", padding: 12, borderRadius: 10 }}
      />

      <Pressable
        onPress={onSave}
        disabled={saving}
        style={{
          backgroundColor: "#111",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? <ActivityIndicator /> : <Text style={{ color: "#fff", fontWeight: "700" }}>Salvar</Text>}
      </Pressable>
    </View>
  );
}
