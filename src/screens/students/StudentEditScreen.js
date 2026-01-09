import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { StudentsApi } from "../../api/students";

export default function StudentEditScreen({ route, navigation }) {
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [course, setCourse] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await StudentsApi.getById(id);

      setName(data?.name || "");
      setRegistration(data?.registration || "");
      setCourse(data?.course || "");
    } catch (e) {
      Alert.alert("Erro", e?.response?.data?.message || e?.message || "Falha ao carregar aluno");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  async function onSave() {
    if (!name.trim() || !registration.trim()) {
      Alert.alert("Validação", "Nome e matrícula são obrigatórios.");
      return;
    }

    try {
      setSaving(true);

      await StudentsApi.update(id, {
        name: name.trim(),
        registration: registration.trim(),
        course: course.trim() || undefined,
      });

      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.response?.data?.message || e?.message || "Falha ao salvar aluno");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "800" }}>Editar Aluno</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nome"
        style={{ borderWidth: 1, borderColor: "#333", padding: 12, borderRadius: 10 }}
      />

      <TextInput
        value={registration}
        onChangeText={setRegistration}
        placeholder="Matrícula"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: "#333", padding: 12, borderRadius: 10 }}
      />

      <TextInput
        value={course}
        onChangeText={setCourse}
        placeholder="Curso (opcional)"
        style={{ borderWidth: 1, borderColor: "#333", padding: 12, borderRadius: 10 }}
      />

      <Pressable
        onPress={onSave}
        disabled={saving}
        style={{
          backgroundColor: "#111",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? <ActivityIndicator /> : <Text style={{ color: "#fff", fontWeight: "800" }}>Salvar</Text>}
      </Pressable>
    </View>
  );
}