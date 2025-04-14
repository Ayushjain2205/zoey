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
    "Hello! I'm your virtual doctor. How can I help you with your health concerns today? 👨‍⚕️",
  NUTRITIONIST:
    "Hi! I'm here to help you make healthy food choices and create a balanced diet plan. What's on your mind? 🥗",
  THERAPIST:
    "Welcome to a safe space. I'm here to listen and support you through whatever you'd like to discuss. How are you feeling today? 💭",
  TRAINER:
    "Ready to crush your fitness goals! What type of workout are you looking to do today? 💪",
  SLEEP:
    "Looking to improve your sleep quality? I'm here to help you develop better sleep habits. How have you been sleeping lately? 😴",
  MEDITATION:
    "Welcome to your mindfulness journey. Let's find some peace and clarity together. How can I guide you today? 🧘‍♀️",
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

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  workoutTemplate?: WorkoutTemplate;
  productCollection?: ProductCollection;
  daySchedule?: DaySchedule;
}

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

  // Reset messages when mode changes
  useEffect(() => {
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

    // Special handling for trainer mode
    if (selectedMode.name === "TRAINER") {
      const coachResponse = handleCoachMessage(text);
      if (coachResponse) {
        setTimeout(() => {
          const response: Message = {
            id: (Date.now() + 1).toString(),
            text:
              coachResponse.type === "message"
                ? (coachResponse.content as string)
                : "WORKOUT_TEMPLATE",
            isUser: false,
            timestamp: new Date(),
            workoutTemplate:
              coachResponse.type === "workout"
                ? (coachResponse.content as WorkoutTemplate)
                : undefined,
          };
          setMessages((prev) => [...prev, response]);
          setIsTyping(false);
          scrollToBottom();
        }, 1000);
        return;
      }
    }

    // Special handling for nutritionist mode
    if (selectedMode.name === "NUTRITIONIST") {
      const shopperResponse = handleShopperMessage(text);
      if (shopperResponse) {
        setTimeout(() => {
          const response: Message = {
            id: (Date.now() + 1).toString(),
            text:
              shopperResponse.type === "message"
                ? (shopperResponse.content as string)
                : "PRODUCT_COLLECTION",
            isUser: false,
            timestamp: new Date(),
            productCollection:
              shopperResponse.type === "products"
                ? (shopperResponse.content as ProductCollection)
                : undefined,
          };
          setMessages((prev) => [...prev, response]);
          setIsTyping(false);
          scrollToBottom();
        }, 1000);
        return;
      }
    }

    // Special handling for sleep mode
    if (selectedMode.name === "SLEEP") {
      const managerResponse = handleManagerMessage(text);
      if (managerResponse) {
        setTimeout(() => {
          const response: Message = {
            id: (Date.now() + 1).toString(),
            text:
              managerResponse.type === "message"
                ? (managerResponse.content as string)
                : "CALENDAR_VIEW",
            isUser: false,
            timestamp: new Date(),
            daySchedule:
              managerResponse.type === "calendar"
                ? (managerResponse.content as DaySchedule)
                : undefined,
          };
          setMessages((prev) => [...prev, response]);
          setIsTyping(false);
          scrollToBottom();
        }, 1000);
        return;
      }
    }

    try {
      // Convert messages to OpenAI format
      const openAIMessages: OpenAIMessage[] = messages.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      }));

      // Add the new message
      openAIMessages.push({
        role: "user",
        content: text.trim(),
      });

      // Get response from OpenAI
      const response = await sendMessage(openAIMessages, selectedMode.name);

      const zoeyResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, zoeyResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = (message: Message) => {
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
        <StyledPressable
          onPress={handleCallPress}
          className="border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
          style={{ backgroundColor: currentTheme.main }}
        >
          <Feather name="phone" size={20} color="black" />
        </StyledPressable>
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
