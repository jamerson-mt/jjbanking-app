import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

interface UserHeaderProps {
  name?: string;
  branch?: string;
  account?: string;
  onLogout?: () => void;
}

export const UserHeader = ({ name, branch, account, onLogout }: UserHeaderProps) => {
  const firstName = name?.split(" ")[0] || "Usuário";

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá, {firstName}</Text>
        <Text style={styles.accountInfo}>
          Agência {branch || "0001"} • Conta {account || "00000-0"}
        </Text>
      </View>
      
      {onLogout && (
        <TouchableOpacity 
          onPress={onLogout} 
          style={styles.logoutButton} 
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={26} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 30, // Espaçamento para não colar no topo
    paddingBottom: 20,
  },
  greeting: { fontSize: 22, fontWeight: "bold", color: Colors.text },
  accountInfo: { fontSize: 14, color: Colors.gray, marginTop: 4 },
  logoutButton: { 
    padding: 10,
    backgroundColor: "#FF3B3010", // Fundo levemente avermelhado
    borderRadius: 12 
  },
});