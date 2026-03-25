import React from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { Colors } from "../constants/Colors";
import { Button } from "../components/Button";
import { BalanceCard } from "../components/BalanceCard";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { user, login, isLoading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Cabeçalho de Identificação */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            {user ? `Olá, ${user.name}!` : "Bem-vindo ao JJ Banking"}
          </Text>
          <Text style={styles.dateText}>Quarta-feira, 25 de Março</Text>
        </View>

        {/* Área Central: Mostra o saldo se logado, ou mensagem de boas-vindas */}
        <View style={styles.main}>
          {user ? (
            <BalanceCard amount={1250.55} />
          ) : (
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderText}>
                Faça login para gerenciar suas finanças com segurança.
              </Text>
            </View>
          )}
        </View>

        {/* Ações na parte inferior */}
        <View style={styles.footer}>
          {!user && (
            <Button 
              title="Entrar na minha conta" 
              onPress={login} 
              loading={isLoading} 
            />
          )}
          
          {user && (
            <Button 
              title="Ir para o Dashboard" 
              onPress={() => console.log("Navegar para Home")} 
              variant="secondary"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.text,
  },
  dateText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderCard: {
    padding: 20,
    backgroundColor: "#E1E8F0",
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  placeholderText: {
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
  },
  footer: {
    marginBottom: 20,
  },
});