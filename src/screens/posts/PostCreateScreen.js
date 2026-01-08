import { useContext, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { PostsApi } from "../../api/posts";
import { AuthContext } from "../../context/AuthContext";

export default function PostCreateScreen({ navigation }) {
  const { role } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const canEdit = role === "teacher";

  async function handleSave() {
    if (!canEdit) {
      Alert.alert("Acesso negado", "Somente professores podem criar posts.");
      return;
    }

    if (!title.trim() || !author.trim() || !content.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha título, autor e conteúdo.");
      return;
    }

    try {
      setSaving(true);

      await PostsApi.create({
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
      });

      Alert.alert("Sucesso", "Post criado.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao criar post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Novo post</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        autoCapitalize="sentences"
        style={{
          borderWidth: 1,
          borderColor: "#333",
          borderRadius: 10,
          padding: 10,
        }}
      />

      <TextInput
        value={author}
        onChangeText={setAuthor}
        placeholder="Autor"
        autoCapitalize="words"
        style={{
          borderWidth: 1,
          borderColor: "#333",
          borderRadius: 10,
          padding: 10,
        }}
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
        title={saving ? "Salvando..." : "Criar"}
        onPress={handleSave}
        disabled={saving}
      />
    </View>
  );
}
