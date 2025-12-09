import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
  useTheme,
  ActivityIndicator,
  ProgressBar,
  Text,
} from "react-native-paper";
import { router } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { H1 } from "../components/atom/text";

export default function Welcome() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const [count, setCount] = useState(3);
  const [progress, setProgress] = useState(0);
  const iRef = useRef<NodeJS.Timeout | null>(null);
  const pRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    iRef.current = setInterval(
      () => setCount((n) => (n > 1 ? n - 1 : n)),
      1000
    );
    pRef.current = setInterval(
      () => setProgress((p) => Math.min(1, p + 0.08)),
      200
    );
    const to = setTimeout(() => router.replace("/(tabs)/a"), 3000);
    return () => {
      if (iRef.current) clearInterval(iRef.current);
      if (pRef.current) clearInterval(pRef.current);
      clearTimeout(to);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        padding: tokens.spacing.lg,
        gap: tokens.spacing.lg,
      }}
    >
      <H1 style={{ color: colors.onSurface }}>Welcome, User</H1>
      <ActivityIndicator animating />
      <ProgressBar progress={progress} style={{ width: 280 }} />
      <Text style={{ color: colors.onSurfaceVariant }}>
        Opening workspace in {count}s
      </Text>
    </View>
  );
}
