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

export default function PostsListScreen({ navigation }) {
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

  function excerpt(text, max = 130) {
    const s = String(text || "").replace(/\s+/g, " ").trim();
    if (!s) return "Sem descrição.";
    return s.length > max ? s.slice(0, max).trim() + "…" : s;
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

  function renderItem({ item }) {
    return (
      <Card style={styles.card}>
        <Pressable
          onPress={() => navigation.navigate("PostRead", { id: item._id })}
          style={({ pressed }) => [styles.cardPress, pressed && { opacity: 0.92 }]}
        >
          <Text style={styles.title} numberOfLines={1}>
            {item?.title || "Sem título"}
          </Text>

          <Text style={styles.meta} numberOfLines={1}>
            Autor: {item?.author || "—"}
          </Text>

          <Text style={styles.desc} numberOfLines={3}>
            {excerpt(item?.content)}
          </Text>

          <View style={styles.readRow}>
            <Text style={styles.readText}>Ler</Text>
            <Text style={styles.readArrow}>›</Text>
          </View>
        </Pressable>
      </Card>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <H1>Posts</H1>
          <Muted>{filtered.length} disponível(is)</Muted>
        </View>
      </View>

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por palavra-chave..."
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

  card: {
    padding: 16,
  },

  cardPress: {
    gap: 8,
  },

  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "900",
  },

  meta: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },

  desc: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },

  readRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },

  readText: {
    color: theme.colors.accent,
    fontWeight: "900",
    fontSize: 14,
  },

  readArrow: {
    color: theme.colors.accent,
    fontWeight: "900",
    fontSize: 18,
    marginTop: -2,
  },
});