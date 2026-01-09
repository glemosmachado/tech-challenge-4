import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { PostsApi } from "../../api/posts";

export default function PostCreateScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      await PostsApi.create({
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
      });

      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao criar post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Novo Post</Text>

      <Text style={{ fontWeight: "600" }}>Título</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Ex: Aula 1 - Introdução"
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
        placeholder="Ex: Prof. João"
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
        placeholder="Escreva o conteúdo do post..."
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
