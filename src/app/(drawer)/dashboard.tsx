import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../constants/Colors";
import { BalanceCard } from "../../components/BalanceCard";
import { useAuth } from "../../hooks/useAuth"; // Importando o cérebro do app

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, logout, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser(); // Atualiza os dados do AsyncStorage (e futuramente da API)
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Customizado com dados do Hook */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Olá, {user?.fullName?.split(" ")[0] || "Usuário"}
            </Text>
            <Text style={styles.accountInfo}>
              Agência {user?.branch || "0001"} • Conta {user?.accountNumber || "00000-0"}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* Card de Saldo Real */}
        <View style={styles.balanceSection}>
          <BalanceCard amount={user?.balance ?? 0} />
        </View>

        {/* Atalhos Rápidos */}
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

        {/* Lista de Atividades */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividade recente</Text>
            <TouchableOpacity onPress={() => router.push("/dashboard")}>
              <Text style={styles.seeAll}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          <TransactionItem
            title="Abertura de Conta"
            date="Hoje"
            value={`+ R$ ${(user?.balance ?? 0).toFixed(2)}`}
            type="income"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Componentes Auxiliares permanecem os mesmos ---
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
    backgroundColor: "#FFF",
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