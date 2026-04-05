import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import AuthDecoration from "../components/AuthDecoration";
import CustomInput from "../components/CustomInput";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const canLogin = email.trim().length > 0 && password.trim().length > 0;

  const handleLogin = () => {
    router.replace("/home");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AuthDecoration />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthCard
            minHeight={540}
            title="Login"
            subtitle="Please sign in to continue."
            footer={
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don&apos;t have an account? </Text>
                <Link href="/signup" asChild>
                  <Pressable>
                    <Text style={styles.signupLink}>Sign up</Text>
                  </Pressable>
                </Link>
              </View>
            }
          >
            <View style={styles.form}>
              <CustomInput
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                autoFocus
                keyboardType="email-address"
                label="Email"
                iconName="mail-outline"
                maxLength={40}
                onChangeText={setEmail}
                placeholder="user123@email.com"
                style={styles.inputText}
                textContentType="emailAddress"
                value={email}
              />

              <CustomInput
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                label="Password"
                iconName="lock-closed-outline"
                maxLength={20}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                style={styles.inputText}
                textContentType="password"
                value={password}
                rightElement={
                  <Pressable>
                    <Text style={styles.forgotText}>FORGOT</Text>
                  </Pressable>
                }
              />

              <AuthButton
                disabled={!canLogin}
                label="LOGIN"
                onPress={handleLogin}
                style={styles.buttonContainer}
              />
            </View>
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  form: {
    flex: 1,
  },
  forgotText: {
    color: "#F5A129",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  buttonContainer: {
    marginTop: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    color: "#8E857A",
    fontSize: 13,
    fontWeight: "500",
  },
  signupLink: {
    color: "#F5A129",
    fontWeight: "800",
    fontSize: 13,
  },
  inputText: {
    fontSize: 14,
  },
});
