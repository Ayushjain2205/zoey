import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);

const screenWidth = Dimensions.get("window").width;

type InsightCategory =
  | "Overview"
  | "Nutrition"
  | "Activity"
  | "Sleep"
  | "Mental";
type TimelineFilter = "Today" | "Week" | "Month" | "Year";
type InsightSource = "User" | "AI" | "Device";

interface StatImpact {
  stamina?: number;
  clarity?: number;
  fuel?: number;
  recovery?: number;
}

interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  tags: string[];
  statImpact: StatImpact;
  timestamp: string;
  source: InsightSource;
}

const CATEGORIES: { id: InsightCategory; emoji: string; label: string }[] = [
  { id: "Overview", emoji: "🎯", label: "Overview" },
  { id: "Nutrition", emoji: "🍽️", label: "Nutrition" },
  { id: "Activity", emoji: "💪", label: "Activity" },
  { id: "Sleep", emoji: "😴", label: "Sleep" },
  { id: "Mental", emoji: "🧠", label: "Mental" },
];

const TIMELINES: { id: TimelineFilter; label: string }[] = [
  { id: "Today", label: "Today" },
  { id: "Week", label: "This Week" },
  { id: "Month", label: "This Month" },
  { id: "Year", label: "This Year" },
];

const MOCK_INSIGHTS: Insight[] = [
  {
    id: "1",
    category: "Activity",
    title: "Better Sleep After Workouts",
    description: "Your sleep duration increased by 38 mins on workout days.",
    tags: ["Sleep", "Workout"],
    statImpact: {
      recovery: 12,
      stamina: 8,
    },
    timestamp: new Date().toISOString(),
    source: "AI",
  },
  {
    id: "2",
    category: "Nutrition",
    title: "Late Meals Affect Sleep",
    description: "Eating after 8 PM correlates with 25% worse sleep quality.",
    tags: ["Sleep", "Nutrition"],
    statImpact: {
      recovery: -8,
      clarity: -5,
    },
    timestamp: new Date().toISOString(),
    source: "AI",
  },
];

const STAT_ICONS = {
  stamina: "⚡️",
  clarity: "🎯",
  fuel: "🔋",
  recovery: "🔄",
};

