import { Drawer } from "expo-router/drawer";
import { Colors } from "../../constants/Colors";
import { Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

export default function DrawerLayout() {
  return (
    <Drawer
      // Usamos uma função aqui para ganhar acesso ao objeto 'navigation' nativo
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTintColor: Colors.primary,
        drawerActiveTintColor: Colors.primary,

        headerLeft: () => (
          <TouchableOpacity
            // DrawerActions.openDrawer() é a forma mais segura de disparar o evento
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu-outline" size={28} color={Colors.primary} />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          drawerLabel: "Início",
          title: "JJ Banking",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}