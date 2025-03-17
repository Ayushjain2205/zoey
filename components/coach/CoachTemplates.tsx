import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import { Feather } from "@expo/vector-icons";
import { ThemeColors } from "../../context/ThemeContext";

const StyledView = styled(View);
const StyledText = styled(Text);

// Types
type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

export interface WorkoutExercise {
  name: string;
  sets: string;
  instruction: string;
  icon: FeatherIconName;
}

export interface WorkoutTemplate {
  title: string;
  description: string;
  exercises: WorkoutExercise[];
  tips: string[];
}

// Templates
export const legWorkout: WorkoutTemplate = {
  title: "Killer Leg Workout 🦵",
  description: "Build strong, powerful legs with this comprehensive routine",
  exercises: [
    {
      name: "Squats",
      sets: "3 sets × 10-15 reps",
      instruction: "Keep chest up, push hips back",
      icon: "trending-up",
    },
    {
      name: "Lunges",
      sets: "3 sets × 10 reps/leg",
      instruction: "Front knee over ankle",
      icon: "activity",
    },
    {
      name: "Deadlifts",
      sets: "3 sets × 10-12 reps",
      instruction: "Hinge at hips, back straight",
      icon: "bar-chart-2",
    },
    {
      name: "Leg Press",
      sets: "3 sets × 10-12 reps",
      instruction: "Push through heels",
      icon: "chevrons-up",
    },
    {
      name: "Calf Raises",
      sets: "3 sets × 15-20 reps",
      instruction: "Squeeze at the top",
      icon: "arrow-up",
    },
    {
      name: "Glute Bridges",
      sets: "3 sets × 12-15 reps",
      instruction: "Squeeze glutes at top",
      icon: "trending-up",
    },
  ],
  tips: ["Stay hydrated 💧", "Focus on form over speed", "Listen to your body"],
};

// Add more workout templates here as needed
export const upperBodyWorkout: WorkoutTemplate = {
  title: "Upper Body Power 💪",
  description: "Build strength and muscle in your upper body",
  exercises: [
    {
      name: "Push-ups",
      sets: "3 sets × 12-15 reps",
      instruction: "Keep core tight, elbows at 45°",
      icon: "arrow-down",
    },
    {
      name: "Pull-ups",
      sets: "3 sets × 8-12 reps",
      instruction: "Full range of motion",
      icon: "arrow-up",
    },
    {
      name: "Bench Press",
      sets: "3 sets × 10 reps",
      instruction: "Control the descent",
      icon: "trending-up",
    },
    {
      name: "Shoulder Press",
      sets: "3 sets × 10-12 reps",
      instruction: "Keep core engaged",
      icon: "chevrons-up",
    },
  ],
  tips: [
    "Warm up properly",
    "Focus on controlled movements",
    "Stay hydrated 💧",
  ],
};

export const coreWorkout: WorkoutTemplate = {
  title: "Core Crusher 🎯",
  description: "Strengthen your core and improve stability",
  exercises: [
    {
      name: "Planks",
      sets: "3 sets × 45 seconds",
      instruction: "Keep body straight",
      icon: "minus",
    },
    {
      name: "Crunches",
      sets: "3 sets × 20 reps",
      instruction: "Engage core throughout",
      icon: "chevrons-up",
    },
    {
      name: "Russian Twists",
      sets: "3 sets × 20 reps",
      instruction: "Control the rotation",
      icon: "rotate-cw",
    },
  ],
  tips: ["Quality over quantity", "Breathe steadily", "Keep form strict"],
};

interface TemplateProps {
  currentTheme: ThemeColors;
}

export const WorkoutCard: React.FC<
  TemplateProps & { workout: WorkoutTemplate }
> = ({ workout, currentTheme }) => (
  <StyledView className="bg-white border-2 border-black rounded-xl overflow-hidden mb-4">
    {/* Header */}
    <StyledView
      className="px-3 py-2 border-b-2 border-black"
      style={{ backgroundColor: currentTheme.main }}
    >
      <StyledText className="font-space text-lg font-bold">
        {workout.title}
      </StyledText>
    </StyledView>

    {/* Exercises */}
    <StyledView className="p-3">
      {workout.exercises.map((exercise, index) => (
        <StyledView
          key={exercise.name}
          className={`flex-row items-center py-2 ${
            index !== workout.exercises.length - 1
              ? "border-b border-gray-200"
              : ""
          }`}
        >
          <StyledView className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center mr-2 border-2 border-black">
            <Feather name={exercise.icon} size={20} color="black" />
          </StyledView>
          <StyledView className="flex-1">
            <StyledView className="flex-row items-center justify-between">
              <StyledText className="font-space font-bold text-sm">
                {exercise.name}
              </StyledText>
              <StyledText className="font-space text-xs text-gray-600">
                {exercise.sets}
              </StyledText>
            </StyledView>
            <StyledText className="font-space text-xs text-gray-500">
              {exercise.instruction}
            </StyledText>
          </StyledView>
        </StyledView>
      ))}

      {/* Tips - Inline */}
      <StyledView className="mt-2 pt-2 border-t border-gray-200">
        <StyledText className="font-space text-xs text-gray-600">
          💡 {workout.tips.join(" • ")}
        </StyledText>
      </StyledView>
    </StyledView>
  </StyledView>
);

