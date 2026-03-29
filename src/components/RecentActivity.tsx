import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from "react-native";
import { Colors } from "../constants/Colors";
import { TransactionItem } from "./TransactionItem";

// Habilita animação no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface RecentActivityProps {
  transactions: any[];
}

export const RecentActivity = ({ transactions }: RecentActivityProps) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAll(!showAll);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Atividade recente</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Atividade recente</Text>
        
        {/* Uso do ternário para evitar renderização acidental do número 0 no iOS */}
        {transactions.length > 3 ? (
          <TouchableOpacity onPress={toggleShowAll} activeOpacity={0.6}>
            <Text style={styles.seeAllText}>
              {showAll ? "Ver menos" : "Ver tudo"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View>
        {transactions
          .slice(0, showAll ? transactions.length : 3)
          .map((item: any) => (
            <TransactionItem
              key={item.id || item.guid}
              title={item.description}
              date={new Date(item.createdAt).toLocaleDateString('pt-BR')}
              value={item.amount}
              type={item.type === "Credit" ? "income" : "outcome"} 
            />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 10,
    paddingBottom: 20, // Margem extra para não colar no final da tela
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  seeAllText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 14,
    padding: 4, // Melhora a área de toque
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 14,
  },
});