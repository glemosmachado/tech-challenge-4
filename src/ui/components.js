import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import themeDefault, { theme as themeNamed } from "./theme";

const T = themeNamed?.colors ? themeNamed : themeDefault;

function pickTypo(key, fallback) {
  return (T?.typography && T.typography[key]) || fallback;
}

export function Screen({ children, style, contentStyle }) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: T.colors.screen }, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

export function Card({ children, style }) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: T.colors.surface,
          borderColor: T.colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function H1({ children, style }) {
  return (
    <Text style={[pickTypo("h1"), { color: T.colors.text }, style]}>
      {children}
    </Text>
  );
}

export function Input(props) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={T.colors.textMuted}
      style={[
        styles.input,
        {
          backgroundColor: T.colors.inputBg,
          borderColor: T.colors.border,
          color: T.colors.text,
        },
        props.style,
      ]}
    />
  );
}

export function Button({ title, onPress, disabled, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: T.colors.accent,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
}

export function Muted({ children }) {
  return <Text style={{ color: T.colors.textMuted }}>{children}</Text>;
}

export function Loading({ text }) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 20 }}>
      <ActivityIndicator />
      {text ? <Text style={{ marginTop: 10 }}>{text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  btn: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0B0B10",
  },
});
