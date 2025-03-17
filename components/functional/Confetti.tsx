import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ConfettiProps {
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ onComplete }) => {
  const particles = Array(50).fill(0);
  const animationsRef = useRef<Animated.Value[]>([]);

  useEffect(() => {
    // Initialize animations if they haven't been created yet
    if (animationsRef.current.length === 0) {
      animationsRef.current = particles.map(() => new Animated.Value(0));
    }

    const animationConfigs = animationsRef.current.map((animation, index) => {
      const startX = Math.random() * SCREEN_WIDTH;
      const startY = -20;
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = SCREEN_HEIGHT + 100;
      const duration = 2000 + Math.random() * 1000;
      const delay = Math.random() * 500;

      return Animated.timing(animation, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      });
    });

    Animated.parallel(animationConfigs).start(() => {
      if (onComplete) {
        onComplete();
      }
    });
  }, []);

  return (
    <StyledView className="absolute inset-0 pointer-events-none">
      {particles.map((_, index) => {
        const startX = Math.random() * SCREEN_WIDTH;
        const startY = -20;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = SCREEN_HEIGHT + 100;
        const rotate = Math.random() * 360;

        const translateX = animationsRef.current[index].interpolate({
          inputRange: [0, 1],
          outputRange: [startX, endX],
        });

        const translateY = animationsRef.current[index].interpolate({
          inputRange: [0, 1],
          outputRange: [startY, endY],
        });

        const rotateAnimation = animationsRef.current[index].interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", `${rotate}deg`],
        });

        const opacity = animationsRef.current[index].interpolate({
          inputRange: [0, 0.8, 1],
          outputRange: [1, 1, 0],
        });

        return (
          <Animated.View
            key={index}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
              borderRadius: 4,
              transform: [
                { translateX },
                { translateY },
                { rotate: rotateAnimation },
              ],
              opacity,
            }}
          />
        );
      })}
    </StyledView>
  );
};
