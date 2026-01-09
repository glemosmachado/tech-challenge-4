import { View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, H1, Muted, Screen } from "../../ui/components";

export default function PeopleHomeScreen({ navigation }) {
  const { user } = useAuth();

  const isTeacher = user?.role === "teacher";

  return (
    <Screen style={{ gap: 14 }}>
      <H1>Pessoas</H1>

      <Muted>
        Cadastre, edite e exclua professores e alunos (apenas professor logado).
      </Muted>

      <Card style={{ gap: 12 }}>
        <Button
          title="Professores"
          variant={isTeacher ? "primary" : "ghost"}
          onPress={() => navigation.navigate("TeachersList")}
          disabled={!isTeacher}
        />

        <Button
          title="Alunos"
          variant={isTeacher ? "primary" : "ghost"}
          onPress={() => navigation.navigate("StudentsList")}
          disabled={!isTeacher}
        />
      </Card>

      {!isTeacher ? (
        <Card>
          <Muted>
            Você está logado como aluno. A área de Pessoas é restrita a professores.
          </Muted>
        </Card>
      ) : (
        <View />
      )}
    </Screen>
  );
}