export const StreakTracker: React.FC<TemplateProps> = ({ currentTheme }) => (
  <StyledView className="bg-white border-2 border-black rounded-xl overflow-hidden mb-4">
    <StyledView
      className="p-4 border-b-2 border-black"
      style={{ backgroundColor: currentTheme.main }}
    >
      <StyledText className="font-space text-lg font-bold">
        Workout Streak 🔥
      </StyledText>
    </StyledView>

    <StyledView className="p-4">
      {/* Current Streak */}
      <StyledView className="flex-row items-center justify-between mb-4">
        <StyledView>
          <StyledText className="font-space text-sm text-gray-600">
            Current Streak
          </StyledText>
          <StyledText className="font-space text-2xl font-bold">
            3 Days
          </StyledText>
        </StyledView>
        <StyledView
          className="px-4 py-2 rounded-xl border-2 border-black"
          style={{ backgroundColor: currentTheme.lighter }}
        >
          <StyledText className="font-space font-bold">Level 2</StyledText>
        </StyledView>
      </StyledView>

      {/* Weekly Progress */}
      <StyledView className="flex-row justify-between mb-2">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <StyledView key={index} className="items-center">
            <StyledText className="font-space text-xs mb-2">{day}</StyledText>
            <StyledView
              className={`w-8 h-8 rounded-lg border-2 border-black items-center justify-center ${
                index < 3 ? "" : "opacity-50"
              }`}
              style={{
                backgroundColor: index < 3 ? currentTheme.main : "white",
              }}
            >
              {index < 3 && <Feather name="check" size={16} color="black" />}
            </StyledView>
          </StyledView>
        ))}
      </StyledView>
    </StyledView>
  </StyledView>
);

// Coach mode simulation helpers
export interface CoachResponse {
  type: "workout" | "message";
  content: WorkoutTemplate | string;
}

export const handleCoachMessage = (text: string): CoachResponse | null => {
  const lowerText = text.toLowerCase();

  // Streak tracking
  if (
    lowerText.includes("streak") ||
    lowerText.includes("progress") ||
    lowerText.includes("stats")
  ) {
    return {
      type: "message",
      content: "SHOW_STREAK_TRACKER",
    };
  }

  // Workout type detection
  if (lowerText.includes("leg workout") || lowerText.includes("leg day")) {
    return {
      type: "workout",
      content: legWorkout,
    };
  }

  if (
    lowerText.includes("upper body") ||
    lowerText.includes("arm") ||
    lowerText.includes("chest")
  ) {
    return {
      type: "workout",
      content: upperBodyWorkout,
    };
  }

  if (
    lowerText.includes("core") ||
    lowerText.includes("ab") ||
    lowerText.includes("stomach")
  ) {
    return {
      type: "workout",
      content: coreWorkout,
    };
  }

  // General workout questions
  if (
    lowerText.includes("how many") ||
    lowerText.includes("reps") ||
    lowerText.includes("sets")
  ) {
    return {
      type: "message",
      content:
        "For beginners, I recommend 3 sets of 10-12 reps. As you get stronger, we can adjust the volume and intensity. Remember to focus on proper form! 💪",
    };
  }

  if (lowerText.includes("rest") || lowerText.includes("recovery")) {
    return {
      type: "message",
      content:
        "Rest is crucial for muscle recovery! Take 1-2 minutes between sets, and make sure to get 7-8 hours of sleep. Your muscles grow during recovery, not during the workout! 😴",
    };
  }

  if (lowerText.includes("form") || lowerText.includes("technique")) {
    return {
      type: "message",
      content:
        "Proper form is essential to prevent injury and maximize results. Start with lighter weights to perfect your form. Would you like me to break down the proper form for a specific exercise? 🎯",
    };
  }

  // Return null if no specific workout or coaching response is needed
  return null;
};
