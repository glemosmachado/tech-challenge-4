import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PeopleHomeScreen from "../screens/people/PeopleHomeScreen";

import TeacherCreateScreen from "../screens/teachers/TeacherCreateScreen";
import TeacherEditScreen from "../screens/teachers/TeacherEditScreen";
import TeachersListScreen from "../screens/teachers/TeachersListScreen";

import StudentCreateScreen from "../screens/students/StudentCreateScreen";
import StudentEditScreen from "../screens/students/StudentEditScreen";
import StudentsListScreen from "../screens/students/StudentsListScreen";

import { theme as ui } from "../ui/theme";

const Stack = createNativeStackNavigator();

export default function PeopleStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: ui.colors.bg },
        headerTintColor: ui.colors.text,
        headerTitleStyle: { fontWeight: "900" },
        contentStyle: { backgroundColor: ui.colors.bg },
      }}
    >
      <Stack.Screen
        name="PeopleHome"
        component={PeopleHomeScreen}
        options={{ title: "Pessoas" }}
      />

      {/* Teachers */}
      <Stack.Screen
        name="TeachersList"
        component={TeachersListScreen}
        options={{ title: "Professores" }}
      />
      <Stack.Screen
        name="TeacherCreate"
        component={TeacherCreateScreen}
        options={{ title: "Novo professor" }}
      />
      <Stack.Screen
        name="TeacherEdit"
        component={TeacherEditScreen}
        options={{ title: "Editar professor" }}
      />

      {/* Students */}
      <Stack.Screen
        name="StudentsList"
        component={StudentsListScreen}
        options={{ title: "Alunos" }}
      />
      <Stack.Screen
        name="StudentCreate"
        component={StudentCreateScreen}
        options={{ title: "Novo aluno" }}
      />
      <Stack.Screen
        name="StudentEdit"
        component={StudentEditScreen}
        options={{ title: "Editar aluno" }}
      />
    </Stack.Navigator>
  );
}
