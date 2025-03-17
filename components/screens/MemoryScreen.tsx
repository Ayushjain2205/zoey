import React, { useState } from "react";
import { Text, View, Pressable, ScrollView, Image } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledSafeAreaView = styled(SafeAreaView);

type TabType = "files" | "apps";

export const MemoryScreen = () => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("files");

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
            onPress={() => router.back()}
            className="bg-white border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Feather name="arrow-left" size={20} color="black" />
          </StyledPressable>
          <StyledText className="font-space text-2xl ml-4">Memory</StyledText>
        </StyledView>

        {/* Tabs */}
        <StyledView className="flex-row mb-4">
          {[
            { id: "files", label: "Files" },
            { id: "apps", label: "Apps" },
          ].map((category) => (
            <StyledPressable
              key={category.id}
              className={`flex-1 py-2 px-4 border-2 border-black rounded-xl mr-2 last:mr-0`}
              style={{
                backgroundColor:
                  activeTab === category.id ? currentTheme.main : "white",
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 1,
                shadowRadius: 0,
                shadowColor: "#000",
              }}
              onPress={() => setActiveTab(category.id as TabType)}
            >
              <StyledText className="font-space text-center">
                {category.label}
              </StyledText>
            </StyledPressable>
          ))}
        </StyledView>

        {/* Content */}
        <ScrollView className="flex-1">
          {activeTab === "files" ? (
            <StyledView className="space-y-4">
              {/* Recent Files Section */}
              <StyledView>
                <StyledText className="font-space text-lg mb-3">
                  Recent Files
                </StyledText>
                <StyledView className="space-y-3">
                  {/* File Card */}
                  <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                    <StyledView className="flex-row items-center">
                      <StyledView className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mr-4">
                        <Feather name="file-text" size={24} color="black" />
                      </StyledView>
                      <StyledView className="flex-1">
                        <StyledText className="font-space text-base">
                          Meeting Notes
                        </StyledText>
                        <StyledText className="font-space text-sm text-gray-500">
                          Last edited 2h ago
                        </StyledText>
                      </StyledView>
                      <Feather name="chevron-right" size={20} color="black" />
                    </StyledView>
                  </StyledView>

                  {/* Another File Card */}
                  <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                    <StyledView className="flex-row items-center">
                      <StyledView className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mr-4">
                        <Feather name="image" size={24} color="black" />
                      </StyledView>
                      <StyledView className="flex-1">
                        <StyledText className="font-space text-base">
                          Project Screenshots
                        </StyledText>
                        <StyledText className="font-space text-sm text-gray-500">
                          Last edited 1d ago
                        </StyledText>
                      </StyledView>
                      <Feather name="chevron-right" size={20} color="black" />
                    </StyledView>
                  </StyledView>
                </StyledView>
              </StyledView>
            </StyledView>
          ) : (
            <StyledView className="space-y-4">
              {/* Connected Apps Section */}
              <StyledView>
                <StyledText className="font-space text-lg mb-3">
                  Connected Apps
                </StyledText>
                <StyledView className="space-y-3">
                  {/* Apple Fitness Card */}
                  <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                    <StyledView className="flex-row items-center">
                      <StyledView className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mr-4">
                        <Feather name="activity" size={24} color="black" />
                      </StyledView>
                      <StyledView className="flex-1">
                        <StyledText className="font-space text-base">
                          Apple Fitness
                        </StyledText>
                        <StyledText className="font-space text-sm text-gray-500">
                          Last synced 1h ago
                        </StyledText>
                      </StyledView>
                      <StyledView className="bg-green-100 px-3 py-1 rounded-full">
                        <StyledText className="font-space text-sm text-green-800">
                          Connected
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  </StyledView>

                  {/* Google Calendar Card */}
                  <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                    <StyledView className="flex-row items-center">
                      <StyledView className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mr-4">
                        <Feather name="calendar" size={24} color="black" />
                      </StyledView>
                      <StyledView className="flex-1">
                        <StyledText className="font-space text-base">
                          Google Calendar
                        </StyledText>
                        <StyledText className="font-space text-sm text-gray-500">
                          Last synced 30m ago
                        </StyledText>
                      </StyledView>
                      <StyledView className="bg-green-100 px-3 py-1 rounded-full">
                        <StyledText className="font-space text-sm text-green-800">
                          Connected
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  </StyledView>
                </StyledView>
              </StyledView>

              {/* Available Apps Section */}
              <StyledView>
                <StyledText className="font-space text-lg mb-3">
                  Available Apps
                </StyledText>
                <StyledView className="space-y-3">
                  {/* Strava Card */}
                  <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                    <StyledView className="flex-row items-center">
                      <StyledView className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mr-4">
                        <Feather name="map" size={24} color="black" />
                      </StyledView>
                      <StyledView className="flex-1">
                        <StyledText className="font-space text-base">
                          Strava
                        </StyledText>
                        <StyledText className="font-space text-sm text-gray-500">
                          Track your workouts
                        </StyledText>
                      </StyledView>
                      <StyledView className="bg-gray-100 px-3 py-1 rounded-full">
                        <StyledText className="font-space text-sm text-gray-800">
                          Connect
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  </StyledView>

                  {/* Todoist Card */}
                  <StyledView className="bg-white border-2 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                    <StyledView className="flex-row items-center">
                      <StyledView className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mr-4">
                        <Feather name="check-square" size={24} color="black" />
                      </StyledView>
                      <StyledView className="flex-1">
                        <StyledText className="font-space text-base">
                          Todoist
                        </StyledText>
                        <StyledText className="font-space text-sm text-gray-500">
                          Manage your tasks
                        </StyledText>
                      </StyledView>
                      <StyledView className="bg-gray-100 px-3 py-1 rounded-full">
                        <StyledText className="font-space text-sm text-gray-800">
                          Connect
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  </StyledView>
                </StyledView>
              </StyledView>
            </StyledView>
          )}
        </ScrollView>

        {/* FABs */}
        {activeTab === "files" && (
          <StyledView className="absolute bottom-6 right-4 space-y-4">
            {/* Upload FAB */}
            <StyledPressable
              onPress={() => {}}
              className="w-14 h-14 bg-white border-2 border-black rounded-full items-center justify-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]"
              style={{ backgroundColor: currentTheme.main }}
            >
              <Feather name="upload" size={24} color="black" />
            </StyledPressable>

            {/* New Note FAB */}
            <StyledPressable
              onPress={() => {}}
              className="w-14 h-14 bg-white border-2 border-black rounded-full items-center justify-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]"
              style={{ backgroundColor: currentTheme.main }}
            >
              <Feather name="edit-2" size={24} color="black" />
            </StyledPressable>
          </StyledView>
        )}
      </StyledView>
    </StyledSafeAreaView>
  );
};
