import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { 
  useDueProblems, 
  useLeetCodeProblems, 
  useReviewProblem 
} from "../hooks/use-leetcode";
import { colors, spacing, typography } from "../theme/theme";
import { 
  Play, 
  Calendar, 
  ListBullets, 
  TrendUp, 
  CheckCircle 
} from "phosphor-react-native";
import { LeetCodeProblem } from "../types";

const AnyFlashList = FlashList as any;

export const MasteryScreen = () => {
  const { data: dueProblems = [], isLoading: loadingDue } = useDueProblems();
  const { data: allProblems = [], isLoading: loadingAll } = useLeetCodeProblems();
  
  const [activeTab, setActiveTab] = useState<"QUEUE" | "ALL">("QUEUE");

  const sortedProblems = useMemo(() => {
    const list = activeTab === "QUEUE" ? dueProblems : allProblems;
    return [...list].sort((a, b) => a.title.localeCompare(b.title));
  }, [activeTab, dueProblems, allProblems]);

  if (loadingDue || loadingAll) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mastery</Text>
          <Text style={styles.subtitle}>Queue de Retenção Espaçada</Text>
        </View>
        {activeTab === "QUEUE" && dueProblems.length > 0 && (
          <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
            <Play size={20} color={colors.dark.background} weight="fill" />
            <Text style={styles.startButtonText}>Revisar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "QUEUE" && styles.activeTab]}
          onPress={() => setActiveTab("QUEUE")}
        >
          <Calendar size={18} color={activeTab === "QUEUE" ? colors.dark.primary : colors.dark.mutedForeground} />
          <Text style={[styles.tabText, activeTab === "QUEUE" && styles.activeTabText]}>
            Para Hoje ({dueProblems.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "ALL" && styles.activeTab]}
          onPress={() => setActiveTab("ALL")}
        >
          <ListBullets size={18} color={activeTab === "ALL" ? colors.dark.primary : colors.dark.mutedForeground} />
          <Text style={[styles.tabText, activeTab === "ALL" && styles.activeTabText]}>
            Todos ({allProblems.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <AnyFlashList
          data={sortedProblems as any}
          renderItem={({ item }: { item: any }) => <ProblemItem problem={item} />}
          estimatedItemSize={100}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum problema encontrado.</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const ProblemItem = ({ problem }: { problem: LeetCodeProblem }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle} numberOfLines={1}>{problem.title}</Text>
        <DifficultyBadge difficulty={problem.difficulty} />
      </View>
      
      <View style={styles.itemFooter}>
        <View style={styles.itemStat}>
          <TrendUp size={14} color={colors.dark.mutedForeground} />
          <Text style={styles.itemStatText}>Ease: {problem.ease_factor.toFixed(1)}</Text>
        </View>
        <View style={styles.itemStat}>
          <CheckCircle size={14} color={colors.dark.mutedForeground} />
          <Text style={styles.itemStatText}>Score: {problem.last_score}</Text>
        </View>
        <Text style={styles.nextReview}>
          Próxima: {new Date(problem.next_review).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const getColor = () => {
    switch (difficulty) {
      case "Easy": return colors.dark.success;
      case "Medium": return colors.dark.warning;
      case "Hard": return colors.dark.destructive;
      default: return colors.dark.mutedForeground;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: `${getColor()}20` }]}>
      <Text style={[styles.badgeText, { color: getColor() }]}>{difficulty}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
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
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 28,
    color: colors.dark.foreground,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.dark.mutedForeground,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
  },
  startButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.dark.background,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.dark.primary,
  },
  tabText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.mutedForeground,
  },
  activeTabText: {
    color: colors.dark.foreground,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  itemContainer: {
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  itemTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.dark.foreground,
    flex: 1,
    marginRight: spacing.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    textTransform: "uppercase",
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  itemStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemStatText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.dark.mutedForeground,
  },
  nextReview: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: "rgba(94, 129, 172, 0.6)",
    marginLeft: "auto",
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.mutedForeground,
  },
});
