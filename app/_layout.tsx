import Constants from "expo-constants";
import { Stack } from "expo-router";
import { PrivyProvider, PrivyElements } from "@privy-io/expo";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { SpaceGrotesk_400Regular } from "@expo-google-fonts/space-grotesk";
import "@fontsource/rubik-doodle-shadow";
import { useFonts } from "expo-font";
import { scrollSepolia } from "viem/chains";
import { useState, useEffect } from "react";
import { View, Image, Text, Animated } from "react-native";

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
        <View
          style={{
            backgroundColor: "#ffffff",
            padding: 20,
            borderRadius: 12,
            borderWidth: 3,
            borderColor: "#000000",
            shadowColor: "#000000",
            shadowOffset: {
              width: 5,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 5,
          }}
        >
          <Image
            source={require("../assets/images/zoey.png")}
            style={{
              width: 200,
              height: 200,
              borderRadius: 8,
            }}
          />
          <Text
            style={{
              marginTop: 20,
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "SpaceGrotesk_400Regular",
            }}
          >
            Zoey
          </Text>
        </View>
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
    if (fontsLoaded) {
      setTimeout(() => {
        setIsReady(true);
      }, 2000);
    }
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
