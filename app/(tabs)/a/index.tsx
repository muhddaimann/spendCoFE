import React from "react";
import { ScrollView, View } from "react-native";
import { useTheme, Card } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../../contexts/designContext";
import { useAuth } from "../../../contexts/authContext";
import { useRouter } from "expo-router";
import { H1, Subtitle, Body, BodySmall } from "../../../components/atom/text";
import { Button } from "../../../components/atom/button";
import { Wallet, PieChart, ListChecks } from "lucide-react-native";

export default function Home() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const router = useRouter();

  const name = user?.username || "there";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: tokens.spacing.lg,
        paddingBottom: insets.bottom + tokens.spacing.xl * 5,
        paddingHorizontal: tokens.spacing.lg,
        gap: tokens.spacing.lg,
      }}
      bounces={false}
    >
      <View style={{ gap: tokens.spacing.xs }}>
        <BodySmall muted>Welcome, {name}</BodySmall>
        <H1 weight="bold">Let’s set up SpendCo</H1>
        <Body muted>
          Start by adding your first spending and organising it into simple
          categories. This Home tab will become your money overview.
        </Body>
      </View>

      <Card
        style={{
          borderRadius: tokens.radii.lg,
          backgroundColor: colors.surface,
        }}
      >
        <Card.Content
          style={{
            paddingVertical: tokens.spacing.lg,
            gap: tokens.spacing.md,
          }}
        >
          <View style={{ gap: tokens.spacing.xs }}>
            <Subtitle weight="semibold">
              You haven’t tracked anything yet
            </Subtitle>
            <Body muted>
              Once you add some spending, you’ll see totals, trends, and
              category breakdowns here.
            </Body>
          </View>

          <Button
            variant="default"
            rounded="pill"
            fullWidth
            onPress={() => router.push("(tabs)/a/spendingPage")}
          >
            Check Your spending
          </Button>
        </Card.Content>
      </Card>

      <Card
        style={{
          borderRadius: tokens.radii.lg,
          backgroundColor: colors.surface,
        }}
      >
        <Card.Content style={{ gap: tokens.spacing.md }}>
          <Subtitle weight="semibold">How SpendCo works</Subtitle>

          <View
            style={{
              flexDirection: "row",
              gap: tokens.spacing.md,
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: tokens.radii.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.primaryContainer,
              }}
            >
              <Wallet color={colors.onPrimaryContainer} size={20} />
            </View>
            <View style={{ flex: 1, gap: tokens.spacing.xxs }}>
              <Body weight="semibold">Track spending quickly</Body>
              <BodySmall muted>
                Log each expense with an amount, category, and note so you
                always know where your money goes.
              </BodySmall>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: tokens.spacing.md,
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: tokens.radii.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.secondaryContainer,
              }}
            >
              <ListChecks color={colors.onSecondaryContainer} size={20} />
            </View>
            <View style={{ flex: 1, gap: tokens.spacing.xxs }}>
              <Body weight="semibold">Group by categories</Body>
              <BodySmall muted>
                Keep it simple with a few categories first: food, transport,
                bills, fun, or whatever fits your life.
              </BodySmall>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: tokens.spacing.md,
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: tokens.radii.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.tertiaryContainer,
              }}
            >
              <PieChart color={colors.onTertiaryContainer} size={20} />
            </View>
            <View style={{ flex: 1, gap: tokens.spacing.xxs }}>
              <Body weight="semibold">See your month at a glance</Body>
              <BodySmall muted>
                After a few entries, this Home screen will show how much you’ve
                spent and where it’s going.
              </BodySmall>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={{ alignItems: "center", marginTop: tokens.spacing.sm }}>
        <BodySmall muted align="center">
          Tip: You can always add spending from the + button in the bottom bar.
        </BodySmall>
      </View>
    </ScrollView>
  );
}
