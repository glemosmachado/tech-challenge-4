import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Text, TextInput, View } from "react-native";
import { PostsApi } from "../../api/posts";
import { AuthContext } from "../../context/AuthContext";

export default function PostEditScreen({ route, navigation }) {
  const { role } = useContext(AuthContext);
  const { postId } = route.params;

  const canEdit = role === "teacher";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const post = await PostsApi.get(postId);

        setTitle(post?.title || "");
        setAuthor(post?.author || "");
        setContent(post?.content || "");
      } catch (e) {
        Alert.alert("Erro", e?.message || "Falha ao carregar post");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [postId, navigation]);

  async function handleSave() {
    if (!canEdit) {
      Alert.alert("Acesso negado", "Somente professores podem editar posts.");
      return;
    }

    if (!title.trim() || !author.trim() || !content.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha título, autor e conteúdo.");
      return;
    }

    try {
      setSaving(true);

      await PostsApi.update(postId, {
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
      });

      Alert.alert("Sucesso", "Post atualizado.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao atualizar post");
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
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Editar post</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        autoCapitalize="sentences"
        style={{ borderWidth: 1, borderColor: "#333", borderRadius: 10, padding: 10 }}
      />

      <TextInput
        value={author}
        onChangeText={setAuthor}
        placeholder="Autor"
        autoCapitalize="words"
        style={{ borderWidth: 1, borderColor: "#333", borderRadius: 10, padding: 10 }}
      />

      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Conteúdo"
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#333",
          borderRadius: 10,
          padding: 10,
          minHeight: 160,
          textAlignVertical: "top",
        }}
      />

      <Button
        title={saving ? "Salvando..." : "Salvar alterações"}
        onPress={handleSave}
        disabled={saving}
      />
    </View>
  );
}
