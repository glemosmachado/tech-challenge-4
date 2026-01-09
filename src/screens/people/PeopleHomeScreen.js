import { StyleSheet } from "react-native";
import { Card, PrimaryButton, Screen, Subtitle, Title } from "../../ui/components";

export default function PeopleHomeScreen({ navigation }) {
  return (
    <Screen>
      <Title style={styles.h1}>Pessoas</Title>
      <Subtitle style={styles.p}>
        Cadastre, edite e exclua professores e alunos (apenas professor logado).
      </Subtitle>

      <Card style={styles.card}>
        <PrimaryButton
          title="Professores"
          onPress={() => navigation.navigate("TeachersList")}
        />

        <PrimaryButton
          title="Alunos"
          onPress={() => navigation.navigate("StudentsList")}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: { marginBottom: 6 },
  p: { marginBottom: 16 },
  card: { gap: 12 },
});
