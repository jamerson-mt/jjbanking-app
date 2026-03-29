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
  // Garante que pegamos o primeiro nome mesmo se o nome vier nulo inicialmente
  const firstName = name ? name.split(" ")[0] : "Usuário";

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.greeting} numberOfLines={1}>
          Olá, {firstName}
        </Text>
        <Text style={styles.accountInfo}>
          Ag {branch || "0001"} • Cc {account || "00000-0"}
        </Text>
      </View>
      
      {onLogout && (
        <TouchableOpacity 
          onPress={onLogout} 
          style={styles.logoutButton} 
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Aumenta a área de toque
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
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
    paddingTop: 20, 
    paddingBottom: 20,
    backgroundColor: Colors.background, // Garante que o fundo combine com a Dash
  },
  infoContainer: {
    flex: 1, // Faz os textos ocuparem o espaço disponível sem empurrar o botão de sair
    marginRight: 15,
  },
  greeting: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: Colors.text,
    letterSpacing: -0.5,
  },
  accountInfo: { 
    fontSize: 14, 
    color: Colors.gray, 
    marginTop: 2,
    fontWeight: "500",
  },
  logoutButton: { 
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FF3B3010", 
    borderRadius: 14,
  },
});