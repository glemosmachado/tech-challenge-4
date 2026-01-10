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

import { PostsApi } from "../../api/posts";
import { Card, H1, Input, Loading, Muted, Screen } from "../../ui/components";
import theme from "../../ui/theme";

export default function PostsAdminScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await PostsApi.list();
      const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setPosts(arr);
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar posts");
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
    if (!debounced) return posts;

    return posts.filter((p) => {
      const t = String(p?.title || "").toLowerCase();
      const a = String(p?.author || "").toLowerCase();
      const c = String(p?.content || "").toLowerCase();
      return t.includes(debounced) || a.includes(debounced) || c.includes(debounced);
    });
  }, [posts, debounced]);

  function confirmDelete(postId) {
    Alert.alert("Excluir post", "Essa ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await PostsApi.remove(postId);
            setPosts((prev) => prev.filter((p) => p?._id !== postId));
          } catch (e) {
            Alert.alert("Erro", e?.message || "Falha ao excluir post");
          }
        },
      },
    ]);
  }

  function excerpt(text, max = 120) {
    const s = String(text || "").replace(/\s+/g, " ").trim();
    if (!s) return "Sem conteúdo.";
    return s.length > max ? s.slice(0, max).trim() + "…" : s;
  }

  function renderItem({ item }) {
    return (
      <Card style={styles.card}>
        <Pressable
          onPress={() => navigation.navigate("PostRead", { id: item._id })}
          style={({ pressed }) => [styles.cardPress, pressed && { opacity: 0.92 }]}
        >
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>
                {item?.title || "Sem título"}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                Autor: {item?.author || "—"}
              </Text>
              <Text style={styles.desc} numberOfLines={3}>
                {excerpt(item?.content)}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() => navigation.navigate("PostEdit", { id: item._id })}
              style={({ pressed }) => [styles.btnEdit, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.btnText}>Editar</Text>
            </Pressable>

            <Pressable
              onPress={() => confirmDelete(item._id)}
              style={({ pressed }) => [styles.btnDelete, pressed && { opacity: 0.9 }]}
            >
              <Text style={styles.btnText}>Excluir</Text>
            </Pressable>
          </View>
        </Pressable>
      </Card>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <H1>Admin</H1>
          <Muted>{filtered.length} post(s)</Muted>
        </View>

        <Pressable
          onPress={() => navigation.navigate("PostCreate")}
          style={({ pressed }) => [styles.newBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.newBtnText}>Novo</Text>
        </Pressable>
      </View>

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por título, autor ou conteúdo..."
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

  cardPress: {
    gap: 12,
  },

  cardTop: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },

  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },

  meta: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },

  desc: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
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