import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

export const InsightsScreen = () => {
  const { currentTheme } = useTheme();

  return (
    <StyledSafeAreaView
      className="flex-1"
      style={{ backgroundColor: currentTheme.light }}
      edges={["top"]}
    >
      {/* Header */}
      <StyledView className="px-4 py-3 border-b-2 border-black bg-white">
        <StyledText className="font-space text-2xl font-bold">
          Insights
        </StyledText>
      </StyledView>

      <StyledScrollView className="flex-1 px-4">
        {/* Mood Trends Card */}
        <StyledView className="mt-4 bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <StyledView className="flex-row items-center mb-4">
            <Feather name="trending-up" size={24} color="black" />
            <StyledText className="font-space text-xl font-bold ml-2">
              Mood Trends
            </StyledText>
          </StyledView>
          <StyledText className="font-space text-base opacity-70">
            Your emotional patterns and progress over time
          </StyledText>
        </StyledView>

        {/* Conversation Analysis Card */}
        <StyledView className="mt-4 bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <StyledView className="flex-row items-center mb-4">
            <Feather name="message-square" size={24} color="black" />
            <StyledText className="font-space text-xl font-bold ml-2">
              Conversation Analysis
            </StyledText>
          </StyledView>
          <StyledText className="font-space text-base opacity-70">
            Key topics and themes from your chats
          </StyledText>
        </StyledView>

        {/* Progress Report Card */}
        <StyledView className="mt-4 bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <StyledView className="flex-row items-center mb-4">
            <Feather name="award" size={24} color="black" />
            <StyledText className="font-space text-xl font-bold ml-2">
              Progress Report
            </StyledText>
          </StyledView>
          <StyledText className="font-space text-base opacity-70">
            Your achievements and growth journey
          </StyledText>
        </StyledView>

        {/* Recommendations Card */}
        <StyledView className="mt-4 mb-4 bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <StyledView className="flex-row items-center mb-4">
            <Feather name="compass" size={24} color="black" />
            <StyledText className="font-space text-xl font-bold ml-2">
              Personalized Recommendations
            </StyledText>
          </StyledView>
          <StyledText className="font-space text-base opacity-70">
            Suggested activities based on your patterns
          </StyledText>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
