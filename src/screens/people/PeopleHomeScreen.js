import { Pressable, Text, View } from "react-native";

export default function PeopleHomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "800" }}>Pessoas</Text>
      <Text style={{ opacity: 0.8 }}>
        Cadastre, edite e exclua professores e alunos (apenas professor logado).
      </Text>

      <Pressable
        onPress={() => navigation.navigate("TeachersList")}
        style={{
          borderWidth: 1,
          borderColor: "#111",
          borderRadius: 12,
          padding: 14,
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "800" }}>Professores</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("StudentsList")}
        style={{
          borderWidth: 1,
          borderColor: "#111",
          borderRadius: 12,
          padding: 14,
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "800" }}>Alunos</Text>
      </Pressable>
    </View>
  );
}