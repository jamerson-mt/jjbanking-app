import { Drawer } from 'expo-router/drawer';
import { Colors } from '../../constants/Colors';

export default function DrawerLayout() {
  return (
    <Drawer screenOptions={{ 
      headerShown: true, 
      headerTintColor: Colors.primary,
      drawerActiveTintColor: Colors.primary 
    }}>
      <Drawer.Screen
        name="dashboard" // Refere-se ao arquivo dashboard.tsx
        options={{
          drawerLabel: 'Início',
          title: 'JJ Banking',
        }}
      />
    </Drawer>
  );
}