import { Text, View, Pressable, Dimensions } from "react-native";
import { useLogin } from "@privy-io/expo";
import { useState } from "react";
import { Video, ResizeMode } from "expo-av";
import { styled } from "nativewind";
import { NeuButton } from "../functional/NeuButton";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledVideo = styled(Video);

export default function LoginScreen() {
  const [error, setError] = useState("");
  const { login } = useLogin();
  const screenWidth = Dimensions.get("window").width;

  return (
    <StyledView className="flex-1 bg-[#A7D2BC] p-5">
      {/* Video and Title Container */}
      <StyledView className="flex-1 items-center justify-center">
        <StyledView className="relative mb-5" style={{ width: screenWidth - 40, aspectRatio: 1 }}>
          {/* Shadow box */}
          <StyledView className="absolute w-full h-full bg-black rounded-xl top-2 left-2" />
          {/* Main container */}
          <StyledView className="w-full h-full bg-white rounded-xl border-2 border-black overflow-hidden relative">
            <StyledVideo
              source={require("../../assets/videos/splash.mp4")}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              className="w-full h-full"
            />
          </StyledView>
        </StyledView>

        <StyledText className="text-5xl font-[RubikDoodleShadow] text-black text-center mb-10">
          I am Zoey!
        </StyledText>
      </StyledView>

      {/* Login Button Container */}
      <StyledView className="mb-10">
        <NeuButton
          onPress={() => {
            login({ loginMethods: ["email"] })
              .then((session) => {
                console.log("User logged in", session.user);
              })
              .catch((err) => {
                setError(JSON.stringify(err.error) as string);
              });
          }}
        >
          <Text style={{ 
            fontFamily: 'SpaceGrotesk_400Regular',
            fontSize: 24,
            color: '#000000',
            textAlign: 'center',
          }}>
            Login
          </Text>
        </NeuButton>

        {error && (
          <StyledText style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-red-500 mt-5">
            Error: {error}
          </StyledText>
        )}
      </StyledView>
    </StyledView>
  );
}
