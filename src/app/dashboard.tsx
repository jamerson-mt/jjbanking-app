import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Biblioteca de ícones padrão do Expo

import { Colors } from "../constants/Colors";
import { BalanceCard } from "../components/BalanceCard";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    account: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const fullName = await AsyncStorage.getItem("@JJBanking:fullName");
      const accountNumber = await AsyncStorage.getItem(
        "@JJBanking:accountNumber",
      );

      setUserData({
        name: fullName || "Usuário",
        account: accountNumber || "0000-0",
      });
    } catch (error) {
      console.error("Erro ao carregar dados do cache", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Customizado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Olá, {userData.name.split(" ")[0]}
            </Text>
            <Text style={styles.accountInfo}>Conta {userData.account}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Card de Saldo */}
        <View style={styles.balanceSection}>
          <BalanceCard amount={1250.55} />
          {/* Nota: O valor do saldo idealmente viria de um fetch à API /accounts/balance */}
        </View>

        {/* Atalhos Rápidos (Quick Actions) */}
        <Text style={styles.sectionTitle}>Ações rápidas</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionsGrid}
        >
          <QuickAction icon="qr-code-outline" label="Pix" color="#00C1AF" />
          <QuickAction icon="barcode-outline" label="Pagar" color="#5E5CE6" />
          <QuickAction
            icon="arrow-up-circle-outline"
            label="Transferir"
            color="#FF9500"
          />
          <QuickAction
            icon="phone-portrait-outline"
            label="Recarga"
            color="#FF2D55"
          />
        </ScrollView>

        {/* Lista de Atividades Recentes */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividade recente</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          <TransactionItem
            title="Supermercado Extra"
            date="Hoje, 14:20"
            value="- R$ 152,00"
            type="expense"
          />
          <TransactionItem
            title="Transferência Recebida"
            date="Ontem, 09:10"
            value="+ R$ 450,00"
            type="income"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componentes Auxiliares Internos
function QuickAction({ icon, label, color }: any) {
  return (
    <TouchableOpacity style={styles.actionItem}>
      <View style={[styles.iconCircle, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function TransactionItem({ title, date, value, type }: any) {
  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionIcon}>
        <Ionicons
          name={type === "income" ? "arrow-down-outline" : "cart-outline"}
          size={20}
          color={Colors.gray}
        />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.transactionTitle}>{title}</Text>
        <Text style={styles.transactionDate}>{date}</Text>
      </View>
      <Text
        style={[
          styles.transactionValue,
          { color: type === "income" ? "#28A745" : Colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  greeting: { fontSize: 20, fontWeight: "bold", color: Colors.text },
  accountInfo: { fontSize: 14, color: Colors.gray },
  logoutButton: { padding: 8 },
  balanceSection: { paddingHorizontal: 24, marginBottom: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginLeft: 24,
    marginBottom: 16,
  },
  actionsGrid: { paddingLeft: 24, paddingRight: 8 },
  actionItem: { alignItems: "center", marginRight: 20 },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: { fontSize: 13, fontWeight: "500", color: Colors.text },
  activitySection: { paddingHorizontal: 24, marginTop: 32 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: { color: Colors.primary, fontWeight: "600" },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F7F8FA",
    justifyContent: "center",
    alignItems: "center",
  },
  transactionTitle: { fontSize: 15, fontWeight: "600", color: Colors.text },
  transactionDate: { fontSize: 12, color: Colors.gray },
  transactionValue: { fontSize: 15, fontWeight: "bold" },
});
