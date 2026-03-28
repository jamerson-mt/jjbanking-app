import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#121212' }, // Cor do seu banco
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        animation: 'fade', // Transição suave entre login e registro
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ title: 'Entrar no JJ Banking' }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ title: 'Criar sua Conta' }} 
      />
    </Stack>
  );
}