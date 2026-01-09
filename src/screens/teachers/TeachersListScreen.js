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
import { TeachersApi } from "../../api/teachers";
import { useAuth } from "../../context/AuthContext";

export default function TeachersListScreen({ navigation }) {
  const { user } = useAuth();
  const currentId = user?.id;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      setMessage("");
      setLoading(true);
      const data = await TeachersApi.list(1, 50);
      const arr = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setItems(arr);
    } catch (e) {
      setMessage(e?.message || "Falha ao listar professores");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  function handleDelete(id) {
    Alert.alert("Excluir", "Deseja excluir este professor?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await TeachersApi.remove(id);
            setItems((prev) => prev.filter((t) => t?._id !== id));
          } catch (e) {
            Alert.alert("Erro", e?.message || "Falha ao excluir professor");
          }
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Professores</Text>

        <Pressable
          onPress={() => navigation.navigate("TeacherCreate")}
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
        <ActivityIndicator />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, idx) => item?._id || String(idx)}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            const id = item?._id;
            const isMe = currentId && id === currentId;

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
                  {item?.name || "—"} {isMe ? "(você)" : ""}
                </Text>
                <Text style={{ opacity: 0.8 }}>{item?.email || "—"}</Text>
                <Text style={{ opacity: 0.8 }}>
                  Área: {item?.area || "—"}
                </Text>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
                  <Pressable
                    onPress={() => navigation.navigate("TeacherEdit", { id })}
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
                    onPress={() => {
                      if (isMe) {
                        Alert.alert(
                          "Ação bloqueada",
                          "Você não pode excluir o professor que está logado."
                        );
                        return;
                      }
                      handleDelete(id);
                    }}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: isMe ? "#999" : "#b00020",
                      opacity: isMe ? 0.5 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        color: isMe ? "#999" : "#b00020",
                      }}
                    >
                      Excluir
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}