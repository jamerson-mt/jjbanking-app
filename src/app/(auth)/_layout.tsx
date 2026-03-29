import { Stack , useRouter } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AuthLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        animation: "fade",

        // CORREÇÃO PARA O ERRO 404 NA WEB:
        // Substituímos o ícone de imagem (.png) por um ícone de fonte (Ionicons)
        headerLeft: (props) =>
          Platform.OS === "web" && props.canGoBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10, marginRight: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ) : undefined, // No Android/iOS ele usa o nativo que não dá erro
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Entrar no JJ Banking",
          headerLeft: () => null, // Opcional: Remove o botão de voltar na tela de login
        }}
      />
      <Stack.Screen name="register" options={{ title: "Criar sua Conta" }} />
    </Stack>
  );
}
