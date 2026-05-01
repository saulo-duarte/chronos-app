import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, typography } from "../theme/theme";
import { IconProps } from "phosphor-react-native";

interface StatCardProps {
  title: string;
  count: number;
  color: string;
  icon: React.ElementType<IconProps>;
  onPress?: () => void;
}

export const StatCard = ({
  title,
  count,
  color,
  icon: Icon,
  onPress,
}: StatCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${color}20` },
          ]}
        >
          <Icon size={20} color={color} weight="duotone" />
        </View>
        <Text style={styles.count}>{count}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    minWidth: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    width: "100%",
  },
  iconContainer: {
    padding: spacing.xs,
    borderRadius: 8,
  },
  count: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.dark.foreground,
  },
  title: {
    fontFamily: typography.fonts.medium,
    fontSize: 10,
    color: colors.dark.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
