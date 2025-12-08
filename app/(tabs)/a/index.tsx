import React from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
} from "react-native";
import { NativeScrollEvent } from "react-native";
import { useTheme, Card } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../../contexts/designContext";
import { useAuth } from "../../../contexts/authContext";
import { useRouter } from "expo-router";
import { H1, Subtitle, Body, BodySmall } from "../../../components/atom/text";
import {
  Wallet,
  PieChart,
  ListChecks,
  ChevronRight,
} from "lucide-react-native";
import { HomeHeader } from "../../../components/shared/homeHeader";
import { useTabsUi } from "../../../contexts/tabContext";

const HOME_ROUTE_KEY = "a";

export default function Home() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const router = useRouter();
  const name = user?.username || "there";
  const { updateByOffset, saveOffset, setActiveRoute } = useTabsUi();

  React.useEffect(() => {
    setActiveRoute(HOME_ROUTE_KEY);
  }, [setActiveRoute]);

  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      updateByOffset(y);
      saveOffset(HOME_ROUTE_KEY, y);
    },
    [updateByOffset, saveOffset]
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: tokens.spacing.lg,
        paddingBottom: insets.bottom + tokens.spacing.xl * 5,
        paddingHorizontal: tokens.spacing.lg,
        gap: tokens.spacing.md,
      }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={handleScroll}
    >
      <HomeHeader name={name} />

      <Card
        style={{
          borderRadius: tokens.radii["2xl"],
          backgroundColor: colors.surface,
        }}
      >
        <Card.Content
          style={{
            padding: tokens.spacing.md,
            paddingBottom: tokens.spacing.lg,
            gap: tokens.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <BodySmall muted>Spending overview</BodySmall>
              <View
                style={{
                  paddingHorizontal: tokens.spacing.xs,
                  paddingVertical: 2,
                  borderRadius: 999,
                  backgroundColor: colors.background,
                }}
              >
                <BodySmall
                  weight="semibold"
                  style={{ color: colors.onBackground }}
                >
                  This month
                </BodySmall>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("(tabs)/a/spendingPage")}
              style={{
                width: tokens.spacing["2xl"],
                height: tokens.spacing["2xl"],
                borderRadius: tokens.spacing["2xl"] / 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.background,
              }}
            >
              <ChevronRight
                size={tokens.sizes.icon.md}
                color={colors.onBackground}
              />
            </TouchableOpacity>
          </View>

          <View style={{ gap: tokens.spacing["xxs"] }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <H1
                weight="bold"
                style={{
                  color: colors.onSurface,
                }}
              >
                RM 0
              </H1>
              <BodySmall
                style={{
                  marginLeft: 2,
                  marginBottom: 4,
                  color: colors.onSurfaceVariant,
                }}
              >
                .00
              </BodySmall>
            </View>

            <BodySmall muted style={{ color: colors.onSurfaceVariant }}>
              So far this month
            </BodySmall>
          </View>

          <View style={{ flex: 1 }}>
            <BodySmall
              muted
              numberOfLines={2}
              style={{ color: colors.onSurface }}
            >
              No spending yet.{" "}
              <BodySmall weight="semibold" style={{ color: colors.onSurface }}>
                Add your first entry today.
              </BodySmall>
            </BodySmall>
          </View>
        </Card.Content>
      </Card>

      <Card
        style={{
          borderRadius: tokens.radii["2xl"],
          backgroundColor: colors.surfaceVariant,
        }}
      >
        <Card.Content
          style={{
            paddingVertical: tokens.spacing.md,
            paddingBottom: tokens.spacing.lg,
            gap: tokens.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <BodySmall muted>Budget overview</BodySmall>
              <View
                style={{
                  paddingHorizontal: tokens.spacing.xs,
                  paddingVertical: 2,
                  borderRadius: 999,
                  backgroundColor: colors.background,
                }}
              >
                <BodySmall
                  weight="semibold"
                  style={{ color: colors.onBackground }}
                >
                  Planning
                </BodySmall>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("(tabs)/a/budgetPage")}
              style={{
                width: tokens.spacing["2xl"],
                height: tokens.spacing["2xl"],
                borderRadius: tokens.spacing["2xl"] / 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surface,
              }}
            >
              <ChevronRight
                size={tokens.sizes.icon.md}
                color={colors.onSurface}
              />
            </TouchableOpacity>
          </View>

          <View style={{ gap: tokens.spacing["xxs"] }}>
            <BodySmall muted style={{ color: colors.onSurfaceVariant }}>
              Monthly budget
            </BodySmall>
            <H1
              weight="bold"
              style={{
                color: colors.onSurface,
              }}
            >
              Not set
            </H1>
          </View>

          <View style={{ flex: 1 }}>
            <BodySmall
              muted
              numberOfLines={2}
              style={{ color: colors.onSurfaceVariant }}
            >
              No budget yet.{" "}
              <BodySmall weight="semibold" style={{ color: colors.onSurface }}>
                Set a simple monthly limit.
              </BodySmall>
            </BodySmall>
          </View>
        </Card.Content>
      </Card>

      <Card
        style={{
          borderRadius: tokens.radii.xl,
          backgroundColor: colors.surface,
        }}
      >
        <Card.Content
          style={{
            gap: tokens.spacing.md,
            padding: tokens.spacing.md,
            paddingBottom: tokens.spacing.lg,
          }}
        >
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
          Version 1.0.0
        </BodySmall>
      </View>
    </ScrollView>
  );
}
