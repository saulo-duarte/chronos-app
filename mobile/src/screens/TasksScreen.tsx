import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator, 
  TouchableOpacity,
  ScrollView, 
  Dimensions 
} from "react-native";
import { useTasks, useUpdateTaskStatus, useDeleteTask } from "../hooks/use-tasks";
import { TaskItem } from "../components/TaskItem";
import { colors, spacing, typography } from "../theme/theme";
import { Task, Status } from "../types";
import { 
  Plus, 
  MagnifyingGlass, 
  Funnel, 
  Calendar as CalendarIcon,
  ClipboardText
} from "phosphor-react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useNavigationStore } from "../hooks/use-navigation-store";
import { TaskFiltersModal, FilterStatus } from "../components/TaskFiltersModal";
import { HorizontalCalendar } from "../components/HorizontalCalendar";

const { width } = Dimensions.get("window");

type TabType = "TODAY" | "WEEK" | "DAY" | "NO_DATE";

export const TasksScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { setActiveContext } = useNavigationStore();
  const { data: tasks = [], isLoading } = useTasks();
  
  const [activeTab, setActiveTab] = useState<TabType>("TODAY");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL");
  const [statusFilters, setStatusFilters] = useState<FilterStatus[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isFocused) {
      setActiveContext("TASK");
      
      // Handle navigation params
      if (route.params?.filter === "OVERDUE") {
        setStatusFilters(["OVERDUE"]);
        // Clear params after handling to avoid re-triggering
        navigation.setParams({ filter: undefined });
      }
    }
  }, [isFocused, route.params]);

  const updateStatusMutation = useUpdateTaskStatus();
  const deleteTaskMutation = useDeleteTask();

  const handleToggleStatus = (id: string, currentStatus: Status) => {
    updateStatusMutation.mutate({ id, status: currentStatus === "DONE" ? "PENDING" : "DONE" });
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const getFilteredTasks = (tab: TabType) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let baseTasks = tasks.filter(task => {
      const taskDate = task.start_time ? new Date(task.start_time) : null;

      // Apply Search
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      // Apply Priority Filter
      if (priorityFilter !== "ALL" && task.priority !== priorityFilter) return false;

      // Apply Tab Filter
      if (tab === "TODAY") {
        if (!taskDate || !isSameDay(taskDate, today)) return false;
      } else if (tab === "WEEK") {
        if (!taskDate) return false;
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        if (taskDate < today || taskDate >= nextWeek) return false;
      } else if (tab === "DAY") {
        if (!taskDate || !isSameDay(taskDate, selectedDate)) return false;
      } else if (tab === "NO_DATE") {
        if (task.end_time) return false;
      }

      return true;
    });

    // Apply Status Filter
    if (statusFilters.length > 0) {
      baseTasks = baseTasks.filter(task => {
        const taskDate = task.start_time ? new Date(task.start_time) : null;
        const isOverdue = task.status === "PENDING" && task.end_time && new Date(task.end_time) < now;
        
        return statusFilters.some(filter => {
          if (filter === "DONE") return task.status === "DONE";
          if (filter === "OVERDUE") return isOverdue;
          if (filter === "IN_PROGRESS") return task.status === "PENDING" && !isOverdue;
          if (filter === "PENDING") return task.status === "PENDING";
          return false;
        });
      });
    }

    if (tab === "NO_DATE") {
        // Sort NO_DATE tasks by priority then title
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return baseTasks.sort((a, b) => {
            if (a.priority !== b.priority) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return a.title.localeCompare(b.title);
        });
    }

    return baseTasks.sort((a, b) => {
      const dateA = a.start_time ? new Date(a.start_time).getTime() : Infinity;
      const dateB = b.start_time ? new Date(b.start_time).getTime() : Infinity;
      return dateA - dateB;
    });
  };

  const groupTasksByDate = (tasksList: Task[]) => {
    const groups: { date: string; tasks: Task[] }[] = [];
    tasksList.forEach(task => {
      const taskDate = task.start_time ? new Date(task.start_time) : null;
      const dateStr = (taskDate && !isNaN(taskDate.getTime()))
        ? taskDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
        : "Sem Data";
      const group = groups.find(g => g.date === dateStr);
      if (group) {
        group.tasks.push(task);
      } else {
        groups.push({ date: dateStr, tasks: [task] });
      }
    });
    return groups;
  };

  const renderTaskList = (tab: TabType) => {
    const filtered = getFilteredTasks(tab);
    const grouped = groupTasksByDate(filtered);

    if (grouped.length === 0) {
      return (
        <View style={styles.tabContent}>
          {tab === "DAY" && (
            <HorizontalCalendar 
              selectedDate={selectedDate} 
              onSelectDate={setSelectedDate} 
            />
          )}
          <View style={styles.emptyContainer}>
            <ClipboardText size={48} color={colors.dark.mutedForeground} weight="duotone" />
            <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        {tab === "DAY" && (
          <HorizontalCalendar 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} 
          />
        )}
        <ScrollView 
          style={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {grouped.map((group) => (
            <View key={group.date} style={styles.dateGroup}>
              <View style={styles.dateHeader}>
                <Text style={styles.dateText}>{group.date}</Text>
                <View style={styles.dateLine} />
              </View>
              <View style={styles.tasksInGroup}>
                {group.tasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggleStatus={handleToggleStatus}
                    onDelete={(id) => deleteTaskMutation.mutate(id)}
                    onPress={() => {}} 
                    onLongPress={(t) => navigation.navigate("ItemDetail", { item: t, type: "TASK" })}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    const tabs: TabType[] = ["TODAY", "WEEK", "DAY", "NO_DATE"];
    if (tabs[index] !== activeTab) {
      setActiveTab(tabs[index]);
    }
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  if (isLoading) {
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
          <Text style={styles.title}>Minhas Tarefas</Text>
          <Text style={styles.subtitle}>{tasks.length} tarefas totais</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        {["TODAY", "WEEK", "DAY", "NO_DATE"].map((tab, index) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => scrollToIndex(index)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === "TODAY" ? "Hoje" : 
               tab === "WEEK" ? "Semana" : 
               tab === "DAY" ? "Dia" : "Sem Data"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.pagingContainer}
      >
        <View style={{ width, flex: 1 }}>{renderTaskList("TODAY")}</View>
        <View style={{ width, flex: 1 }}>{renderTaskList("WEEK")}</View>
        <View style={{ width, flex: 1 }}>{renderTaskList("DAY")}</View>
        <View style={{ width, flex: 1 }}>{renderTaskList("NO_DATE")}</View>
      </ScrollView>

      {/* Floating Filter Button */}
      <TouchableOpacity 
        style={styles.fabFilter}
        onPress={() => setIsFilterModalOpen(true)}
      >
        <Funnel size={24} color={colors.dark.foreground} weight="fill" />
      </TouchableOpacity>

      <TaskFiltersModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        statusFilters={statusFilters}
        setStatusFilters={setStatusFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    paddingTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
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
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeTab: {
    backgroundColor: "rgba(94, 129, 172, 0.1)",
    borderColor: colors.dark.primary,
  },
  tabText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.dark.mutedForeground,
  },
  activeTabText: {
    color: colors.dark.primary,
  },
  pagingContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 120,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  dateGroup: {
    marginBottom: spacing.xl,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  dateText: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.dark.mutedForeground,
    textTransform: "uppercase",
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  tasksInGroup: {
    gap: spacing.md,
  },
  fabFilter: {
    position: "absolute",
    bottom: 100,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dark.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.mutedForeground,
  },
});
