import React from "react";
import { View, Pressable, Platform, Animated, Easing } from "react-native";
import { useTheme, Divider } from "react-native-paper";
import { BlurView } from "expo-blur";
import { useDesign } from "../../contexts/designContext";
import type {
  OptionsOverlayOptions,
  OptionItem,
} from "../../contexts/overlayContext";
import { H3, Body, BodySmall } from "../atom/text";

const DURATION_IN = 220;
const DURATION_OUT = 180;

export function OptionsCenter({
  visible,
  state,
  onSelect,
  onDismiss,
}: {
  visible: boolean;
  state: OptionsOverlayOptions | null;
  onSelect: (index: number) => void;
  onDismiss: () => void;
}) {
  const { colors, dark } = useTheme();
  const { tokens } = useDesign();

  const canDismiss = state?.dismissible ?? true;

  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const panelOpacity = React.useRef(new Animated.Value(0)).current;
  const panelScale = React.useRef(new Animated.Value(0.96)).current;
  const closingRef = React.useRef(false);
  const [mounted, setMounted] = React.useState(visible);

  const [internalState, setInternalState] =
    React.useState<OptionsOverlayOptions | null>(state ?? null);

  React.useEffect(() => {
    if (state) setInternalState(state);
  }, [state]);

  const total = internalState?.options.length ?? 0;
  const hasHeader = !!(internalState?.title || internalState?.message);

  const LONG_LIST_THRESHOLD_WITH_HEADER = 8;
  const LONG_LIST_THRESHOLD_NO_HEADER = 12;

  const isLongList =
    total >=
    (hasHeader
      ? LONG_LIST_THRESHOLD_WITH_HEADER
      : LONG_LIST_THRESHOLD_NO_HEADER);

  const animateIn = React.useCallback(() => {
    closingRef.current = false;
    backdropOpacity.setValue(0);
    panelOpacity.setValue(0);
    panelScale.setValue(0.96);

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: DURATION_IN,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(panelOpacity, {
        toValue: 1,
        duration: DURATION_IN,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(panelScale, {
        toValue: 1,
        duration: DURATION_IN,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, panelOpacity, panelScale]);

  const animateOut = React.useCallback(
    (after?: () => void) => {
      if (closingRef.current) return;
      closingRef.current = true;

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: DURATION_OUT,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(panelOpacity, {
          toValue: 0,
          duration: DURATION_OUT,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(panelScale, {
          toValue: 0.96,
          duration: DURATION_OUT,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        closingRef.current = false;
        setMounted(false);
        setInternalState(null);
        after?.();
      });
    },
    [backdropOpacity, panelOpacity, panelScale]
  );

  React.useEffect(() => {
    if (visible) {
      if (!mounted) setMounted(true);
      requestAnimationFrame(animateIn);
    } else if (mounted && !closingRef.current) {
      animateOut();
    }
  }, [visible, mounted, animateIn, animateOut]);

  const handleBackdropPress = () => {
    if (!canDismiss || closingRef.current) return;
    animateOut(onDismiss);
  };

  const renderOption = (
    opt: OptionItem, // Use OptionItem type
    globalIndex: number,
    showDivider: boolean
  ) => {
    const Icon = opt.icon; // Get the Icon component
    const iconColor = colors.onSurfaceVariant; // Determine icon color from theme

    return (
      <React.Fragment key={opt.id ?? `${globalIndex}`}>
        {showDivider && (
          <Divider
            style={{
              backgroundColor: colors.outlineVariant,
              opacity: 0.6,
            }}
          />
        )}

        <Pressable
          onPress={() => onSelect(globalIndex)}
          style={({ pressed }) => ({
            paddingHorizontal: tokens.spacing.lg,
            paddingVertical: tokens.spacing.md,
            backgroundColor: pressed ? colors.surfaceVariant : "transparent",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: isLongList ? "center" : "flex-start",
            gap: tokens.spacing.lg,
            alignSelf: "stretch",
          })}
        >
          {Icon ? <Icon color={iconColor} size={tokens.sizes.icon.md} /> : null}
          <Body
            numberOfLines={1}
            style={{ textAlign: isLongList ? "center" : "left" }}
          >
            {opt.label}
          </Body>
        </Pressable>
      </React.Fragment>
    );
  };

  if (!mounted || !internalState) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        inset: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      accessible
      accessibilityLabel={internalState.title ?? "Options dialog"}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
    >
      <Animated.View
        style={{
          position: "absolute",
          inset: 0,
          opacity: backdropOpacity,
        }}
      >
        {Platform.OS === "ios" || Platform.OS === "web" ? (
          <>
            <BlurView
              intensity={30}
              tint={dark ? "dark" : "light"}
              style={{ position: "absolute", inset: 0 }}
            />
            <Pressable
              onPress={handleBackdropPress}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: dark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.18)",
              }}
            />
          </>
        ) : (
          <Pressable
            onPress={handleBackdropPress}
            style={{
              flex: 1,
              backgroundColor: dark ? "rgba(0,0,0,0.40)" : "rgba(0,0,0,0.22)",
            }}
          />
        )}
      </Animated.View>

      <Animated.View
        style={{
          width: "90%",
          maxWidth: 420,
          borderRadius: tokens.radii["2xl"],
          backgroundColor: "transparent",
          opacity: panelOpacity,
          transform: [{ scale: panelScale }],
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii["2xl"],
            width: "100%",
            overflow: "hidden",
          }}
        >
          {(internalState.title || internalState.message) && (
            <View
              style={{
                paddingHorizontal: tokens.spacing.lg,
                paddingTop: tokens.spacing.lg,
                paddingBottom: tokens.spacing.sm,
              }}
            >
              {internalState.title ? <H3>{internalState.title}</H3> : null}
              {internalState.message ? (
                <BodySmall muted style={{ marginTop: tokens.spacing.xs }}>
                  {internalState.message}
                </BodySmall>
              ) : null}
            </View>
          )}

          <Divider
            style={{ backgroundColor: colors.outlineVariant, opacity: 0.6 }}
          />

          <View
            style={{
              paddingVertical: tokens.spacing.xs,
            }}
          >
            <View
              style={{
                alignSelf: "stretch",
                width: "100%",
              }}
            >
              {internalState.options.map((opt, index) =>
                renderOption(opt, index, index > 0)
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
