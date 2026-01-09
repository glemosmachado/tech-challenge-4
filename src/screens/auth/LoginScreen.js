import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [role, setRole] = useState("teacher"); 
  const [email, setEmail] = useState("prof@fiap.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  function selectRole(nextRole) {
    setRole(nextRole);

    if (nextRole === "teacher") {
      setEmail("prof@fiap.com");
      setPassword("123456");
    } else {
      setEmail("alunoteste@fiap.com");
      setPassword("123456");
    }
  }

  async function onSubmit() {
    try {
      setLoading(true);
      await login({ role, email: email.trim(), password });
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Login</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={() => selectRole("teacher")}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#222",
            backgroundColor: role === "teacher" ? "#222" : "transparent",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: role === "teacher" ? "#fff" : "#222",
              fontWeight: "700",
            }}
          >
            Professor
          </Text>
        </Pressable>

        <Pressable
          onPress={() => selectRole("student")}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#222",
            backgroundColor: role === "student" ? "#222" : "transparent",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: role === "student" ? "#fff" : "#222",
              fontWeight: "700",
            }}
          >
            Aluno
          </Text>
        </Pressable>
      </View>

      <Text style={{ fontWeight: "600" }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Seu email"
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
        placeholder="Sua senha"
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
        onPress={onSubmit}
        disabled={loading}
        style={{
          marginTop: 6,
          backgroundColor: "#111",
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: "center",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </Pressable>
    </View>
  );
}
