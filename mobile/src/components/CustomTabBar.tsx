import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, spacing, typography } from "../theme/theme";
import { 
  SquaresFour, 
  CheckCircle, 
  FolderSimple, 
  UserCircle, 
  Plus,
  Target
} from "phosphor-react-native";

import { useQuickAddStore } from "../hooks/use-quick-add-store";
import { useNavigationStore } from "../hooks/use-navigation-store";

const { width } = Dimensions.get("window");

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const quickAdd = useQuickAddStore();
  const { activeContext, currentCollectionId } = useNavigationStore();
  
  // In newer React Navigation, visibility is often handled via display or by not rendering the tab bar at all in specific screens.
  // If you need to hide it, you usually do it in the screen options.

  const handlePlusPress = () => {
    if (activeContext === "COLLECTION_RESOURCE") {
      quickAdd.open("RESOURCE", currentCollectionId || undefined);
    } else if (activeContext === "COLLECTION_TASK") {
      quickAdd.open("TASK", currentCollectionId || undefined);
    } else {
      quickAdd.open("TASK");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const options = descriptors[route.key].options as any;
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = getIcon(route.name);

          return (
            <React.Fragment key={route.key}>
              {/* Insert FAB after the second tab */}
              {index === 2 && (
                <View style={styles.fabWrapper}>
                  <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.8}
                    onPress={handlePlusPress}
                  >
                    <Plus size={28} color={colors.dark.primaryForeground} weight="bold" />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                style={styles.tabItem}
              >
                {isFocused && <View style={styles.activeIndicator} />}
                <Icon 
                  size={24} 
                  color={isFocused ? colors.dark.primary : colors.dark.mutedForeground} 
                  weight={isFocused ? "duotone" : "regular"} 
                />
                <Text style={[
                  styles.label, 
                  { color: isFocused ? colors.dark.primary : colors.dark.mutedForeground }
                ]}>
                  {typeof label === 'string' ? label : route.name}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const getIcon = (routeName: string) => {
  switch (routeName) {
    case "Tasks": return CheckCircle;
    case "Collections": return FolderSimple;
    case "Objectives": return Target;
    case "Dashboard": return SquaresFour;
    case "Profile": return UserCircle;
    default: return SquaresFour;
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: width,
    backgroundColor: "transparent",
    elevation: 0,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.dark.card,
    height: 85,
    paddingBottom: Platform.OS === "ios" ? 25 : 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    position: "relative",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: "100%",
  },
  activeIndicator: {
    position: "absolute",
    top: -1,
    width: 24,
    height: 3,
    backgroundColor: colors.dark.primary,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  label: {
    fontSize: 10,
    fontFamily: typography.fonts.medium,
  },
  fabWrapper: {
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    // This moves the wrapper up so the FAB protrudes
    marginTop: -45,
    zIndex: 100,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dark.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: colors.dark.card,
  },
});
