import React from "react";
import { Text, View, StyleSheet } from "react-native";
// Importação correta para evitar o erro de "deprecated"
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// Seus componentes e hooks
import { Colors } from "../constants/Colors";
import { Button } from "../components/Button";
import { BalanceCard } from "../components/BalanceCard";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  // Função para formatar a data atual
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Cabeçalho de Identificação */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            {user ? `Olá, ${user.name}!` : "Bem-vindo ao JJ Banking"}
          </Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {/* Área Central: Lógica de exibição de saldo ou boas-vindas */}
        <View style={styles.main}>
          {user ? (
            <BalanceCard amount={1250.55} />
          ) : (
            <View style={styles.placeholderCard}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoInnerText}>JJ</Text>
              </View>
              <Text style={styles.placeholderText}>
                Sua conta digital completa. Faça login para gerenciar suas
                finanças com segurança.
              </Text>
            </View>
          )}
        </View>

        {/* Ações na parte inferior da tela */}
        <View style={styles.footer}>
          {!user ? (
            <>
              <Button
                title="Entrar na minha conta"
                onPress={login}
                loading={isLoading}
              />

              <View style={styles.spacer} />

              <Button
                title="Abrir conta gratuita"
                onPress={() => router.push("/register")}
                variant="secondary"
              />
            </>
          ) : (
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
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    marginTop: 20,
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
    textTransform: "capitalize",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderCard: {
    padding: 30,
    backgroundColor: Colors.white,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#CBD5E0",
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoInnerText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 20,
  },
  placeholderText: {
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
    fontSize: 15,
  },
  footer: {
    marginTop: "auto",
  },
  spacer: {
    height: 12,
  },
});
