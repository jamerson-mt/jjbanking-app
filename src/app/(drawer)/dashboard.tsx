import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../constants/Colors";
import { UserHeader } from "../../components/UserHeader"; // Novo
import { BalanceCard } from "../../components/BalanceCard";
import { QuickAction } from "../../components/QuickAction";
import { TransactionItem } from "../../components/TransactionItem";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { user, isLoading, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* 1. Informações do Usuário */}
        <UserHeader 
          name={user?.fullName} 
          branch={user?.branch} 
          account={user?.accountNumber} 
        />

        {/* 2. Card de Saldo */}
        <View style={styles.section}>
          <BalanceCard amount={user?.balance ?? 0} />
        </View>

        {/* 3. Atalhos Rápidos */}
        <Text style={styles.sectionTitle}>Ações rápidas</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionsList}
        >
          <QuickAction icon="qr-code-outline" label="Pix" color="#00C1AF" />
          <QuickAction icon="barcode-outline" label="Pagar" color="#5E5CE6" />
          <QuickAction icon="arrow-up-circle-outline" label="Transferir" color="#FF9500" />
          <QuickAction icon="phone-portrait-outline" label="Recarga" color="#FF2D55" />
          <QuickAction icon="card-outline" label="Cartões" color="#007AFF" />
        </ScrollView>

        {/* 4. Atividade Recente */}
        <View style={styles.activitySection}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitleNoMargin}>Atividade recente</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          <TransactionItem
            title="Abertura de Conta"
            date="Hoje"
            value={user?.balance ?? 0}
            type="income"
          />
        </View>
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
  sectionTitleNoMargin: { fontSize: 18, fontWeight: "bold", color: Colors.text },
  actionsList: { paddingLeft: 24, paddingRight: 8, marginBottom: 30 },
  activitySection: { paddingHorizontal: 24 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: { color: Colors.primary, fontWeight: "600", fontSize: 14 },
});