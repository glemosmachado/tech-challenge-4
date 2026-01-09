import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
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
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  async function load(p = 1, { showLoading = true } = {}) {
    try {
      setMessage("");
      if (showLoading) setLoading(true);

      const data = await StudentsApi.list(p, limit);

      const arr = Array.isArray(data?.items) ? data.items : [];
      setItems(arr);
      setPage(data?.page || p);
      setTotalPages(data?.totalPages || 1);

      setMessage(`debug: carregou ${arr.length} alunos (página ${data?.page || p})`);
    } catch (e) {
      setMessage(e?.response?.data?.message || e?.message || "Falha ao carregar alunos");
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    try {
      await load(1, { showLoading: false });
    } finally {
      setRefreshing(false);
    }
  }

  async function onDelete(id) {
    Alert.alert("Excluir aluno", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await StudentsApi.remove(id);
            await load(page, { showLoading: false });
          } catch (e) {
            Alert.alert("Erro", e?.response?.data?.message || e?.message || "Falha ao excluir");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    load(1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(1, { showLoading: false });
    }, [])
  );

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "800" }}>Alunos</Text>

        <Pressable
          onPress={() => navigation.navigate("StudentCreate")}
          style={{
            borderWidth: 1,
            borderColor: "#111",
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontWeight: "800" }}>Novo</Text>
        </Pressable>
      </View>

      {message ? <Text style={{ color: "#b00020" }}>{message}</Text> : null}

      {loading ? (
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
        </View>
      ) : items.length === 0 ? (
        <Text>Nenhum aluno cadastrado.</Text>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item, idx) => item?._id || String(idx)}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#222",
                  borderRadius: 12,
                  padding: 12,
                  gap: 10,
                }}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "800" }}>{item?.name || "Sem nome"}</Text>
                  <Text style={{ opacity: 0.8 }}>Matrícula: {item?.registration || "—"}</Text>
                  {item?.course ? <Text style={{ opacity: 0.8 }}>{item.course}</Text> : null}
                </View>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    onPress={() => navigation.navigate("StudentEdit", { id: item._id })}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#111",
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "800" }}>Editar</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => onDelete(item._id)}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#b00020",
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "800", color: "#b00020" }}>Excluir</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />

          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Pressable
              disabled={page <= 1}
              onPress={() => load(page - 1)}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#111",
                paddingVertical: 10,
                borderRadius: 10,
                alignItems: "center",
                opacity: page <= 1 ? 0.4 : 1,
              }}
            >
              <Text style={{ fontWeight: "800" }}>Anterior</Text>
            </Pressable>

            <Text style={{ fontWeight: "800" }}>
              {page} / {totalPages}
            </Text>

            <Pressable
              disabled={page >= totalPages}
              onPress={() => load(page + 1)}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#111",
                paddingVertical: 10,
                borderRadius: 10,
                alignItems: "center",
                opacity: page >= totalPages ? 0.4 : 1,
              }}
            >
              <Text style={{ fontWeight: "800" }}>Próxima</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}