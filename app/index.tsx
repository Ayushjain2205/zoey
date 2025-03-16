import { SafeAreaView, Text, View } from "react-native";
import Constants from "expo-constants";
import LoginScreen from "@/components/screens/LoginScreen";
import { usePrivy } from "@privy-io/expo";
import { UserScreen } from "@/components/screens/UserScreen";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import SplashScreenComponent from "@/components/screens/SplashScreen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { user } = usePrivy();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for 2 seconds to simulate loading
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return <SplashScreenComponent />;
  }

  if ((Constants.expoConfig?.extra?.privyAppId as string).length !== 25) {
    return (
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>You have not set a valid `privyAppId` in app.json</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!(Constants.expoConfig?.extra?.privyClientId as string).startsWith("client-")) {
    return (
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>You have not set a valid `privyClientId` in app.json</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      {!user ? <LoginScreen /> : <UserScreen />}
    </View>
  );
}
