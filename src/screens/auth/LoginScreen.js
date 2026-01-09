import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import { ui } from "../../ui/components";

export default function LoginScreen() {
  const { loginTeacher, loginStudent } = useAuth();

  const [mode, setMode] = useState("teacher"); // "teacher" | "student"
  const [email, setEmail] = useState(mode === "teacher" ? "prof@fiap.com" : "");
  const [password, setPassword] = useState(mode === "teacher" ? "123456" : "");
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    return mode === "teacher" ? "Login (Professor)" : "Login (Aluno)";
  }, [mode]);

  function switchMode(next) {
    setMode(next);
    setEmail(next === "teacher" ? "prof@fiap.com" : "");
    setPassword(next === "teacher" ? "123456" : "");
  }

  async function handleLogin() {
    const e = email.trim();
    const p = password.trim();

    if (!e || !p) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "teacher") {
        await loginTeacher(e, p);
      } else {
        await loginStudent(e, p);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Falha ao fazer login.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={ui.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ gap: 12 }}>
        <Text style={ui.headerTitle}>Login</Text>
        <Text style={ui.headerSubtitle}>
          Entre como professor ou aluno para acessar o app.
        </Text>

        <View style={[ui.row, { marginTop: 10 }]}>
          <Pressable
            onPress={() => switchMode("teacher")}
            style={[
              ui.btn,
              ui.btnGhost,
              {
                flex: 1,
                borderColor:
                  mode === "teacher" ? "rgba(168,85,247,0.55)" : ui.btnGhost.borderColor,
                backgroundColor:
                  mode === "teacher" ? "rgba(168,85,247,0.12)" : "transparent",
              },
            ]}
          >
            <Text style={ui.btnGhostText}>Professor</Text>
          </Pressable>

          <Pressable
            onPress={() => switchMode("student")}
            style={[
              ui.btn,
              ui.btnGhost,
              {
                flex: 1,
                borderColor:
                  mode === "student" ? "rgba(168,85,247,0.55)" : ui.btnGhost.borderColor,
                backgroundColor:
                  mode === "student" ? "rgba(168,85,247,0.12)" : "transparent",
              },
            ]}
          >
            <Text style={ui.btnGhostText}>Aluno</Text>
          </Pressable>
        </View>

        <View style={[ui.card, { marginTop: 12, gap: 10 }]}>
          <Text style={ui.cardTitle}>{title}</Text>

          <Text style={ui.inputLabel}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="ex: prof@fiap.com"
            placeholderTextColor="rgba(255,255,255,0.35)"
            autoCapitalize="none"
            keyboardType="email-address"
            style={ui.input}
          />

          <Text style={ui.inputLabel}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="sua senha"
            placeholderTextColor="rgba(255,255,255,0.35)"
            secureTextEntry
            autoCapitalize="none"
            style={ui.input}
          />

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={[
              ui.btn,
              ui.btnPrimary,
              { marginTop: 14, opacity: loading ? 0.7 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={ui.btnPrimaryText}>Entrar</Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
