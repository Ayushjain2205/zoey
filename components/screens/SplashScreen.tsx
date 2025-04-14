import { View, Image, Text } from "react-native";
import { styled } from "nativewind";
import { useEffect, useState } from "react";

const StyledView = styled(View);
const StyledText = styled(Text);

const images = [
  require("../../assets/images/zoey_doctor.png"),
  require("../../assets/images/zoey_meditation.png"),
  require("../../assets/images/zoey_therapist.png"),
  require("../../assets/images/zoey_sleep.png"),
  require("../../assets/images/zoey_nutritionist.png"),
  require("../../assets/images/zoey_trainer.png"),
];

export default function SplashScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledView className="flex-1 bg-[#E0B3FF] items-center justify-center space-y-8">
      <Image
        source={images[currentImageIndex]}
        style={{ width: 300, height: 300 }}
        resizeMode="contain"
      />
      <StyledText className="text-5xl text-center font-[RubikDoodleShadow] text-black  rounded-xl px-6 py-2 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]">
        Dr. Zoey
      </StyledText>
    </StyledView>
  );
}
