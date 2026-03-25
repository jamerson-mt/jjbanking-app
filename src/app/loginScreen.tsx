import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../constants/Colors";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { useRouter } from "expo-router";
import { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      // 1. Chamada para a rota de login da sua API
      const response = await api.post("/auth/login", form);

      // 2. PEGANDO O TOKEN: Supondo que sua API retorne { token: "...", user: {...} }
      const { token, user } = response.data;

      // 3. SALVANDO NO DISPOSITIVO: Para manter o usuário logado
      await AsyncStorage.setItem("@JJBanking:token", token);
      await AsyncStorage.setItem("@JJBanking:user", JSON.stringify(user));

      Alert.alert(
        "Sucesso",
        `Bem-vindo de volta, ${user?.fullName || "usuário"}!`,
      );

      // 4. NAVEGAÇÃO: Vai para a tela principal (Dashboard)
      router.replace("/dashboard");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "E-mail ou senha incorretos.";
        Alert.alert("Falha no Login", String(message));
      } else {
        Alert.alert("Erro", "Não foi possível conectar ao servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Entrar</Text>
      <Text style={styles.subtitle}>Acesse sua conta JJ Banking.</Text>

      <View style={styles.inputGroup}>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingTop: 100 },
  title: { fontSize: 32, fontWeight: "bold", color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.gray, marginBottom: 40 },
  inputGroup: { marginBottom: 24 },
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
    marginBottom: 16,
  },
  registerLink: { marginTop: 24, alignItems: "center" },
  registerText: { color: Colors.gray, fontSize: 14 },
  linkBold: { color: "#007AFF", fontWeight: "bold" },
});
