import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AuthContext } from "../../context/AuthContext";

export default function LoginScreen() {
  const auth = useContext(AuthContext) || {};

  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("prof@fiap.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === "teacher") {
      setEmail("prof@fiap.com");
      setPassword("123456");
    } else {
      setEmail("aluno@fiap.com");
      setPassword("123456");
    }
  }, [role]);

  const title = useMemo(
    () => (role === "teacher" ? "Login (Professor)" : "Login (Aluno)"),
    [role]
  );

  async function handleLogin() {
    const e = String(email || "").trim().toLowerCase();
    const p = String(password || "").trim();

    if (!e || !p) {
      Alert.alert("Erro", "Email e senha são obrigatórios.");
      return;
    }

    const fn =
      role === "teacher"
        ? auth.loginTeacher || auth.loginteacher
        : auth.loginStudent || auth.loginstudent;

    if (typeof fn !== "function") {
      Alert.alert(
        "Erro",
        `Função de login não encontrada no AuthContext (${role}).\nVerifique se existe loginTeacher/loginStudent.`
      );
      return;
    }

    setLoading(true);
    try {
      if (fn.length >= 2) {
        await fn(e, p);
      } else {
        await fn({ email: e, password: p });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Falha ao efetuar login.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.appTitle}>Tech Challenge 4</Text>
        <Text style={styles.subtitle}>Acesso ao sistema</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>

        <View style={styles.segment}>
          <Pressable
            onPress={() => setRole("teacher")}
            style={[
              styles.segmentBtn,
              role === "teacher" && styles.segmentBtnActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                role === "teacher" && styles.segmentTextActive,
              ]}
            >
              Professor
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setRole("student")}
            style={[
              styles.segmentBtn,
              role === "student" && styles.segmentBtnActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                role === "student" && styles.segmentTextActive,
              ]}
            >
              Aluno
            </Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: prof@fiap.com"
          placeholderTextColor="rgba(255,255,255,0.35)"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="sua senha"
          placeholderTextColor="rgba(255,255,255,0.35)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.85 },
            loading && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </Pressable>

        <Text style={styles.hint}>
          Dica: professor usa o admin do .env (prof@fiap.com / 123456) e aluno usa
          (aluno@fiap.com / 123456).
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07060b",
    paddingHorizontal: 18,
    paddingTop: 60,
    justifyContent: "flex-start",
  },
  header: {
    marginBottom: 14,
  },
  appTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
  },
  card: {
    backgroundColor: "#12111a",
    borderColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  cardTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  segment: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "#0d0b14",
  },
  segmentBtnActive: {
    backgroundColor: "#9b87ff",
    borderColor: "rgba(155,135,255,0.65)",
  },
  segmentText: {
    color: "rgba(255,255,255,0.72)",
    fontWeight: "700",
  },
  segmentTextActive: {
    color: "#0b0a10",
  },
  label: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#0d0b14",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.92)",
  },
  primaryBtn: {
    marginTop: 14,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#9b87ff",
  },
  primaryBtnText: {
    color: "#0b0a10",
    fontWeight: "800",
    fontSize: 16,
  },
  
  hint: {
    marginTop: 10,
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    lineHeight: 16,
  }
}); 
