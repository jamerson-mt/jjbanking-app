import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notify } from "../utils/toast";

interface UserData {
  fullName: string;
  accountId: string;
  accountNumber: string;
  branch: string;
  balance: number;
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar os dados do "banco local" do celular
  const loadStorageData = useCallback(async () => {
    try {
      setIsLoading(true);
      const keys = [
        "@JJBanking:token",
        "@JJBanking:fullName",
        "@JJBanking:accountId",
        "@JJBanking:accountNumber",
        "@JJBanking:branch",
        "@JJBanking:balance",
      ];

      const storage = await AsyncStorage.multiGet(keys);
      
      // Transformamos o array do AsyncStorage em um objeto fácil de usar
      const data: any = {};
      storage.forEach(([key, value]) => {
        data[key.split(":")[1]] = value;
      });

      if (data.token) {
        setUser({
          token: data.token,
          fullName: data.fullName,
          accountId: data.accountId,
          accountNumber: data.accountNumber,
          branch: data.branch,
          balance: parseFloat(data.balance) || 0,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Erro ao carregar sessão:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Roda assim que o Hook é chamado (na abertura do App)
  useEffect(() => {
    loadStorageData();
  }, [loadStorageData]);

  const logout = async () => {
    await AsyncStorage.multiRemove([
      "@JJBanking:token",
      "@JJBanking:fullName",
      "@JJBanking:accountId",
      "@JJBanking:accountNumber",
      "@JJBanking:branch",
      "@JJBanking:balance",
    ]);
    setUser(null);
    notify.info("Sessão encerrada.");
  };

  return { 
    user, 
    isLoading, 
    logout, 
    isLoggedIn: !!user?.token,
    refreshUser: loadStorageData // Útil para atualizar o saldo após um Pix
  };
}