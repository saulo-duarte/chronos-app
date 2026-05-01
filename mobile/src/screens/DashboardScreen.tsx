import React, { useMemo } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  ActivityIndicator 
} from "react-native";
import { colors, spacing, typography } from "../theme/theme";
import { StatGrid } from "../components/StatGrid";
import { RadialProgress } from "../components/RadialProgress";
import { useTasks } from "../hooks/use-tasks";
import { useMe } from "../hooks/use-auth";
import { Clock } from "phosphor-react-native";

export const DashboardScreen = () => {
  const { data: user } = useMe();
  const { data: tasks = [], isLoading } = useTasks();

  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "DONE").length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => t.status === "PENDING" && t.end_time && new Date(t.end_time) < new Date()).length;
    const mastery = 0;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed, pending, overdue, mastery, progress };
  }, [tasks]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(" ")[0] || "Usuário"}</Text>
            <Text style={styles.subtitle}>Veja como está seu progresso hoje.</Text>
          </View>
          <View style={styles.progressContainer}>
            <RadialProgress progress={metrics.progress} size={64} />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressLabel}>Progresso</Text>
              <Text style={styles.progressSubtext}>
                {metrics.completed}/{metrics.total} tarefas
              </Text>
            </View>
          </View>
        </View>

        <StatGrid 
          stats={{
            total: metrics.total,
            completed: metrics.completed,
            pending: metrics.pending,
            overdue: metrics.overdue,
            mastery: metrics.mastery,
          }} 
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={48} color={colors.dark.mutedForeground} weight="thin" />
              <Text style={styles.emptyText}>Nenhuma tarefa recente</Text>
            </View>
          ) : (
            tasks.slice(0, 3).map((task) => (
              <View key={task.id} style={styles.taskPreview}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                  <Text style={styles.taskTime}>
                    {new Date(task.start_time).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH": return colors.dark.destructive;
    case "MEDIUM": return colors.dark.warning;
    case "LOW": return colors.dark.primary;
    default: return colors.dark.mutedForeground;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    paddingTop: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
  header: {
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontFamily: typography.fonts.bold,
    fontSize: 24,
    color: colors.dark.foreground,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.dark.mutedForeground,
    marginTop: spacing.xs,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  progressTextContainer: {
    marginLeft: spacing.sm,
  },
  progressLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.dark.foreground,
  },
  progressSubtext: {
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    color: colors.dark.mutedForeground,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.dark.foreground,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.dark.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderStyle: "dashed",
  },
  emptyText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.mutedForeground,
    marginTop: spacing.sm,
  },
  taskPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.md,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.dark.foreground,
  },
  taskTime: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.dark.mutedForeground,
    marginTop: 2,
  },
});
