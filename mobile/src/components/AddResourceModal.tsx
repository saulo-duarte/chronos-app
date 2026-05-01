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
  Pressable,
  ActivityIndicator
} from "react-native";
import { colors, spacing, typography } from "../theme/theme";
import { X, Link as LinkIcon, File as FileIcon, Tag as TagIcon, Upload } from "phosphor-react-native";
import { useCreateResource } from "../hooks/use-resources";
import { useQuickAddStore } from "../hooks/use-quick-add-store";
import * as DocumentPicker from "expo-document-picker";

const { width } = Dimensions.get("window");

export const AddResourceModal = () => {
  const { isOpen, type, collectionId, close } = useQuickAddStore();
  const [resourceType, setResourceType] = useState<"LINK" | "FILE">("LINK");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState("");
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  
  const createResourceMutation = useCreateResource();

  useEffect(() => {
    if (isOpen && type === "RESOURCE") {
      setResourceType("LINK");
      setTitle("");
      setDescription("");
      setUrl("");
      setTag("");
      setSelectedFile(null);
    }
  }, [isOpen, type]);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result);
        if (!title) {
          setTitle(result.assets[0].name);
        }
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const handleCreate = async () => {
    if (!collectionId) return;

    if (resourceType === "LINK") {
      if (!title.trim() || !url.trim()) return;
      createResourceMutation.mutate(
        {
          collection_id: collectionId,
          title: title.trim(),
          description: description.trim(),
          tag: tag.trim() || undefined,
          path: url.trim(),
          type: "LINK",
          size: 0,
        },
        { onSuccess: close }
      );
    } else {
      if (!selectedFile || selectedFile.canceled) return;
      
      const file = selectedFile.assets[0];
      const formData = new FormData();
      formData.append("collection_id", collectionId);
      formData.append("title", title.trim() || file.name);
      formData.append("description", description.trim());
      if (tag.trim()) formData.append("tag", tag.trim());
      formData.append("type", "FILE");
      
      // Axios expects this structure for React Native file uploads
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream",
      } as any);

      createResourceMutation.mutate(formData as any, { onSuccess: close });
    }
  };

  if (!isOpen || type !== "RESOURCE") return null;

  return (
    <Modal
      visible={isOpen && type === "RESOURCE"}
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
              <Text style={styles.headerTitle}>Novo Resource</Text>
              <TouchableOpacity onPress={close} style={styles.closeButton}>
                <X size={20} color={colors.dark.mutedForeground} />
              </TouchableOpacity>
            </View>

            <View style={styles.tabs}>
              <TouchableOpacity 
                style={[styles.tab, resourceType === "LINK" && styles.activeTab]} 
                onPress={() => setResourceType("LINK")}
              >
                <LinkIcon size={20} color={resourceType === "LINK" ? colors.dark.primary : colors.dark.mutedForeground} />
                <Text style={[styles.tabText, resourceType === "LINK" && styles.activeTabText]}>Link</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, resourceType === "FILE" && styles.activeTab]} 
                onPress={() => setResourceType("FILE")}
              >
                <FileIcon size={20} color={resourceType === "FILE" ? colors.dark.primary : colors.dark.mutedForeground} />
                <Text style={[styles.tabText, resourceType === "FILE" && styles.activeTabText]}>Arquivo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {resourceType === "LINK" ? (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>URL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://exemplo.com"
                    placeholderTextColor={colors.dark.mutedForeground}
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                  />
                </View>
              ) : (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Arquivo</Text>
                  <TouchableOpacity style={styles.uploadButton} onPress={handlePickDocument}>
                    <Upload size={24} color={colors.dark.primary} />
                    <Text style={styles.uploadText}>
                      {selectedFile && !selectedFile.canceled ? selectedFile.assets[0].name : "Selecionar arquivo"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome do resource"
                  placeholderTextColor={colors.dark.mutedForeground}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição (opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Sobre o que é este resource?"
                  placeholderTextColor={colors.dark.mutedForeground}
                  multiline
                  numberOfLines={3}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tag (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Documentação, Estudo..."
                  placeholderTextColor={colors.dark.mutedForeground}
                  value={tag}
                  onChangeText={setTag}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity 
                style={[styles.submitButton, (resourceType === "LINK" ? !url || !title : !selectedFile) && styles.disabledButton]}
                onPress={handleCreate}
                disabled={createResourceMutation.isPending}
              >
                {createResourceMutation.isPending ? (
                  <ActivityIndicator color={colors.dark.foreground} />
                ) : (
                  <Text style={styles.submitText}>Adicionar</Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
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
  tabs: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
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
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.dark.mutedForeground,
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 48,
    color: colors.dark.foreground,
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  textArea: {
    height: 80,
    paddingTop: spacing.sm,
    textAlignVertical: "top",
  },
  uploadButton: {
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(94, 129, 172, 0.05)",
  },
  uploadText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.dark.mutedForeground,
    paddingHorizontal: spacing.md,
    textAlign: "center",
  },
  footer: {
    marginTop: spacing.xl,
  },
  submitButton: {
    backgroundColor: colors.dark.primary,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    fontFamily: typography.fonts.bold,
    color: colors.dark.foreground,
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
