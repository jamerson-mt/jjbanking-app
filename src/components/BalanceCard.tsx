import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface BalanceProps {
  amount: number;
}

export function BalanceCard({ amount }: BalanceProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Saldo disponível</Text>
      <Text style={styles.amount}>
        R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  label: {
    color: Colors.gray,
    fontSize: 14,
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
});