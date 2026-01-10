import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Card, H1, Muted, Screen } from "../../ui/components";
import theme from "../../ui/theme";

export default function PeopleHomeScreen({ navigation }) {
  function showInfo() {
    Alert.alert(
      "Permissão",
      "Somente professores autenticados podem criar, editar e excluir professores e alunos. Alunos podem apenas visualizar posts."
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <H1 style={styles.title}>Pessoas</H1>

        <View style={styles.subtitleRow}>
          <Muted style={styles.subtitle}>
            Cadastre e gerencie professores e alunos
          </Muted>

          <Pressable
            onPress={showInfo}
            hitSlop={12}
            style={({ pressed }) => [
              styles.infoBtn,
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text style={styles.infoText}>i</Text>
          </Pressable>
        </View>
      </View>

      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Ações</Text>
          <Text style={styles.cardHint}>Escolha uma área para gerenciar</Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Professores"
            onPress={() => navigation.navigate("TeachersList")}
            style={styles.actionBtn}
          />

          <Button
            title="Alunos"
            onPress={() => navigation.navigate("StudentsList")}
            style={styles.actionBtn}
          />
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Dica</Text>
          <Text style={styles.noteText}>
            Use a aba Admin para gerenciar posts (criar/editar/excluir).
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 18,
    gap: 14,
  },

  header: {
    gap: 8,
  },

  title: {
    marginBottom: 2,
  },

  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  subtitle: {
    flex: 1,
  },

  infoBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  infoText: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 14,
    marginTop: -1,
  },

  card: {
    gap: 14,
    padding: 16,
  },

  cardHeader: {
    gap: 6,
  },

  cardTitle: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 16,
  },

  cardHint: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },

  actions: {
    gap: 12,
  },

  actionBtn: {
    width: "100%",
  },

  noteBox: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.inputBg,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },

  noteTitle: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 13,
  },

  noteText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
