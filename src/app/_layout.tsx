import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { RootSiblingParent } from "react-native-root-siblings";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            // CORREÇÃO PARA WEB: Remove o ícone padrão que causa o 404
            headerLeft: Platform.OS === "web" ? () => null : undefined,
          }}
        >
          <Stack.Screen name="index" />

          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />

          <Stack.Screen
            name="(drawer)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}
