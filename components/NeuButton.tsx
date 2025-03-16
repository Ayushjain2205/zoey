import { View, Pressable, Text, DimensionValue } from "react-native";

interface NeuButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  width?: DimensionValue;
}

export const NeuButton = ({ onPress, children, width = "100%" }: NeuButtonProps) => {
  return (
    <View style={{ position: "relative", width }}>
      {/* Shadow Element */}
      <View
        style={{
          position: "absolute",
          top: 5,
          left: 5,
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          borderRadius: 12,
          zIndex: 1,
        }}
      />
      {/* Button Element */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: "#ffffff",
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: "#000000",
          transform: pressed ? [
            { translateX: 3 },
            { translateY: 3 }
          ] : [],
          zIndex: 2,
        })}
      >
        {children}
      </Pressable>
    </View>
  );
};
