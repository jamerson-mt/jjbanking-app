// components/TransactionItem.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

interface TransactionProps {
  title: string;
  date: string;
  value: number;
  type: "income" | "outcome"; // Lógica que ajustamos na Dashboard
}

export const TransactionItem = ({ title, date, value, type }: TransactionProps) => (
  <View style={styles.transactionCard}>
    <View style={styles.transactionIcon}>
      <Ionicons
        // Ícones específicos: seta pra baixo (entrada/verde), seta pra cima (saída/vermelho)
        name={type === "income" ? "arrow-down-circle-outline" : "arrow-up-circle-outline"}
        size={22} 
        color={type === "income" ? "#28A745" : "#FF3B30"} // Cores nos ícones
      />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.transactionTitle}>{title || "Transação"}</Text>
      <Text style={styles.transactionDate}>{date}</Text>
    </View>
    <Text style={[styles.transactionValue, { color: type === "income" ? "#28A745" : "#FF3B30" }]}>
      {/* Adiciona o sinal de + ou - e formata como moeda (R$ 1.500,00) */}
      {type === "income" ? "+" : "-"} {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  transactionCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFF",
    padding: 16, borderRadius: 16, marginBottom: 12,
  },
  transactionIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "#F7F8FA", justifyContent: "center", alignItems: "center",
  },
  transactionTitle: { fontSize: 15, fontWeight: "600", color: Colors.text },
  transactionDate: { fontSize: 12, color: Colors.gray },
  transactionValue: { fontSize: 15, fontWeight: "bold" },
});