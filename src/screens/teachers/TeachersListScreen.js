import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { TeachersApi } from "../../api/teachers";
import { useAuth } from "../../context/AuthContext";
import { Card, H1, Input, Loading, Muted, Screen } from "../../ui/components";
import theme from "../../ui/theme";

export default function TeachersListScreen({ navigation }) {
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await TeachersApi.list();
      const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setItems(arr);
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar professores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  const filtered = useMemo(() => {
    if (!debounced) return items;
    return items.filter((t) => {
      const n = String(t?.name || "").toLowerCase();
      const e = String(t?.email || "").toLowerCase();
      const a = String(t?.area || "").toLowerCase();
      return n.includes(debounced) || e.includes(debounced) || a.includes(debounced);
    });
  }, [items, debounced]);

  async function handleDelete(item) {
    const isMe = item?.email && user?.email && item.email === user.email;
    if (isMe) return;

    Alert.alert("Excluir professor", "Essa ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await TeachersApi.remove(item._id);
            setItems((prev) => prev.filter((x) => x._id !== item._id));
          } catch (e) {
            Alert.alert("Erro", e?.message || "Falha ao excluir");
          }
        },
      },
    ]);
  }

  function renderItem({ item }) {
    const isMe = item?.email && user?.email && item.email === user.email;

    return (
      <Card style={styles.card}>
        <View style={styles.top}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {item?.name || "Sem nome"}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {item?.email || "—"}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              Área: {item?.area || "—"}
            </Text>
          </View>

          {isMe ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Você</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => navigation.navigate("TeacherEdit", { id: item._id })}
            style={({ pressed }) => [styles.btnEdit, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.btnText}>Editar</Text>
          </Pressable>

          <Pressable
            disabled={isMe}
            onPress={() => handleDelete(item)}
            style={[
              styles.btnDelete,
              isMe && styles.btnBlocked,
            ]}
          >
            <Text style={styles.btnText}>{isMe ? "Bloqueado" : "Excluir"}</Text>
          </Pressable>
        </View>
      </Card>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <H1>Professores</H1>
          <Muted>{filtered.length} no total</Muted>
        </View>

        <Pressable
          onPress={() => navigation.navigate("TeacherCreate")}
          style={({ pressed }) => [styles.newBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.newBtnText}>Novo</Text>
        </Pressable>
      </View>

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por nome, email ou área..."
      />

      {loading ? (
        <Loading text="Carregando..." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(it) => it._id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 18 }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 14, gap: 12 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  newBtn: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },

  newBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  card: {
    padding: 16,
    gap: 12,
  },

  top: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },

  name: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },

  meta: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },

  badge: {
    backgroundColor: theme.colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  btnEdit: {
    flex: 1,
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  btnDelete: {
    flex: 1,
    backgroundColor: theme.colors.danger,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  btnBlocked: {
    backgroundColor: "#7a2f3b",
    opacity: 0.85,
  },

  btnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
});