import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Pressable,
  Dimensions
} from "react-native";
import { colors, spacing, typography } from "../theme/theme";
import { X, MagnifyingGlass, Funnel, Check } from "phosphor-react-native";
import { Status } from "../types";

export type FilterStatus = "DONE" | "IN_PROGRESS" | "PENDING" | "OVERDUE";

const { height } = Dimensions.get("window");

interface TaskFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: "ALL" | "LOW" | "MEDIUM" | "HIGH";
  setPriorityFilter: (filter: "ALL" | "LOW" | "MEDIUM" | "HIGH") => void;
  statusFilters: FilterStatus[];
  setStatusFilters: (filters: FilterStatus[]) => void;
}

export const TaskFiltersModal = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  statusFilters,
  setStatusFilters
}: TaskFiltersModalProps) => {
  const toggleStatusFilter = (status: FilterStatus) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter(s => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Funnel size={20} color={colors.dark.primary} weight="fill" />
              <Text style={styles.headerTitle}>Filtros</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.dark.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Buscar por nome</Text>
              <View style={styles.searchBar}>
                <MagnifyingGlass size={20} color={colors.dark.mutedForeground} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Ex: Reunião..."
                  placeholderTextColor={colors.dark.mutedForeground}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Prioridade</Text>
              <View style={styles.filterOptions}>
                {["ALL", "HIGH", "MEDIUM", "LOW"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterOption,
                      priorityFilter === status && styles.activeFilterOption
                    ]}
                    onPress={() => setPriorityFilter(status as any)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      priorityFilter === status && styles.activeFilterOptionText
                    ]}>
                      {status === "ALL" ? "Todas" : 
                       status === "HIGH" ? "Alta" : 
                       status === "MEDIUM" ? "Média" : "Baixa"}
                    </Text>
                    {priorityFilter === status && (
                      <Check size={16} color={colors.dark.primary} weight="bold" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.filterOptions}>
                {[
                  { id: "DONE", label: "Finalizado" },
                  { id: "IN_PROGRESS", label: "Em andamento" },
                  { id: "PENDING", label: "Não iniciado" },
                  { id: "OVERDUE", label: "Atrasado" }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.filterOption,
                      statusFilters.includes(option.id as FilterStatus) && styles.activeFilterOption
                    ]}
                    onPress={() => toggleStatusFilter(option.id as FilterStatus)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      statusFilters.includes(option.id as FilterStatus) && styles.activeFilterOptionText
                    ]}>
                      {option.label}
                    </Text>
                    {statusFilters.includes(option.id as FilterStatus) && (
                      <Check size={16} color={colors.dark.primary} weight="bold" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>Ver Resultados</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: colors.dark.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    maxHeight: height * 0.7,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.dark.foreground,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.dark.mutedForeground,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.dark.foreground,
    fontFamily: typography.fonts.medium,
    fontSize: 16,
  },
  filterOptions: {
    gap: spacing.sm,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeFilterOption: {
    backgroundColor: "rgba(94, 129, 172, 0.1)",
    borderColor: colors.dark.primary,
  },
  filterOptionText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.mutedForeground,
  },
  activeFilterOptionText: {
    color: colors.dark.primary,
  },
  applyButton: {
    backgroundColor: colors.dark.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
  },
  applyButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.dark.foreground,
  },
});
