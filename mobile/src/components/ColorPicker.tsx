import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { colors, spacing } from "../theme/theme";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorPicker = ({ selectedColor, onColorSelect }: ColorPickerProps) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {colors.collectionColors.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => onColorSelect(color)}
          style={[
            styles.colorCircle,
            { backgroundColor: color },
            selectedColor === color && styles.selectedCircle
          ]}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCircle: {
    borderColor: colors.dark.foreground,
    transform: [{ scale: 1.1 }],
  },
});
