import React, { useState } from "react";
import { View, Text, Image, Pressable, Animated, Modal } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { NeuButton } from "../functional/NeuButton";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useCoins } from "../../context/CoinsContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);

export const UserScreen = () => {
  const { currentTheme, selectedMode } = useTheme();
  const { coins, addCoins } = useCoins();
  const attributes = [
    { name: "Stamina", icon: "🔥", value: 85 },
    { name: "Clarity", icon: "🧠", value: 68 },
    { name: "Recovery", icon: "😴", value: 92 },
    { name: "Fuel", icon: "🥗", value: 78 },
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

  const [streaks] = useState([
    {
      id: 1,
      category: "Workout",
      icon: "activity",
      streak: 5,
      color: "#FCA5A5", // Light red
    },
    {
      id: 2,
      category: "Meditation",
      icon: "moon",
      streak: 12,
      color: "#93C5FD", // Light blue
    },
    {
      id: 3,
      category: "Journaling",
      icon: "edit-3",
      streak: 3,
      color: "#86EFAC", // Light green
    },
    {
      id: 4,
      category: "Eat Clean",
      icon: "heart",
      streak: 7,
      color: "#FCD34D", // Light yellow
    },
  ]);

  // Track which section is expanded
  const [expandedSection, setExpandedSection] = useState<
    "challenges" | "streaks" | null
  >(null);
  const [challengesAnimation] = useState(new Animated.Value(0));
  const [streaksAnimation] = useState(new Animated.Value(0));

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [lastCompletedChallenge, setLastCompletedChallenge] = useState<{
    title: string;
    coins: number;
  } | null>(null);

  const toggleSection = (section: "challenges" | "streaks") => {
    const toValue = expandedSection === section ? 0 : 1;

    // Collapse the other section if it's open
    if (expandedSection && expandedSection !== section) {
      Animated.spring(
        section === "challenges" ? streaksAnimation : challengesAnimation,
        {
          toValue: 0,
          useNativeDriver: false,
          friction: 10,
        }
      ).start();
    }

    // Expand/collapse the clicked section
    Animated.spring(
      section === "challenges" ? challengesAnimation : streaksAnimation,
      {
        toValue,
        useNativeDriver: false,
        friction: 10,
      }
    ).start();

    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleChallenge = (id: number) => {
    setChallenges(
      challenges.map((challenge) => {
        if (challenge.id === id) {
          const wasCompleted = challenge.completed;
          const newCompleted = !wasCompleted;

          // Show reward modal when completing a challenge
          if (!wasCompleted && newCompleted) {
            setLastCompletedChallenge({
              title: challenge.title,
              coins: challenge.coins,
            });
            addCoins(challenge.coins);
            setShowRewardModal(true);
          }

          return { ...challenge, completed: newCompleted };
        }
        return challenge;
      })
    );
  };

  const completedCount = challenges.filter((c) => c.completed).length;
  const canClaimRewards = completedCount > 0;

  const handleClaimRewards = () => {
    // Here you would add logic to credit coins and reset challenges
    console.log("Claiming rewards...");
  };

  const challengesMaxHeight = challengesAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 270],
  });

  const streaksMaxHeight = streaksAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const challengesRotateArrow = challengesAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const streaksRotateArrow = streaksAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <StyledSafeAreaView
      className="flex-1"
      style={{ backgroundColor: currentTheme.light }}
      edges={["top"]}
    >
      <StyledView className="flex-1 px-4">
        {/* Main Card */}
        <StyledView className="flex-1 space-y-4">
          <StyledView className="bg-white border-2 border-black rounded-xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <StyledView className="flex-row">
              {/* Left Section - Profile and Coins */}
              <StyledView className="w-32">
                {/* Profile Image */}
                <StyledView className="w-24 h-24 border-2 border-black rounded-full overflow-hidden">
                  <StyledImage
                    source={selectedMode.image}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </StyledView>

                {/* Coins */}
                <StyledView className="flex-row items-center mt-4">
                  <StyledView className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-black mr-2" />
                  <StyledText className="font-space text-base">
                    {coins.toLocaleString()}
                  </StyledText>
                </StyledView>
              </StyledView>

              {/* Right Section - Attributes */}
              <StyledView className="flex-1 justify-between">
                {attributes.map((attribute) => (
                  <StyledView
                    key={attribute.name}
                    className="flex-row items-center last:mb-0"
                  >
                    <StyledView className="w-24 flex-row items-center">
                      <StyledText className="font-space text-lg mr-2">
                        {attribute.icon}
                      </StyledText>
                      <StyledText className="font-space text-sm">
                        {attribute.name}
                      </StyledText>
                    </StyledView>
                    <StyledView className="flex-1 flex-row items-center">
                      <StyledView className="flex-1 h-4 bg-white rounded-full border-2 border-black overflow-hidden mr-3">
                        <StyledView
                          className="h-full rounded-full"
                          style={{
                            width: `${attribute.value}%`,
                            backgroundColor: currentTheme.main,
                          }}
                        />
                      </StyledView>
                      <StyledText className="font-space text-base w-8">
                        {attribute.value}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                ))}
              </StyledView>
            </StyledView>
          </StyledView>

          {/* Daily Challenges Card */}
          <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            {/* Header - Always visible */}
            <StyledPressable
              onPress={() => toggleSection("challenges")}
              className="flex-row items-center justify-between"
            >
              <StyledView className="flex-row items-center space-x-2">
                <StyledText className="font-space text-xl font-bold">
                  Daily Challenges
                </StyledText>
                <StyledView
                  className="px-3 py-1 rounded-xl border-2 border-black"
                  style={{ backgroundColor: currentTheme.light }}
                >
                  <StyledText className="font-space text-sm">
                    {completedCount}/{challenges.length}
                  </StyledText>
                </StyledView>
              </StyledView>
              <Animated.View
                style={{ transform: [{ rotate: challengesRotateArrow }] }}
              >
                <Feather name="chevron-down" size={24} color="black" />
              </Animated.View>
            </StyledPressable>

            {/* Expandable Content */}
            <Animated.View
              style={{ maxHeight: challengesMaxHeight, overflow: "hidden" }}
            >
              <StyledView className="space-y-2.5 mt-4">
                {challenges.map((challenge) => (
                  <StyledPressable
                    key={challenge.id}
                    onPress={() => toggleChallenge(challenge.id)}
                    className={`p-3 border-2 border-black rounded-xl active:scale-[0.98]`}
                    style={{
                      backgroundColor: challenge.completed
                        ? "#DCFCE7"
                        : currentTheme.light,
                    }}
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
                  className={`mt-2 flex-row items-center justify-center py-2.5 px-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]`}
                  style={{
                    backgroundColor: canClaimRewards
                      ? currentTheme.main
                      : currentTheme.light,
                    opacity: canClaimRewards ? 1 : 0.5,
                  }}
                  disabled={!canClaimRewards}
                >
                  <Feather name="award" size={16} color="black" />
                  <StyledText className="font-space text-sm ml-1.5">
                    Claim Daily Rewards
                  </StyledText>
                </StyledPressable>
              </StyledView>
            </Animated.View>
          </StyledView>

          {/* Streaks Card */}
          <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            {/* Header - Always visible */}
            <StyledPressable
              onPress={() => toggleSection("streaks")}
              className="flex-row items-center justify-between"
            >
              <StyledText className="font-space text-xl font-bold">
                Streaks
              </StyledText>
              <Animated.View
                style={{ transform: [{ rotate: streaksRotateArrow }] }}
              >
                <Feather name="chevron-down" size={24} color="black" />
              </Animated.View>
            </StyledPressable>

            {/* Expandable Content */}
            <Animated.View
              style={{ maxHeight: streaksMaxHeight, overflow: "hidden" }}
            >
              <StyledView className="flex-row flex-wrap justify-between mt-4">
                {streaks.map((streak) => (
                  <StyledView key={streak.id} className="w-[48%] mb-4">
                    <StyledView
                      className="border-2 border-black rounded-xl p-3 active:scale-[0.98]"
                      style={{ backgroundColor: streak.color }}
                    >
                      <StyledView className="flex-row items-center justify-between mb-2">
                        <StyledView className="bg-white w-8 h-8 rounded-lg border-2 border-black items-center justify-center">
                          <Feather
                            name={streak.icon as any}
                            size={18}
                            color="black"
                          />
                        </StyledView>
                        <StyledView className="bg-white px-2 py-1 rounded-lg border-2 border-black">
                          <StyledText className="font-space text-xs">
                            🔥 {streak.streak}
                          </StyledText>
                        </StyledView>
                      </StyledView>
                      <StyledText className="font-space text-sm mt-1">
                        {streak.category}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                ))}
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
                  <Feather
                    name={item.icon as any}
                    size={22}
                    style={{ color: currentTheme.dark }}
                  />
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
            color={currentTheme.main}
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

      {/* Reward Modal */}
      <Modal
        transparent
        visible={showRewardModal}
        animationType="fade"
        onRequestClose={() => setShowRewardModal(false)}
      >
        <StyledView className="flex-1 items-center justify-center bg-black/50">
          <StyledView className="bg-white border-2 border-black rounded-xl p-6 w-[80%] items-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <StyledText className="font-space text-2xl text-center mb-4">
              Challenge Completed! 🎉
            </StyledText>
            <StyledText className="font-space text-lg text-center mb-6">
              {lastCompletedChallenge?.title}
            </StyledText>
            <StyledView className="flex-row items-center mb-6">
              <StyledView className="w-6 h-6 bg-yellow-400 rounded-full border border-black mr-2" />
              <StyledText className="font-space text-2xl">
                +{lastCompletedChallenge?.coins}
              </StyledText>
            </StyledView>
            <NeuButton
              onPress={() => setShowRewardModal(false)}
              width="100%"
              color={currentTheme.main}
            >
              <StyledText className="font-space text-lg">Awesome!</StyledText>
            </NeuButton>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledSafeAreaView>
  );
};
