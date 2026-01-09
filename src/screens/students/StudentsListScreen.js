import { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, View } from "react-native";
import { StudentsApi } from "../../api/students";
import { Button, Card, H1, Input, Loading, Muted, Screen } from "../../ui/components";

export default function StudentsListScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await StudentsApi.list({ q: query });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Erro", e?.response?.data?.message || e?.message || "Falha ao carregar alunos");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
  }, [query]);

  async function handleDelete(item) {
    Alert.alert(
      "Excluir aluno",
      "Tem certeza? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await StudentsApi.remove(item._id);
              setItems((prev) => prev.filter((x) => x._id !== item._id));
            } catch (e) {
              Alert.alert("Erro", e?.response?.data?.message || e?.message || "Falha ao excluir");
            }
          },
        },
      ]
    );
  }

  function renderItem({ item }) {
    return (
      <Card style={{ gap: 10 }}>
        <H1 style={{ fontSize: 16 }}>{item?.name || "Sem nome"}</H1>

        <Muted>{item?.email || "—"}</Muted>

        <Muted>Matrícula: {item?.registration || "—"}</Muted>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Editar"
              variant="outline"
              onPress={() => navigation.navigate("StudentEdit", { id: item._id })}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Button
              title="Excluir"
              variant="danger"
              onPress={() => handleDelete(item)}
            />
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Screen style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <H1>Alunos</H1>
        <View style={{ width: 120 }}>
          <Button
            title="Novo"
            onPress={() => navigation.navigate("StudentCreate")}
          />
        </View>
      </View>

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por nome, email ou matrícula..."
      />

      {loading ? (
        <Loading text="Carregando..." />
      ) : items.length === 0 ? (
        <Card>
          <Muted>Nenhum aluno encontrado.</Muted>
        </Card>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it._id}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={renderItem}
        />
      )}
    </Screen>
  );
}
