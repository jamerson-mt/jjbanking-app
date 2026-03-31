import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../utils/toast";
import { api } from "../../services/api";

interface Account {
  id: string;
  owner: string;
}

export default function TransferScreen() {
  const [amountValue, setAmountValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );

  const router = useRouter();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await api.get("/accounts");
        // Filtra a própria conta do Jamerson
        const filtered = response.data.filter(
          (acc: Account) => acc.id !== user?.accountId,
        );
        setAccounts(filtered);
      } catch (error) {
        notify.error("Não foi possível carregar os contatos.");
      } finally {
        setLoadingAccounts(false);
      }
    }
    fetchAccounts();
  }, [user?.accountId]);

  const handleTransfer = async () => {
    const amount = parseFloat(amountValue.replace(",", "."));

    if (!selectedAccountId) {
      notify.error("Selecione um contato.");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      notify.error("Insira um valor válido.");
      return;
    }

    if (amount > (user?.balance || 0)) {
      notify.error("Saldo insuficiente.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/transfer/send", {
        OriginAccountId: user?.accountId,
        DestinationAccountId: selectedAccountId,
        Amount: amount,
      });

      await refreshUser();
      notify.success("Enviado com sucesso!");
      router.replace("/(drawer)/dashboard");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Falha na transferência.";
      notify.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.label}>Nova Transferência</Text>

              {/* Seção de Valor */}
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={styles.inputAmount}
                  placeholder="0,00"
                  keyboardType="numeric"
                  value={amountValue}
                  onChangeText={(text) =>
                    setAmountValue(text.replace(/[^0-9,.]/g, ""))
                  }
                  editable={!loading}
                  placeholderTextColor={Colors.gray}
                />
              </View>

              <Text style={styles.inputLabel}>
                Para quem você deseja enviar?
              </Text>

              {loadingAccounts ? (
                <ActivityIndicator
                  color={Colors.primary}
                  style={{ marginVertical: 30 }}
                />
              ) : (
                <View style={styles.listContainer}>
                  {accounts.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => setSelectedAccountId(item.id)}
                      style={[
                        styles.accountItem,
                        selectedAccountId === item.id &&
                          styles.accountItemSelected,
                      ]}
                    >
                      <View style={styles.avatar}>
                        <Text
                          style={[
                            styles.avatarText,
                            selectedAccountId === item.id && styles.textPrimary,
                          ]}
                        >
                          {/* O ?. e o || garantem que se o nome for nulo, ele mostre "?" em vez de quebrar */}
                          {item.owner?.charAt(0).toUpperCase() || "?"}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.accountName,
                          selectedAccountId === item.id && styles.textWhite,
                        ]}
                      >
                        {item.owner || "Usuário sem nome"}
                      </Text>

                      {selectedAccountId === item.id && (
                        <View style={styles.checkCircle}>
                          <Text style={{ color: Colors.primary, fontSize: 12 }}>
                            ✓
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.infoBox}>
                <Text style={styles.balanceText}>
                  Seu saldo:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    R${" "}
                    {user?.balance?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (loading || !selectedAccountId) && styles.buttonDisabled,
                ]}
                onPress={handleTransfer}
                disabled={loading || !selectedAccountId}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Confirmar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                disabled={loading}
              >
                <Text style={styles.backButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, justifyContent: "center" },
  content: { padding: 20 },
  card: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 28,
    elevation: 4,
  },
  label: {
    fontSize: 22,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "800",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary + "10",
    paddingBottom: 15,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginRight: 8,
  },
  inputAmount: {
    fontSize: 42,
    fontWeight: "bold",
    color: Colors.primary,
    minWidth: 160,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.gray,
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  listContainer: { marginBottom: 20, maxHeight: 300 },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  accountItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E9ECEF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { fontWeight: "bold", color: Colors.gray },
  textPrimary: { color: Colors.primary },
  accountName: { fontSize: 16, fontWeight: "600", color: Colors.text, flex: 1 },
  textWhite: { color: "#FFF" },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: { marginVertical: 15, alignItems: "center" },
  balanceText: { fontSize: 14, color: Colors.gray },
  confirmButton: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  backButton: { marginTop: 18, alignItems: "center" },
  backButtonText: { color: Colors.gray, fontSize: 15, fontWeight: "600" },
});
