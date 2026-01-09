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
import { useAuth } from "../../context/AuthContext";

export default function PostsListScreen({ navigation }) {
  const { token } = useAuth();
  const isTeacher = !!token;

  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  async function loadAll({ showDebug = true } = {}) {
    try {
      setMessage("");
      setLoading(true);

      const data = await PostsApi.list();
      const arr = Array.isArray(data) ? data : [];
      setPosts(arr);

      if (showDebug) setMessage(`debug: carregou ${arr.length} posts`);
    } catch (e) {
      setMessage(e?.response?.data?.message || e?.message || "Falha ao carregar posts");
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
      const arr = Array.isArray(data) ? data : [];
      setPosts(arr);
      setMessage(`debug: busca '${trimmed}' retornou ${arr.length}`);
    } catch (e) {
      setMessage(e?.response?.data?.message || e?.message || "Falha ao buscar posts");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    try {
      if (query.trim()) await runSearch(query);
      else await loadAll({ showDebug: true });
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Posts</Text>

        {isTeacher ? (
          <Pressable
            onPress={() => navigation.navigate("PostCreate")}
            style={{
              borderWidth: 1,
              borderColor: "#111",
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "700" }}>Novo</Text>
          </Pressable>
        ) : null}
      </View>

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

      {message ? <Text style={{ color: "#b00020" }}>{message}</Text> : null}

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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate("PostRead", { id: item?._id })}
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