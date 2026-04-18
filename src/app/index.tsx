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
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthButton from "@/src/presentation/components/AuthButton";
import AuthCard from "@/src/presentation/components/AuthCard";
import AuthDecoration from "@/src/presentation/components/AuthDecoration";
import CustomInput from "@/src/presentation/components/CustomInput";

import { useAppDispatch, useAppSelector } from "@/src/presentation/state/hooks";
import { 
  signInAction, 
  signInAnonymouslyAction, 
  clearError, 
  selectAuthStatus 
} from "@/src/presentation/state/userSlice";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(selectAuthStatus);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordInputRef = useRef<TextInput>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) return;
    
    const resultAction = await dispatch(signInAction({ email, password }));
    if (signInAction.fulfilled.match(resultAction)) {
      // Navigation is handled by the useEffect above
    }
  };

  const handleGuestSignIn = async () => {
    Keyboard.dismiss();
    await dispatch(signInAnonymouslyAction());
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
            minHeight={540}
            title="Login"
            subtitle={error || "Please sign in to continue."}
            subtitleStyle={error ? { color: "#F06B62", fontWeight: "700" } : undefined}
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
                returnKeyType="next"
                style={styles.inputText}
                textContentType="emailAddress"
                value={email}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <CustomInput
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                blurOnSubmit
                label="Password"
                iconName="lock-closed-outline"
                maxLength={20}
                onChangeText={setPassword}
                onSubmitEditing={handleLogin}
                placeholder="Enter your password"
                ref={passwordInputRef}
                returnKeyType="done"
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
                label="LOGIN"
                loading={loading}
                onPress={handleLogin}
                style={styles.buttonContainer}
              />

              <Pressable 
                onPress={handleGuestSignIn}
                style={({ pressed }) => [
                  styles.guestButton,
                  pressed && styles.guestButtonPressed
                ]}
              >
                <Text style={styles.guestButtonText}>CONTINUE AS GUEST</Text>
              </Pressable>
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
  forgotText: {
    color: "#F5A129",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  buttonContainer: {
    marginTop: 18,
  },
  guestButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#EBE6E0",
  },
  guestButtonPressed: {
    backgroundColor: "#F9F8F6",
    borderColor: "#DCD5CD",
  },
  guestButtonText: {
    color: "#8E857A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
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
