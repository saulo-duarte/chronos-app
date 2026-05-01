import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatCard } from "./StatCard";
import { spacing, colors } from "../theme/theme";
import { 
  CheckCircle, 
  Clock, 
  Lightning, 
  Archive,
  Warning
} from "phosphor-react-native";

interface StatGridProps {
  stats?: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    mastery: number;
  };
}

export const StatGrid = ({ stats }: StatGridProps) => {
  const navigation = useNavigation<any>();
  const data = stats || {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    mastery: 0,
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.cardWrapper} 
          onPress={() => navigation.navigate("Tasks", { screen: "TasksList", params: { filter: "OVERDUE" } })}
        >
          <StatCard
            title="Atrasadas"
            count={data.overdue}
            color={colors.dark.destructive}
            icon={Warning}
          />
        </TouchableOpacity>
        <View style={{ width: spacing.sm }} />
        <TouchableOpacity 
          style={styles.cardWrapper}
          onPress={() => navigation.navigate("Tasks")}
        >
          <StatCard
            title="Concluídas"
            count={data.completed}
            color={colors.dark.success}
            icon={CheckCircle}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.cardWrapper}>
          <StatCard
            title="Mastery"
            count={data.mastery}
            color={colors.dark.warning}
            icon={Lightning}
          />
        </TouchableOpacity>
        <View style={{ width: spacing.sm }} />
        <TouchableOpacity 
          style={styles.cardWrapper}
          onPress={() => navigation.navigate("Tasks")}
        >
          <StatCard
            title="Total"
            count={data.total}
            color={colors.dark.mutedForeground}
            icon={Archive}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  cardWrapper: {
    flex: 1,
  },
});
