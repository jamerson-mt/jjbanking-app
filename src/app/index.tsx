import React, { useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors } from "../constants/Colors";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth"; // Certifique-se que este hook lê o AsyncStorage

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionamento Automático: Se já estiver logado, pula a landing
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/(drawer)/dashboard");
    }
  }, [user, isLoading, router]); // <-- Adicione o 'router' aqui

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bem-vindo ao JJ Banking</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <View style={styles.main}>
          <View style={styles.placeholderCard}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoInnerText}>JJ</Text>
            </View>
            <Text style={styles.placeholderText}>
              Sua conta digital completa. Faça login para gerenciar suas
              finanças com segurança na nossa nova plataforma.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Entrar na minha conta"
            onPress={() => router.push("/login")} // Rota corrigida para o grupo
          />

          <View style={styles.spacer} />

          <Button
            title="Abrir conta gratuita"
            onPress={() => router.push("/register")} // Rota corrigida
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingHorizontal: 24, paddingBottom: 40 },
  header: { marginTop: 20, marginBottom: 32 },
  welcomeText: { fontSize: 26, fontWeight: "bold", color: Colors.text },
  dateText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
    textTransform: "capitalize",
  },
  main: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholderCard: {
    padding: 30,
    backgroundColor: "#FFF",
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2, // Sombra leve no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
  logoInnerText: { color: "#FFF", fontWeight: "bold", fontSize: 20 },
  placeholderText: {
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
    fontSize: 15,
  },
  footer: { marginTop: "auto" },
  spacer: { height: 12 },
});
