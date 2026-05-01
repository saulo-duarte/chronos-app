import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { colors, spacing, typography } from "../theme/theme";
import { Clock, GoogleLogo, EnvelopeSimple, Lock, User as UserIcon } from "phosphor-react-native";
import { useLoginWithGoogle, useLoginWithEmail, useRegister } from "../hooks/use-auth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const { width, height } = Dimensions.get("window");

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export const LoginScreen = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { login: loginWithGoogle } = useLoginWithGoogle();
  
  const loginMutation = useLoginWithEmail();
  const registerMutation = useRegister();
  
  const isSubmitting = loginMutation.isPending || registerMutation.isPending;

  const currentSchema = mode === "login" ? loginSchema : registerSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    reset();
  };

  const onSubmit = (data: any) => {
    if (mode === "login") {
      loginMutation.mutate(data, {
        onError: (err: any) => {
          alert(`Erro ao entrar: ${err.message || "Credenciais inválidas"}`);
        }
      });
    } else {
      registerMutation.mutate(data, {
        onError: (err: any) => {
          alert(`Erro ao registrar: ${err.message || "Tente novamente mais tarde"}`);
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.blurBlob, styles.topBlob]} />
          <View style={[styles.blurBlob, styles.bottomBlob]} />

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Clock
                  size={32}
                  color={colors.dark.primaryForeground}
                  weight="fill"
                />
              </View>
              <Text style={styles.title}>Chronos</Text>
              <Text style={styles.subtitle}>Sua produtividade em outro nível</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>{mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</Text>
              <Text style={styles.cardSubtitle}>
                {mode === "login" ? "Acesse sua conta para continuar" : "Preencha os dados abaixo"}
              </Text>

              {mode === "register" && (
                <View style={styles.inputGroup}>
                  <View style={styles.inputContainer}>
                    <UserIcon size={20} color={colors.dark.mutedForeground} style={styles.inputIcon} />
                    <Controller
                      control={control}
                      name="name"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.input}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          placeholder="Seu nome"
                          placeholderTextColor={colors.dark.mutedForeground}
                          editable={!isSubmitting}
                        />
                      )}
                    />
                  </View>
                  {errors.name && <Text style={styles.errorText}>{errors.name.message as string}</Text>}
                </View>
              )}

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <EnvelopeSimple size={20} color={colors.dark.mutedForeground} style={styles.inputIcon} />
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="E-mail"
                        placeholderTextColor={colors.dark.mutedForeground}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isSubmitting}
                      />
                    )}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message as string}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Lock size={20} color={colors.dark.mutedForeground} style={styles.inputIcon} />
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Senha"
                        placeholderTextColor={colors.dark.mutedForeground}
                        secureTextEntry
                        editable={!isSubmitting}
                      />
                    )}
                  />
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message as string}</Text>}
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.8}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.dark.background} />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {mode === "login" ? "Entrar" : "Criar conta"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchModeButton}
                onPress={toggleMode}
                disabled={isSubmitting}
              >
                <Text style={styles.switchModeText}>
                  {mode === "login" ? "Não tem uma conta? Crie aqui" : "Já tem uma conta? Entre"}
                </Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OU USE</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.googleButton}
                onPress={loginWithGoogle}
                activeOpacity={0.8}
                disabled={isSubmitting}
              >
                <GoogleLogo size={24} color="#EA4335" weight="bold" />
                <Text style={styles.googleButtonText}>Google</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footer}>
              © 2026 Chronos. Todos os direitos reservados.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    paddingVertical: spacing.xxl,
  },
  blurBlob: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    opacity: 0.1,
  },
  topBlob: {
    top: -height * 0.1,
    left: -width * 0.2,
    backgroundColor: colors.dark.primary,
  },
  bottomBlob: {
    bottom: -height * 0.1,
    right: -width * 0.2,
    backgroundColor: "#3b82f6", // blue-500
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.dark.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 40,
    color: colors.dark.foreground,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: typography.fonts.medium,
    fontSize: 16,
    color: colors.dark.mutedForeground,
    marginTop: spacing.xs,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(28, 30, 45, 0.8)", // card bg with transparency
    borderRadius: 24,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 24,
    color: colors.dark.foreground,
    textAlign: "center",
  },
  cardSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.dark.mutedForeground,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    height: 56,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    color: colors.dark.foreground,
    fontSize: 16,
    height: "100%",
  },
  errorText: {
    fontFamily: typography.fonts.regular,
    color: "#ef4444",
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.dark.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.dark.foreground,
  },
  switchModeButton: {
    alignItems: "center",
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  switchModeText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.dark.primary,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: colors.dark.foreground,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  googleButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.dark.background,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  dividerText: {
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    color: "rgba(148, 163, 184, 0.4)", // muted foreground
    letterSpacing: 1.5,
  },
  footer: {
    marginTop: spacing.xxl,
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: "rgba(148, 163, 184, 0.3)",
  },
});
