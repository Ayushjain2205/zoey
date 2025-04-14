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
import { Svg, Path, Circle, G, Text as SvgText } from "react-native-svg";

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
  | "Mental"
  | "Recovery"
  | "Hormones";
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
  { id: "Hormones", emoji: "🧬", label: "Hormones" },
  { id: "Mental", emoji: "🧠", label: "Mental" },
  { id: "Sleep", emoji: "😴", label: "Sleep" },
  { id: "Activity", emoji: "💪", label: "Activity" },
  { id: "Nutrition", emoji: "🍽️", label: "Nutrition" },
  { id: "Recovery", emoji: "💧", label: "Recovery" },
];

const TIMELINES: { id: TimelineFilter; label: string }[] = [
  { id: "Today", label: "Today" },
  { id: "Week", label: "This Week" },
  { id: "Month", label: "This Month" },
  { id: "Year", label: "This Year" },
];

const CATEGORY_ICONS = {
  Activity: "💪",
  Nutrition: "🍽",
  Sleep: "😴",
  Mental: "🧠",
  Recovery: "💧",
  Hormones: "🧬",
};

const MOCK_INSIGHTS: Insight[] = [
  {
    id: "1",
    category: "Activity",
    title: "Skipped Workout → Mood Drop",
    description: "Mood score dropped the next day after missing a workout",
    tags: ["Workout", "Mood"],
    statImpact: {
      clarity: -6,
    },
    timestamp: "1d ago",
    source: "AI",
  },
  {
    id: "2",
    category: "Nutrition",
    title: "Heart Rate Spike After Eating",
    description:
      "Your heart rate increased by an average of 18 bpm after meals",
    tags: ["Heart Rate", "Meals"],
    statImpact: {
      stamina: 10,
    },
    timestamp: "2d ago",
    source: "Device",
  },
  {
    id: "3",
    category: "Recovery",
    title: "Low Hydration Levels",
    description: "Daily water intake stayed below 1.5 liters this week",
    tags: ["Hydration"],
    statImpact: {
      fuel: 5,
    },
    timestamp: "3d ago",
    source: "Device",
  },
  {
    id: "4",
    category: "Sleep",
    title: "Better Sleep After Walk",
    description: "You slept for 40 min longer after your evening walk",
    tags: ["Sleep", "Activity"],
    statImpact: {
      recovery: 8,
    },
    timestamp: "4d ago",
    source: "AI",
  },
  {
    id: "5",
    category: "Hormones",
    title: "Cycle Phase Impact",
    description: "Mood swings were more frequent around your cycle phase",
    tags: ["Cycle", "Mood"],
    statImpact: {
      clarity: -8,
      recovery: -5,
    },
    timestamp: "2d ago",
    source: "AI",
  },
  {
    id: "6",
    category: "Hormones",
    title: "Luteal Phase Energy Dip",
    description:
      "You experienced lower energy and recovery during luteal phase",
    tags: ["Cycle", "Energy"],
    statImpact: {
      stamina: -12,
      recovery: -8,
    },
    timestamp: "3d ago",
    source: "AI",
  },
  {
    id: "7",
    category: "Sleep",
    title: "Screen Time Impact",
    description:
      "Increased screen time after 9PM correlated with reduced deep sleep",
    tags: ["Sleep", "Screen Time"],
    statImpact: {
      recovery: -10,
      clarity: -8,
    },
    timestamp: "1d ago",
    source: "Device",
  },
  {
    id: "8",
    category: "Activity",
    title: "Cold Shower Benefits",
    description:
      "Heart rate variability improved after cold exposure in the morning",
    tags: ["Recovery", "HRV"],
    statImpact: {
      clarity: 5,
      stamina: 3,
    },
    timestamp: "4h ago",
    source: "Device",
  },
  {
    id: "9",
    category: "Mental",
    title: "Meditation Streak Impact",
    description: "Meditation streak of 4 days = increased Clarity by 12%",
    tags: ["Meditation", "Focus"],
    statImpact: {
      clarity: 12,
      recovery: 8,
    },
    timestamp: "1d ago",
    source: "AI",
  },
  {
    id: "10",
    category: "Mental",
    title: "Missed Journaling Effect",
    description: "Skipping journaling = 23% increase in mood fluctuations",
    tags: ["Journaling", "Mood"],
    statImpact: {
      clarity: -6,
    },
    timestamp: "2d ago",
    source: "AI",
  },
  {
    id: "11",
    category: "Sleep",
    title: "Phone Usage Impact",
    description: "Phone usage before bed → delayed REM cycle by 45 mins",
    tags: ["Sleep", "Screen Time"],
    statImpact: {
      recovery: -15,
      clarity: -10,
    },
    timestamp: "12h ago",
    source: "Device",
  },
  {
    id: "12",
    category: "Hormones",
    title: "Cortisol Alert",
    description: "Cortisol levels were elevated on days with <5 hours sleep",
    tags: ["Sleep", "Stress"],
    statImpact: {
      recovery: -12,
      clarity: -8,
    },
    timestamp: "5h ago",
    source: "Device",
  },
  {
    id: "13",
    category: "Mental",
    title: "Anxiety Pattern Detected",
    description:
      "Higher anxiety levels reported during morning meetings (9-11 AM)",
    tags: ["Anxiety", "Work"],
    statImpact: {
      clarity: -15,
      recovery: -8,
    },
    timestamp: "6h ago",
    source: "AI",
  },
  {
    id: "14",
    category: "Mental",
    title: "Social Interaction Impact",
    description: "30+ mins of social activity reduced anxiety levels by 45%",
    tags: ["Anxiety", "Social"],
    statImpact: {
      clarity: 12,
      recovery: 8,
    },
    timestamp: "1d ago",
    source: "AI",
  },
  {
    id: "15",
    category: "Mental",
    title: "Stress Response Alert",
    description: "Breathing rate increased during back-to-back meetings",
    tags: ["Stress", "Work"],
    statImpact: {
      clarity: -10,
      stamina: -8,
    },
    timestamp: "3h ago",
    source: "Device",
  },
  {
    id: "16",
    category: "Mental",
    title: "Emotional Regulation Win",
    description: "Deep breathing exercises helped reduce stress peaks by 60%",
    tags: ["Stress", "Breathing"],
    statImpact: {
      clarity: 15,
      recovery: 10,
    },
    timestamp: "2h ago",
    source: "Device",
  },
  {
    id: "17",
    category: "Mental",
    title: "Focus Session Analysis",
    description:
      "Anxiety decreased after 20-min focused work blocks with breaks",
    tags: ["Focus", "Anxiety"],
    statImpact: {
      clarity: 8,
      stamina: 5,
    },
    timestamp: "4h ago",
    source: "AI",
  },
  {
    id: "18",
    category: "Mental",
    title: "Evening Routine Impact",
    description: "Consistent evening routine reduced nighttime anxiety by 35%",
    tags: ["Anxiety", "Sleep"],
    statImpact: {
      recovery: 12,
      clarity: 8,
    },
    timestamp: "8h ago",
    source: "AI",
  },
  {
    id: "19",
    category: "Mental",
    title: "Work-Break Balance",
    description:
      "Missing lunch breaks correlated with 40% higher stress levels",
    tags: ["Stress", "Work"],
    statImpact: {
      clarity: -12,
      stamina: -10,
    },
    timestamp: "5h ago",
    source: "AI",
  },
  {
    id: "20",
    category: "Mental",
    title: "Nature Walk Effect",
    description: "15-min outdoor walks reduced anxiety symptoms by 25%",
    tags: ["Anxiety", "Activity"],
    statImpact: {
      clarity: 10,
      recovery: 8,
    },
    timestamp: "7h ago",
    source: "Device",
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
  const [isMapView, setIsMapView] = useState(false);

  const getAggregatedStats = () => {
    const stats = {
      Clarity: 0,
      Recovery: 0,
      Stamina: 0,
      Focus: 0,
      Energy: 0,
    };

    const relevantInsights = MOCK_INSIGHTS.filter(
      (insight) =>
        selectedCategory === "Overview" || insight.category === selectedCategory
    );

    relevantInsights.forEach((insight) => {
      Object.entries(insight.statImpact).forEach(([stat, value]) => {
        const normalizedStat = stat.charAt(0).toUpperCase() + stat.slice(1);
        if (stats.hasOwnProperty(normalizedStat)) {
          stats[normalizedStat as keyof typeof stats] += value;
        }
      });
    });

    // Normalize values between 0 and 100
    Object.keys(stats).forEach((key) => {
      const value = stats[key as keyof typeof stats];
      stats[key as keyof typeof stats] = Math.min(
        Math.max((value + 100) / 2, 0),
        100
      );
    });

    return stats;
  };

  const renderRadarChart = () => {
    const stats = getAggregatedStats();
    const values = Object.values(stats);
    const labels = Object.keys(stats);
    const numPoints = values.length;
    const angleStep = (Math.PI * 2) / numPoints;
    const center = { x: 150, y: 160 };
    const radius = 100;
    const maxValue = 100;

    // Calculate points for the radar
    const points = values.map((value, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const distance = (value / maxValue) * radius;
      return {
        x: center.x + distance * Math.cos(angle),
        y: center.y + distance * Math.sin(angle),
      };
    });

    // Create path for the radar shape
    const pathData =
      points
        .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x},${point.y}`)
        .join(" ") + " Z";

    // Create background grid lines
    const gridLines = [0.25, 0.5, 0.75, 1].map((scale) => {
      const gridPoints = Array.from({ length: numPoints }).map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const distance = radius * scale;
        return {
          x: center.x + distance * Math.cos(angle),
          y: center.y + distance * Math.sin(angle),
        };
      });
      return (
        gridPoints
          .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x},${point.y}`)
          .join(" ") + " Z"
      );
    });

    const getEmoji = (label: string) => {
      switch (label) {
        case "Clarity":
          return "🎯";
        case "Recovery":
          return "🔄";
        case "Stamina":
          return "⚡️";
        case "Focus":
          return "👀";
        case "Energy":
          return "✨";
        default:
          return "⭐️";
      }
    };

    return (
      <StyledView className="items-center mt-4 bg-white border-2 border-black rounded-3xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <StyledText className="font-space text-xl mb-4">
          Insights Map
        </StyledText>
        <Svg width={300} height={350}>
          {/* Background grid */}
          {gridLines.map((line, i) => (
            <Path
              key={`grid-${i}`}
              d={line}
              stroke="#00000010"
              strokeWidth="1"
              fill="none"
            />
          ))}

          {/* Axis lines */}
          {points.map((point, i) => (
            <Path
              key={`axis-${i}`}
              d={`M ${center.x},${center.y} L ${point.x},${point.y}`}
              stroke="#00000010"
              strokeWidth="1"
            />
          ))}

          {/* Data shape with gradient */}
          <Path
            d={pathData}
            fill="rgba(0, 0, 0, 0.05)"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points with cute circles */}
          {points.map((point, i) => (
            <G key={`point-${i}`}>
              <Circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              <Circle cx={point.x} cy={point.y} r="3" fill="black" />
            </G>
          ))}

          {/* Labels with emojis */}
          {labels.map((label, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const labelDistance = radius + 35;
            const x = center.x + labelDistance * Math.cos(angle);
            const y = center.y + labelDistance * Math.sin(angle);
            const value = values[i].toFixed(0);
            return (
              <G key={`label-${i}`}>
                <SvgText
                  x={x}
                  y={y - 12}
                  fill="black"
                  fontSize="16"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {getEmoji(label)}
                </SvgText>
                <SvgText
                  x={x}
                  y={y + 8}
                  fill="black"
                  fontSize="12"
                  fontFamily="SpaceGrotesk"
                  fontWeight="500"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {label}
                </SvgText>
              </G>
            );
          })}

          {/* Center decoration */}
          <Circle
            cx={center.x}
            cy={center.y}
            r="4"
            fill="white"
            stroke="black"
            strokeWidth="2"
          />
        </Svg>
      </StyledView>
    );
  };

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
    const getStatColor = (value: number) => {
      return value > 0 ? "#22C55E" : "#EF4444";
    };

    const getStatArrow = (value: number) => {
      return value > 0 ? "▲" : "▼";
    };

    return (
      <StyledPressable
        key={insight.id}
        className="bg-white border-2 border-black rounded-3xl p-4 mb-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
      >
        {/* Icon and Title */}
        <StyledView>
          <StyledText className="font-space text-xl mb-1">
            {CATEGORY_ICONS[insight.category as keyof typeof CATEGORY_ICONS]}{" "}
            {insight.title}
          </StyledText>
          <StyledText className="font-space text-base text-gray-900 mb-3">
            {insight.description}
          </StyledText>
        </StyledView>

        {/* Category and Time */}
        <StyledView className="flex-row items-center justify-between">
          <StyledView className="flex-row items-center">
            <StyledText className="font-space text-sm text-gray-500">
              {insight.category}
            </StyledText>
            <StyledText className="font-space text-sm text-gray-500">
              {" · "}
              {insight.timestamp}
            </StyledText>
          </StyledView>

          {/* Impact Metrics */}
          <StyledView className="flex-row items-center space-x-2">
            {Object.entries(insight.statImpact).map(([stat, value]) => (
              <StyledView key={stat} className="flex-row items-center">
                <StyledText
                  style={{ color: getStatColor(value), fontSize: 12 }}
                >
                  {getStatArrow(value)}
                </StyledText>
                <StyledText
                  className="font-space text-base ml-1"
                  style={{ color: getStatColor(value) }}
                >
                  {value > 0 ? "+" : ""}
                  {Math.abs(value)}{" "}
                  {stat.charAt(0).toUpperCase() + stat.slice(1)}
                </StyledText>
              </StyledView>
            ))}
          </StyledView>
        </StyledView>
      </StyledPressable>
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
        <StyledPressable
          onPress={() => setIsMapView(!isMapView)}
          className="bg-white border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
        >
          <Feather
            name={isMapView ? "list" : "activity"}
            size={20}
            color="black"
          />
        </StyledPressable>
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
              <StyledText className="font-space text-base">
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
            <StyledText className="font-space text-base">
              {TIMELINES.find((t) => t.id === selectedTimeline)?.label}
            </StyledText>
            <Feather name="chevron-down" size={20} color="black" />
          </StyledView>
        </StyledPressable>
      </StyledView>

      {/* Content */}
      <StyledScrollView className="flex-1 px-4">
        {selectedCategory === "Overview" && !isMapView && (
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

        {isMapView
          ? renderRadarChart()
          : MOCK_INSIGHTS.filter(
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
