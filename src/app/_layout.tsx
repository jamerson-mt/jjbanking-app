import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { RootSiblingParent } from "react-native-root-siblings";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import { AuthProvider } from "../context/AuthContext"; // Importe o Provider

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider> {/* Envolva tudo aqui */}
        <RootSiblingParent>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              headerLeft: Platform.OS === "web" ? () => null : undefined,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ animation: "slide_from_bottom" }} />
            <Stack.Screen name="(drawer)" />
          </Stack>
        </RootSiblingParent>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}