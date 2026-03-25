import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Colors } from "../constants/Colors";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cpf: "",
    password: "",
  });

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.fullName || !form.cpf) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/accounts/register", form); // Ajuste o endpoint se necessário

      Alert.alert("Sucesso!", "Conta JJ Banking criada com sucesso.");
      console.log("Dados da Conta:", response.data);

      router.replace("/"); // Volta para a home ou vai para o login
    } catch (error: any) {
      Alert.alert(
        "Erro no Cadastro",
        error.response?.data?.message || "Ocorreu um erro inesperado.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>
        Preencha os dados para abrir sua conta JJ.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Jamerson Silva"
          onChangeText={(t) => setForm({ ...form, fullName: t })}
        />

        <Text style={styles.label}>CPF (Somente números)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="000.000.000-00"
          onChangeText={(t) => setForm({ ...form, cpf: t })}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seu@email.com"
          onChangeText={(t) => setForm({ ...form, email: t })}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Crie uma senha forte"
          onChangeText={(t) => setForm({ ...form, password: t })}
        />
      </View>

      <Button
        title="Finalizar Cadastro"
        onPress={handleRegister}
        loading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold", color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.gray, marginBottom: 32 },
  inputGroup: { marginBottom: 32 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 16,
  },
});
