import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useTheme, TextInput, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { useRouter } from "expo-router";
import { H2, BodySmall } from "../../components/atom/text";
import { apiForgotPassword } from "../../contexts/api/auth"; // Import apiForgotPassword
import { useOverlay } from "../../hooks/useOverlay"; // Import useOverlay

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function ForgotPasswordModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { toast } = useOverlay(); // Initialize toast

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const valid = useMemo(() => isValidEmail(email), [email]);
  const showErr = touched && email.length > 0 && !valid;

  const onSubmit = async () => {
    setTouched(true);
    if (!valid) return;

    setLoading(true); // Set loading to true
    try {
      await apiForgotPassword({ email });
      toast({
        message: "Password reset link sent to your email.",
        variant: "success",
      });
      router.back();
    } catch (e: any) {
      const msg = e?.message || "Failed to send reset link.";
      toast({ message: msg, variant: "error" });
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing.xl * 7,
          gap: tokens.spacing.lg,
          justifyContent: "center",
        }}
      >
        <View style={{ gap: tokens.spacing.xs, alignItems: "center" }}>
          <H2
            weight="bold"
            align="center"
            style={{ fontSize: tokens.typography.sizes["2xl"] }}
          >
            Reset password
          </H2>
          <BodySmall
            muted
            align="center"
            style={{ color: colors.onSurfaceVariant }}
          >
            Enter your email to receive reset instructions
          </BodySmall>
        </View>

        <View style={{ gap: tokens.spacing.xs }}>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={(t) => {
              if (!touched) setTouched(true);
              setEmail(t);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoFocus
            error={showErr}
            onBlur={() => setTouched(true)}
            returnKeyType="send"
            onSubmitEditing={onSubmit}
            disabled={loading} // Disable input while loading
          />
          {showErr ? (
            <BodySmall
              style={{
                color: colors.error,
                marginTop: -6,
                fontSize: tokens.typography.sizes.xs,
              }}
            >
              Please enter a valid email address
            </BodySmall>
          ) : null}
        </View>

        <Divider style={{ marginTop: tokens.spacing.xs }} />

        <View style={{ gap: tokens.spacing.xs, alignItems: "center" }}>
          <BodySmall
            align="center"
            style={{
              color: colors.onSurfaceVariant,
              fontSize: tokens.typography.sizes.sm,
            }}
          >
            Double-check your email spelling. If the account exists, we’ll send
            a reset link shortly.
          </BodySmall>
          <BodySmall
            muted
            align="center"
            style={{
              color: colors.onSurfaceVariant,
              fontSize: tokens.typography.sizes.xs,
            }}
          >
            Didn’t receive it? Check spam/junk or try again in a few minutes.
          </BodySmall>
        </View>
      </View>

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
            disabled={!valid || loading} // Disable button while loading
            fullWidth
            rounded="sm"
          >
            {loading ? "Sending..." : "Send reset link"} {/* Update button text */}
          </Button>
        </View>
      </View>
    </View>
  );
}
