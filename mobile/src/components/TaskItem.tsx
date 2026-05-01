import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Task, Status, Priority } from "../types";
import { colors, spacing, typography } from "../theme/theme";
import { 
  CheckCircle, 
  Calendar, 
  Trash 
} from "phosphor-react-native";
import Reanimated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  runOnJS
} from "react-native-reanimated";
import { 
  Gesture, 
  GestureDetector 
} from "react-native-gesture-handler";

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, currentStatus: Status) => void;
  onDelete: (id: string) => void;
  onPress: (task: Task) => void;
  onLongPress: (task: Task) => void;
}

const SWIPE_THRESHOLD = -80;

export const TaskItem = ({ 
  task, 
  onToggleStatus, 
  onDelete, 
  onPress,
  onLongPress
}: TaskItemProps) => {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      // Only allow swiping to the left
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < SWIPE_THRESHOLD) {
        translateX.value = withSpring(SWIPE_THRESHOLD);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteOpacity = useAnimatedStyle(() => ({
    opacity: translateX.value < -40 ? 1 : 0,
  }));

  const handleToggle = () => {
    onToggleStatus(task.id, task.status);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "HIGH": return colors.dark.destructive;
      case "MEDIUM": return colors.dark.warning;
      case "LOW": return colors.dark.primary;
      default: return colors.dark.mutedForeground;
    }
  };

  return (
    <View style={styles.container}>
      <Reanimated.View style={[styles.deleteButton, deleteOpacity]}>
        <Pressable 
          onPress={() => onDelete(task.id)}
          style={styles.deletePressable}
        >
          <Trash size={24} color={colors.dark.destructive} weight="bold" />
        </Pressable>
      </Reanimated.View>

      <GestureDetector gesture={panGesture}>
        <Reanimated.View style={[styles.taskCard, animatedStyle]}>
          <Pressable 
            onPress={() => onPress(task)}
            onLongPress={() => onLongPress(task)}
            delayLongPress={300}
            style={styles.content}
          >
            <Pressable onPress={handleToggle} style={styles.checkContainer}>
              {task.status === "DONE" ? (
                <CheckCircle size={24} color={colors.dark.success} weight="fill" />
              ) : (
                <CheckCircle size={24} color={colors.dark.mutedForeground} weight="thin" />
              )}
            </Pressable>

            <View style={styles.info}>
              <Text 
                style={[
                  styles.title,
                  task.status === "DONE" && styles.completedText
                ]}
                numberOfLines={1}
              >
                {task.title}
              </Text>
              <View style={styles.meta}>
                <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(task.priority)}20` }]}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                  <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                    {task.priority}
                  </Text>
                </View>
                <View style={styles.dateInfo}>
                  <Calendar size={12} color={colors.dark.mutedForeground} />
                  <Text style={styles.dateText}>
                    {new Date(task.start_time).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Reanimated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
    marginHorizontal: spacing.sm,
    position: "relative",
  },
  taskCard: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    zIndex: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
  },
  checkContainer: {
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.dark.foreground,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: colors.dark.mutedForeground,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    gap: 4,
  },
  priorityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  priorityText: {
    fontFamily: typography.fonts.bold,
    fontSize: 8,
    textTransform: "uppercase",
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.dark.mutedForeground,
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  deletePressable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
