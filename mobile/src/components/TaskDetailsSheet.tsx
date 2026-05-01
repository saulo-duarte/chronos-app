import React, { useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Task, Status, Priority } from "../types";
import { colors, spacing, typography } from "../theme/theme";
import { X, Calendar, Flag, Trash, CheckCircle } from "phosphor-react-native";

interface TaskDetailsSheetProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

export const TaskDetailsSheet = ({ 
  task, 
  onClose, 
  onUpdate, 
  onDelete 
}: TaskDetailsSheetProps) => {
  const snapPoints = useMemo(() => ["50%", "80%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    []
  );

  if (!task) return null;

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose
      index={task ? 0 : -1}
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detalhes da Tarefa</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={20} color={colors.dark.mutedForeground} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Título</Text>
          <TextInput 
            style={styles.input}
            value={task.title}
            placeholderTextColor={colors.dark.mutedForeground}
            onChangeText={(text) => onUpdate(task.id, { title: text })}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput 
            style={[styles.input, styles.textArea]}
            value={task.description}
            multiline
            placeholder="Adicione uma descrição..."
            placeholderTextColor={colors.dark.mutedForeground}
            onChangeText={(text) => onUpdate(task.id, { description: text })}
          />

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Prioridade</Text>
              <View style={styles.selector}>
                <Flag size={16} color={getPriorityColor(task.priority)} weight="fill" />
                <Text style={styles.selectorText}>{task.priority}</Text>
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.selector}>
                <CheckCircle 
                  size={16} 
                  color={task.status === "DONE" ? colors.dark.success : colors.dark.mutedForeground} 
                  weight="fill" 
                />
                <Text style={styles.selectorText}>
                  {task.status === "DONE" ? "Concluída" : "Pendente"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => onDelete(task.id)}
            >
              <Trash size={20} color={colors.dark.destructive} />
              <Text style={styles.deleteText}>Excluir Tarefa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "HIGH": return colors.dark.destructive;
    case "MEDIUM": return colors.dark.warning;
    case "LOW": return colors.dark.primary;
    default: return colors.dark.mutedForeground;
  }
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.dark.card,
  },
  indicator: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.dark.foreground,
  },
  closeButton: {
    padding: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 100,
  },
  form: {
    gap: spacing.lg,
  },
  label: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.dark.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    padding: spacing.md,
    color: colors.dark.foreground,
    fontFamily: typography.fonts.medium,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  field: {
    flex: 1,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  selectorText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.foreground,
  },
  footer: {
    marginTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    paddingTop: spacing.xl,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  deleteText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.dark.destructive,
  },
});
