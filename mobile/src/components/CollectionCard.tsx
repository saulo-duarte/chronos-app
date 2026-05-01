import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Collection } from "../types";
import { colors, spacing, typography } from "../theme/theme";
import { FolderSimple, CaretRight } from "phosphor-react-native";

interface CollectionCardProps {
  collection: Collection;
  onPress: (collection: Collection) => void;
  taskCount?: number;
  resourceCount?: number;
}

export const CollectionCard = ({ 
  collection, 
  onPress, 
  taskCount = 0, 
  resourceCount = 0 
}: CollectionCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(collection)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: collection.color || colors.dark.primary }]}>
        <FolderSimple size={24} color={colors.dark.primaryForeground} weight="duotone" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{collection.title}</Text>
        <Text style={styles.subtitle}>
          {`${taskCount} ${taskCount === 1 ? "tarefa" : "tarefas"} • ${resourceCount} ${resourceCount === 1 ? "recurso" : "recursos"}`}
        </Text>
      </View>

      <CaretRight size={20} color={colors.dark.mutedForeground} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.card,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.dark.foreground,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.dark.mutedForeground,
    marginTop: 2,
  },
});
