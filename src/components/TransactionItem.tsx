import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

interface TransactionProps {
  title: string;
  date: string;
  value: number;
  type: "income" | "outcome";
}

export const TransactionItem = ({ title, date, value, type }: TransactionProps) => (
  <View style={styles.transactionCard}>
    <View style={styles.transactionIcon}>
      <Ionicons
        name={type === "income" ? "arrow-down-outline" : "cart-outline"}
        size={20} color={Colors.gray}
      />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.transactionTitle}>{title}</Text>
      <Text style={styles.transactionDate}>{date}</Text>
    </View>
    <Text style={[styles.transactionValue, { color: type === "income" ? "#28A745" : Colors.text }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  transactionCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFF",
    padding: 16, borderRadius: 16, marginBottom: 12,
  },
  transactionIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#F7F8FA", justifyContent: "center", alignItems: "center",
  },
  transactionTitle: { fontSize: 15, fontWeight: "600", color: Colors.text },
  transactionDate: { fontSize: 12, color: Colors.gray },
  transactionValue: { fontSize: 15, fontWeight: "bold" },
});