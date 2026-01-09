import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { PostsApi } from "../../api/posts";

export default function PostEditScreen({ route, navigation }) {
  const { postId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await PostsApi.getById(postId);

      setTitle(data?.title || "");
      setAuthor(data?.author || "");
      setContent(data?.content || "");
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao carregar post");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [postId]);

  async function handleSave() {
    try {
      setSaving(true);

      await PostsApi.update(postId, {
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
      });

      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao salvar post");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Editar Post</Text>

      <Text style={{ fontWeight: "600" }}>Título</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        style={{
          borderWidth: 1,
          borderColor: "#333",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      />

      <Text style={{ fontWeight: "600" }}>Autor</Text>
      <TextInput
        value={author}
        onChangeText={setAuthor}
        placeholder="Autor"
        style={{
          borderWidth: 1,
          borderColor: "#333",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      />

      <Text style={{ fontWeight: "600" }}>Conteúdo</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Conteúdo"
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#333",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
          minHeight: 160,
          textAlignVertical: "top",
        }}
      />

      <Pressable
        onPress={handleSave}
        disabled={saving}
        style={{
          marginTop: 6,
          backgroundColor: "#111",
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: "center",
          opacity: saving ? 0.6 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
          Salvar
        </Text>
      </Pressable>
    </View>
  );
}
