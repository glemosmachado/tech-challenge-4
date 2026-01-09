import { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, View } from "react-native";
import { TeachersApi } from "../../api/teachers";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, H1, Input, Loading, Muted, Screen } from "../../ui/components";

export default function TeachersListScreen({ navigation }) {
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await TeachersApi.list({ q: query });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Erro", e?.response?.data?.message || e?.message || "Falha ao carregar professores");
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
      "Excluir professor",
      "Tem certeza? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await TeachersApi.remove(item._id);
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
    const isMe = item?.email && user?.email && item.email === user.email;

    return (
      <Card style={{ gap: 10 }}>
        <H1 style={{ fontSize: 16 }}>{item?.name || "Sem nome"}</H1>

        <Muted>{item?.email || "—"}</Muted>

        <Muted>Área: {item?.area || "—"}</Muted>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Editar"
              variant="outline"
              onPress={() => navigation.navigate("TeacherEdit", { id: item._id })}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Button
              title={isMe ? "Exclusão bloqueada" : "Excluir"}
              variant="danger"
              onPress={() => handleDelete(item)}
              disabled={isMe}
            />
          </View>
        </View>

        {isMe ? <Muted>Professor admin (você)</Muted> : null}
      </Card>
    );
  }

  return (
    <Screen style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <H1>Professores</H1>
        <View style={{ width: 120 }}>
          <Button
            title="Novo"
            onPress={() => navigation.navigate("TeacherCreate")}
          />
        </View>
      </View>

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por nome, email ou área..."
      />

      {loading ? (
        <Loading text="Carregando..." />
      ) : items.length === 0 ? (
        <Card>
          <Muted>Nenhum professor encontrado.</Muted>
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