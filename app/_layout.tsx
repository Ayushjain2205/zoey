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
    <View
      style={{
        flex: 1,
        backgroundColor: "#F6F1F1",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          alignItems: "center",
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        <Image
          source={require("../assets/images/zoey.png")}
          style={{
            width: 300,
            height: 300,
            marginBottom: 30,
          }}
        />
        <Text
          style={{
            fontSize: 48,
            textAlign: "center",
            fontFamily: "RubikDoodleShadow",
            color: "#000000",
          }}
        >
          Zoey
        </Text>
      </Animated.View>
    </View>
  );
};

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    SpaceGrotesk_400Regular,
  });

  useEffect(() => {
    async function loadCustomFonts() {
      try {
        await Font.loadAsync({
          RubikDoodleShadow: require("../assets/fonts/RubikDoodleShadow-Regular.ttf"),
        });
        if (fontsLoaded) {
          setTimeout(() => {
            setIsReady(true);
          }, 2000);
        }
      } catch (error) {
        console.error("Error loading fonts:", error);
        // Still set ready to true even if custom font fails
        if (fontsLoaded) {
          setIsReady(true);
        }
      }
    }
    loadCustomFonts();
  }, [fontsLoaded]);

  if (!fontsLoaded || !isReady) {
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
        <Stack.Screen name="index" />
      </Stack>
      <PrivyElements />
    </PrivyProvider>
  );
}
