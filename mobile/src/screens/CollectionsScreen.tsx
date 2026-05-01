import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity 
} from "react-native";
import { useCollections } from "../hooks/use-collections";
import { useTasks } from "../hooks/use-tasks";
import { useResources } from "../hooks/use-resources";
import { CollectionCard } from "../components/CollectionCard";
import { colors, spacing, typography } from "../theme/theme";
import { Collection } from "../types";
import { FolderOpen } from "phosphor-react-native";

export const CollectionsScreen = ({ navigation }: any) => {
  const { data: collections = [], isLoading } = useCollections();
  const { data: tasks = [] } = useTasks();
  const { data: resources = [] } = useResources();
  
  const handleCollectionPress = (collection: Collection) => {
    navigation.navigate("CollectionDetails", { collectionId: collection.id, title: collection.title });
  };

  const getTaskCount = (collectionId: string) => {
    return tasks.filter((t) => t.collection_id === collectionId).length;
  };

  const getResourceCount = (collectionId: string) => {
    return resources.filter((r) => r.collection_id === collectionId).length;
  };

  const sortedCollections = [...collections].sort((a, b) => 
    a.title.localeCompare(b.title)
  );

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
          <Text style={styles.title}>Minhas Coleções</Text>
          <Text style={styles.subtitle}>{collections.length} coleções organizadas</Text>
        </View>
      </View>

      <FlatList
        data={sortedCollections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CollectionCard 
            collection={item} 
            onPress={handleCollectionPress}
            taskCount={getTaskCount(item.id)}
            resourceCount={getResourceCount(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FolderOpen size={48} color={colors.dark.mutedForeground} weight="duotone" />
            <Text style={styles.emptyText}>Você ainda não tem coleções.</Text>
            <Text style={styles.emptySubtext}>Crie uma para organizar suas tarefas e recursos.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    paddingTop: spacing.lg, // Increased top margin as requested
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
    marginBottom: spacing.md,
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
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(94, 129, 172, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100, // Room for FAB
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: "center",
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.dark.foreground,
    textAlign: "center",
  },
  emptySubtext: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.dark.mutedForeground,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
