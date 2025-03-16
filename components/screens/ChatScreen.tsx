import React from "react";
import { View, Text, Pressable } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledSafeAreaView = styled(SafeAreaView);

export const ChatScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-[#FFE5EC]" edges={["top"]}>
      <StyledView className="flex-1 px-4">
        {/* Header with back button */}
        <StyledView className="flex-row items-center py-4">
          <StyledPressable
            onPress={() => router.back()}
            className="bg-white border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Feather name="arrow-left" size={20} color="black" />
          </StyledPressable>
          <StyledText className="font-doodle text-2xl ml-4">
            Chat with Zoey
          </StyledText>
        </StyledView>

        {/* Chat content area */}
        <StyledView className="flex-1 bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <StyledText className="font-space text-center text-gray-500">
            Start chatting with Zoey!
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
};
