import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";
import AuthDecoration from "../components/AuthDecoration";
import CustomInput from "../components/CustomInput";

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canSignup =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0;

  const handleSignup = () => {
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
            minHeight={640}
            onBackPress={() => router.back()}
            title="Create Account"
            footer={
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Link href="/" asChild>
                  <Pressable>
                    <Text style={styles.signinLink}>Sign in</Text>
                  </Pressable>
                </Link>
              </View>
            }
          >
            <View style={styles.form}>
              <CustomInput
                autoCapitalize="words"
                autoCorrect={false}
                autoFocus
                keyboardType="default"
                label="Full Name"
                iconName="person-outline"
                maxLength={30}
                onChangeText={setFullName}
                placeholder="Jhone Williams"
                style={styles.inputText}
                textContentType="name"
                value={fullName}
              />

              <CustomInput
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                keyboardType="email-address"
                label="Email"
                iconName="mail-outline"
                maxLength={40}
                onChangeText={setEmail}
                placeholder="Enter your email"
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
                placeholder="Create password"
                secureTextEntry
                style={styles.inputText}
                textContentType="newPassword"
                value={password}
              />

              <CustomInput
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                label="Confirm Password"
                iconName="lock-closed-outline"
                maxLength={20}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                secureTextEntry
                style={styles.inputText}
                textContentType="password"
                value={confirmPassword}
              />

              <AuthButton
                disabled={!canSignup}
                label="SIGN UP"
                onPress={handleSignup}
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
  signinLink: {
    color: "#F5A129",
    fontSize: 13,
    fontWeight: "800",
  },
  inputText: {
    fontSize: 14,
  },
});
