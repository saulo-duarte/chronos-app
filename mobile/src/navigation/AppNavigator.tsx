import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabNavigator } from "./MainTabNavigator";
import { LoginScreen } from "../screens/LoginScreen";
import { QuickAddModal } from "../components/QuickAddModal";
import { AddResourceModal } from "../components/AddResourceModal";
import { colors } from "../theme/theme";
import { useMe } from "../hooks/use-auth";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTaskNotifications } from "../hooks/use-task-notifications";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { data: user, isLoading } = useMe();

  // Sync notifications — hook is safe to call always;
  // it no-ops when there are no tasks
  useTaskNotifications();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.dark.background },
        }}
      >
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
      {user && (
        <>
          <QuickAddModal />
          <AddResourceModal />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
});
