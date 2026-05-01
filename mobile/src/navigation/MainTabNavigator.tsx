import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DashboardScreen } from "../screens/DashboardScreen";
import { TasksScreen } from "../screens/TasksScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { CollectionsScreen } from "../screens/CollectionsScreen";
import { CollectionDetailsScreen } from "../screens/CollectionDetailsScreen";
import { ItemDetailScreen } from "../screens/ItemDetailScreen";
import { ObjectivesScreen } from "../screens/ObjectivesScreen";
import { CustomTabBar } from "../components/CustomTabBar";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TasksStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TasksList" component={TasksScreen} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
    </Stack.Navigator>
  );
};

const CollectionStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CollectionsList" component={CollectionsScreen} />
      <Stack.Screen name="CollectionDetails" component={CollectionDetailsScreen} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
    </Stack.Navigator>
  );
};

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Tasks"
      tabBar={(props: any) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Tasks"
        component={TasksStack}
        options={{
          tabBarLabel: "Tarefas",
        }}
      />
      <Tab.Screen
        name="Collections"
        component={CollectionStack}
        options={{
          tabBarLabel: "Coleções",
        }}
      />
      <Tab.Screen
        name="Objectives"
        component={ObjectivesScreen}
        options={{
          tabBarLabel: "Metas",
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Início",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
};
