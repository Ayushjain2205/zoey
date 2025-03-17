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
} from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);

type ChatMode = "BFF" | "COACH" | "MANAGER" | "GF" | "SHOPPER";

interface ChatModeConfig {
  name: ChatMode;
  image: any;
  color: string;
}

const CHAT_MODES: ChatModeConfig[] = [
  {
    name: "BFF",
    image: require("../../assets/images/zoey.png"),
    color: "#FFB5C5",
  },
  {
    name: "COACH",
    image: require("../../assets/images/zoey_coach.png"),
    color: "#90EE90",
  },
  {
    name: "MANAGER",
    image: require("../../assets/images/zoey_manager.png"),
    color: "#87CEEB",
  },
  {
    name: "GF",
    image: require("../../assets/images/zoey_gf.png"),
    color: "#FFB6C1",
  },
  {
    name: "SHOPPER",
    image: require("../../assets/images/zoey_shopper.png"),
    color: "#DDA0DD",
  },
];

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Zoey. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ChatModeConfig>(
    CHAT_MODES[0]
  );
  const [isModePickerVisible, setIsModePickerVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = (text: string) => {
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

    // Simulate Zoey typing
    setIsTyping(true);

    // Simulate Zoey's response
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more about it.",
        "I understand how you feel.",
        "I'm here to listen and help!",
        "That must have been challenging.",
        "You're doing great! Keep going!",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const zoeyResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, zoeyResponse]);
      scrollToBottom();
    }, 2000);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const renderMessage = (message: Message) => (
    <StyledView
      key={message.id}
      className={`mb-4 flex-row ${
        message.isUser ? "justify-end" : "justify-start"
      }`}
    >
      <StyledView
        className={`px-4 py-3 max-w-[80%] border-2 border-black ${
          message.isUser
            ? "bg-[#FFB5C5] rounded-tl-xl rounded-tr-xl rounded-bl-xl"
            : "bg-white rounded-tl-xl rounded-tr-xl rounded-br-xl"
        } shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
      >
        <StyledText className="font-space text-base">{message.text}</StyledText>
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
    <StyledSafeAreaView className="flex-1 bg-[#FFE5EC]" edges={["top"]}>
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
              style={{ backgroundColor: selectedMode.color }}
            >
              <StyledText className="font-space font-bold mr-2">
                {selectedMode.name}
              </StyledText>
              <Feather name="chevron-down" size={16} color="black" />
            </StyledView>
          </StyledPressable>
        </StyledView>
        <StyledPressable className="bg-[#FFB5C5] border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]">
          <Feather name="phone" size={20} color="black" />
        </StyledPressable>
      </StyledView>

      {renderModePicker()}

      {/* Chat Container */}
      <StyledView className="flex-1 justify-between">
        {/* Messages */}
        <StyledView className="flex-1 relative">
          <StyledScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 h-full"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {messages.length <= 1 && (
              <StyledView className="absolute left-0 right-0 top-[30%] items-center justify-center">
                <StyledImage
                  source={selectedMode.image}
                  className="w-80 h-80 opacity-40"
                  resizeMode="contain"
                />
              </StyledView>
            )}
            <StyledView className="flex-1">
              {messages.map(renderMessage)}
              {isTyping && renderTypingIndicator()}
              <StyledView className="h-4" />
            </StyledView>
          </StyledScrollView>
        </StyledView>

        {/* Input Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <StyledView className="p-4 border-t-2 border-black bg-white">
            <StyledView className="flex-row items-center">
              <StyledTextInput
                className="flex-1 bg-gray-100 px-4 py-3 rounded-xl border-2 border-black font-space mr-2"
                placeholder="Type your message..."
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => sendMessage(inputText)}
                returnKeyType="send"
              />
              <StyledPressable
                onPress={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className={`border-2 border-black rounded-xl w-10 h-10 items-center justify-center ${
                  !inputText.trim() || isTyping
                    ? "bg-gray-200"
                    : "bg-[#FFB5C5] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
                }`}
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
