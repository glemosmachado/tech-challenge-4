import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PeopleHomeScreen from "../screens/people/PeopleHomeScreen";

import TeacherCreateScreen from "../screens/teachers/TeacherCreateScreen";
import TeacherEditScreen from "../screens/teachers/TeacherEditScreen";
import TeachersListScreen from "../screens/teachers/TeachersListScreen";

import StudentCreateScreen from "../screens/students/StudentCreateScreen";
import StudentEditScreen from "../screens/students/StudentEditScreen";
import StudentsListScreen from "../screens/students/StudentsListScreen";

const Stack = createNativeStackNavigator();

export default function PeopleStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PeopleHome" component={PeopleHomeScreen} options={{ title: "Pessoas" }} />

      <Stack.Screen name="TeachersList" component={TeachersListScreen} options={{ title: "Professores" }} />
      <Stack.Screen name="TeacherCreate" component={TeacherCreateScreen} options={{ title: "Novo Professor" }} />
      <Stack.Screen name="TeacherEdit" component={TeacherEditScreen} options={{ title: "Editar Professor" }} />

      <Stack.Screen name="StudentsList" component={StudentsListScreen} options={{ title: "Alunos" }} />
      <Stack.Screen name="StudentCreate" component={StudentCreateScreen} options={{ title: "Novo Aluno" }} />
      <Stack.Screen name="StudentEdit" component={StudentEditScreen} options={{ title: "Editar Aluno" }} />
    </Stack.Navigator>
  );
}
