import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { StudentsApi } from "../../api/students";

export default function StudentCreateScreen({ navigation }) {
  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      await StudentsApi.create({
        name: name.trim(),
        email: email.trim(),
        password,
        registration: registration.trim() || undefined,
      });

      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao criar aluno");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Novo Aluno</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nome do aluno"
        style={{
          borderWidth: 1,
          borderColor: "#333",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email do aluno (login)"
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

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Senha do aluno"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#333",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      />

      <TextInput
        value={registration}
        onChangeText={setRegistration}
        placeholder="Matrícula (opcional) ex: RM123456"
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
