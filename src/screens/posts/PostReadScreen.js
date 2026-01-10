import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { PostsApi } from "../../api/posts";
import { Card, H1, Muted, Screen } from "../../ui/components";
import theme from "../../ui/theme";

export default function PostReadScreen({ route }) {
  const id = route?.params?.id || route?.params?.postId;

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  async function load() {
    if (!id) {
      setPost(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await PostsApi.getById(id);
      setPost(data || null);
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar post");
      setPost(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <Screen contentStyle={styles.content}>
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  if (!post) {
    return (
      <Screen contentStyle={styles.content}>
        <Card>
          <Text style={styles.notFoundTitle}>Post não encontrado.</Text>
          <Muted>Verifique se ele foi removido ou se houve falha ao carregar.</Muted>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <Card style={styles.card}>
        <H1 numberOfLines={2} style={{ marginBottom: 6 }}>
          {post?.title || "Sem título"}
        </H1>

        <Muted>Autor: {post?.author || "—"}</Muted>

        <View style={styles.divider} />

        <Text style={styles.body}>{post?.content || "—"}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 14 },

  card: { gap: 10 },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginTop: 6,
    marginBottom: 6,
  },

  body: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    lineHeight: 22,
  },

  notFoundTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: "900",
    marginBottom: 6,
  },
});