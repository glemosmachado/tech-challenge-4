import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { PostsApi } from "../../api/posts";
import { AuthContext } from "../../context/AuthContext";

export default function PostsAdminScreen({ navigation }) {
  const { role } = useContext(AuthContext);
  const canAdmin = role === "teacher";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      setMsg("");
      setLoading(true);

      const data = await PostsApi.list();
      const arr = Array.isArray(data) ? data : [];
      setPosts(arr);

      if (arr.length === 0) setMsg("Nenhum post encontrado.");
    } catch (e) {
      setMsg(e?.message || "Falha ao carregar posts");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    try {
      const data = await PostsApi.list();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      setMsg(e?.message || "Falha ao atualizar posts");
    } finally {
      setRefreshing(false);
    }
  }

  function handleEdit(postId) {
    navigation.navigate("PostsTab", {
      screen: "PostEdit",
      params: { postId },
    });
  }

  function handleDelete(postId) {
    Alert.alert(
      "Excluir post",
      "Tem certeza que deseja excluir este post?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await PostsApi.remove(postId);
              await load();
              Alert.alert("Sucesso", "Post excluído.");
            } catch (e) {
              Alert.alert("Erro", e?.message || "Falha ao excluir post");
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  useEffect(() => {
    load();
  }, []);

  if (!canAdmin) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Somente professores podem acessar a área administrativa.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Admin - Posts</Text>

      {loading ? (
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          {msg ? <Text style={{ color: "#b00020" }}>{msg}</Text> : null}

          <FlatList
            data={posts}
            keyExtractor={(item, idx) => item?._id || String(idx)}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {item?.title || "Sem título"}
                </Text>

                <Text style={{ opacity: 0.8 }}>
                  Autor: {item?.author || "—"}
                </Text>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Pressable
                    onPress={() => handleEdit(item._id)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderWidth: 1,
                      borderColor: "#222",
                      borderRadius: 10,
                    }}
                  >
                    <Text>Editar</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleDelete(item._id)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderWidth: 1,
                      borderColor: "#222",
                      borderRadius: 10,
                    }}
                  >
                    <Text>Excluir</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}
