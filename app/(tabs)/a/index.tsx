import React from "react";
import { ScrollView, View } from "react-native";
import { useTheme, Card, ProgressBar } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { H1, H2, Body, Subtitle } from "../../../components/atom/text";

const dummyData = {
  monthlyBudget: 2000,
  spent: 1500,
  categories: [
    { name: "Food", spent: 600, budget: 800, color: "#FF6347" },
    { name: "Transport", spent: 300, budget: 400, color: "#4682B4" },
    { name: "Bills", spent: 400, budget: 500, color: "#3CB371" },
    { name: "Fun", spent: 200, budget: 300, color: "#FFD700" },
  ],
};

export default function Dashboard() {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const spentPercentage = (dummyData.spent / dummyData.monthlyBudget) * 100;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: tokens.spacing.md, gap: tokens.spacing.lg }}>
        <H1>Dashboard</H1>
        
        <Card>
          <Card.Content>
            <Subtitle>Monthly Overview</Subtitle>
            <H2>RM {dummyData.spent.toFixed(2)} / RM {dummyData.monthlyBudget.toFixed(2)}</H2>
            <ProgressBar progress={spentPercentage / 100} color={colors.primary} style={{ marginTop: tokens.spacing.sm }} />
          </Card.Content>
        </Card>

        <H2>Categories</H2>

        {dummyData.categories.map((category, index) => (
          <Card key={index}>
            <Card.Content>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Body>{category.name}</Body>
                <Body>RM {category.spent.toFixed(2)} / RM {category.budget.toFixed(2)}</Body>
              </View>
              <ProgressBar progress={category.spent / category.budget} color={category.color} style={{ marginTop: tokens.spacing.sm }} />
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
