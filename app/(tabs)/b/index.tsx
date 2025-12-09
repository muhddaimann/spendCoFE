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

    </View>
  );
}
