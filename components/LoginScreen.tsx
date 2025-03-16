import { Text, View, Pressable, Dimensions } from "react-native";
import { useLogin } from "@privy-io/expo";
import { useState } from "react";
import { Video, ResizeMode } from "expo-av";

export default function LoginScreen() {
  const [error, setError] = useState("");
  const { login } = useLogin();
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#A7D2BC",
        padding: 20,
      }}
    >
      {/* Video and Title Container */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: screenWidth - 40,
            aspectRatio: 1,
            position: "relative",
            marginBottom: 20,
          }}
        >
          {/* Shadow box */}
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "#000000",
              borderRadius: 12,
              top: 8,
              left: 8,
            }}
          />
          {/* Main container */}
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#ffffff",
              borderRadius: 12,
              borderWidth: 3,
              borderColor: "#000000",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Video
              source={require("../assets/videos/splash.mp4")}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </View>
        </View>

        <Text
          style={{
            fontSize: 48,
            fontFamily: "RubikDoodleShadow",
            color: "#000000",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          I am Zoey!
        </Text>
      </View>

      {/* Login Button Container */}
      <View style={{ marginBottom: 40 }}>
        <Pressable
          onPress={() => {
            login({ loginMethods: ["email"] })
              .then((session) => {
                console.log("User logged in", session.user);
              })
              .catch((err) => {
                setError(JSON.stringify(err.error) as string);
              });
          }}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#e0e0e0" : "#ffffff",
            paddingVertical: 15,
            borderRadius: 12,
            borderWidth: 3,
            borderColor: "#000000",
            shadowColor: "#000000",
            shadowOffset: {
              width: pressed ? 2 : 5,
              height: pressed ? 2 : 5,
            },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: pressed ? 2 : 5,
            transform: [
              {
                translateX: pressed ? 3 : 0,
              },
              {
                translateY: pressed ? 3 : 0,
              },
            ],
            width: "100%",
          })}
        >
          <Text
            style={{
              fontSize: 24,
              fontFamily: "SpaceGrotesk_400Regular",
              color: "#000000",
              textAlign: "center",
            }}
          >
            Login
          </Text>
        </Pressable>

        {error && (
          <Text
            style={{
              color: "red",
              marginTop: 20,
              fontFamily: "SpaceGrotesk_400Regular",
            }}
          >
            Error: {error}
          </Text>
        )}
      </View>
    </View>
  );
}
