import { View, Image } from "react-native";
import { styled } from "nativewind";
import { useEffect, useState } from "react";

const StyledView = styled(View);

const images = [
  require("../../assets/images/zoey.png"),
  require("../../assets/images/zoey_shopper.png"),
  require("../../assets/images/zoey_gf.png"),
  require("../../assets/images/zoey_coach.png"),
  require("../../assets/images/zoey_manager.png"),
];

export default function SplashScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledView className="flex-1 bg-[#A7D2BC] items-center justify-center">
      <Image
        source={images[currentImageIndex]}
        style={{ width: 300, height: 300 }}
        resizeMode="contain"
      />
    </StyledView>
  );
}