import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { H1 } from "../../../components/atom/text";
import { Button } from "../../../components/atom/button";
import { useAuth } from "../../../contexts/authContext";
import { LogOut } from "lucide-react-native";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { signOut, loading } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: tokens.spacing.md }}>
      <H1 style={{ marginBottom: tokens.spacing.lg }}>Settings</H1>

      <Button
        variant="destructive"
        onPress={signOut}
        fullWidth
        rounded="sm"
        IconLeft={LogOut}
        loading={loading}
      >
        Sign Out
      </Button>
    </View>
  );
}
