import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PostsApi } from "../../api/posts";
import { AuthContext } from "../../context/AuthContext";

export default function PostReadScreen({ route, navigation }) {
  const { postId } = route.params;
  const { role } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const load = useCallback(async () => {
    try {
      setErrorMsg("");
      setLoading(true);
      const data = await PostsApi.get(postId);
      setPost(data);
    } catch (e) {
      setErrorMsg(e?.message || "Falha ao carregar post");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  async function doDelete() {
    try {
      setDeleting(true);
      await PostsApi.remove(postId);
      Alert.alert("Sucesso", "Post excluído.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao excluir post");
    } finally {
      setDeleting(false);
    }
  }

  const confirmDelete = useCallback(() => {
    if (deleting) return;

    Alert.alert(
      "Excluir post",
      "Tem certeza que deseja excluir este post?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: doDelete },
      ],
      { cancelable: true }
    );
  }, [deleting, postId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight:
        role === "teacher"
          ? () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("PostEdit", { postId })}
                  style={{ paddingHorizontal: 10, paddingVertical: 6 }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  disabled={deleting}
                >
                  <Text style={{ fontSize: 16, opacity: deleting ? 0.5 : 1 }}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmDelete}
                  style={{ paddingHorizontal: 10, paddingVertical: 6 }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  disabled={deleting}
                >
                  <Text style={{ fontSize: 16, opacity: deleting ? 0.5 : 1 }}>
                    {deleting ? "Excluindo..." : "Excluir"}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          : undefined,
    });
  }, [navigation, role, postId, deleting, confirmDelete]);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "#b00020" }}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        {post?.title || "Sem título"}
      </Text>

      <Text style={{ opacity: 0.8 }}>Autor: {post?.author || "—"}</Text>

      <Text style={{ fontSize: 16, lineHeight: 22, marginTop: 8 }}>
        {post?.content || "—"}
      </Text>
    </ScrollView>
  );
}