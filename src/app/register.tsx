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
import { isAxiosError } from "axios";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estado para erro específico do campo CPF
  const [cpfError, setCpfError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cpf: "",
    password: "",
  });

  const handleRegister = async () => {
    // Reset de estados iniciais
    setCpfError(null);

    if (!form.email || !form.password || !form.fullName || !form.cpf) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", form);

      Alert.alert("Sucesso!", "Conta criada com sucesso.");
      router.replace("/"); // Ou para a tela de login
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const apiData = error.response?.data;
        // Pega a mensagem vindo do backend (seja .error ou .message)
        const message = apiData?.error || apiData?.message || "";

        // Se a mensagem mencionar CPF, exibe no input, senão usa Alert
        if (message.toLowerCase().includes("cpf")) {
          setCpfError(String(message));
        } else {
          Alert.alert(
            "Erro no Cadastro",
            String(message || "Erro ao processar."),
          );
        }
      } else {
        Alert.alert("Erro de Conexão", "Não foi possível alcançar o servidor.");
      }
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
          value={form.fullName}
          onChangeText={(t) => setForm({ ...form, fullName: t })}
        />

        <Text style={styles.label}>CPF (Somente números)</Text>
        <TextInput
          // Estilo condicional: se houver erro, aplica borda vermelha
          style={[styles.input, cpfError ? styles.inputError : null]}
          keyboardType="numeric"
          maxLength={11}
          placeholder="00000000000"
          value={form.cpf}
          onChangeText={(t) => {
            setCpfError(null); // Limpa o erro ao digitar
            setForm({ ...form, cpf: t.replace(/\D/g, "") });
          }}
        />
        {/* Mensagem de erro vermelha abaixo do input */}
        {cpfError && <Text style={styles.errorText}>{cpfError}</Text>}

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seu@email.com"
          value={form.email}
          onChangeText={(t) => setForm({ ...form, email: t })}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Crie uma senha forte"
          value={form.password}
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
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 16, // Espaçamento padrão entre inputs
  },
  // Estilo para quando o input tem erro
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 1.5,
    marginBottom: 4, // Diminui o margin para o erro ficar colado
  },
  // Estilo do texto de erro
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 4,
    fontWeight: "500",
  },
});
