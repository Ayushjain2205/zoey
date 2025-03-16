import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from '@expo/vector-icons';

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
    <StyledSafeAreaView className="flex-1 bg-[#FFE5EC]">
      <StyledView className="flex-1 px-4 pt-2">
        {/* Main Card */}
        <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          {/* Header Section */}
          <StyledView className="flex-row items-center justify-between mb-8">
            {/* Profile and Level */}
            <StyledView className="flex-row items-center">
              {/* Profile Image */}
              <StyledView className="relative">
                <StyledView className="w-16 h-16 border-2 border-black rounded-full overflow-hidden">
                  <StyledImage
                    source={require("../../assets/images/zoey.png")}
                    className="w-full h-full"
                    style={{ borderRadius: 9999 }}
                    resizeMode="cover"
                  />
                </StyledView>
                <StyledView className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#FFB5C5] border-2 border-black rounded-full items-center justify-center">
                  <StyledText style={{ fontFamily: 'SpaceGrotesk_400Regular' }}>5</StyledText>
                </StyledView>
              </StyledView>
              
              {/* Name and Level */}
              <StyledView className="ml-3">
                <StyledText style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-xl mb-1">Zoey</StyledText>
                <StyledView className="flex-row items-center">
                  <StyledView className="bg-[#FFB5C5] border-2 border-black rounded-xl px-3 py-1 mr-2">
                    <StyledText style={{ fontFamily: 'SpaceGrotesk_400Regular' }}>✨ Level 5</StyledText>
                  </StyledView>
                  <StyledView className="bg-[#FFB5C5] border-2 border-black rounded-xl px-3 py-1">
                    <StyledText style={{ fontFamily: 'SpaceGrotesk_400Regular' }}>Level Up</StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
            </StyledView>

            {/* Coins */}
            <StyledView className="bg-[#FFB5C5] border-2 border-black rounded-xl px-4 py-2 flex-row items-center">
              <View className="w-4 h-4 bg-yellow-400 rounded-full mr-2 border border-black" />
              <StyledText style={{ fontFamily: 'SpaceGrotesk_400Regular' }}>1250</StyledText>
            </StyledView>
          </StyledView>

          {/* Attributes Section */}
          {attributes.map((attribute) => (
            <StyledView key={attribute.name} className="mb-4 last:mb-0">
              <StyledView className="flex-row justify-between mb-1">
                <StyledText style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-lg">
                  {attribute.name}
                </StyledText>
                <StyledText style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-lg">
                  {attribute.value}/100
                </StyledText>
              </StyledView>
              <StyledView className="h-5 bg-white rounded-xl border-2 border-black overflow-hidden">
                <StyledView 
                  className="h-full bg-[#FFB5C5] rounded-xl"
                  style={{ width: `${attribute.value}%` }}
                />
              </StyledView>
            </StyledView>
          ))}
        </StyledView>

        {/* Navigation Buttons */}
        <StyledView className="flex-row justify-between my-4">
          {[
            { name: "Shop", icon: "shopping-bag" },
            { name: "Memory", icon: "book" },
            { name: "Wallet", icon: "credit-card" }
          ].map((item) => (
            <StyledPressable
              key={item.name}
              className="bg-white border-2 border-black rounded-xl w-[31%] py-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]"
            >
              <StyledView className="items-center">
                <Feather name={item.icon as any} size={24} color="#FFB5C5" />
                <StyledText style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="mt-2">
                  {item.name}
                </StyledText>
              </StyledView>
            </StyledPressable>
          ))}
        </StyledView>

        {/* Talk To Me Button */}
        <StyledPressable className="bg-[#FFB5C5] border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]">
          <StyledView className="flex-row justify-center items-center">
            <Feather name="message-circle" size={24} color="black" />
            <StyledText style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-xl ml-2">
              Talk to Me
            </StyledText>
          </StyledView>
        </StyledPressable>
      </StyledView>
    </StyledSafeAreaView>
  );
};
