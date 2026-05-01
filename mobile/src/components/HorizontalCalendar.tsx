import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { colors, spacing, typography } from "../theme/theme";

interface HorizontalCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const { width } = Dimensions.get("window");

export const HorizontalCalendar = ({ selectedDate, onSelectDate }: HorizontalCalendarProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Generate 45 days: 14 days before today, 30 days after
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 45 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + (i - 14));
    return d;
  });

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  useEffect(() => {
    // Scroll to the selected date roughly (since each item is about 64px width + gap)
    const index = days.findIndex(d => isSameDay(d, selectedDate));
    if (index !== -1 && scrollViewRef.current) {
      // 56 item width + 8 gap = 64
      const x = (index * 64) - (width / 2) + 32;
      scrollViewRef.current.scrollTo({ x: x > 0 ? x : 0, animated: true });
    }
  }, [selectedDate]);

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                styles.dayButton,
                isSelected && styles.dayButtonSelected
              ]}
              onPress={() => onSelectDate(date)}
            >
              <Text style={[
                styles.dayName,
                isSelected && styles.dayNameSelected
              ]}>
                {formatDayName(date)}
              </Text>
              <Text style={[
                styles.dayNumber,
                isSelected && styles.dayNumberSelected
              ]}>
                {date.getDate()}
              </Text>
              {isToday && !isSelected && (
                <View style={styles.todayIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  dayButton: {
    width: 56,
    height: 80,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  dayButtonSelected: {
    backgroundColor: colors.dark.primary,
    borderColor: colors.dark.primary,
    transform: [{ scale: 1.05 }],
  },
  dayName: {
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    color: colors.dark.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 4,
  },
  dayNameSelected: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  dayNumber: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.dark.foreground,
  },
  dayNumberSelected: {
    color: colors.dark.foreground,
  },
  todayIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dark.primary,
    marginTop: 4,
  },
});
