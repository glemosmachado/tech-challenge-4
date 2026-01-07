import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { setHttpRole } from "../api/http";
import LoginScreen from "../screens/auth/LoginScreen";

void setHttpRole; //depois deleta

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
    </Stack.Navigator>
  );
}
