import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { colors, spacing, typography } from "../theme/theme";
import { Clock, SignOut, UserCircle } from "phosphor-react-native";
import { useMe, useLogout } from "../hooks/use-auth";

export const ProfileScreen = () => {
  const { data: user } = useMe();
  const { mutate: logout } = useLogout();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Clock size={48} color={colors.dark.primary} weight="duotone" />
          <Text style={styles.title}>Chronos</Text>
        </View>

        <View style={styles.profileCard}>
          <UserCircle size={80} color={colors.dark.mutedForeground} weight="thin" />
          <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sessão Ativa</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => logout()}
          activeOpacity={0.7}
        >
          <SignOut size={22} color={colors.dark.destructive} weight="bold" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Ambiente: Mobile Web (8081)</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    paddingTop: spacing.lg,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 24,
    color: colors.dark.foreground,
    marginTop: spacing.xs,
  },
  profileCard: {
    width: "100%",
    backgroundColor: colors.dark.card,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: spacing.xl,
  },
  userName: {
    fontFamily: typography.fonts.bold,
    fontSize: 22,
    color: colors.dark.foreground,
    marginTop: spacing.md,
  },
  userEmail: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.dark.mutedForeground,
    marginTop: spacing.xs,
  },
  badge: {
    backgroundColor: "rgba(94, 129, 172, 0.1)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 100,
    marginTop: spacing.lg,
  },
  badgeText: {
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    color: colors.dark.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.destructive + "33", // transparency
  },
  logoutText: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.dark.destructive,
  },
  footer: {
    marginTop: spacing.xxl,
    fontFamily: typography.fonts.medium,
    fontSize: 10,
    color: "rgba(148, 163, 184, 0.2)",
  },
});
