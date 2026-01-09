import { Platform, StyleSheet } from "react-native";
import { theme } from "./theme";

export const ui = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.lg,
  },

  headerTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  headerSubtitle: {
    marginTop: 6,
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 10 },
        }
      : {
          elevation: 2,
        }),
  },

  cardTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },

  text: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },

  muted: {
    color: theme.colors.muted,
  },

  inputLabel: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.2,
  },

  input: {
    backgroundColor: theme.colors.surface2,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: theme.colors.text,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  btn: {
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  btnPrimary: {
    backgroundColor: theme.colors.accent,
  },

  btnPrimaryText: {
    color: theme.colors.bg,
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.2,
  },

  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  btnGhostText: {
    color: theme.colors.text,
    fontWeight: "800",
    fontSize: 14,
  },

  btnDanger: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },

  btnDangerText: {
    color: theme.colors.danger,
    fontWeight: "900",
    fontSize: 14,
  },

  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.35)",
    backgroundColor: "rgba(168,85,247,0.12)",
  },

  pillText: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },

  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },

  errorText: {
    color: theme.colors.danger,
    fontWeight: "700",
  },
});
