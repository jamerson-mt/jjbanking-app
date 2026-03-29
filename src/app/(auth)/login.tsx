import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { Button } from "../../components/Button";
import { api } from "../../services/api";
import { useRouter } from "expo-router";
import { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notify } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext"; // 1. Importe o useAuth

export default function LoginScreen() {
  const router = useRouter();
  const { refreshUser } = useAuth(); // 2. Pegue a função de atualização
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      notify.error("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", form);
      const data = response.data;

      // 3. Persistência de Dados
      await AsyncStorage.multiSet([
        ["@JJBanking:token", data.token],
        ["@JJBanking:fullName", data.fullName],
        ["@JJBanking:accountId", data.accountId],
        ["@JJBanking:accountNumber", data.accountNumber],
        ["@JJBanking:branch", data.branch],
        ["@JJBanking:balance", data.balance.toString()],
      ]);

      // 4. ATUALIZAÇÃO DO CONTEXTO (O PULO DO GATO)
      // Isso faz o useAuth ler o AsyncStorage AGORA e preencher o 'user'
      await refreshUser();

      notify.success(`Bem-vindo de volta, ${data.fullName.split(" ")[0]}!`);

      // 5. Agora sim, redireciona com o estado populado
      router.replace("/(drawer)/dashboard");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "E-mail ou senha incorretos.";
        notify.error(String(message));
      } else {
        notify.error("Não foi possível conectar ao servidor da JJ Banking.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Acesse sua conta JJ Banking.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="seu@email.com"
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Digite sua senha"
            value={form.password}
            onChangeText={(t) => setForm({ ...form, password: t })}
          />
        </View>

        <Button title="Entrar" onPress={handleLogin} loading={loading} />

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerText}>
            Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingTop: 100 },
  title: { fontSize: 32, fontWeight: "bold", color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.gray, marginBottom: 40 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 16,
    fontSize: 16
  },
  registerLink: { marginTop: 24, alignItems: "center" },
  registerText: { color: Colors.gray, fontSize: 14 },
  linkBold: { color: "#007AFF", fontWeight: "bold" },
});