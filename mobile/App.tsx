import React, { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Lora_400Regular,
  Lora_700Bold,
} from "@expo-google-fonts/lora";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { queryClient } from "./src/lib/queryClient";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { navigationRef } from "./src/lib/navigation-ref";
import { colors, layout } from "./src/theme/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Task } from "./src/types";

export default function App() {
  const [fontsLoaded] = useFonts({
    Lora_400Regular,
    Lora_700Bold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // ─── Notification tap handler ─────────────────────────────────────
  useEffect(() => {
    // Handle notification tapped while app is running (foreground/background)
    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationNavigation(response);
      });

    // Handle notification that opened the app from killed state
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationNavigation(response);
      }
    });

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <View style={{ flex: 1, backgroundColor: colors.dark.background, paddingTop: layout.topMargin }}>
            <NavigationContainer ref={navigationRef}>
              <StatusBar style="light" />
              <AppNavigator />
            </NavigationContainer>
          </View>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

// ─── Navigation helper ──────────────────────────────────────────────
function handleNotificationNavigation(
  response: Notifications.NotificationResponse
): void {
  const data = response.notification.request.content.data;

  if (!data?.screen || data.screen !== "ItemDetail") return;

  // Parse the task item from the notification data
  let item: Task | null = null;
  try {
    item = typeof data.item === "string" ? JSON.parse(data.item) : data.item;
  } catch {
    return;
  }

  if (!item) return;

  // Small delay to ensure navigation container is mounted
  setTimeout(() => {
    if (!navigationRef.isReady()) return;

    // Navigate to Tasks tab first, then into ItemDetail
    navigationRef.navigate("Main" as never);

    // Use a nested navigate to reach ItemDetail inside the TasksStack
    setTimeout(() => {
      if (!navigationRef.isReady()) return;

      (navigationRef as any).navigate("Tasks", {
        screen: "ItemDetail",
        params: { item, type: "TASK" },
      });
    }, 100);
  }, 300);
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
});
