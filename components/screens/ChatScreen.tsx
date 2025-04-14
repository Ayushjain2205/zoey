import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Modal,
  Animated,
  Easing,
  ActionSheetIOS,
} from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme, CHAT_MODES } from "../../context/ThemeContext";
import { sendMessage, Message as OpenAIMessage } from "../../utils/openai";
import Markdown from "react-native-markdown-display";
import {
  WorkoutCard,
  StreakTracker,
  legWorkout,
  handleCoachMessage,
  WorkoutTemplate,
} from "../coach/CoachTemplates";
import {
  ProductGrid,
  handleShopperMessage,
  ProductCollection,
} from "../shopper/ShopperTemplates";
import {
  CalendarView,
  handleManagerMessage,
  DaySchedule,
} from "../manager/ManagerTemplates";
import * as ImagePicker from "expo-image-picker";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);

type ChatMode =
  | "DOCTOR"
  | "NUTRITIONIST"
  | "THERAPIST"
  | "TRAINER"
  | "SLEEP"
  | "MEDITATION";

interface ThemeColors {
  main: string;
  light: string;
  lighter: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  icon: string;
}

interface WorkoutTemplate {
  title: string;
  description: string;
  exercises: Exercise[];
  tips: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: any;
  price: number;
  rating: number;
  reviews: number;
  isPrime: boolean;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fats: string;
  };
}

interface ProductCollection {
  title: string;
  products: Product[];
}

interface Activity {
  time: string;
  activity: string;
  duration: number;
}

interface Meeting {
  time: string;
  title: string;
  duration: number;
}

interface DaySchedule {
  date: string;
  sleepTime: string;
  wakeTime: string;
  activities: Activity[];
  meetings: Meeting[];
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  workoutTemplate?: import("../coach/CoachTemplates").WorkoutTemplate;
  productCollection?: import("../coach/CoachTemplates").ProductCollection;
  daySchedule?: import("../manager/ManagerTemplates").DaySchedule;
  image?: string;
}

interface SimulatedResponse {
  text: string;
  delay?: number;
  workoutTemplate?: import("../coach/CoachTemplates").WorkoutTemplate;
  productCollection?: import("../coach/CoachTemplates").ProductCollection;
  daySchedule?: import("../manager/ManagerTemplates").DaySchedule;
}

interface SimulatedFlow {
  responses: SimulatedResponse[];
}

const modeColors: Record<string, ThemeColors> = {
  DOCTOR: {
    main: "#BAE1FF",
    light: "#E5F4FF",
    lighter: "#F5FAFF",
  },
  NUTRITIONIST: {
    main: "#BAFFC9",
    light: "#E5FFE9",
    lighter: "#F5FFF7",
  },
  THERAPIST: {
    main: "#E0B3FF",
    light: "#F0E5FF",
    lighter: "#F8F5FF",
  },
  TRAINER: {
    main: "#FFB3BA",
    light: "#FFE5E8",
    lighter: "#FFF5F7",
  },
  SLEEP: {
    main: "#7EE8E8",
    light: "#E5FDFD",
    lighter: "#F5FEFE",
  },
  MEDITATION: {
    main: "#FFE4B3",
    light: "#FFF4E5",
    lighter: "#FFF9F5",
  },
};

const modeIntroMessages: Record<ChatMode, string> = {
  DOCTOR:
    "You were supposed to take Cetirizine at 8pm post dinner did you take it? 👨‍⚕️",
  NUTRITIONIST:
    "Welcome! I'm here to help you make healthy food choices. What would you like to know about your nutrition today? 🥗",
  THERAPIST:
    "Hi! This is a safe space to share your thoughts and feelings. How are you feeling today? 💭",
  TRAINER:
    "Ready to crush your fitness goals! What type of workout would you like to do today? 💪",
  SLEEP:
    "Let's work on improving your sleep quality. How can I help you get better rest? 😴",
  MEDITATION:
    "Welcome to your mindfulness session. How would you like to center yourself today? 🧘‍♀️",
};

