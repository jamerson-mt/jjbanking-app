import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { Button } from "../../components/Button";
import { api } from "../../services/api";
import { useRouter } from "expo-router";
import { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notify } from "../../utils/toast"; // Importe seu utilitário de Toast

interface RegisterResponse {
  token: string;
  fullName: string;
  accountId: string;
  accountNumber: string;
  branch: string;
  balance: number;
}

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
      notify.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (form.cpf.length !== 11) {
      setCpfError("O CPF deve conter 11 dígitos.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post<RegisterResponse>("/auth/register", form);
      const data = response.data;

      // Persistência em lote
      await AsyncStorage.multiSet([
        ["@JJBanking:token", data.token],
        ["@JJBanking:fullName", data.fullName],
        ["@JJBanking:accountId", data.accountId],
        ["@JJBanking:accountNumber", data.accountNumber],
        ["@JJBanking:branch", data.branch],
        ["@JJBanking:balance", data.balance.toString()],
      ]);

      // Notificação de sucesso no topo
      notify.success(
        `Conta criada! Bem-vindo, ${data.fullName.split(" ")[0]}.`,
      );

      // Redirecionamento para a rota do Drawer
      router.replace("/(drawer)/dashboard");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const apiData = error.response?.data;
        const message =
          apiData?.error || apiData?.message || "Erro ao criar conta.";

        if (message.toLowerCase().includes("cpf")) {
          setCpfError(String(message));
        } else {
          notify.error(String(message)); // Toast vermelho em vez de Alert
        }
      } else {
        notify.error("Verifique sua conexão com a internet.");
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
        <Text style={styles.title}>Abrir Conta</Text>
        <Text style={styles.subtitle}>Rápido, seguro e sem burocracia.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Como quer ser chamado?"
            value={form.fullName}
            onChangeText={(t) => setForm({ ...form, fullName: t })}
          />

          <Text style={styles.label}>CPF (Apenas números)</Text>
          <TextInput
            style={[styles.input, cpfError ? styles.inputError : null]}
            keyboardType="numeric"
            maxLength={11}
            placeholder="000.000.000-00"
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
            placeholder="Mínimo 6 caracteres"
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
    </KeyboardAvoidingView>
  );
}

// ... estilos permanecem os mesmos ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: "bold", color: Colors.text },
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  inputError: { borderColor: "#FF3B30", backgroundColor: "#FFF9F9" },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 4,
    fontWeight: "500",
  },
});
