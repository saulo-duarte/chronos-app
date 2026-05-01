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

const { height } = Dimensions.get("window");

interface ResourceFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: "ALL" | "FILE" | "LINK";
  setTypeFilter: (filter: "ALL" | "FILE" | "LINK") => void;
  tagFilter: string;
  setTagFilter: (tag: string) => void;
  availableTags?: string[];
}

export const ResourceFiltersModal = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  tagFilter,
  setTagFilter,
  availableTags = []
}: ResourceFiltersModalProps) => {
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
              <Text style={styles.headerTitle}>Filtros de Recursos</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.dark.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Buscar por título</Text>
              <View style={styles.searchBar}>
                <MagnifyingGlass size={20} color={colors.dark.mutedForeground} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Ex: Documento..."
                  placeholderTextColor={colors.dark.mutedForeground}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Filtrar por Tag</Text>
              {availableTags.length === 0 ? (
                <Text style={styles.noTagsText}>Nenhuma tag encontrada nesta coleção.</Text>
              ) : (
                <View style={styles.tagsContainer}>
                  {availableTags.map((tag) => {
                    const isSelected = tagFilter === tag;
                    return (
                      <TouchableOpacity
                        key={tag}
                        style={[
                          styles.tagChip,
                          isSelected && styles.activeTagChip
                        ]}
                        onPress={() => setTagFilter(isSelected ? "" : tag)}
                      >
                        <Text style={[
                          styles.tagChipText,
                          isSelected && styles.activeTagChipText
                        ]}>
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Tipo de Recurso</Text>
              <View style={styles.typeOptionsRow}>
                {["FILE", "LINK"].map((type) => {
                  const isActive = typeFilter === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeToggleButton,
                        isActive && styles.activeTypeToggleButton
                      ]}
                      onPress={() => setTypeFilter(isActive ? "ALL" : type as any)}
                    >
                      <Text style={[
                        styles.typeToggleText,
                        isActive && styles.activeTypeToggleText
                      ]}>
                        {type === "FILE" ? "Arquivos" : "Links"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
  typeOptionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  typeToggleButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeTypeToggleButton: {
    backgroundColor: "rgba(94, 129, 172, 0.1)",
    borderColor: colors.dark.primary,
  },
  typeToggleText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.mutedForeground,
  },
  activeTypeToggleText: {
    color: colors.dark.primary,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tagChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeTagChip: {
    backgroundColor: "rgba(94, 129, 172, 0.1)",
    borderColor: colors.dark.primary,
  },
  tagChipText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.dark.mutedForeground,
  },
  activeTagChipText: {
    color: colors.dark.primary,
    fontFamily: typography.fonts.bold,
  },
  noTagsText: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.dark.mutedForeground,
    fontStyle: "italic",
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
