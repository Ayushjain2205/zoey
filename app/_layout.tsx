import Constants from "expo-constants";
import { Stack } from "expo-router";
import { PrivyProvider, PrivyElements } from "@privy-io/expo";
import { SpaceGrotesk_400Regular } from "@expo-google-fonts/space-grotesk";
import { useFonts } from "expo-font";
import { scrollSepolia } from "viem/chains";
import { useState, useEffect } from "react";
import SplashScreen from "../components/screens/SplashScreen";
import { View } from "react-native";
import { styled } from "nativewind";
import { ThemeProvider } from "../context/ThemeContext";
import { CoinsProvider } from "../context/CoinsContext";

const StyledView = styled(View);

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
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
    <ThemeProvider>
      <CoinsProvider>
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
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <PrivyElements />
        </PrivyProvider>
      </CoinsProvider>
    </ThemeProvider>
  );
}
