import { Drawer } from "expo-router/drawer";
import { Colors } from "../../constants/Colors";
import { Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerTintColor: Colors.primary,
        drawerActiveTintColor: Colors.primary,

        // CORREÇÃO PARA O ERRO 404 NA WEB:
        // Substituímos o ícone do menu lateral que costuma dar erro 404 (.png)
        headerLeft: (props) =>
          Platform.OS === "web" ? (
            <TouchableOpacity
              onPress={props.onPress}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="menu-outline" size={28} color={Colors.primary} />
            </TouchableOpacity>
          ) : undefined, // Mantém o ícone nativo no Android/iOS
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          drawerLabel: "Início",
          title: "JJ Banking",
          // Garantimos que o ícone do item no menu lateral também seja estável
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
