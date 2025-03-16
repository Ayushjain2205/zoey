import Constants from "expo-constants";
import { Stack } from "expo-router";
import { PrivyProvider, PrivyElements } from "@privy-io/expo";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { SpaceGrotesk_400Regular } from "@expo-google-fonts/space-grotesk";
import { useFonts } from "expo-font";
import { scrollSepolia } from "viem/chains";
import { useState, useEffect } from "react";
import { View, Image, Text, Animated } from "react-native";
import * as Font from "expo-font";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledAnimatedView = styled(Animated.View);

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <StyledView className="flex-1 bg-[#F6F1F1] items-center justify-center">
      <StyledAnimatedView
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
        className="items-center"
      >
        <StyledImage
          source={require("../assets/images/zoey.png")}
          className="w-[300px] h-[300px] mb-8"
        />
        <StyledText className="text-5xl text-center font-[RubikDoodleShadow] text-black">
          Zoey
        </StyledText>
      </StyledAnimatedView>
    </StyledView>
  );
};

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    SpaceGrotesk_400Regular,
    RubikDoodleShadow: require("../assets/fonts/RubikDoodleShadow-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setTimeout(() => {
        setIsReady(true);
      }, 2000);
    }
  }, [fontsLoaded, fontError]);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <PrivyProvider
      appId={Constants.expoConfig?.extra?.privyAppId}
      clientId={Constants.expoConfig?.extra?.privyClientId}
      supportedChains={[scrollSepolia]}
      config={{
        embedded: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <PrivyElements />
    </PrivyProvider>
  );
}