// Conversation step counter for each mode
const conversationSteps: Record<ChatMode, number> = {
  DOCTOR: 0,
  NUTRITIONIST: 0,
  THERAPIST: 0,
  TRAINER: 0,
  SLEEP: 0,
  MEDITATION: 0,
};

const mockFlows: Record<ChatMode, SimulatedFlow> = {
  DOCTOR: {
    responses: [
      {
        text: "How are your symptoms today?",
        delay: 1000,
      },
      {
        text: "That's great to hear! The medication seems to be working. Any side effects like drowsiness?",
        delay: 1500,
      },
      {
        text: "Perfect! Let's continue with the current dosage. Remember to take it at the same time tomorrow. Would you like me to set a reminder for you?",
        delay: 2000,
      },
    ],
  },
  NUTRITIONIST: {
    responses: [
      {
        text: "Based on your fitness goals and the fact that you usually workout in the mornings, I'd recommend a protein-rich breakfast. How about:",
        delay: 1000,
      },
      {
        text: "PRODUCT_COLLECTION",
        productCollection: {
          title: "Healthy Breakfast Options",
          products: [
            {
              id: "1",
              name: "Greek Yogurt Parfait",
              description: "Greek yogurt, granola, berries, and honey",
              image: require("../../assets/images/gifts/candle.png"),
              price: 8.99,
              rating: 4.8,
              reviews: 128,
              isPrime: true,
              nutrition: {
                calories: 320,
                protein: "20g",
                carbs: "40g",
                fats: "10g",
              },
            },
            {
              id: "2",
              name: "Protein Oatmeal",
              description: "Oats, protein powder, banana, and almonds",
              image: require("../../assets/images/gifts/candle.png"),
              price: 7.99,
              rating: 4.7,
              reviews: 95,
              isPrime: true,
              nutrition: {
                calories: 380,
                protein: "25g",
                carbs: "45g",
                fats: "12g",
              },
            },
          ],
        },
        delay: 1500,
      },
      {
        text: "These options provide a good balance of protein and complex carbs. Would you like me to suggest some pre-workout snacks as well?",
        delay: 2000,
      },
    ],
  },
  TRAINER: {
    responses: [
      {
        text: "I've got the perfect leg workout for you! This will target all major muscle groups in your legs:",
        delay: 1000,
      },
      {
        text: "WORKOUT_TEMPLATE",
        workoutTemplate: {
          title: "Lower Body Power",
          description:
            "A comprehensive leg workout targeting all major muscle groups",
          exercises: [
            {
              name: "Squats",
              sets: 4,
              reps: "12",
              rest: "60 sec",
              icon: "chevrons-down" as const,
            },
            {
              name: "Romanian Deadlifts",
              sets: 3,
              reps: "12",
              rest: "60 sec",
              icon: "arrow-up" as const,
            },
            {
              name: "Walking Lunges",
              sets: 3,
              reps: "20",
              rest: "45 sec",
              icon: "chevrons-right" as const,
            },
          ],
          tips: ["Keep proper form", "Stay hydrated", "Rest between sets"],
        },
        delay: 1500,
      },
      {
        text: "How does this workout look? We can adjust the intensity if needed.",
        delay: 2000,
      },
    ],
  },
  SLEEP: {
    responses: [
      {
        text: "I'll help you create a better sleep routine. First, let's look at your current schedule:",
        delay: 1000,
      },
      {
        text: "CALENDAR_VIEW",
        daySchedule: {
          date: new Date().toISOString(),
          sleepTime: "23:00",
          wakeTime: "07:00",
          activities: [
            {
              time: "22:00",
              activity: "No screen time",
              duration: 60,
            },
            {
              time: "22:30",
              activity: "Reading/Meditation",
              duration: 30,
            },
          ],
          meetings: [
            {
              id: "1",
              title: "Sleep Review",
              startTime: "22:00",
              endTime: "22:30",
              isOnline: true,
              participants: ["user", "sleep-coach"],
            },
          ],
        },
        delay: 1500,
      },
      {
        text: "This is a suggested schedule. How does this align with your current routine?",
        delay: 2000,
      },
    ],
  },
  MEDITATION: {
    responses: [
      {
        text: "Let's do a quick breathing exercise together. Find a comfortable position and let me guide you.",
        delay: 1000,
      },
      {
        text: "Close your eyes and take a deep breath in through your nose for 4 counts...",
        delay: 3000,
      },
      {
        text: "Now hold for 4 counts...",
        delay: 7000,
      },
      {
        text: "And slowly exhale through your mouth for 6 counts...",
        delay: 11000,
      },
      {
        text: "How do you feel? Would you like to continue with a longer meditation session?",
        delay: 13000,
      },
    ],
  },
  THERAPIST: {
    responses: [
      {
        text: "I understand presentations can be nerve-wracking. Let's break this down - what specific aspects of the presentation are making you feel anxious?",
        delay: 1500,
      },
      {
        text: "That's a common concern. Have you prepared any strategies to help you remember your key points? We could work on some memory techniques and confidence-building exercises together.",
        delay: 2000,
      },
      {
        text: "Here's a quick grounding exercise we can try: Take 3 deep breaths, and on each exhale, remind yourself of one thing you know really well about your presentation topic.",
        delay: 3000,
      },
    ],
  },
};

