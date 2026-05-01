import { useTasks, useUpdateTaskStatus, useDeleteTask } from "../hooks/use-tasks";
import { useResources } from "../hooks/use-resources";
import { TaskItem } from "../components/TaskItem";
import { colors, spacing, typography } from "../theme/theme";
import { Status } from "../types";
import { 
  CaretLeft, 
  Plus,
  MagnifyingGlass,
  SlidersHorizontal,
  Globe, 
  FileText, 
  Tag as TagIcon,
  Funnel,
  ClipboardText,
  Files
} from "phosphor-react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useNavigationStore } from "../hooks/use-navigation-store";
import { ResourceFiltersModal } from "../components/ResourceFiltersModal";
import { TaskFiltersModal, FilterStatus } from "../components/TaskFiltersModal";
import { useQuickAddStore } from "../hooks/use-quick-add-store";
import { useEffect, useRef, useState } from "react";
import { stringToColor } from "../utils/color";
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Dimensions, Linking, Alert } from "react-native";

const { width } = Dimensions.get("window");

export const CollectionDetailsScreen = ({ route }: any) => {
  const { collectionId, title } = route.params;
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { setActiveContext, setCurrentCollectionId } = useNavigationStore();
  
  const [activeTab, setActiveTab] = useState<"TASKS" | "RESOURCES">("TASKS");
  const [isTaskFilterOpen, setIsTaskFilterOpen] = useState(false);
  const [isResourceFilterOpen, setIsResourceFilterOpen] = useState(false);
  
  const [taskSearch, setTaskSearch] = useState("");
  const [taskPriority, setTaskPriority] = useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL");
  const [taskStatus, setTaskStatus] = useState<FilterStatus[]>([]);
  
  const [resSearch, setResSearch] = useState("");
  const [resType, setResType] = useState<"ALL" | "FILE" | "LINK">("ALL");
  const [resTag, setResTag] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const quickAdd = useQuickAddStore();


  useEffect(() => {
    if (isFocused) {
      setCurrentCollectionId(collectionId);
      setActiveContext(activeTab === "TASKS" ? "COLLECTION_TASK" : "COLLECTION_RESOURCE");
    } else {
      setCurrentCollectionId(null);
    }
  }, [isFocused, activeTab]);

  const { data: tasks = [], isLoading: isLoadingTasks } = useTasks(collectionId);
  const { data: resources = [], isLoading: isLoadingResources } = useResources(collectionId);
  
  const updateStatusMutation = useUpdateTaskStatus();
  const deleteTaskMutation = useDeleteTask();

  const handleToggleStatus = (id: string, currentStatus: any) => {
    updateStatusMutation.mutate({ id, status: currentStatus === "DONE" ? "PENDING" : "DONE" });
  };

  const handleResourcePress = (resource: any) => {
    if (resource.type === "LINK" && resource.path) {
      Linking.openURL(resource.path).catch(() => {
        Alert.alert("Erro", "Não foi possível abrir o link.");
      });
    }
  };

  const getFilteredTasks = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return tasks.filter(task => {
      if (taskSearch && !task.title.toLowerCase().includes(taskSearch.toLowerCase())) return false;
      if (taskPriority !== "ALL" && task.priority !== taskPriority) return false;
      
      if (taskStatus.length > 0) {
        const taskDate = task.start_time ? new Date(task.start_time) : null;
        const isOverdue = task.status === "PENDING" && taskDate && taskDate < now;
        
        const matched = taskStatus.some(filter => {
          if (filter === "DONE") return task.status === "DONE";
          if (filter === "OVERDUE") return isOverdue;
          if (filter === "IN_PROGRESS") return task.status === "PENDING" && !isOverdue;
          if (filter === "PENDING") return task.status === "PENDING";
          return false;
        });
        if (!matched) return false;
      }
      
      return true;
    }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  };

  const getFilteredResources = () => {
    return resources.filter(res => {
      if (resSearch && !res.title.toLowerCase().includes(resSearch.toLowerCase())) return false;
      if (resType !== "ALL" && res.type !== resType) return false;
      if (resTag && (!res.tag || !res.tag.toLowerCase().includes(resTag.toLowerCase()))) return false;
      return true;
    });
  };

  const groupTasksByDate = (tasksList: any[]) => {
    const groups: { date: string; tasks: any[] }[] = [];
    tasksList.forEach(task => {
      const dateStr = new Date(task.start_time).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      const group = groups.find(g => g.date === dateStr);
      if (group) group.tasks.push(task);
      else groups.push({ date: dateStr, tasks: [task] });
    });
    return groups;
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setActiveTab(index === 0 ? "TASKS" : "RESOURCES");
  };

  if (isLoadingTasks || isLoadingResources) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  const filteredTasks = getFilteredTasks();
  const groupedTasks = groupTasksByDate(filteredTasks);
  const filteredResources = getFilteredResources();

  const availableTags = Array.from(new Set(resources.map((r: any) => r.tag).filter(Boolean))) as string[];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <CaretLeft size={24} color={colors.dark.foreground} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "TASKS" && styles.activeTab]}
          onPress={() => scrollViewRef.current?.scrollTo({ x: 0, animated: true })}
        >
          <Text style={[styles.tabText, activeTab === "TASKS" && styles.activeTabText]}>Tarefas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "RESOURCES" && styles.activeTab]}
          onPress={() => scrollViewRef.current?.scrollTo({ x: width, animated: true })}
        >
          <Text style={[styles.tabText, activeTab === "RESOURCES" && styles.activeTabText]}>Recursos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.pagingContainer}
      >
        {/* TASKS TAB */}
        <View style={{ width, flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {groupedTasks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <ClipboardText size={48} color={colors.dark.mutedForeground} weight="duotone" />
                <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
              </View>
            ) : (
              groupedTasks.map((group) => (
                <View key={group.date} style={styles.dateGroup}>
                  <View style={styles.dateHeader}>
                    <Text style={styles.dateText}>{group.date}</Text>
                    <View style={styles.dateLine} />
                  </View>
                  <View style={styles.tasksInGroup}>
                    {group.tasks.map((task) => (
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
              ))
            )}
          </ScrollView>
        </View>

        {/* RESOURCES TAB */}
        <View style={{ width, flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {filteredResources.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Files size={48} color={colors.dark.mutedForeground} weight="duotone" />
                <Text style={styles.emptyText}>Nenhum recurso encontrado.</Text>
              </View>
            ) : (
              filteredResources.map((resource) => (
                <TouchableOpacity 
                  key={resource.id} 
                  style={styles.resourceItem}
                  onPress={() => handleResourcePress(resource)}
                  onLongPress={() => navigation.navigate("ItemDetail", { item: resource, type: "RESOURCE" })}
                  delayLongPress={300}
                >
                  <View style={styles.resourceIcon}>
                    {resource.type === "LINK" ? (
                      <Globe size={22} color={colors.dark.primary} weight="duotone" />
                    ) : (
                      <FileText size={22} color={colors.dark.primary} weight="duotone" />
                    )}
                  </View>
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceTitle} numberOfLines={1}>{resource.title}</Text>
                    <View style={styles.resourceFooter}>
                      <Text style={styles.resourceType}>{resource.type}</Text>
                      {resource.tag && (
                        <View style={[styles.tagBadge, { backgroundColor: stringToColor(resource.tag, 0.2), borderColor: stringToColor(resource.tag, 0.4) }]}>
                          <TagIcon size={10} color={stringToColor(resource.tag)} weight="fill" />
                          <Text style={[styles.tagText, { color: stringToColor(resource.tag) }]}>{resource.tag}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating Filter Button */}
      <TouchableOpacity 
        style={styles.fabFilter}
        onPress={() => activeTab === "TASKS" ? setIsTaskFilterOpen(true) : setIsResourceFilterOpen(true)}
      >
        <Funnel size={24} color={colors.dark.foreground} weight="fill" />
      </TouchableOpacity>

      <TaskFiltersModal 
        isOpen={isTaskFilterOpen}
        onClose={() => setIsTaskFilterOpen(false)}
        searchQuery={taskSearch}
        setSearchQuery={setTaskSearch}
        priorityFilter={taskPriority}
        setPriorityFilter={setTaskPriority}
        statusFilters={taskStatus}
        setStatusFilters={setTaskStatus}
      />

      <ResourceFiltersModal 
        isOpen={isResourceFilterOpen}
        onClose={() => setIsResourceFilterOpen(false)}
        searchQuery={resSearch}
        setSearchQuery={setResSearch}
        typeFilter={resType}
        setTypeFilter={setResType}
        tagFilter={resTag}
        setTagFilter={setResTag}
        availableTags={availableTags}
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.dark.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.dark.foreground,
    flex: 1,
    textAlign: "center",
    marginHorizontal: spacing.sm,
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "rgba(94, 129, 172, 0.1)",
  },
  tabText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.mutedForeground,
  },
  activeTabText: {
    color: colors.dark.primary,
  },
  pagingContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyText: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.dark.mutedForeground,
    textAlign: "center",
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.card,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  resourceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(94, 129, 172, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.dark.foreground,
  },
  resourceFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: 4,
  },
  resourceType: {
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    color: colors.dark.mutedForeground,
    textTransform: "uppercase",
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    gap: 4,
  },
  tagText: {
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    color: colors.dark.mutedForeground,
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
});
