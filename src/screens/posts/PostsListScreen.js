import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { PostsApi } from "../../api/posts";

export default function PostsListScreen() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState(""); // debug/erro na tela

  async function loadAll({ showDebug = true } = {}) {
    try {
      setMessage("");
      setLoading(true);

      const data = await PostsApi.list();
      console.log("PostsApi.list() =>", data);

      const arr = Array.isArray(data) ? data : [];
      setPosts(arr);

      if (showDebug) setMessage(`debug: carregou ${arr.length} posts`);
    } catch (e) {
      console.log("Erro list posts:", e);
      setMessage(e?.message || "Falha ao carregar posts");
    } finally {
      setLoading(false);
    }
  }

  async function runSearch(text) {
    const trimmed = text.trim();

    try {
      setMessage("");
      setLoading(true);

      if (!trimmed) {
        await loadAll();
        return;
      }

      const data = await PostsApi.search(trimmed);
      console.log("PostsApi.search() =>", data);

      const arr = Array.isArray(data) ? data : [];
      setPosts(arr);
      setMessage(`debug: busca '${trimmed}' retornou ${arr.length}`);
    } catch (e) {
      console.log("Erro search posts:", e);
      setMessage(e?.message || "Falha ao buscar posts");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    try {
      if (query.trim()) {
        await runSearch(query);
      } else {
        await loadAll({ showDebug: true });
      }
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Posts</Text>

      <TextInput
        value={query}
        onChangeText={(t) => {
          setQuery(t);
          runSearch(t);
        }}
        placeholder="Buscar por palavra-chave…"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#333",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      />

      {message ? (
        <Text style={{ color: "#b00020" }}>{message}</Text>
      ) : null}

      {loading ? (
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
        </View>
      ) : posts.length === 0 ? (
        <Text>Nenhum post encontrado.</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, idx) => item?._id || String(idx)}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
              }}
              style={{
                borderWidth: 1,
                borderColor: "#222",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {item?.title || "Sem título"}
              </Text>

              <Text style={{ marginTop: 4, opacity: 0.8 }}>
                Autor: {item?.author || "—"}
              </Text>

              <Text style={{ marginTop: 8 }} numberOfLines={2}>
                {item?.content || "—"}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
