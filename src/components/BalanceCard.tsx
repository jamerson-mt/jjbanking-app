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
        <View style={styles.labelContainer}>
          <Ionicons name="wallet-outline" size={16} color={Colors.gray} style={{ marginRight: 6 }} />
          <Text style={styles.label}>Saldo disponível</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setIsVisible(!isVisible)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name={isVisible ? "eye-outline" : "eye-off-outline"} 
            size={22} 
            color={Colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>R$</Text>
        <Text style={isVisible ? styles.amount : styles.hiddenAmount}>
          {isVisible 
            ? amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
            : "••••••"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 24, // Aumentei um pouco o padding interno
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: { 
    fontSize: 14, 
    color: Colors.gray, 
    fontWeight: "600",
    letterSpacing: 0.2
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline", // Alinha o R$ com a base do número
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginRight: 4,
    opacity: 0.8,
  },
  amount: { 
    fontSize: 32, // Um pouco maior para destaque
    fontWeight: "bold", 
    color: Colors.text,
    letterSpacing: -0.5,
  },
  hiddenAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray,
    letterSpacing: 2,
    top: -2, // Ajuste fino para alinhar os pontos com o R$
  },
});