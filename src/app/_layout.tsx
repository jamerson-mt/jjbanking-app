import 'react-native-gesture-handler'; // IMPORTANTE: Deve ser a primeira linha
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { RootSiblingParent } from 'react-native-root-siblings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    // O GestureHandler permite que o Drawer (menu lateral) funcione
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* O RootSiblingParent permite exibir os Toasts de sucesso/erro */}
      <RootSiblingParent>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          {/* Tela de decisão/boas-vindas */}
          <Stack.Screen name="index" /> 
          
          {/* Grupo de Autenticação (Login/Register) */}
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom' 
            }} 
          />

          {/* Grupo do Dashboard com Menu Lateral */}
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} /> 
        </Stack>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}