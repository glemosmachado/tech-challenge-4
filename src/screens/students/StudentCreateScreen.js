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
    const n = name.trim();
    const e = email.trim();
    const p = password;

    if (!n || !e || !p) {
      Alert.alert("Campos obrigatórios", "Preencha Nome, Email e Senha.");
      return;
    }

    try {
      setSaving(true);

      await StudentsApi.create({
        name: n,
        email: e,
        password: p,
        registration: registration.trim() || undefined,
      });

      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro ao criar aluno", err?.message || "Falha ao criar aluno");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Novo Aluno</Text>

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
