import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import theme from "../../ui/theme";

export default function PeopleHomeScreen({ navigation }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const isTeacher = useMemo(() => {
    const r = String(user?.role || user?.type || user?.userType || "").toLowerCase();
    if (user?.isTeacher === true) return true;
    return r === "teacher" || r === "professor" || r === "docente";
  }, [user]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Pessoas</Text>
          <Text style={styles.p}>
            {isTeacher ? "Cadastre e gerencie professores e alunos." : "Visualize professores e alunos."}
          </Text>
        </View>

        <Pressable onPress={() => setOpen(true)} style={styles.infoBtn}>
          <Text style={styles.infoText}>i</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Ações</Text>
        <Text style={styles.subsection}>Escolha uma área para {isTeacher ? "gerenciar" : "visualizar"}</Text>

        <Pressable
          onPress={() => navigation.navigate("TeachersList")}
          style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.primaryBtnText}>{isTeacher ? "Professores" : "Ver professores"}</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("StudentsList")}
          style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.primaryBtnText}>{isTeacher ? "Alunos" : "Ver alunos"}</Text>
        </Pressable>

        <View style={styles.tip}>
          <Text style={styles.tipTitle}>{isTeacher ? "Dica" : "Acesso"}</Text>
          <Text style={styles.tipText}>
            {isTeacher
              ? "Use a aba Admin para gerenciar posts (criar/editar/excluir)."
              : "Você está no modo somente leitura. Para criar/editar/excluir, entre como professor."}
          </Text>
        </View>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Permissões</Text>

            <Text style={styles.modalText}>
              Professor: pode criar, editar e excluir professores, alunos e posts (na aba Admin).
            </Text>
            <Text style={styles.modalText}>
              Aluno: pode apenas visualizar posts, professores e alunos.
            </Text>

            <Pressable
              onPress={() => setOpen(false)}
              style={({ pressed }) => [styles.modalBtn, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.modalBtnText}>Entendi</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.screen },
  content: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 18, gap: 12 },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },

  h1: { color: theme.colors.text, fontSize: 34, fontWeight: "900", marginBottom: 6 },
  p: { color: theme.colors.textMuted, fontSize: 14, lineHeight: 18 },

  infoBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  infoText: { color: theme.colors.text, fontWeight: "900", fontSize: 16, marginTop: -1 },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  section: { color: theme.colors.text, fontSize: 18, fontWeight: "900" },
  subsection: { color: theme.colors.textMuted, marginTop: -6, marginBottom: 6 },

  primaryBtn: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  tip: {
    marginTop: 6,
    backgroundColor: theme.colors.inputBg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  tipTitle: { color: theme.colors.text, fontWeight: "900" },
  tipText: { color: theme.colors.textMuted, lineHeight: 18 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 18,
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
  },
  modalTitle: { color: theme.colors.text, fontSize: 18, fontWeight: "900" },
  modalText: { color: theme.colors.textMuted, lineHeight: 18 },

  modalBtn: {
    marginTop: 8,
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "900", fontSize: 14 },
});