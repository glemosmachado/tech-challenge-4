import {
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

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

export default Screen;

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

export function Row({ children, style }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function Spacer({ h = 12 }) {
  return <View style={{ height: h }} />;
}

export function H1({ children, style, numberOfLines }) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        pickTypo("h1", { fontSize: 28, fontWeight: "800" }),
        { color: T.colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function H2({ children, style, numberOfLines }) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        pickTypo("h2", { fontSize: 20, fontWeight: "800" }),
        { color: T.colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function H3({ children, style, numberOfLines }) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        pickTypo("h3", { fontSize: 16, fontWeight: "700" }),
        { color: T.colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Title({ children, style, numberOfLines }) {
  return <H2 numberOfLines={numberOfLines} style={style}>{children}</H2>;
}

export function Subtitle({ children, style, numberOfLines }) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        pickTypo("body", { fontSize: 16, fontWeight: "400" }),
        { color: T.colors.textMuted },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Label({ children, style }) {
  return (
    <Text
      style={[
        pickTypo("small", { fontSize: 13, fontWeight: "400" }),
        { color: T.colors.textMuted },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Muted({ children, style }) {
  return <Label style={style}>{children}</Label>;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType,
  style,
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={T.colors.textMuted}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      style={[
        styles.input,
        {
          backgroundColor: T.colors.inputBg,
          borderColor: T.colors.border,
          color: T.colors.text,
        },
        style,
      ]}
    />
  );
}

export function Button({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled,
}) {
  const bg =
    variant === "primary"
      ? T.colors.accent
      : variant === "secondary"
      ? "rgba(255,255,255,0.08)"
      : "transparent";

  const border = variant === "ghost" ? T.colors.border : "transparent";

  const color = variant === "primary" ? "#0B0B10" : T.colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderColor: border,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.btnText, { color }, textStyle]}>{title}</Text>
    </Pressable>
  );
}

export function PrimaryButton(props) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props) {
  return <Button {...props} variant="secondary" />;
}

export function GhostButton(props) {
  return <Button {...props} variant="ghost" />;
}

export function DangerButton({ title, onPress, style, textStyle, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: "transparent",
          borderColor: T.colors.danger,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.btnText, { color: T.colors.danger }, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "800",
  },
});