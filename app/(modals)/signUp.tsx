import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  TextInput as RNInput,
  Animated,
  InteractionManager,
} from "react-native";
import { useTheme, TextInput, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { useFocusEffect } from "expo-router";
import { H2, BodySmall } from "../../components/atom/text";
import { useAuth } from "../../contexts/authContext";

export default function SignUpModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const { signUp, loading, clearError } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErr, setFieldErr] = useState<{
    username?: string;
    email?: string;
    pass?: string;
    conf?: string;
  }>({});

  const usernameRef = useRef<RNInput>(null);
  const emailRef = useRef<RNInput>(null);
  const passRef = useRef<RNInput>(null);
  const confRef = useRef<RNInput>(null);
  const shake = useRef(new Animated.Value(0)).current;

  const mismatch =
    confirm.trim().length > 0 &&
    password.trim().length > 0 &&
    confirm !== password;

  useEffect(() => {
    setFieldErr((e) => ({
      ...e,
      conf: mismatch ? "Passwords do not match" : undefined,
    }));
  }, [mismatch]);

  const isValid =
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirm.trim().length > 0 &&
    !mismatch;

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => usernameRef.current?.focus());
    });
    return () => task.cancel();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        clearError();
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirm("");
        setShowPass(false);
        setShowConfirm(false);
        setFieldErr({});
        shake.setValue(0);
      };
    }, [clearError, shake])
  );

  const onSubmit = async () => {
    const u = username.trim();
    const e = email.trim();
    const p = password.trim();
    const c = confirm.trim();
    const nextErr: typeof fieldErr = {};
    if (!u) nextErr.username = "Required";
    if (!e) nextErr.email = "Required";
    if (!p) nextErr.pass = "Required";
    if (!c) nextErr.conf = "Required";
    setFieldErr(nextErr);
    if (Object.keys(nextErr).length || mismatch) {
      if (!u) usernameRef.current?.focus();
      else if (!e) emailRef.current?.focus();
      else if (!p) passRef.current?.focus();
      else confRef.current?.focus();
      return;
    }

    await signUp(u, e, p, c);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing.xl * 4,
          justifyContent: "center",
          gap: tokens.spacing.lg,
        }}
        bounces={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: tokens.spacing.xxs, alignItems: "center" }}>
          <H2
            weight="bold"
            align="center"
            style={{ fontSize: tokens.typography.sizes["2xl"] }}
          >
            Create account
          </H2>
        </View>

        <Animated.View style={{ transform: [{ translateX: shake }] }}>
          <View style={{ gap: tokens.spacing.md }}>
            <TextInput
              mode="outlined"
              label="Username"
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                if (fieldErr.username)
                  setFieldErr((e) => ({ ...e, username: undefined }));
              }}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              error={!!fieldErr.username}
              ref={usernameRef}
            />
            {fieldErr.username ? (
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.username}
              </BodySmall>
            ) : null}

            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (fieldErr.email)
                  setFieldErr((e) => ({ ...e, email: undefined }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passRef.current?.focus()}
              error={!!fieldErr.email}
              ref={emailRef}
            />
            {fieldErr.email ? (
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.email}
              </BodySmall>
            ) : null}

            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (fieldErr.pass)
                  setFieldErr((e) => ({ ...e, pass: undefined }));
                if (confirm && t === confirm)
                  setFieldErr((e) => ({ ...e, conf: undefined }));
              }}
              secureTextEntry={!showPass}
              ref={passRef}
              returnKeyType="next"
              onSubmitEditing={() => confRef.current?.focus()}
              error={!!fieldErr.pass}
              right={
                <TextInput.Icon
                  icon={showPass ? "eye-off" : "eye"}
                  onPress={() => setShowPass((v) => !v)}
                  forceTextInputFocus={false}
                />
              }
            />
            {fieldErr.pass ? (
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.pass}
              </BodySmall>
            ) : null}

            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={confirm}
              onChangeText={(t) => {
                setConfirm(t);
                if (!t || t === password)
                  setFieldErr((e) => ({ ...e, conf: undefined }));
              }}
              secureTextEntry={!showConfirm}
              ref={confRef}
              returnKeyType="go"
              onSubmitEditing={onSubmit}
              error={!!fieldErr.conf}
              right={
                <TextInput.Icon
                  icon={showConfirm ? "eye-off" : "eye"}
                  onPress={() => setShowConfirm((v) => !v)}
                  forceTextInputFocus={false}
                />
              }
            />
            {fieldErr.conf ? (
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.conf}
              </BodySmall>
            ) : confirm && !mismatch ? (
              <BodySmall
                style={{
                  color: colors.tertiary,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                Passwords match
              </BodySmall>
            ) : null}
          </View>
        </Animated.View>

        <Divider style={{ marginTop: tokens.spacing.sm }} />
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            paddingTop: tokens.spacing.sm,
            paddingBottom: insets.bottom + tokens.spacing.lg,
            backgroundColor: colors.background,
            borderTopWidth: 0.5,
            borderTopColor: colors.outlineVariant,
          }}
        >
          <Button
            onPress={onSubmit}
            variant="default"
            disabled={loading || !isValid}
            fullWidth
            rounded="sm"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </View>
      </View>
    </View>
  );
}
