import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { StudentsApi } from "../../api/students";

export default function StudentsListScreen({ navigation }) {
  const LIMIT = 10;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);

  function extractItems(data) {
    if (Array.isArray(data)) {
      return { items: data, total: data.length, page: 1 };
    }
    const arr = Array.isArray(data?.items) ? data.items : [];
    const t = typeof data?.total === "number" ? data.total : null;
    const p = typeof data?.page === "number" ? data.page : 1;
    return { items: arr, total: t, page: p };
  }

  async function loadFirstPage() {
    try {
      setMessage("");
      setLoading(true);

      const data = await StudentsApi.list(1, LIMIT);
      const parsed = extractItems(data);

      setItems(parsed.items);
      setPage(1);
      setTotal(parsed.total);
    } catch (e) {
      setMessage(e?.message || "Falha ao listar alunos");
    } finally {
      setLoading(false);
    }
  }

  async function loadNextPage() {
    if (total === null) return;

    const already = items.length;
    const hasMore = already < total;

    if (!hasMore) return;
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const data = await StudentsApi.list(nextPage, LIMIT);
      const parsed = extractItems(data);

      setItems((prev) => [...prev, ...parsed.items]);
      setPage(nextPage);
      setTotal(parsed.total);
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar mais alunos");
    } finally {
      setLoadingMore(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadFirstPage();
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    try {
      await loadFirstPage();
    } finally {
      setRefreshing(false);
    }
  }

  function handleDelete(id) {
    Alert.alert("Excluir", "Deseja excluir este aluno?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await StudentsApi.remove(id);
            setItems((prev) => prev.filter((s) => s?._id !== id));
            if (typeof total === "number") setTotal((t) => (t ? t - 1 : t));
          } catch (e) {
            Alert.alert("Erro", e?.message || "Falha ao excluir aluno");
          }
        },
      },
    ]);
  }

  const footer = () => {
    if (total === null) return null;
    if (items.length >= total) return null;

    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Alunos</Text>

        <Pressable
          onPress={() => navigation.navigate("StudentCreate")}
          style={{
            borderWidth: 1,
            borderColor: "#333",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 10,
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
      ) : items.length === 0 ? (
        <Text>Nenhum aluno encontrado.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, idx) => item?._id || String(idx)}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReachedThreshold={0.5}
          onEndReached={loadNextPage}
          ListFooterComponent={footer}
          renderItem={({ item }) => {
            const id = item?._id;

            return (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#222",
                  borderRadius: 12,
                  padding: 12,
                  gap: 6,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  {item?.name || "—"}
                </Text>
                <Text style={{ opacity: 0.8 }}>{item?.email || "—"}</Text>
                <Text style={{ opacity: 0.8 }}>
                  Matrícula: {item?.registration || "—"}
                </Text>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
                  <Pressable
                    onPress={() => navigation.navigate("StudentEdit", { id })}
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
              </View>
            );
          }}
        />
      )}

      {total !== null ? (
        <Text style={{ opacity: 0.7 }}>
          Mostrando {items.length} de {total}
        </Text>
      ) : null}

      {loadingMore ? null : null}
    </View>
  );
}
