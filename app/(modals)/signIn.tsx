import React, { useRef, useState, useEffect } from "react";
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
import { useAuth } from "../../contexts/authContext";
import { useFocusEffect } from "expo-router";
import { H2, BodySmall } from "../../components/atom/text";

export default function SignInModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const { signIn, loading, error, clearError } = useAuth();
  const [login, setLogin] = useState(""); // Changed from username to login
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [fieldErr, setFieldErr] = useState<{ login?: string; pass?: string }>( // Changed from user to login
    {}
  );
  const loginRef = useRef<RNInput>(null); // Changed from userRef to loginRef
  const passRef = useRef<RNInput>(null);
  const shake = useRef(new Animated.Value(0)).current;

  const isValid = login.trim().length > 0 && password.trim().length > 0; // Changed from username to login

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => loginRef.current?.focus()); // Changed from userRef to loginRef
    });
    return () => task.cancel();
  }, []);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        clearError();
        setLogin(""); // Changed from setUsername to setLogin
        setPassword("");
        setShowPass(false);
        setFieldErr({});
        shake.setValue(0);
      };
    }, [clearError, shake])
  );

  useEffect(() => {
    if (!error) return;
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [error, shake]);

  const onSubmit = async () => {
    const l = login.trim(); // Changed from u to l
    const p = password.trim();
    const nextErr: typeof fieldErr = {};
    if (!l) nextErr.login = "Required"; // Changed from user to login
    if (!p) nextErr.pass = "Required";
    setFieldErr(nextErr);
    if (Object.keys(nextErr).length) return;

    const ok = await signIn(l, p); // Changed from u to l
    if (!ok) {
      setPassword("");
      passRef.current?.focus();
    }
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
            Sign in
          </H2>
          <BodySmall muted align="center">
            Welcome back
          </BodySmall>
        </View>

        {!!error && (
          <View
            style={{
              backgroundColor: colors.errorContainer,
              borderColor: colors.error,
              borderWidth: 1,
              borderRadius: tokens.radii.lg,
              paddingVertical: tokens.spacing.sm,
              paddingHorizontal: tokens.spacing.md,
            }}
          >
            <BodySmall
              weight="semibold"
              style={{ color: colors.onErrorContainer }}
            >
              {error}
            </BodySmall>
          </View>
        )}

        <Animated.View style={{ transform: [{ translateX: shake }] }}>
          <View style={{ gap: tokens.spacing.md }}>
            <TextInput
              mode="outlined"
              label="Username" // Changed from Username
              value={login} // Changed from username to login
              onChangeText={(t) => {
                setLogin(t); // Changed from setUsername to setLogin
                if (fieldErr.login) // Changed from user to login
                  setFieldErr((e) => ({ ...e, login: undefined })); // Changed from user to login
              }}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passRef.current?.focus()}
              error={!!fieldErr.login} // Changed from user to login
              ref={loginRef} // Changed from userRef to loginRef
            />
            {fieldErr.login ? ( // Changed from user to login
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.login}
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
              }}
              secureTextEntry={!showPass}
              ref={passRef}
              returnKeyType="go"
              onSubmitEditing={onSubmit}
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
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </View>
      </View>
    </View>
  );
}
