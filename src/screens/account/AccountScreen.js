// src/screens/account/AccountScreen.js
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import theme from "../../ui/theme";

export default function AccountScreen() {
  const { user, role, logout } = useAuth();

  const email = user?.email || "—";
  const name = user?.name || user?.fullName || "—";
  const id = user?.id || user?._id || "—";
  const effectiveRole = role || user?.role || "—";

  function handleLogout() {
    Alert.alert("Sair", "Quer sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Conta</Text>
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.muted}>{email}</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{String(effectiveRole).toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.section}>Detalhes</Text>

        <View style={styles.kv}>
          <Text style={styles.k}>ID</Text>
          <Text style={styles.v} numberOfLines={1}>
            {id}
          </Text>
        </View>

        <View style={styles.kv}>
          <Text style={styles.k}>Tipo</Text>
          <Text style={styles.v}>{effectiveRole}</Text>
        </View>

        <View style={styles.divider} />

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.screen,
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 6,
  },

  muted: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },

  badge: {
    backgroundColor: "rgba(167,139,250,0.14)",
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },

  badgeText: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.4,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginTop: 6,
    marginBottom: 6,
  },

  section: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },

  kv: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  k: {
    width: 56,
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "800",
  },

  v: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "800",
  },

  logoutBtn: {
    marginTop: 6,
    backgroundColor: theme.colors.danger,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});
