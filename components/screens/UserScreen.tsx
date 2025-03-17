import React, { useState } from "react";
import { View, Text, Image, Pressable, Animated } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
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

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Chat with Zoey for 5 minutes",
      coins: 50,
      completed: true,
    },
    {
      id: 2,
      title: "Complete a wellness session",
      coins: 75,
      completed: false,
    },
    { id: 3, title: "Save a memory", coins: 25, completed: true },
  ]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      friction: 10,
    }).start();
  };

  const toggleChallenge = (id: number) => {
    setChallenges(
      challenges.map((challenge) =>
        challenge.id === id
          ? { ...challenge, completed: !challenge.completed }
          : challenge
      )
    );
  };

  const completedCount = challenges.filter((c) => c.completed).length;
  const canClaimRewards = completedCount > 0;

  const handleClaimRewards = () => {
    // Here you would add logic to credit coins and reset challenges
    console.log("Claiming rewards...");
  };

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // Adjust this value based on your content
  });

  const rotateArrow = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <StyledSafeAreaView className="flex-1 bg-[#FFE5EC]" edges={["top"]}>
      <StyledView className="flex-1 px-4 pt-2">
        {/* Main Card */}
        <StyledView className="flex-1 space-y-4">
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

          {/* Daily Challenges Card */}
          <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            {/* Header - Always visible */}
            <StyledPressable
              onPress={toggleExpand}
              className="flex-row items-center justify-between"
            >
              <StyledView className="flex-row items-center space-x-2">
                <StyledText className="font-space text-xl font-bold">
                  Daily Challenges
                </StyledText>
                <StyledView className="bg-[#FFE5EC] px-3 py-1 rounded-xl border-2 border-black">
                  <StyledText className="font-space text-sm">
                    {completedCount}/{challenges.length}
                  </StyledText>
                </StyledView>
              </StyledView>
              <Animated.View style={{ transform: [{ rotate: rotateArrow }] }}>
                <Feather name="chevron-down" size={24} color="black" />
              </Animated.View>
            </StyledPressable>

            {/* Expandable Content */}
            <Animated.View style={{ maxHeight, overflow: "hidden" }}>
              <StyledView className="space-y-2.5 mt-4">
                {challenges.map((challenge) => (
                  <StyledPressable
                    key={challenge.id}
                    onPress={() => toggleChallenge(challenge.id)}
                    className={`p-3 border-2 border-black rounded-xl active:scale-[0.98] ${
                      challenge.completed ? "bg-[#DCFCE7]" : "bg-[#FFE5EC]"
                    }`}
                  >
                    <StyledView className="flex-row items-center justify-between">
                      <StyledView className="flex-row items-center flex-1 mr-3">
                        <StyledView
                          className={`w-5 h-5 rounded-md border-2 border-black items-center justify-center ${
                            challenge.completed ? "bg-[#86EFAC]" : "bg-white"
                          }`}
                        >
                          {challenge.completed && (
                            <Ionicons
                              name="checkmark-sharp"
                              size={14}
                              color="black"
                            />
                          )}
                        </StyledView>
                        <StyledText
                          className={`ml-2.5 font-space text-sm ${
                            challenge.completed ? "line-through opacity-70" : ""
                          }`}
                        >
                          {challenge.title}
                        </StyledText>
                      </StyledView>
                      <StyledView
                        className={`px-2.5 py-0.5 rounded-lg border-2 border-black ${
                          challenge.completed ? "bg-[#86EFAC]" : "bg-white"
                        }`}
                      >
                        <StyledText className="font-space text-xs">
                          +{challenge.coins}
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  </StyledPressable>
                ))}

                <StyledPressable
                  onPress={handleClaimRewards}
                  className={`mt-4 flex-row items-center justify-center p-3.5 rounded-xl border-2 border-black ${
                    canClaimRewards
                      ? "bg-[#FFB5C5] opacity-100"
                      : "bg-[#FFE5EC] opacity-50"
                  }`}
                  disabled={!canClaimRewards}
                >
                  <Feather name="award" size={18} color="black" />
                  <StyledText className="font-space text-sm ml-2">
                    Claim Daily Rewards
                  </StyledText>
                </StyledPressable>
              </StyledView>
            </Animated.View>
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
