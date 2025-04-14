import React from "react";
import { View, Text, Pressable } from "react-native";
import { styled } from "nativewind";
import { Feather } from "@expo/vector-icons";
import { ThemeColors } from "../../context/ThemeContext";
import { Meeting, DaySchedule } from "../../types/shared";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

// Sample schedule
export const todaySchedule: DaySchedule = {
  date: "2024-03-20",
  sleepTime: "23:00",
  wakeTime: "07:00",
  activities: [
    {
      time: "07:30",
      activity: "Morning Exercise",
      duration: 30,
    },
    {
      time: "12:30",
      activity: "Lunch Break",
      duration: 60,
    },
  ],
  meetings: [
    {
      id: "1",
      title: "Team Standup",
      time: "09:00",
      startTime: 900,
      endTime: 930,
      duration: "30m",
      isOnline: true,
      participants: ["John", "Sarah", "Mike"],
      meetingLink: "https://zoom.us/j/123456789",
    },
    {
      id: "2",
      title: "Product Review",
      time: "11:00",
      startTime: 1100,
      endTime: 1200,
      duration: "1h",
      isOnline: false,
      participants: ["Product Team", "Stakeholders"],
      location: "Conference Room A",
    },
    {
      id: "3",
      title: "Client Meeting",
      time: "14:00",
      startTime: 1400,
      endTime: 1500,
      duration: "1h",
      isOnline: true,
      participants: ["Client", "Account Manager"],
      meetingLink: "https://meet.google.com/abc-def-ghi",
    },
    {
      id: "4",
      title: "Sprint Planning",
      time: "16:00",
      startTime: 1600,
      endTime: 1700,
      duration: "1h",
      isOnline: false,
      participants: ["Development Team", "Product Owner"],
      location: "Conference Room B",
    },
  ],
};

interface TemplateProps {
  currentTheme: ThemeColors;
}

const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => (
  <StyledView className="flex-row items-center py-2 border-b border-gray-200 last:border-b-0">
    {/* Time Column */}
    <StyledView className="w-20">
      <StyledText className="font-space text-sm font-bold">
        {meeting.time}
      </StyledText>
      <StyledText className="font-space text-xs text-gray-500">
        {meeting.duration}
      </StyledText>
    </StyledView>

    {/* Meeting Details */}
    <StyledView className="flex-1 ml-3">
      <StyledView className="flex-row items-center">
        <StyledText className="font-space font-bold flex-1" numberOfLines={1}>
          {meeting.title}
        </StyledText>
        {meeting.isOnline ? (
          <StyledView className="bg-blue-100 px-2 py-0.5 rounded-full">
            <StyledText className="font-space text-xs text-blue-600">
              Online
            </StyledText>
          </StyledView>
        ) : (
          <StyledView className="bg-green-100 px-2 py-0.5 rounded-full">
            <StyledText className="font-space text-xs text-green-600">
              In-Person
            </StyledText>
          </StyledView>
        )}
      </StyledView>

      <StyledView className="flex-row items-center mt-1">
        <Feather
          name={meeting.isOnline ? "video" : "map-pin"}
          size={12}
          color="#666"
          style={{ marginRight: 4 }}
        />
        <StyledText className="font-space text-xs text-gray-500">
          {meeting.isOnline ? meeting.meetingLink : meeting.location}
        </StyledText>
      </StyledView>

      <StyledView className="flex-row items-center mt-1">
        <Feather
          name="users"
          size={12}
          color="#666"
          style={{ marginRight: 4 }}
        />
        <StyledText className="font-space text-xs text-gray-500">
          {meeting.participants.join(", ")}
        </StyledText>
      </StyledView>
    </StyledView>
  </StyledView>
);

export const CalendarView: React.FC<
  TemplateProps & { schedule: DaySchedule }
> = ({ schedule, currentTheme }) => (
  <StyledView className="bg-white border-2 border-black rounded-xl overflow-hidden mb-4">
    {/* Header */}
    <StyledView
      className="px-3 py-2 border-b-2 border-black"
      style={{ backgroundColor: currentTheme.main }}
    >
      <StyledText className="font-space text-base font-bold">
        📅 {schedule.date}
      </StyledText>
    </StyledView>

    {/* Quick Stats */}
    <StyledView className="flex-row border-b-2 border-black">
      <StyledView className="flex-1 p-2 items-center border-r-2 border-black">
        <StyledText className="font-space text-2xl font-bold">
          {schedule.meetings.length}
        </StyledText>
        <StyledText className="font-space text-xs">Meetings</StyledText>
      </StyledView>
      <StyledView className="flex-1 p-2 items-center border-r-2 border-black">
        <StyledText className="font-space text-2xl font-bold">
          {schedule.meetings.filter((m) => m.isOnline).length}
        </StyledText>
        <StyledText className="font-space text-xs">Online</StyledText>
      </StyledView>
      <StyledView className="flex-1 p-2 items-center">
        <StyledText className="font-space text-2xl font-bold">
          {schedule.meetings.filter((m) => !m.isOnline).length}
        </StyledText>
        <StyledText className="font-space text-xs">In-Person</StyledText>
      </StyledView>
    </StyledView>

    {/* Meetings List */}
    <StyledView className="p-2">
      {schedule.meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </StyledView>
  </StyledView>
);

// Manager mode simulation helpers
export interface ManagerResponse {
  type: "calendar" | "message";
  content: DaySchedule | string;
}

export const handleManagerMessage = (text: string): ManagerResponse | null => {
  const lowerText = text.toLowerCase();

  // Calendar/Schedule requests
  if (
    lowerText.includes("schedule") ||
    lowerText.includes("calendar") ||
    lowerText.includes("meetings") ||
    lowerText.includes("today") ||
    lowerText.includes("agenda")
  ) {
    return {
      type: "calendar",
      content: todaySchedule,
    };
  }

  // Meeting-related questions
  if (lowerText.includes("next meeting") || lowerText.includes("upcoming")) {
    const nextMeeting = todaySchedule.meetings.find(
      (m) => new Date(`${new Date().toDateString()} ${m.time}`) > new Date()
    );

    if (nextMeeting) {
      return {
        type: "message",
        content: `Your next meeting is "${nextMeeting.title}" at ${
          nextMeeting.time
        }. It's ${
          nextMeeting.isOnline ? "online" : "in-person"
        } and will last ${nextMeeting.duration}.`,
      };
    }
  }

  // Return null if no specific manager response is needed
  return null;
};
