import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { router } from "expo-router";
import { LineChart } from "react-native-chart-kit";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledPressable = styled(Pressable);
const StyledImage = styled(Image);

const screenWidth = Dimensions.get("window").width;

type Metric = {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  target?: string;
  unit: string;
  color: string;
  icon?: string;
  label?: string;
  data: {
    D: { labels: string[]; values: number[] };
    W: { labels: string[]; values: number[] };
    M: { labels: string[]; values: number[] };
    Y: { labels: string[]; values: number[] };
  };
};

type InsightTip = {
  tip: string;
  icon: keyof typeof Feather.glyphMap;
};

export const MetricsScreen = () => {
  const { currentTheme } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "D" | "W" | "M" | "Y"
  >("D");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metrics: Record<string, Metric> = {
    steps: {
      id: "steps",
      title: "Steps",
      subtitle: "Today",
      value: "660",
      target: "10,000",
      unit: "steps",
      color: "#9F7AEA",
      data: {
        D: {
          labels: ["12AM", "6AM", "12PM", "6PM"],
          values: [50, 120, 240, 660],
        },
        W: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [8432, 7651, 9432, 6543, 8765, 660, 0],
        },
        M: {
          labels: ["W1", "W2", "W3", "W4"],
          values: [45000, 52000, 48000, 15000],
        },
        Y: {
          labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
          values: [240000, 280000, 260000, 290000, 270000, 285000],
        },
      },
    },
    distance: {
      id: "distance",
      title: "Distance",
      subtitle: "Today",
      value: "0.45",
      target: "5.0",
      unit: "KM",
      color: "#0EA5E9",
      data: {
        D: {
          labels: ["12AM", "6AM", "12PM", "6PM"],
          values: [0.03, 0.15, 0.3, 0.45],
        },
        W: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [5.2, 4.8, 5.5, 4.2, 5.1, 0.45, 0],
        },
        M: {
          labels: ["W1", "W2", "W3", "W4"],
          values: [28, 32, 30, 12],
        },
        Y: {
          labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
          values: [150, 165, 158, 172, 168, 170],
        },
      },
    },
    sessions: {
      id: "sessions",
      title: "Sessions",
      subtitle: "Sunday",
      value: "2",
      unit: "",
      color: "#4CD964",
      icon: "walk",
      label: "Outdoor Walk",
      data: {
        D: {
          labels: ["12AM", "6AM", "12PM", "6PM"],
          values: [0, 0, 1.67, 1.67],
        },
        W: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [2.1, 0, 1.8, 2.3, 1.9, 0, 1.67],
        },
        M: {
          labels: ["W1", "W2", "W3", "W4"],
          values: [12, 14, 11, 8],
        },
        Y: {
          labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
          values: [45, 52, 48, 55, 42, 38],
        },
      },
    },
    calories: {
      id: "calories",
      title: "Move",
      subtitle: "Today",
      value: "347",
      target: "500",
      unit: "KCAL",
      color: "#FF3B30",
      data: {
        D: {
          labels: ["12AM", "6AM", "12PM", "6PM"],
          values: [20, 80, 220, 347],
        },
        W: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [520, 480, 550, 420, 510, 347, 0],
        },
        M: {
          labels: ["W1", "W2", "W3", "W4"],
          values: [2800, 3200, 3000, 1200],
        },
        Y: {
          labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
          values: [15000, 16500, 15800, 17200, 16800, 17000],
        },
      },
    },
  };

  const trends = [
    { title: "Walking Pace", value: "15:31/KM", trend: "up", color: "#9F7AEA" },
    { title: "Distance", value: "2.4KM/DAY", trend: "down", color: "#0EA5E9" },
    {
      title: "Cardio Fitness",
      value: "38VO2MAX",
      trend: "up",
      color: "#F97316",
    },
    { title: "Exercise", value: "13MIN/DAY", trend: "down", color: "#4CD964" },
    { title: "Stand", value: "10HR/DAY", trend: "down", color: "#5AC8FA" },
    {
      title: "Stand Minutes",
      value: "3MIN/HR",
      trend: "down",
      color: "#FFD60A",
    },
    { title: "Move", value: "347KCAL/DAY", trend: "down", color: "#FF3B30" },
    {
      title: "Running Pace",
      value: "-/-/KM",
      trend: "neutral",
      color: "#EC4899",
    },
  ];

  const getMetricInsight = (metric: Metric): InsightTip | null => {
    switch (metric.id) {
      case "steps":
        return {
          tip: "Try 5-minute walks every hour!",
          icon: "clock",
        };
      case "distance":
        return {
          tip: "A quick walk around the block adds 0.5km",
          icon: "navigation",
        };
      case "sessions":
        return {
          tip: "Perfect time for an evening walk",
          icon: "sun",
        };
      case "calories":
        return {
          tip: "153 kcal left to reach your goal",
          icon: "activity",
        };
      default:
        return null;
    }
  };

  const renderMetricCard = (metric: any) => {
    const data = {
      labels: metric.data.D.labels,
      datasets: [{ data: metric.data.D.values }],
    };

    return (
      <StyledPressable
        onPress={() => setSelectedMetric(metric.id)}
        className="bg-white border-2 border-black rounded-3xl p-4 mb-4 w-[48%] aspect-square shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]"
      >
        <StyledView className="flex-row justify-between items-center">
          <StyledText className="font-space text-lg">{metric.title}</StyledText>
          <Feather name="chevron-right" size={20} color="black" opacity={0.3} />
        </StyledView>
        <StyledText
          className="font-space text-4xl my-1"
          style={{ color: metric.color }}
        >
          {metric.value}
          <StyledText className="text-xl"> {metric.unit}</StyledText>
        </StyledText>
        <StyledView className="flex-1 justify-end">
          <LineChart
            data={data}
            width={screenWidth * 0.42}
            height={60}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={false}
            withVerticalLabels={false}
            withHorizontalLabels={false}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              fillShadowGradientFrom: metric.color,
              fillShadowGradientFromOpacity: 0.1,
              fillShadowGradientTo: metric.color,
              fillShadowGradientToOpacity: 0.0,
              strokeWidth: 2,
              decimalPlaces: 0,
              color: () => metric.color,
            }}
            bezier
            style={{
              marginHorizontal: -16,
              paddingRight: 16,
            }}
          />
        </StyledView>
      </StyledPressable>
    );
  };

  const renderTrends = () => {
    return (
      <StyledView className="bg-white rounded-3xl p-4 mb-4">
        <StyledView className="flex-row justify-between items-center">
          <StyledText className="font-space text-lg">Trends</StyledText>
          <Feather name="chevron-right" size={20} color="black" opacity={0.3} />
        </StyledView>
        <StyledView className="flex-row flex-wrap justify-between mt-2">
          {trends.map((trend) => (
            <StyledView key={trend.title} className="w-[48%] mb-4">
              <StyledView className="flex-row items-center">
                <Feather
                  name={
                    trend.trend === "up"
                      ? "arrow-up"
                      : trend.trend === "down"
                      ? "arrow-down"
                      : "minus"
                  }
                  size={16}
                  color={trend.color}
                />
                <StyledText className="font-space text-sm ml-1">
                  {trend.title}
                </StyledText>
              </StyledView>
              <StyledText className="font-space" style={{ color: trend.color }}>
                {trend.value}
              </StyledText>
            </StyledView>
          ))}
        </StyledView>
      </StyledView>
    );
  };

  const renderDetailView = () => {
    const metric = metrics[selectedMetric as keyof typeof metrics];
    const data = {
      labels: metric.data[selectedTimeframe].labels,
      datasets: [{ data: metric.data[selectedTimeframe].values }],
    };
    const insight = getMetricInsight(metric);

    return (
      <>
        <StyledView className="flex-row justify-between px-4 py-3">
          {["D", "W", "M", "Y"].map((timeframe) => (
            <StyledPressable
              key={timeframe}
              onPress={() => setSelectedTimeframe(timeframe as any)}
              className={`px-6 py-2 rounded-2xl ${
                selectedTimeframe === timeframe
                  ? "bg-black"
                  : "bg-[#FFF] border-black border-2"
              }`}
            >
              <StyledText
                className={`font-space ${
                  selectedTimeframe === timeframe ? "text-white" : "text-black"
                }`}
              >
                {timeframe}
              </StyledText>
            </StyledPressable>
          ))}
        </StyledView>

        <StyledScrollView className="flex-1 px-4">
          <StyledView className="py-4">
            <StyledText className="font-space text-4xl">
              {metric.value}
              <StyledText className="text-xl"> {metric.unit}</StyledText>
            </StyledText>
            {metric.target && (
              <StyledText className="font-space text-gray-500 mt-1">
                Goal: {metric.target} {metric.unit}
              </StyledText>
            )}
          </StyledView>

          <LineChart
            data={data}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              backgroundColor: "white",
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              decimalPlaces: 0,
              color: () => metric.color,
              labelColor: () => "#AAAAAA",
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: metric.color,
              },
              propsForBackgroundLines: {
                stroke: "#EEEEEE",
              },
              strokeWidth: 2,
            }}
            bezier
            withInnerLines={true}
            withOuterLines={false}
            withDots={true}
          />

          {insight && (
            <StyledView className="bg-white border-2 border-black rounded-3xl p-5 mt-6 mx-[-12px] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <StyledView className="flex-row items-start">
                <StyledView className="w-16 h-16 rounded-full overflow-hidden border-2 border-black bg-[#FFE4D6]">
                  <StyledImage
                    source={require("../../assets/images/zoey/zoey_trainer.png")}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </StyledView>
                <StyledView className="flex-1 ml-4">
                  <StyledText
                    className="font-space text-lg"
                    style={{ color: metric.color }}
                  >
                    {insight.tip}
                  </StyledText>
                  <StyledText className="font-space text-sm text-gray-500 mt-1">
                    {metric.id === "steps"
                      ? "Small walks add up throughout the day"
                      : metric.id === "distance"
                      ? "Every bit of movement counts towards your goal"
                      : metric.id === "sessions"
                      ? "Regular activity improves your overall health"
                      : "Stay active to reach your daily target"}
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>
          )}
        </StyledScrollView>
      </>
    );
  };

  return (
    <StyledSafeAreaView
      className="flex-1"
      style={{ backgroundColor: currentTheme.light }}
      edges={["top"]}
    >
      <StyledView className="flex-1 px-4">
        {/* Header with back button */}
        <StyledView className="flex-row items-center py-4">
          <StyledPressable
            onPress={() =>
              selectedMetric ? setSelectedMetric(null) : router.back()
            }
            className="bg-white border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Feather name="arrow-left" size={20} color="black" />
          </StyledPressable>
          <StyledText className="font-space text-2xl ml-4">
            {selectedMetric
              ? metrics[selectedMetric as keyof typeof metrics].title
              : "Metrics"}
          </StyledText>
        </StyledView>

        {selectedMetric ? (
          renderDetailView()
        ) : (
          <StyledScrollView className="flex-1">
            <StyledView className="flex-row flex-wrap justify-between">
              {renderMetricCard(metrics.steps)}
              {renderMetricCard(metrics.distance)}
              {renderMetricCard(metrics.sessions)}
              {renderMetricCard(metrics.calories)}
            </StyledView>
            {renderTrends()}
          </StyledScrollView>
        )}
      </StyledView>
    </StyledSafeAreaView>
  );
};
