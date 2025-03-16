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
import SplashScreen from "../components/screens/SplashScreen";
import { View } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    SpaceGrotesk_400Regular,
    RubikDoodleShadow: require("../assets/fonts/RubikDoodleShadow-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Shorter delay for better UX
      setTimeout(() => {
        setIsReady(true);
      }, 3000);
    }
  }, [fontsLoaded]);

  if (!isReady || !fontsLoaded) {
    return (
      <StyledView className="flex-1">
        <SplashScreen />
      </StyledView>
    );
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
