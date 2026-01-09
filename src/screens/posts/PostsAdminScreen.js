import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { PostsApi } from "../../api/posts";

export default function PostsAdminScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const t = String(p?.title || "").toLowerCase();
      const a = String(p?.author || "").toLowerCase();
      const c = String(p?.content || "").toLowerCase();
      return t.includes(q) || a.includes(q) || c.includes(q);
    });
  }, [posts, query]);

  async function loadAll({ showDebug = false } = {}) {
    try {
      setMessage("");
      setLoading(true);
      const data = await PostsApi.list();
      const arr = Array.isArray(data) ? data : [];
      setPosts(arr);
      if (showDebug) setMessage(`debug: carregou ${arr.length} posts`);
    } catch (e) {
      setMessage(e?.message || "Falha ao carregar posts");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    try {
      await loadAll();
    } finally {
      setRefreshing(false);
    }
  }

  async function handleDelete(postId) {
    Alert.alert("Excluir", "Deseja excluir este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await PostsApi.remove(postId);
            // remove da lista na hora
            setPosts((prev) => prev.filter((p) => p?._id !== postId));
          } catch (e) {
            Alert.alert("Erro", e?.message || "Falha ao excluir post");
          }
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Admin - Posts</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por título, autor ou conteúdo..."
          autoCapitalize="none"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#333",
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        />

        <Pressable
          onPress={() => navigation.navigate("PostCreate")}
          style={{
            borderWidth: 1,
            borderColor: "#333",
            borderRadius: 10,
            paddingHorizontal: 14,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "700" }}>Novo</Text>
        </Pressable>
      </View>

      {message ? <Text style={{ color: "#b00020" }}>{message}</Text> : null}

      {loading ? (
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
        </View>
      ) : filtered.length === 0 ? (
        <Text>Nenhum post encontrado.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, idx) => item?._id || String(idx)}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            const id = item?._id;
            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("PostRead", { postId: id })
                }
                style={{
                  borderWidth: 1,
                  borderColor: "#222",
                  borderRadius: 12,
                  padding: 12,
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  {item?.title || "Sem título"}
                </Text>

                <Text style={{ opacity: 0.8 }}>
                  Autor: {item?.author || "—"}
                </Text>

                <Text numberOfLines={2}>{item?.content || "—"}</Text>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    onPress={() => navigation.navigate("PostEdit", { postId: id })}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#333",
                    }}
                  >
                    <Text style={{ fontWeight: "700" }}>Editar</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleDelete(id)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#b00020",
                    }}
                  >
                    <Text style={{ fontWeight: "700", color: "#b00020" }}>
                      Excluir
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
