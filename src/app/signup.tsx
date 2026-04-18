import { Link, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthButton from "@/src/presentation/components/AuthButton";
import AuthCard from "@/src/presentation/components/AuthCard";
import AuthDecoration from "@/src/presentation/components/AuthDecoration";
import CustomInput from "@/src/presentation/components/CustomInput";

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const canSignup =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0;

  const handleSignup = () => {
    Keyboard.dismiss();
    router.replace("/home");
  };

  return (
    <View style={styles.root}>
      <AuthDecoration />
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <ScrollView
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode={Platform.OS === "ios" ? "on-drag" : "none"}
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
                onSubmitEditing={() => emailInputRef.current?.focus()}
                placeholder="Jhone Williams"
                returnKeyType="next"
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
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                placeholder="Enter your email"
                ref={emailInputRef}
                returnKeyType="next"
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
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                placeholder="Create password"
                ref={passwordInputRef}
                returnKeyType="next"
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
                onSubmitEditing={handleSignup}
                placeholder="Confirm password"
                ref={confirmPasswordInputRef}
                returnKeyType="done"
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
