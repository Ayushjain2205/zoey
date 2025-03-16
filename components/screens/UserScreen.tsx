import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NeuButton } from "../functional/NeuButton";
import { router } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);

export const UserScreen = () => {
  const attributes = [
    { name: "Empathy", value: 85 },
    { name: "Wisdom", value: 68 },
    { name: "Energy", value: 92 },
    { name: "Creativity", value: 78 },
  ];

  return (
    <StyledSafeAreaView className="flex-1 bg-[#FFE5EC]" edges={["top"]}>
      <StyledView className="flex-1 px-4 pt-2">
        {/* Main Card */}
        <StyledView className="flex-1">
          <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            {/* Header Section */}
            <StyledView className="flex-row items-center justify-between mb-4">
              {/* Profile and Level */}
              <StyledView className="flex-row items-center">
                {/* Profile Image */}
                <StyledView className="relative">
                  <StyledView className="w-20 h-20 border-2 border-black rounded-full overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                    <StyledImage
                      source={require("../../assets/images/zoey.png")}
                      className="w-full h-full"
                      style={{ borderRadius: 9999 }}
                      resizeMode="cover"
                    />
                  </StyledView>
                  <StyledView className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FFB5C5] border-2 border-black rounded-full items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <StyledText className="font-space text-xs">5</StyledText>
                  </StyledView>
                </StyledView>

                {/* Name and Level */}
                <StyledView className="ml-3">
                  <StyledText className="font-doodle text-2xl">Zoey</StyledText>
                  <StyledView className="flex-row items-center mt-1">
                    <StyledPressable className="bg-[#FFB5C5] border-2 border-black rounded-xl px-2 py-0.5 mr-2 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]">
                      <StyledText className="font-space text-xs">
                        ✨ Level
                      </StyledText>
                    </StyledPressable>
                    <StyledPressable className="bg-[#FFB5C5] border-2 border-black rounded-xl px-2 py-0.5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]">
                      <StyledText className="font-space text-xs">
                        Level Up
                      </StyledText>
                    </StyledPressable>
                  </StyledView>
                </StyledView>
              </StyledView>

              {/* Coins */}
              <StyledPressable className="bg-[#FFB5C5] border-2 border-black rounded-xl w-8 h-8 items-center justify-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]">
                <StyledView className="w-3.5 h-3.5 bg-yellow-400 rounded-full border border-black" />
              </StyledPressable>
            </StyledView>

            {/* Attributes Section */}
            <StyledView className="flex-row flex-wrap justify-between">
              {attributes.map((attribute) => (
                <StyledView
                  key={attribute.name}
                  className="w-[48%] mb-2 last:mb-0"
                >
                  <StyledView className="flex-row justify-between">
                    <StyledText className="font-space text-xs">
                      {attribute.name}
                    </StyledText>
                    <StyledText className="font-space text-xs">
                      {attribute.value}
                    </StyledText>
                  </StyledView>
                  <StyledView className="h-2 bg-white rounded-xl border-2 border-black overflow-hidden mt-0.5">
                    <StyledView
                      className="h-full bg-[#FFB5C5] rounded-xl"
                      style={{ width: `${attribute.value}%` }}
                    />
                  </StyledView>
                </StyledView>
              ))}
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Bottom Navigation */}
        <StyledView className="mt-auto mb-6">
          {/* Navigation Buttons */}
          <StyledView className="flex-row justify-between mb-3">
            {[
              { name: "Shop", icon: "shopping-bag", route: "/shop" as const },
              { name: "Memory", icon: "book", route: "/memory" as const },
              {
                name: "Wallet",
                icon: "credit-card",
                route: "/wallet" as const,
              },
            ].map((item) => (
              <StyledPressable
                key={item.name}
                onPress={() => router.push(item.route)}
                className="bg-white border-2 border-black rounded-xl w-[31%] py-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]"
              >
                <StyledView className="items-center">
                  <Feather name={item.icon as any} size={22} color="#FFB5C5" />
                  <StyledText className="font-space mt-1 text-sm">
                    {item.name}
                  </StyledText>
                </StyledView>
              </StyledPressable>
            ))}
          </StyledView>

          {/* Talk To Me Button */}
          <NeuButton
            onPress={() => router.push("/chat")}
            width="100%"
            color="#FFB5C5"
          >
            <StyledView className="flex-row justify-center items-center px-4">
              <Feather name="message-circle" size={22} color="black" />
              <StyledText className="font-space text-lg ml-2">
                Talk to Me
              </StyledText>
            </StyledView>
          </NeuButton>
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
};
