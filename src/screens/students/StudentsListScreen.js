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

import { StudentsApi } from "../../api/students";
import { useAuth } from "../../context/AuthContext";
import { Card, H1, Input, Loading, Muted, Screen } from "../../ui/components";
import theme from "../../ui/theme";

export default function StudentsListScreen({ navigation }) {
  const { isTeacher } = useAuth();

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
      const data = await StudentsApi.list();
      const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setItems(arr);
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar alunos");
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

    return items.filter((s) => {
      const n = String(s?.name || "").toLowerCase();
      const e = String(s?.email || "").toLowerCase();
      const r = String(s?.registration || s?.rm || "").toLowerCase();
      return n.includes(debounced) || e.includes(debounced) || r.includes(debounced);
    });
  }, [items, debounced]);

  async function handleDelete(item) {
    Alert.alert("Excluir aluno", "Essa ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await StudentsApi.remove(item._id);
            setItems((prev) => prev.filter((x) => x._id !== item._id));
          } catch (e) {
            Alert.alert("Erro", e?.message || "Falha ao excluir");
          }
        },
      },
    ]);
  }

  function renderItem({ item }) {
    const reg = item?.registration || item?.rm || "—";

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
              Matrícula: {reg}
            </Text>
          </View>

          {!isTeacher ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Somente leitura</Text>
            </View>
          ) : null}
        </View>

        {isTeacher ? (
          <View style={styles.actions}>
            <Pressable
              onPress={() => navigation.navigate("StudentEdit", { id: item._id })}
              style={({ pressed }) => [styles.btnEdit, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.btnText}>Editar</Text>
            </Pressable>

            <Pressable
              onPress={() => handleDelete(item)}
              style={({ pressed }) => [styles.btnDelete, pressed && { opacity: 0.9 }]}
            >
              <Text style={styles.btnText}>Excluir</Text>
            </Pressable>
          </View>
        ) : null}
      </Card>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <H1>Alunos</H1>
          <Muted>
            {filtered.length} no total {isTeacher ? "" : "• somente leitura"}
          </Muted>
        </View>

        {isTeacher ? (
          <Pressable
            onPress={() => navigation.navigate("StudentCreate")}
            style={({ pressed }) => [styles.newBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.newBtnText}>Novo</Text>
          </Pressable>
        ) : null}
      </View>

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por nome, email ou matrícula..."
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

  badge: {
    backgroundColor: "rgba(167,139,250,0.14)",
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 12,
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

  btnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
});