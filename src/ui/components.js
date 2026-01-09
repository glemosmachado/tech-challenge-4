import { Pressable, Text, TextInput, View } from "react-native";
import theme, { colors } from "./theme";

export function Screen({ style, children }) {
  return <View style={[theme.components.screen, style]}>{children}</View>;
}

export function Card({ style, children }) {
  return <View style={[theme.components.card, style]}>{children}</View>;
}

export function Title({ children, style }) {
  return <Text style={[theme.typography.h2, style]}>{children}</Text>;
}

export function Subtitle({ children, style }) {
  return <Text style={[theme.typography.muted, style]}>{children}</Text>;
}

export function Label({ children, style }) {
  return (
    <Text style={[{ color: colors.muted, fontWeight: "700", marginBottom: 8 }, style]}>
      {children}
    </Text>
  );
}

export function AppText({ children, style }) {
  return <Text style={[theme.typography.body, style]}>{children}</Text>;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  style,
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.components.inputMeta.placeholderTextColor}
      selectionColor={theme.components.inputMeta.selectionColor}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize || "none"}
      style={[theme.components.input, style]}
    />
  );
}

export function PrimaryButton({ title, onPress, style, textStyle, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        theme.components.buttonPrimary,
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={[theme.components.buttonPrimaryText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, style, textStyle, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        theme.components.buttonSecondary,
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={[theme.components.buttonSecondaryText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

export function DangerButton({ title, onPress, style, textStyle, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        theme.components.buttonDanger,
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={[theme.components.buttonDangerText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

export default {
  Screen,
  Card,
  Title,
  Subtitle,
  Label,
  AppText,
  Input,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
};