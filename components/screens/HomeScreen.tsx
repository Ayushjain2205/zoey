import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledImage = styled(Image);
const StyledSafeAreaView = styled(SafeAreaView);

export const HomeScreen = () => {
  const { currentTheme } = useTheme();

  return (
    <StyledSafeAreaView
      className="flex-1"
      style={{ backgroundColor: currentTheme.light }}
    >
      <StyledView className="flex-1 px-4">
        {/* Header */}
        <StyledView className="flex-row items-center justify-between py-4">
          <StyledText className="font-space text-2xl font-bold">
            Home
          </StyledText>
          <StyledView className="flex-row items-center">
            <StyledView className="w-4 h-4 bg-yellow-400 rounded-full border border-black mr-1.5" />
            <StyledText className="font-space text-lg">2,450</StyledText>
          </StyledView>
        </StyledView>

        {/* Main Content */}
        <StyledView className="flex-1 justify-center items-center">
          <StyledPressable
            onPress={() => router.push("/chat")}
            className="border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
            style={{ backgroundColor: currentTheme.main }}
          >
            <StyledText className="font-space text-lg font-bold">
              Chat with Zoey
            </StyledText>
          </StyledPressable>
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
};
