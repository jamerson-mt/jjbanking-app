import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

interface User {
  token: string;
  fullName: string;
  accountId: string;
  accountNumber: string;
  branch: string;
  balance: number;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStorageData = useCallback(async () => {
    try {
      const keys = [
        "@JJBanking:token", 
        "@JJBanking:accountId", 
        "@JJBanking:fullName", 
        "@JJBanking:accountNumber", 
        "@JJBanking:branch", 
        "@JJBanking:balance"
      ];
      
      const storaged = await AsyncStorage.multiGet(keys);
      const data: any = {};

      storaged.forEach(([key, value]) => {
        const field = key.split(":")[1];
        data[field] = value;
      });

      // Se temos o token e o ID da conta, tentamos sincronizar com o banco
      if (data.token && data.accountId) {
        try {
          // CORREÇÃO AQUI: Usando data.accountId (a chave correta vinda do storage)
          const response = await api.get(`/accounts/${data.accountId}`); 
          const updatedAccount = response.data;

          // Montamos o objeto de usuário preservando o token e atualizando os dados da conta
          const updatedUser: User = {
            token: data.token,
            fullName: data.fullName, // Se o seu backend não retornar o nome aqui, mantemos o do storage
            accountId: data.accountId,
            accountNumber: updatedAccount.accountNumber || data.accountNumber,
            branch: updatedAccount.branch || data.branch,
            balance: updatedAccount.balance, // SALDO NOVO DO BANCO
          };

          setUser(updatedUser);
          
          // Atualiza o saldo no storage para persistência
          await AsyncStorage.setItem("@JJBanking:balance", updatedAccount.balance.toString());
          
        } catch (apiError) {
          console.error("Erro ao buscar dados atualizados da API, usando cache:", apiError);
          // Fallback: Usa os dados que já estavam no storage
          setUser({
            ...data,
            balance: Number(data.balance) || 0
          } as User);
        }
      }
    } catch (e) {
      console.error("Erro crítico no loadStorageData:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStorageData();
  }, [loadStorageData]);

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: loadStorageData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);