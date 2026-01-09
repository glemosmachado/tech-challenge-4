import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { PostsApi } from "../../api/posts";

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
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Post não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "800" }}>
        {post?.title || "Sem título"}
      </Text>

      <Text style={{ opacity: 0.8 }}>Autor: {post?.author || "—"}</Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#222",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <Text style={{ fontSize: 16 }}>{post?.content || "—"}</Text>
      </View>
    </View>
  );
}
