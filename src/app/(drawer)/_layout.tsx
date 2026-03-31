import { Drawer } from "expo-router/drawer";
import { Colors } from "../../constants/Colors";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTintColor: Colors.primary,
        drawerActiveTintColor: Colors.primary,
        headerLeft: () => (
          <TouchableOpacity
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
      
      <Drawer.Screen
        name="deposit"
        options={{
          drawerLabel: "Adicionar Dinheiro",
          title: "Depósito",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />


      {/* Novo item: Saque */}
      <Drawer.Screen
        name="transfer"
        options={{
          drawerLabel: "transferir Dinheiro",
          title: "transfer",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}