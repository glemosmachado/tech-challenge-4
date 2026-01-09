import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { PostsApi } from "../../api/posts";
import { Card, Hint, Screen } from "../../ui/components";
import { theme } from "../../ui/theme";

export default function PostReadScreen({ route }) {
  const { postId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const data = await PostsApi.getById(postId);
      setPost(data || null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [postId]);

  if (loading) {
    return (
      <Screen title="Leitura">
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  if (!post) {
    return (
      <Screen title="Leitura">
        <Card>
          <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
            Post não encontrado.
          </Text>
          <Hint>Verifique se ele foi removido ou se houve falha ao carregar.</Hint>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen title="Leitura">
      <Card style={{ gap: 10 }}>
        <Text style={{ color: theme.colors.text, fontSize: theme.type.h1, fontWeight: "900" }}>
          {post?.title || "Sem título"}
        </Text>
        <Hint>Autor: {post?.author || "—"}</Hint>

        <Card style={{ backgroundColor: theme.colors.surface2 }}>
          <Text style={{ color: theme.colors.text, fontSize: theme.type.body, lineHeight: 22 }}>
            {post?.content || "—"}
          </Text>
        </Card>
      </Card>
    </Screen>
  );
}
