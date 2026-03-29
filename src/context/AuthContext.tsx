import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api"; // Ajuste o caminho da sua API

interface UserData {
  fullName: string;
  accountId: string;
  accountNumber: string;
  branch: string;
  balance: number;
  token: string;
}

interface AuthContextData {
  user: UserData | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStorageData = useCallback(async () => {
    try {
      const keys = ["@JJBanking:token", "@JJBanking:fullName", "@JJBanking:accountId", "@JJBanking:accountNumber", "@JJBanking:branch", "@JJBanking:balance"];
      const storage = await AsyncStorage.multiGet(keys);
      const data: any = {};
      storage.forEach(([key, value]) => { data[key.split(":")[1]] = value; });

      if (data.token) {
        setUser({
          token: data.token,
          fullName: data.fullName,
          accountId: data.accountId,
          accountNumber: data.accountNumber,
          branch: data.branch,
          balance: parseFloat(data.balance) || 0,
        });
      }
    } catch (e) { console.error(e); }
    setIsLoading(false);
  }, []);

  const refreshUser = async () => {
    if (!user?.accountId) return;
    try {
      const response = await api.get(`/accounts/${user.accountId}`);
      const newBalance = response.data.balance;

      await AsyncStorage.setItem("@JJBanking:balance", String(newBalance));
      
      // ATUALIZAÇÃO GLOBAL: Isso força todas as telas (Dashboard inclusive) a atualizarem
      setUser((prev) => prev ? { ...prev, balance: parseFloat(newBalance) || 0 } : null);
    } catch (e) { console.error("Erro ao sincronizar:", e); }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  useEffect(() => { loadStorageData(); }, [loadStorageData]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);