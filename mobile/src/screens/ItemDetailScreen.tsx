import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  TextInput,
  Modal,
  Platform,
  Dimensions,
  ActivityIndicator
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, spacing, typography } from "../theme/theme";
import { stringToColor } from "../utils/color";
import { 
  CaretLeft, 
  Trash, 
  CheckCircle, 
  Calendar, 
  Flag,
  Globe,
  FileText,
  Tag as TagIcon,
  Check,
  X
} from "phosphor-react-native";
import { useDeleteTask, useUpdateTask } from "../hooks/use-tasks";
import { useDeleteResource, useUpdateResource } from "../hooks/use-resources";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const ItemDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { item, type } = route.params; // type: 'TASK' | 'RESOURCE'

  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || "");
  const [priority, setPriority] = useState(item.priority || "MEDIUM");
  const [startTime, setStartTime] = useState(item.start_time ? new Date(item.start_time) : new Date());
  const [tag, setTag] = useState(item.tag || "");
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);

  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();
  const deleteResourceMutation = useDeleteResource();
  const updateResourceMutation = useUpdateResource();

  const handleDelete = () => {
    Alert.alert(
      "Excluir Item",
      "Tem certeza que deseja excluir permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: () => {
            if (type === "TASK") {
              deleteTaskMutation.mutate(item.id, {
                onSuccess: () => navigation.goBack()
              });
            } else {
              deleteResourceMutation.mutate(item.id, {
                onSuccess: () => navigation.goBack()
              });
            }
          }
        }
      ]
    );
  };

  const handleUpdate = () => {
    if (type === "TASK") {
      updateTaskMutation.mutate({ 
        id: item.id, 
        dto: { 
          title, 
          description,
          priority,
          start_time: startTime.toISOString()
        } 
      }, {
        onSuccess: () => Alert.alert("Sucesso", "Tarefa atualizada!")
      });
    } else {
      updateResourceMutation.mutate({ 
        id: item.id, 
        dto: { title, description, tag: tag || undefined } 
      }, {
        onSuccess: () => Alert.alert("Sucesso", "Recurso atualizado!")
      });
    }
  };

  const getPriorityColor = (p: any) => {
    switch (p) {
      case "HIGH": return colors.dark.destructive;
      case "MEDIUM": return colors.dark.warning;
      case "LOW": return colors.dark.primary;
      default: return colors.dark.mutedForeground;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <CaretLeft size={24} color={colors.dark.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash size={22} color={colors.dark.destructive} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconHeader}>
          <View style={[styles.mainIcon, { backgroundColor: "rgba(94, 129, 172, 0.1)" }]}>
            {type === "TASK" ? (
               <CheckCircle size={40} color={colors.dark.primary} weight="duotone" />
            ) : (
               item.type === "LINK" ? (
                 <Globe size={40} color={colors.dark.primary} weight="duotone" />
               ) : (
                 <FileText size={40} color={colors.dark.primary} weight="duotone" />
               )
            )}
          </View>
        </View>

        <View style={styles.form}>
           <Text style={styles.label}>Título</Text>
           <View style={styles.inputWrapper}>
             <TextInput
               style={styles.titleInput}
               value={title}
               onChangeText={setTitle}
               placeholder="Título do item"
               placeholderTextColor={colors.dark.mutedForeground}
               onBlur={handleUpdate}
             />
           </View>

           <Text style={styles.label}>Descrição</Text>
           <View style={[styles.inputWrapper, { minHeight: 120 }]}>
             <TextInput
               style={styles.descriptionInput}
               value={description}
               onChangeText={setDescription}
               placeholder="Adicione uma descrição detalhada..."
               placeholderTextColor={colors.dark.mutedForeground}
               multiline
               onBlur={handleUpdate}
             />
           </View>

           {type === "TASK" && (
             <View style={styles.metaSection}>
                <Text style={styles.label}>Informações</Text>
                
                <TouchableOpacity 
                   style={[styles.metaRow, { borderColor: `${getPriorityColor(priority)}20` }]}
                   onPress={() => setIsPriorityModalOpen(true)}
                 >
                   <Flag size={20} color={getPriorityColor(priority)} weight="fill" />
                   <View style={{ flex: 1 }}>
                     <Text style={[styles.metaLabel, { color: getPriorityColor(priority) }]}>Prioridade {priority}</Text>
                   </View>
                   <CaretLeft size={16} color={colors.dark.mutedForeground} style={{ transform: [{ rotate: "180deg" }] }} />
                </TouchableOpacity>

                <TouchableOpacity 
                   style={styles.metaRow}
                   onPress={() => setShowDatePicker(true)}
                 >
                   <Calendar size={20} color={colors.dark.mutedForeground} />
                   <View style={{ flex: 1 }}>
                    <Text style={styles.metaLabel}>Data: {startTime.toLocaleDateString("pt-BR")}</Text>
                   </View>
                   <CaretLeft size={16} color={colors.dark.mutedForeground} style={{ transform: [{ rotate: "180deg" }] }} />
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setStartTime(selectedDate);
                        // Save immediately after state update
                        updateTaskMutation.mutate({ 
                          id: item.id, 
                          dto: { 
                            title, 
                            description,
                            priority,
                            start_time: selectedDate.toISOString()
                          } 
                        });
                      }
                    }}
                  />
                )}
             </View>
           )}

           {type === "RESOURCE" && (
             <View style={styles.tagSection}>
               <Text style={styles.label}>Tag</Text>
               <View style={styles.inputWrapper}>
                 <TextInput
                   style={styles.titleInput}
                   value={tag}
                   onChangeText={setTag}
                   placeholder="Ex: Documentação..."
                   placeholderTextColor={colors.dark.mutedForeground}
                   onBlur={handleUpdate}
                 />
               </View>
               {item.tag && (
                 <View style={[styles.tagBadge, { backgroundColor: stringToColor(item.tag, 0.1), borderColor: stringToColor(item.tag, 0.3), marginTop: spacing.xs }]}>
                   <TagIcon size={20} color={stringToColor(item.tag)} weight="fill" />
                   <Text style={[styles.tagLabel, { color: stringToColor(item.tag) }]}>{item.tag}</Text>
                 </View>
               )}
             </View>
           )}
           
           <TouchableOpacity 
             style={[styles.saveButton, (updateTaskMutation.isPending || updateResourceMutation.isPending) && { opacity: 0.7 }]} 
             onPress={handleUpdate}
             disabled={updateTaskMutation.isPending || updateResourceMutation.isPending}
           >
             {updateTaskMutation.isPending || updateResourceMutation.isPending ? (
               <ActivityIndicator color={colors.dark.foreground} />
             ) : (
               <Text style={styles.saveButtonText}>Salvar Alterações</Text>
             )}
           </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Priority Picker Modal */}
      <Modal
        visible={isPriorityModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPriorityModalOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsPriorityModalOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Prioridade</Text>
              <TouchableOpacity onPress={() => setIsPriorityModalOpen(false)}>
                <X size={24} color={colors.dark.mutedForeground} />
              </TouchableOpacity>
            </View>

            {["HIGH", "MEDIUM", "LOW"].map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityOption,
                  priority === p && styles.activePriorityOption
                ]}
                onPress={() => {
                   setPriority(p as any);
                  setIsPriorityModalOpen(false);
                  // Save immediately
                  if (type === "TASK") {
                    updateTaskMutation.mutate({ 
                      id: item.id, 
                      dto: { title, description, priority: p as any, start_time: startTime.toISOString() } 
                    });
                  }
                }}
              >
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(p) }]} />
                <Text style={[
                  styles.priorityText,
                  priority === p && styles.activePriorityText
                ]}>
                  {p === "HIGH" ? "Alta" : p === "MEDIUM" ? "Média" : "Baixa"}
                </Text>
                {priority === p && <Check size={20} color={colors.dark.primary} weight="bold" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.dark.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.dark.foreground,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  iconHeader: {
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  mainIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
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
    marginBottom: -8,
  },
  inputWrapper: {
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  titleInput: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.dark.foreground,
    minHeight: 48,
  },
  descriptionInput: {
    fontFamily: typography.fonts.regular,
    fontSize: 15,
    color: colors.dark.foreground,
    minHeight: 100,
    textAlignVertical: "top",
    lineHeight: 22,
    paddingTop: spacing.sm,
  },
  metaSection: {
    gap: spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.card,
    padding: spacing.md,
    borderRadius: 16,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  metaLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.foreground,
  },
  tagSection: {
    gap: spacing.md,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.sm,
    alignSelf: "flex-start",
    borderWidth: 1,
  },
  tagLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: colors.dark.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.dark.foreground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.dark.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.dark.foreground,
  },
  priorityOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activePriorityOption: {
    backgroundColor: "rgba(94, 129, 172, 0.1)",
    borderColor: colors.dark.primary,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  priorityText: {
    flex: 1,
    fontFamily: typography.fonts.medium,
    fontSize: 16,
    color: colors.dark.mutedForeground,
  },
  activePriorityText: {
    color: colors.dark.foreground,
    fontFamily: typography.fonts.bold,
  },
});
