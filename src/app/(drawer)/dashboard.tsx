import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { UserHeader } from "../../components/UserHeader";
import { BalanceCard } from "../../components/BalanceCard";
import { QuickAction } from "../../components/QuickAction";
import { RecentActivity } from "../../components/RecentActivity";
import { api } from "../../services/api";
// ... (mantenha os imports)
export default function Dashboard() {
  const { user, refreshUser, logout } = useAuth(); // Pegando as funções do contexto
  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = useCallback(async () => {
    if (!user?.accountId) return;
    try {
      const response = await api.get(
        `/transaction/statement/${user.accountId}`,
      );
      const data = response.data || [];
      setTransactions([...data].reverse());
    } catch (error) {
      console.error("Erro ao carregar extrato:", error);
    }
  }, [user?.accountId]);

  useEffect(() => {
    if (user?.accountId) {
      loadTransactions();
    }
  }, [loadTransactions, user?.accountId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), loadTransactions()]);
    setRefreshing(false);
  };

  // FUNÇÃO CORRIGIDA:
  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {user ? (
          <UserHeader
            name={user.fullName}
            branch={user.branch}
            account={user.accountNumber}
            onLogout={handleLogout} // <--- Agora passa a função certa
          />
        ) : null}

        {/* ... restante do seu layout (BalanceCard, QuickActions, RecentActivity) ... */}

        <View style={styles.section}>
          <BalanceCard amount={user?.balance ?? 0} />
        </View>

        <Text style={styles.sectionTitle}>Ações rápidas</Text>

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionsList}
          >
            <QuickAction
              icon="cash-outline"
              label="Depositar"
              color="#28A745"
              onPress={() => router.push("/(drawer)/deposit")}
            />
            <QuickAction
              icon="arrow-up-circle-outline"
              label="Transferir"
              color="#FF9500"
              onPress={() => router.push("/(drawer)/withdraw")} // Agora com a rota correta e sem erro de sintaxe
            />
          </ScrollView>
        </View>

        <RecentActivity transactions={transactions} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 20 },
  section: { paddingHorizontal: 24, marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginLeft: 24,
    marginBottom: 16,
  },
  actionsList: { paddingLeft: 24, paddingRight: 8, marginBottom: 30 },
});
