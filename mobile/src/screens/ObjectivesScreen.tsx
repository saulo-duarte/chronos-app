import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal,
  TextInput,
  Alert
} from "react-native";
import { colors, spacing, typography } from "../theme/theme";
import { useObjectives, useCreateObjective, useUpdateObjective, useDeleteObjective } from "../hooks/use-objectives";
import { Target, Plus, Calendar, Trash, CheckCircle, X } from "phosphor-react-native";
import { Objective } from "../services/objective.service";

export const ObjectivesScreen = () => {
  const { data: objectives = [], isLoading } = useObjectives();
  const createMutation = useCreateObjective();
  const updateMutation = useUpdateObjective();
  const deleteMutation = useDeleteObjective();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newObjective, setNewObjective] = useState({
    title: "",
    description: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const handleCreate = () => {
    if (!newObjective.title) {
      Alert.alert("Erro", "O título é obrigatório");
      return;
    }
    createMutation.mutate({
      title: newObjective.title,
      description: newObjective.description || undefined,
      target_month: newObjective.month,
      target_year: newObjective.year,
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setNewObjective({
          title: "",
          description: "",
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        });
      }
    });
  };

  const handleToggleStatus = (obj: Objective) => {
    updateMutation.mutate({
      id: obj.id,
      dto: { status: obj.status === "DONE" ? "PENDING" : "DONE" }
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Excluir Objetivo",
      "Tem certeza que deseja excluir este objetivo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => deleteMutation.mutate(id) }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Meus Objetivos</Text>
          <Text style={styles.subtitle}>Metas de longo prazo</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsModalOpen(true)}
        >
          <Plus size={24} color={colors.dark.background} weight="bold" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={objectives}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Target size={64} color={colors.dark.mutedForeground} weight="thin" />
            <Text style={styles.emptyText}>Nenhum objetivo definido ainda.</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => setIsModalOpen(true)}>
              <Text style={styles.emptyButtonText}>Começar agora</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, item.status === "DONE" && styles.cardDone]}>
            <TouchableOpacity 
              style={styles.statusToggle}
              onPress={() => handleToggleStatus(item)}
            >
              {item.status === "DONE" ? (
                <CheckCircle size={28} color={colors.dark.primary} weight="fill" />
              ) : (
                <CheckCircle size={28} color={colors.dark.mutedForeground} weight="thin" />
              )}
            </TouchableOpacity>
            
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, item.status === "DONE" && styles.textDone]} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.dateBadge}>
                  <Calendar size={12} color={colors.dark.primary} weight="fill" />
                  <Text style={styles.dateText}>
                    {item.target_month}/{item.target_year}
                  </Text>
                </View>
              </View>
              {item.description && (
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>

            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Trash size={20} color={colors.dark.destructive} />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Objetivo</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X size={24} color={colors.dark.foreground} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Aprender Alemão"
                placeholderTextColor={colors.dark.mutedForeground}
                value={newObjective.title}
                onChangeText={(text) => setNewObjective({...newObjective, title: text})}
              />

              <Text style={styles.label}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Mais detalhes sobre seu objetivo..."
                placeholderTextColor={colors.dark.mutedForeground}
                multiline
                numberOfLines={3}
                value={newObjective.description}
                onChangeText={(text) => setNewObjective({...newObjective, description: text})}
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={styles.label}>Mês</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={newObjective.month.toString()}
                    onChangeText={(text) => setNewObjective({...newObjective, month: parseInt(text) || 1})}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={styles.label}>Ano</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={newObjective.year.toString()}
                    onChangeText={(text) => setNewObjective({...newObjective, year: parseInt(text) || 2024})}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleCreate}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <ActivityIndicator color={colors.dark.background} />
                ) : (
                  <Text style={styles.submitButtonText}>Criar Objetivo</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    paddingTop: spacing.xl,
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.card,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardDone: {
    opacity: 0.6,
  },
  statusToggle: {
    marginRight: spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.dark.foreground,
    flex: 1,
    marginRight: spacing.sm,
  },
  textDone: {
    textDecorationLine: "line-through",
    color: colors.dark.mutedForeground,
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  dateText: {
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    color: colors.dark.primary,
  },
  cardDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.dark.mutedForeground,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontFamily: typography.fonts.medium,
    fontSize: 16,
    color: colors.dark.mutedForeground,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  emptyButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.dark.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.dark.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    maxHeight: "80%",
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
  modalBody: {
    gap: spacing.md,
  },
  label: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.dark.foreground,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: spacing.md,
    color: colors.dark.foreground,
    fontFamily: typography.fonts.regular,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
  },
  submitButton: {
    backgroundColor: colors.dark.primary,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  submitButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.dark.background,
  },
});
