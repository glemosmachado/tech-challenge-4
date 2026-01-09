import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { PostsApi } from "../../api/posts";

export default function PostReadScreen({ route }) {
  const id = route?.params?.id || route?.params?._id || route?.params?.postId;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErrorMsg("");
        setLoading(true);

        if (!id) {
          setErrorMsg("Post inválido: id não foi enviado na navegação.");
          return;
        }

        const data = await PostsApi.get(id);
        setPost(data);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Falha ao carregar post";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "800" }}>
        {post?.title || "Sem título"}
      </Text>

      <Text style={{ opacity: 0.8 }}>
        Autor: {post?.author || "—"}
      </Text>

      <Text style={{ marginTop: 10 }}>
        {post?.content || "—"}
      </Text>
    </View>
  );
}