interface ChatModeConfig {
  name: ChatMode;
  image: any;
  color: string;
}

const modeConfig: Record<string, ChatModeConfig> = {
  DOCTOR: {
    name: "DOCTOR",
    image: require("../../assets/images/zoey/zoey_doctor.png"),
    color: modeColors.DOCTOR.main,
  },
  NUTRITIONIST: {
    name: "NUTRITIONIST",
    image: require("../../assets/images/zoey/zoey_nutritionist.png"),
    color: modeColors.NUTRITIONIST.main,
  },
  THERAPIST: {
    name: "THERAPIST",
    image: require("../../assets/images/zoey/zoey_therapist.png"),
    color: modeColors.THERAPIST.main,
  },
  TRAINER: {
    name: "TRAINER",
    image: require("../../assets/images/zoey/zoey_trainer.png"),
    color: modeColors.TRAINER.main,
  },
  SLEEP: {
    name: "SLEEP",
    image: require("../../assets/images/zoey/zoey_sleep.png"),
    color: modeColors.SLEEP.main,
  },
  MEDITATION: {
    name: "MEDITATION",
    image: require("../../assets/images/zoey/zoey_meditation.png"),
    color: modeColors.MEDITATION.main,
  },
};

// Add type for Feather icon names
type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

export const ChatScreen = () => {
  const { selectedMode, setSelectedMode, currentTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: modeIntroMessages[selectedMode.name],
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModePickerVisible, setIsModePickerVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Voice call states
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const blobAnimation = useRef(new Animated.Value(0)).current;
  const voiceAnimation = useRef(new Animated.Value(0)).current;

  // Blob animation
  useEffect(() => {
    if (isInCall) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blobAnimation, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(blobAnimation, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate voice activity
      const voiceInterval = setInterval(() => {
        Animated.sequence([
          Animated.timing(voiceAnimation, {
            toValue: Math.random(),
            duration: 200,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ]).start();
      }, 200);

      return () => {
        clearInterval(voiceInterval);
        blobAnimation.setValue(0);
        voiceAnimation.setValue(0);
      };
    }
  }, [isInCall]);

  const handleCallPress = () => {
    setIsInCall(true);
  };

  const handleEndCall = () => {
    setIsInCall(false);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const renderCallInterface = () => {
    if (!isInCall) return null;

    const scale = blobAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2],
    });

    const voiceScale = voiceAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.3],
    });

    return (
      <Modal
        transparent
        visible={isInCall}
        animationType="fade"
        onRequestClose={handleEndCall}
      >
        <StyledView
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: currentTheme.light }}
        >
          {/* Animated Blob */}
          <StyledView className="relative items-center justify-center w-80 h-80">
            <Animated.View
              style={{
                position: "absolute",
                width: 280,
                height: 280,
                borderRadius: 140,
                backgroundColor: currentTheme.main,
                opacity: 0.5,
                transform: [{ scale }],
              }}
            />
            <Animated.View
              style={{
                position: "absolute",
                width: 240,
                height: 240,
                borderRadius: 120,
                backgroundColor: currentTheme.main,
                opacity: 0.7,
                transform: [{ scale: voiceScale }],
              }}
            />
            <StyledView
              className="w-48 h-48 rounded-full items-center justify-center border-2 border-black"
              style={{ backgroundColor: currentTheme.main }}
            >
              <StyledImage
                source={selectedMode.image}
                className="w-40 h-40"
                resizeMode="contain"
              />
            </StyledView>
          </StyledView>

          {/* Call Controls */}
          <StyledView className="flex-row space-x-4 mt-8">
            <StyledPressable
              onPress={handleToggleMute}
              className="w-14 h-14 rounded-full border-2 border-black items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
              style={{ backgroundColor: isMuted ? "#FF6B6B" : "white" }}
            >
              <Feather
                name={isMuted ? "mic-off" : "mic"}
                size={24}
                color="black"
              />
            </StyledPressable>
            <StyledPressable
              onPress={handleEndCall}
              className="w-14 h-14 bg-red-500 rounded-full border-2 border-black items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
            >
              <Feather name="phone-off" size={24} color="white" />
            </StyledPressable>
          </StyledView>
        </StyledView>
      </Modal>
    );
  };

  // Reset conversation steps when mode changes
  useEffect(() => {
    conversationSteps[selectedMode.name] = 0;
    setMessages([
      {
        id: "1",
        text: modeIntroMessages[selectedMode.name],
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setInputText("");
    setIsTyping(false);
  }, [selectedMode]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessageToAPI = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    scrollToBottom();

    // Show typing indicator
    setIsTyping(true);

    // Get next response in the flow
    const currentStep = conversationSteps[selectedMode.name];
    const flow = mockFlows[selectedMode.name];

    if (currentStep < flow.responses.length) {
      const response = flow.responses[currentStep];
      await new Promise((resolve) =>
        setTimeout(resolve, response.delay || 1000)
      );

      const zoeyResponse: Message = {
        id: Date.now().toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        workoutTemplate: response.workoutTemplate,
        productCollection: response.productCollection,
        daySchedule: response.daySchedule,
      };

      setMessages((prev) => [...prev, zoeyResponse]);
      conversationSteps[selectedMode.name]++;
    } else {
      // Reset the conversation if we've reached the end
      conversationSteps[selectedMode.name] = 0;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const defaultResponse: Message = {
        id: Date.now().toString(),
        text: "Let's start a new conversation. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, defaultResponse]);
    }

    setIsTyping(false);
    scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImagePicker = async () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Library"],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            // Take Photo
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status === "granted") {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
                aspect: [4, 3],
              });

              if (!result.canceled) {
                const newMessage: Message = {
                  id: Date.now().toString(),
                  text: "",
                  isUser: true,
                  timestamp: new Date(),
                  image: result.assets[0].uri,
                };
                setMessages((prev) => [...prev, newMessage]);
                scrollToBottom();
              }
            }
          } else if (buttonIndex === 2) {
            // Choose from Library
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status === "granted") {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
                aspect: [4, 3],
              });

              if (!result.canceled) {
                const newMessage: Message = {
                  id: Date.now().toString(),
                  text: "",
                  isUser: true,
                  timestamp: new Date(),
                  image: result.assets[0].uri,
                };
                setMessages((prev) => [...prev, newMessage]);
                scrollToBottom();
              }
            }
          }
        }
      );
    } else {
      // For Android, directly open image picker
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        });

        if (!result.canceled) {
          const newMessage: Message = {
            id: Date.now().toString(),
            text: "",
            isUser: true,
            timestamp: new Date(),
            image: result.assets[0].uri,
          };
          setMessages((prev) => [...prev, newMessage]);
          scrollToBottom();
        }
      }
    }
  };

  const renderMessage = (message: Message) => {
    if (message.image) {
      return (
        <StyledView
          key={message.id}
          className={`mb-4 flex-row ${
            message.isUser ? "justify-end" : "justify-start"
          }`}
        >
          <StyledView
            className={`p-1 border-2 border-black ${
              message.isUser
                ? `rounded-tl-xl rounded-tr-xl rounded-bl-xl`
                : "bg-white rounded-tl-xl rounded-tr-xl rounded-br-xl"
            } shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
            style={{
              backgroundColor: message.isUser ? currentTheme.main : "white",
            }}
          >
            <StyledImage
              source={{ uri: message.image }}
              className="w-60 h-60 rounded-lg"
              resizeMode="cover"
            />
          </StyledView>
        </StyledView>
      );
    }

    if (
      !message.isUser &&
      message.text === "WORKOUT_TEMPLATE" &&
      message.workoutTemplate
    ) {
      return (
        <StyledView key={message.id} className="mb-4">
          <WorkoutCard
            workout={message.workoutTemplate}
            currentTheme={currentTheme}
          />
        </StyledView>
      );
    }

    if (!message.isUser && message.text === "SHOW_STREAK_TRACKER") {
      return (
        <StyledView key={message.id} className="mb-4">
          <StreakTracker currentTheme={currentTheme} />
        </StyledView>
      );
    }

    if (
      !message.isUser &&
      message.text === "PRODUCT_COLLECTION" &&
      message.productCollection
    ) {
      return (
        <StyledView key={message.id} className="mb-4">
          <ProductGrid
            collection={message.productCollection}
            currentTheme={currentTheme}
          />
        </StyledView>
      );
    }

    if (
      !message.isUser &&
      message.text === "CALENDAR_VIEW" &&
      message.daySchedule
    ) {
      return (
        <StyledView key={message.id} className="mb-4">
          <CalendarView
            schedule={message.daySchedule}
            currentTheme={currentTheme}
          />
        </StyledView>
      );
    }

    return (
      <StyledView
        key={message.id}
        className={`mb-4 flex-row ${
          message.isUser ? "justify-end" : "justify-start"
        }`}
      >
        <StyledView
          className={`px-4 py-3 max-w-[80%] border-2 border-black ${
            message.isUser
              ? `rounded-tl-xl rounded-tr-xl rounded-bl-xl`
              : "bg-white rounded-tl-xl rounded-tr-xl rounded-br-xl"
          } shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
          style={{
            backgroundColor: message.isUser ? currentTheme.main : "white",
          }}
        >
          <Markdown
            style={{
              body: {
                fontFamily: "SpaceGrotesk_400Regular",
                fontSize: 16,
                color: message.isUser ? "#000000" : "#000000",
              },
              code: {
                fontFamily: "SpaceGrotesk_400Regular",
                backgroundColor: message.isUser
                  ? currentTheme.lighter
                  : "#F0F0F0",
                padding: 4,
                borderRadius: 4,
              },
              code_inline: {
                fontFamily: "SpaceGrotesk_400Regular",
                backgroundColor: message.isUser
                  ? currentTheme.lighter
                  : "#F0F0F0",
                padding: 2,
                borderRadius: 4,
              },
            }}
          >
            {message.text}
          </Markdown>
        </StyledView>
      </StyledView>
    );
  };

  const renderTypingIndicator = () => (
    <StyledView className="flex-row mb-4">
      <StyledView className="px-4 py-3 bg-white border-2 border-black rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <StyledView className="flex-row items-center space-x-2">
          <ActivityIndicator size="small" color="#000" />
          <StyledText className="font-space text-sm">
            Zoey is typing...
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );

  const renderModePicker = () => (
    <Modal
      transparent
      visible={isModePickerVisible}
      animationType="fade"
      onRequestClose={() => setIsModePickerVisible(false)}
    >
      <StyledPressable
        className="flex-1 bg-black/50"
        onPress={() => setIsModePickerVisible(false)}
      >
        <StyledView className="mt-32 mx-4">
          <StyledView className="bg-white border-2 border-black rounded-xl overflow-hidden">
            {CHAT_MODES.map((mode) => (
              <StyledPressable
                key={mode.name}
                className={`flex-row items-center p-4 border-b-2 border-black last:border-b-0 active:opacity-70`}
                style={{ backgroundColor: mode.color }}
                onPress={() => {
                  setSelectedMode(mode);
                  setIsModePickerVisible(false);
                }}
              >
                <StyledImage
                  source={mode.image}
                  className="w-10 h-10 rounded-full border-2 border-black"
                />
                <StyledText className="ml-3 font-space font-bold">
                  {mode.name} MODE
                </StyledText>
              </StyledPressable>
            ))}
          </StyledView>
        </StyledView>
      </StyledPressable>
    </Modal>
  );

  return (
    <StyledSafeAreaView
      className="flex-1"
      style={{ backgroundColor: currentTheme.light }}
    >
      {/* Header */}
      <StyledView className="flex-row items-center justify-between p-4">
        <StyledView className="flex-row items-center flex-1">
          <StyledPressable
            onPress={() => router.back()}
            className="bg-white border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Feather name="arrow-left" size={20} color="black" />
          </StyledPressable>

          <StyledPressable
            onPress={() => setIsModePickerVisible(true)}
            className="ml-4"
          >
            <StyledView
              className="px-4 py-2 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-row items-center"
              style={{ backgroundColor: currentTheme.main }}
            >
              <StyledText className="font-space font-bold mr-2">
                {selectedMode.name} MODE
              </StyledText>
              <Feather name="chevron-down" size={16} color="black" />
            </StyledView>
          </StyledPressable>
        </StyledView>

        <StyledView className="flex-row space-x-2">
          <StyledPressable
            onPress={handleImagePicker}
            className="border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
            style={{ backgroundColor: currentTheme.main }}
          >
            <Feather name="camera" size={20} color="black" />
          </StyledPressable>
          <StyledPressable
            onPress={handleCallPress}
            className="border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
            style={{ backgroundColor: currentTheme.main }}
          >
            <Feather name="phone" size={20} color="black" />
          </StyledPressable>
        </StyledView>
      </StyledView>

      {renderModePicker()}
      {renderCallInterface()}

      {/* Chat Container */}
      <StyledView className="flex-1 justify-between">
        {/* Messages */}
        <StyledView className="flex-1 relative">
          <StyledScrollView
            ref={scrollViewRef}
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <StyledView className="flex-1">
              {messages.length <= 1 && (
                <StyledView className="absolute left-0 right-0 top-[35%] items-center">
                  <StyledImage
                    source={selectedMode.image}
                    className="w-80 h-80 opacity-40"
                    resizeMode="contain"
                  />
                </StyledView>
              )}
              <StyledView className="w-full pt-4">
                {messages.map((message) => renderMessage(message))}
                {isTyping && renderTypingIndicator()}
              </StyledView>
            </StyledView>
            <StyledView className="h-6" />
          </StyledScrollView>
        </StyledView>

        {/* Input Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <StyledView
            className="py-6 px-4 border-t-2 border-black"
            style={{ backgroundColor: currentTheme.main }}
          >
            <StyledView className="flex-row items-center">
              <StyledTextInput
                className="flex-1 bg-white px-4 py-3 rounded-xl border-2 border-black font-space mr-2"
                placeholder="Type your message..."
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => sendMessageToAPI(inputText)}
                returnKeyType="send"
              />
              <StyledPressable
                onPress={() => sendMessageToAPI(inputText)}
                disabled={!inputText.trim() || isTyping}
                className={`border-2 border-black rounded-xl w-10 h-10 items-center justify-center ${
                  !inputText.trim() || isTyping
                    ? "bg-gray-200"
                    : "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
                }`}
                style={{
                  backgroundColor:
                    !inputText.trim() || isTyping
                      ? "#E5E5E5"
                      : currentTheme.lighter,
                }}
              >
                <Feather
                  name="send"
                  size={20}
                  color={!inputText.trim() || isTyping ? "#666" : "#000"}
                />
              </StyledPressable>
            </StyledView>
          </StyledView>
        </KeyboardAvoidingView>
      </StyledView>
    </StyledSafeAreaView>
  );
};
