import Toast from 'react-native-root-toast';

export const notify = {
  success: (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: "#28a745", // Verde Sucesso
      textColor: "#ffffff",
    });
  },
  error: (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: "#dc3545", // Vermelho Erro
      textColor: "#ffffff",
    });
  },
  info: (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      backgroundColor: "#007bff", // Azul Info (Logout)
      textColor: "#ffffff",
    });
  }
};