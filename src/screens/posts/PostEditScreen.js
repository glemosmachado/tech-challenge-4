import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { PostsApi } from "../../api/posts";
import theme from "../../ui/theme";

export default function PostEditScreen({ route, navigation }) {
  const id = route?.params?.id || route?.params?.postId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) {
        Alert.alert("Erro", "Id do post inválido.");
        navigation.goBack();
        return;
      }

      try {
        setLoading(true);
        const data = await PostsApi.getById(id);
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

    load();
  }, [id, navigation]);

  async function handleSave() {
    const t = title.trim();
    const a = author.trim();
    const c = content.trim();

    if (!t || !a || !c) {
      Alert.alert("Campos obrigatórios", "Preencha Título, Autor e Conteúdo.");
      return;
    }

    if (!id) {
      Alert.alert("Erro", "Id do post inválido.");
      return;
    }

    setSaving(true);
    try {
      await PostsApi.update(id, { title: t, author: a, content: c });
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao salvar post");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Aula 1 - Introdução"
          placeholderTextColor="rgba(255,255,255,0.45)"
        />

        <Text style={styles.label}>Autor</Text>
        <TextInput
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
          placeholder="Ex: Prof. João"
          placeholderTextColor="rgba(255,255,255,0.45)"
        />

        <Text style={styles.label}>Conteúdo</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={content}
          onChangeText={setContent}
          placeholder="Escreva o conteúdo do post..."
          placeholderTextColor="rgba(255,255,255,0.45)"
          multiline
          textAlignVertical="top"
        />

        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveBtn,
            pressed && { opacity: 0.85 },
            saving && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: theme.colors.screen,
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.screen,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  label: {
    color: theme.colors.text,
    fontWeight: "700",
    marginTop: 6,
  },

  input: {
    backgroundColor: theme.colors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  textarea: {
    minHeight: 160,
  },

  saveBtn: {
    marginTop: 14,
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});