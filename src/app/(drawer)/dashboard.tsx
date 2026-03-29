import React, { useState, useEffect, useCallback } from "react";
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { UserHeader } from "../../components/UserHeader";
import { BalanceCard } from "../../components/BalanceCard";
import { QuickAction } from "../../components/QuickAction";
import { RecentActivity } from "../../components/RecentActivity";
import { api } from "../../services/api";

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, logout, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadTransactions = useCallback(async () => {
    if (!user?.accountId) return;
    try {
      const response = await api.get(`/transaction/statement/${user.accountId}`);
      if (response.data && Array.isArray(response.data)) {
        setTransactions([...response.data].reverse());
      }
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  }, [user?.accountId]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), loadTransactions()]);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Ternário para garantir que só renderiza se houver 'user' */}
        {user ? (
          <UserHeader
            name={user.fullName}
            branch={user.branch}
            account={user.accountNumber}
            onLogout={handleLogout}
          />
        ) : null}

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
              onPress={() => router.push("/deposit")}
            />
            <QuickAction
              icon="arrow-up-circle-outline"
              label="Transferir"
              color="#FF9500"
              onPress={() => {}} 
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