import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

interface BalanceCardProps {
  amount: number;
}

export const BalanceCard = ({ amount }: BalanceCardProps) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Saldo disponível</Text>
        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
          <Ionicons 
            name={isVisible ? "eye-outline" : "eye-off-outline"} 
            size={22} 
            color={Colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.amount}>
        {isVisible 
          ? `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
          : "••••••••"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 24,
    // Sombra leve para destacar no fundo cinza
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: { fontSize: 14, color: Colors.gray, fontWeight: "500" },
  amount: { fontSize: 28, fontWeight: "bold", color: Colors.text },
});