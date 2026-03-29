import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../utils/toast"; 
import { api } from "../../services/api";

export default function DepositScreen() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const handleDeposit = async () => {
    const amount = parseFloat(value.replace(",", "."));

    if (isNaN(amount) || amount <= 0) {
      notify.error("Por favor, digite um valor válido.");
      return;
    }

    setLoading(true);

    try {
      // 1. Chamada API
      await api.post("/transaction/deposit", {
        AccountId: user?.accountId, 
        Amount: amount,
        Description: "Depósito via App JJ Banking",
      });

      // 2. Aguarda a sincronização real (Isso atualiza o estado global)
      await refreshUser();

      // 3. Feedback de sucesso
      notify.success(`R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} adicionados!`);

      // 4. Redireciona (A Dashboard já estará com o valor novo no cache do React)
      setTimeout(() => {
        router.replace("/(drawer)/dashboard");
      }, 1200);

    } catch (error: any) {
      notify.error(error.response?.data?.message || "Erro ao processar o depósito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.label}>Quanto deseja depositar?</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={styles.input}
                placeholder="0,00"
                keyboardType="numeric"
                value={value}
                onChangeText={(text) => setValue(text.replace(/[^0-9,.]/g, ''))}
                autoFocus
                editable={!loading}
                placeholderTextColor={Colors.gray}
              />
            </View>

            <TouchableOpacity 
              style={[styles.confirmButton, loading && styles.buttonDisabled]} 
              onPress={handleDeposit}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Confirmar Depósito</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} disabled={loading}>
              <Text style={styles.backButtonText}>Cancelar e Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  card: { backgroundColor: '#FFF', padding: 30, borderRadius: 24, elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 15 },
  label: { fontSize: 16, color: Colors.gray, textAlign: 'center', marginBottom: 20, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40, borderBottomWidth: 2, borderBottomColor: Colors.primary + "15", paddingBottom: 12 },
  currencySymbol: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginRight: 10 },
  input: { fontSize: 38, fontWeight: 'bold', color: Colors.primary, minWidth: 120 },
  confirmButton: { backgroundColor: Colors.primary, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  backButton: { marginTop: 22, alignItems: 'center' },
  backButtonText: { color: Colors.gray, fontSize: 15, fontWeight: '500' }
});