export const InsightsScreen = () => {
  const { currentTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] =
    useState<InsightCategory>("Overview");
  const [selectedTimeline, setSelectedTimeline] =
    useState<TimelineFilter>("Today");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isTimelineModalVisible, setIsTimelineModalVisible] = useState(false);

  const renderSelectModal = (
    isVisible: boolean,
    onClose: () => void,
    options: any[],
    selectedValue: string,
    onSelect: (value: any) => void
  ) => (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StyledPressable className="flex-1 bg-black/50" onPress={onClose}>
        <StyledView className="mt-32 mx-4">
          <StyledView className="bg-white border-2 border-black rounded-3xl overflow-hidden">
            {options.map((option) => (
              <StyledPressable
                key={option.id}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
                className={`p-4 border-b border-black/10 active:bg-black/5 ${
                  selectedValue === option.id ? "bg-black/5" : ""
                }`}
              >
                <StyledView className="flex-row items-center">
                  {option.emoji && (
                    <StyledText className="text-xl mr-2">
                      {option.emoji}
                    </StyledText>
                  )}
                  <StyledText className="font-space text-base flex-1">
                    {option.label}
                  </StyledText>
                  {selectedValue === option.id && (
                    <Feather name="check" size={20} color="black" />
                  )}
                </StyledView>
              </StyledPressable>
            ))}
          </StyledView>
        </StyledView>
      </StyledPressable>
    </Modal>
  );

  const renderInsightCard = (insight: Insight) => {
    return (
      <StyledView
        key={insight.id}
        className="bg-white border-2 border-black rounded-3xl p-4 mb-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
      >
        <StyledView className="flex-row items-start justify-between">
          <StyledView className="flex-1">
            <StyledText className="font-space text-lg">
              {insight.title}
            </StyledText>
            <StyledText className="font-space text-base text-gray-600 mt-1">
              {insight.description}
            </StyledText>
          </StyledView>
          <StyledView className="bg-black rounded-full p-2">
            <StyledText>
              {insight.source === "AI"
                ? "🤖"
                : insight.source === "Device"
                ? "⌚️"
                : "👤"}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Tags */}
        <StyledView className="flex-row flex-wrap mt-3">
          {insight.tags.map((tag) => (
            <StyledView
              key={tag}
              className="bg-black/10 rounded-full px-3 py-1 mr-2 mb-2"
            >
              <StyledText className="font-space text-sm">#{tag}</StyledText>
            </StyledView>
          ))}
        </StyledView>

        {/* Stat Impact */}
        {Object.entries(insight.statImpact).length > 0 && (
          <StyledView className="flex-row flex-wrap mt-2">
            {Object.entries(insight.statImpact).map(([stat, value]) => (
              <StyledView
                key={stat}
                className="flex-row items-center bg-black/5 rounded-full px-3 py-1 mr-2"
              >
                <StyledText>
                  {STAT_ICONS[stat as keyof typeof STAT_ICONS]}
                </StyledText>
                <StyledText
                  className="font-space text-sm ml-1"
                  style={{ color: value > 0 ? "#22C55E" : "#EF4444" }}
                >
                  {stat.charAt(0).toUpperCase() + stat.slice(1)}{" "}
                  {value > 0 ? "+" : ""}
                  {value}
                </StyledText>
              </StyledView>
            ))}
          </StyledView>
        )}
      </StyledView>
    );
  };

  return (
    <StyledSafeAreaView
      className="flex-1"
      style={{ backgroundColor: currentTheme.light }}
      edges={["top"]}
    >
      {/* Header */}
      <StyledView className="flex-row items-center justify-between p-4">
        <StyledView className="flex-row items-center">
          <StyledPressable
            onPress={() => router.back()}
            className="bg-white border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Feather name="arrow-left" size={20} color="black" />
          </StyledPressable>
          <StyledText className="font-space text-2xl ml-4">Insights</StyledText>
        </StyledView>
      </StyledView>

      {/* Filters */}
      <StyledView className="flex-row px-4 mb-4">
        <StyledPressable
          onPress={() => setIsCategoryModalVisible(true)}
          className="flex-1 mr-2 bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          <StyledView className="flex-row items-center justify-between">
            <StyledView className="flex-row items-center">
              <StyledText className="text-lg mr-2">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.emoji}
              </StyledText>
              <StyledText className="font-space">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
              </StyledText>
            </StyledView>
            <Feather name="chevron-down" size={20} color="black" />
          </StyledView>
        </StyledPressable>

        <StyledPressable
          onPress={() => setIsTimelineModalVisible(true)}
          className="flex-1 bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          <StyledView className="flex-row items-center justify-between">
            <StyledText className="font-space">
              {TIMELINES.find((t) => t.id === selectedTimeline)?.label}
            </StyledText>
            <Feather name="chevron-down" size={20} color="black" />
          </StyledView>
        </StyledPressable>
      </StyledView>

      {/* Content */}
      <StyledScrollView className="flex-1 px-4">
        {selectedCategory === "Overview" && (
          <StyledView className="bg-white border-2 border-black rounded-3xl p-4 mb-4">
            <StyledView className="flex-row items-center mb-3">
              <StyledView className="w-12 h-12 rounded-full overflow-hidden">
                <StyledImage
                  source={require("../../assets/images/zoey/zoey_trainer.png")}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </StyledView>
              <StyledText className="font-space text-lg ml-3">
                Zoey's Take 🎯
              </StyledText>
            </StyledView>
            <StyledText className="font-space text-base text-gray-600">
              You've been less focused in the mornings. Try hydrating more
              before 11 AM. Also, workouts seem to improve your clarity
              significantly.
            </StyledText>
          </StyledView>
        )}

        {MOCK_INSIGHTS.filter(
          (insight) =>
            selectedCategory === "Overview" ||
            insight.category === selectedCategory
        ).map(renderInsightCard)}
      </StyledScrollView>

      {/* Modals */}
      {renderSelectModal(
        isCategoryModalVisible,
        () => setIsCategoryModalVisible(false),
        CATEGORIES,
        selectedCategory,
        setSelectedCategory
      )}
      {renderSelectModal(
        isTimelineModalVisible,
        () => setIsTimelineModalVisible(false),
        TIMELINES,
        selectedTimeline,
        setSelectedTimeline
      )}
    </StyledSafeAreaView>
  );
};
