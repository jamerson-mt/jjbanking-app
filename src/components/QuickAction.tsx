import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress?: () => void;
}

export const QuickAction = ({ icon, label, color, onPress }: QuickActionProps) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={[styles.iconCircle, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  actionItem: { alignItems: "center", marginRight: 20 },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: "center", alignItems: "center", marginBottom: 8,
  },
  actionLabel: { fontSize: 13, fontWeight: "500", color: Colors.text },
});