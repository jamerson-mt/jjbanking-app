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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cpfError, setCpfError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cpf: "",
    password: "",
  });

  const handleRegister = async () => {
    setCpfError(null);

    if (!form.email || !form.password || !form.fullName || !form.cpf) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      // 1. Envia os dados para a API
      const response = await api.post("/auth/register", form);

      // 2. EXTRAÇÃO DOS DADOS: 
      // Como sua API retorna CreatedAtAction(..., result), os dados estão em response.data
      const { token, accountNumber, fullName } = response.data;

      // 3. PERSISTÊNCIA (Auto-Login):
      // Salvamos imediatamente para que o Dashboard tenha o que ler
      await AsyncStorage.setItem("@JJBanking:token", token);
      await AsyncStorage.setItem("@JJBanking:accountNumber", accountNumber);
      await AsyncStorage.setItem("@JJBanking:fullName", fullName); 

      Alert.alert("Sucesso!", "Sua conta JJ foi criada e você já está logado.");

      // 4. REDIRECIONAMENTO DIRETO:
      // Usamos replace para que o usuário não volte para a tela de cadastro ao apertar 'voltar'
      router.replace("/dashboard");

    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const apiData = error.response?.data;
        const message = apiData?.error || apiData?.message || "";

        if (message.toLowerCase().includes("cpf")) {
          setCpfError(String(message));
        } else {
          Alert.alert("Erro no Cadastro", String(message || "Erro ao processar."));
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
      <Text style={styles.subtitle}>Preencha os dados para abrir sua conta JJ.</Text>

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
          style={[styles.input, cpfError ? styles.inputError : null]}
          keyboardType="numeric"
          maxLength={11}
          placeholder="00000000000"
          value={form.cpf}
          onChangeText={(t) => {
            setCpfError(null);
            setForm({ ...form, cpf: t.replace(/\D/g, "") });
          }}
        />
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
        title="Finalizar e Entrar"
        onPress={handleRegister}
        loading={loading}
      />
    </ScrollView>
  );
}

// ... (seus estilos permanecem os mesmos)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold", color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.gray, marginBottom: 32 },
  inputGroup: { marginBottom: 32 },
  label: { fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 8 },
  input: { backgroundColor: "#fff", padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#DDD", marginBottom: 16 },
  inputError: { borderColor: "#FF3B30", borderWidth: 1.5, marginBottom: 4 },
  errorText: { color: "#FF3B30", fontSize: 12, marginBottom: 16, marginLeft: 4, fontWeight: "500" },
});