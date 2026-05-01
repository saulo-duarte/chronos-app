import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  Pressable
} from "react-native";
import { colors, spacing, typography } from "../theme/theme";
import { X, Plus, Calendar, Flag, FolderSimple, Check, Clock } from "phosphor-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCreateTask } from "../hooks/use-tasks";
import { useCreateCollection } from "../hooks/use-collections";
import { useQuickAddStore } from "../hooks/use-quick-add-store";
import { CreateTaskDTO, CreateCollectionDTO, Priority } from "../types";
import { ColorPicker } from "./ColorPicker";

const { width, height } = Dimensions.get("window");

export const QuickAddModal = () => {
  const { isOpen, type, collectionId, selectedColor, setSelectedColor, close } = useQuickAddStore();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  
  const createTaskMutation = useCreateTask();
  const createCollectionMutation = useCreateCollection();

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDate(new Date());
      setPriority("MEDIUM");
      setShowPriorityPicker(false);
    }
  }, [isOpen]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    
    // Preserve current time when changing date
    const newDate = new Date(currentDate);
    newDate.setHours(date.getHours());
    newDate.setMinutes(date.getMinutes());
    setDate(newDate);
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleCreate = () => {
    if (!title.trim()) return;

    if (type === "TASK") {
      const dto: CreateTaskDTO = {
        title: title.trim(),
        status: "PENDING",
        priority: priority,
        start_time: date.toISOString(),
        collection_id: collectionId,
      };

      createTaskMutation.mutate(dto, {
        onSuccess: () => close(),
      });
    } else if (type === "COLLECTION") {
      const dto: CreateCollectionDTO = {
        title: title.trim(),
        color: selectedColor,
      };

      createCollectionMutation.mutate(dto, {
        onSuccess: () => close(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <Pressable style={styles.overlay} onPress={close}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {type === "TASK" ? "Nova Tarefa" : "Nova Coleção"}
              </Text>
              <TouchableOpacity onPress={close} style={styles.closeButton}>
                <X size={20} color={colors.dark.mutedForeground} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              {type === "COLLECTION" ? (
                <FolderSimple size={24} color={selectedColor} style={styles.inputIcon} weight="duotone" />
              ) : (
                <Plus size={24} color={colors.dark.primary} style={styles.inputIcon} />
              )}
              <TextInput
                style={styles.input}
                placeholder={type === "TASK" ? "O que precisa ser feito?" : "Nome da coleção"}
                placeholderTextColor={colors.dark.mutedForeground}
                autoFocus
                value={title}
                onChangeText={setTitle}
                onSubmitEditing={handleCreate}
              />
            </View>

            {type === "COLLECTION" && (
              <View style={styles.colorPickerWrapper}>
                <Text style={styles.label}>Escolha uma cor</Text>
                <ColorPicker 
                  selectedColor={selectedColor} 
                  onColorSelect={setSelectedColor} 
                />
              </View>
            )}

            <View style={styles.footer}>
              <View style={styles.options}>
                {type === "TASK" && (
                  <>
                    <TouchableOpacity 
                      style={[styles.optionBtn, showDatePicker && styles.activeOptionBtn]}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Calendar size={20} color={showDatePicker ? colors.dark.primary : colors.dark.mutedForeground} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.optionBtn, showTimePicker && styles.activeOptionBtn]}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Clock size={20} color={showTimePicker ? colors.dark.primary : colors.dark.mutedForeground} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.optionBtn, showPriorityPicker && styles.activeOptionBtn]}
                      onPress={() => setShowPriorityPicker(!showPriorityPicker)}
                    >
                      <Flag size={20} color={priority !== "MEDIUM" ? getColorForPriority(priority) : colors.dark.mutedForeground} weight={priority !== "MEDIUM" ? "fill" : "regular"} />
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="default"
                  is24Hour={true}
                  onChange={onChangeTime}
                />
              )}
              
              <TouchableOpacity 
                style={[styles.submitButton, !title.trim() && styles.disabledButton]}
                onPress={handleCreate}
                disabled={!title.trim() || createTaskMutation.isPending || createCollectionMutation.isPending}
              >
                <Text style={styles.submitText}>Criar</Text>
              </TouchableOpacity>
            </View>

            {showPriorityPicker && (
              <View style={styles.priorityPicker}>
                {(["LOW", "MEDIUM", "HIGH"] as Priority[]).map((p) => (
                  <TouchableOpacity 
                    key={p} 
                    style={[styles.priorityOption, priority === p && { backgroundColor: "rgba(94, 129, 172, 0.1)" }]}
                    onPress={() => {
                      setPriority(p);
                      setShowPriorityPicker(false);
                    }}
                  >
                    <Flag size={18} color={getColorForPriority(p)} weight={priority === p ? "fill" : "regular"} />
                    <Text style={[styles.priorityOptionText, { color: priority === p ? getColorForPriority(p) : colors.dark.mutedForeground }]}>
                      {p}
                    </Text>
                    {priority === p && <Check size={16} color={getColorForPriority(p)} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const getColorForPriority = (priority: Priority) => {
  switch (priority) {
    case "HIGH": return colors.dark.destructive;
    case "MEDIUM": return colors.dark.warning;
    case "LOW": return colors.dark.primary;
    default: return colors.dark.mutedForeground;
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: colors.dark.card,
    width: "100%",
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.dark.foreground,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: 56,
    color: colors.dark.foreground,
    fontFamily: typography.fonts.medium,
    fontSize: 16,
  },
  colorPickerWrapper: {
    marginTop: spacing.xl,
  },
  label: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.mutedForeground,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  options: {
    flexDirection: "row",
    gap: spacing.md,
  },
  optionBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    justifyContent: "center",
    alignItems: "center",
  },
  activeOptionBtn: {
    backgroundColor: "rgba(94, 129, 172, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(94, 129, 172, 0.2)",
  },
  priorityPicker: {
    position: "absolute",
    bottom: 80,
    left: spacing.xl,
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 100,
  },
  priorityOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    gap: spacing.sm,
    width: 160,
  },
  priorityOptionText: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: spacing.xl,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    fontFamily: typography.fonts.bold,
    color: colors.dark.foreground,
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: colors.dark.muted,
  },
});
