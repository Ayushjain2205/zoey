import React, { useState } from "react";
import { View, Text, Pressable, Image, ScrollView, Modal } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledModal = styled(Modal);

type Category = "abilities" | "gifts" | "boosts";

interface ShopItem {
  name: string;
  price: number;
  image: any;
}

const gifts: ShopItem[] = [
  {
    name: "Friendship Bracelet",
    price: 100,
    image: require("../../assets/images/bracelet.png"),
  },
  {
    name: "Crown of Excellence",
    price: 200,
    image: require("../../assets/images/crown.png"),
  },
  {
    name: "Dream Catcher",
    price: 300,
    image: require("../../assets/images/dreamcatcher.png"),
  },
  {
    name: "Hat of Empathy",
    price: 400,
    image: require("../../assets/images/hat.png"),
  },
  {
    name: "Hoodie",
    price: 500,
    image: require("../../assets/images/hoodie.png"),
  },
  {
    name: "Locket of Love",
    price: 600,
    image: require("../../assets/images/locket.png"),
  },
  {
    name: "Enchanted Mirror",
    price: 700,
    image: require("../../assets/images/mirror.png"),
  },
  {
    name: "Makeup Box",
    price: 800,
    image: require("../../assets/images/makeupbox.png"),
  },
  {
    name: "Ring of Friendship",
    price: 900,
    image: require("../../assets/images/ring.png"),
  },
  {
    name: "Sunglasses",
    price: 1000,
    image: require("../../assets/images/sunglasses.png"),
  },
];

const boosts: ShopItem[] = [
  {
    name: "1-Day Boost",
    price: 100,
    image: require("../../assets/images/bronze-rocket.png"),
  },
  {
    name: "3-Day Boost",
    price: 250,
    image: require("../../assets/images/silver-rocket.png"),
  },
  {
    name: "5-Day Boost",
    price: 400,
    image: require("../../assets/images/gold-rocket.png"),
  },
  {
    name: "7-Day Boost",
    price: 500,
    image: require("../../assets/images/diamond-rocket.png"),
  },
];

const abilities: ShopItem[] = [
  {
    name: "Novice Pack",
    price: 500,
    image: require("../../assets/images/ability1.png"),
  },
  {
    name: "Adept Bundle",
    price: 1000,
    image: require("../../assets/images/ability2.png"),
  },
  {
    name: "Master's Cache",
    price: 2000,
    image: require("../../assets/images/ability3.png"),
  },
  {
    name: "Ultimate Upgrade",
    price: 5000,
    image: require("../../assets/images/ability4.png"),
  },
];

export const ShopScreen = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("abilities");
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const handlePurchase = (item: ShopItem) => {
    // TODO: Implement actual purchase logic
    setSelectedItem(null);
  };

  const renderPurchaseModal = () => (
    <StyledModal
      animationType="slide"
      transparent={true}
      visible={selectedItem !== null}
      onRequestClose={() => setSelectedItem(null)}
    >
      <StyledPressable
        className="flex-1 bg-black/50"
        onPress={() => setSelectedItem(null)}
      >
        <StyledView className="flex-1 justify-center items-center px-4">
          <StyledPressable
            className="w-full bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            onPress={(e) => e.stopPropagation()}
          >
            {selectedItem && (
              <>
                <StyledView className="w-32 h-32 mx-auto bg-gray-100 rounded-lg items-center justify-center border-2 border-black overflow-hidden mb-4">
                  <StyledImage
                    source={selectedItem.image}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </StyledView>
                <StyledText className="font-space text-xl text-center font-bold mb-2">
                  {selectedItem.name}
                </StyledText>
                <StyledView className="flex-row justify-center items-center mb-4">
                  <StyledView className="w-4 h-4 bg-yellow-400 rounded-full border border-black mr-1.5" />
                  <StyledText className="font-space text-lg">
                    {selectedItem.price}
                  </StyledText>
                </StyledView>
                <StyledView className="flex-row space-x-2">
                  <StyledPressable
                    className="flex-1 bg-gray-100 py-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
                    onPress={() => setSelectedItem(null)}
                  >
                    <StyledText className="font-space text-center">
                      Cancel
                    </StyledText>
                  </StyledPressable>
                  <StyledPressable
                    className="flex-1 bg-[#FFB5C5] py-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
                    onPress={() => handlePurchase(selectedItem)}
                  >
                    <StyledText className="font-space text-center font-bold">
                      Buy Now
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </>
            )}
          </StyledPressable>
        </StyledView>
      </StyledPressable>
    </StyledModal>
  );

  const renderItem = (item: ShopItem) => (
    <StyledPressable
      key={item.name}
      className="bg-white border-2 border-black rounded-xl p-3 mb-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
      onPress={() => setSelectedItem(item)}
    >
      <StyledView className="aspect-square bg-gray-100 rounded-lg mb-2 items-center justify-center border-2 border-black overflow-hidden">
        <StyledImage
          source={item.image}
          className="w-full h-full"
          resizeMode="contain"
        />
      </StyledView>
      <StyledView className="flex-row items-center justify-between">
        <StyledText
          className="font-space text-sm font-bold flex-1 mr-2"
          numberOfLines={1}
        >
          {item.name}
        </StyledText>
        <StyledView className="flex-row items-center">
          <StyledView className="w-3 h-3 bg-yellow-400 rounded-full border border-black mr-1" />
          <StyledText className="font-space text-sm">{item.price}</StyledText>
        </StyledView>
      </StyledView>
    </StyledPressable>
  );

  const getItemsForCategory = () => {
    switch (selectedCategory) {
      case "abilities":
        return abilities;
      case "gifts":
        return gifts;
      case "boosts":
        return boosts;
      default:
        return [];
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-[#FFE5EC]" edges={["top"]}>
      <StyledView className="flex-1 px-4">
        {/* Header with back button */}
        <StyledView className="flex-row items-center justify-between py-4">
          <StyledView className="flex-row items-center">
            <StyledPressable
              onPress={() => router.back()}
              className="bg-white border-2 border-black rounded-xl w-10 h-10 items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
            >
              <Feather name="arrow-left" size={20} color="black" />
            </StyledPressable>
            <StyledView className="ml-4">
              <StyledText className="font-space text-2xl font-bold">
                Shop
              </StyledText>
              <StyledText className="font-space text-sm text-gray-600">
                Buy Zoey some gifts!
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledView className="flex-row items-center">
            <StyledView className="w-4 h-4 bg-yellow-400 rounded-full border border-black mr-1.5" />
            <StyledText className="font-space text-lg">2,450</StyledText>
          </StyledView>
        </StyledView>

        {/* Category Tabs */}
        <StyledView className="flex-row mb-4">
          {[
            { id: "abilities" as const, label: "Abilities", color: "#FFB5C5" },
            { id: "gifts" as const, label: "Gifts", color: "#FFFFFF" },
            { id: "boosts" as const, label: "Boosts", color: "#FFFFFF" },
          ].map((category) => (
            <StyledPressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`flex-1 py-2 px-4 border-2 border-black rounded-xl mr-2 last:mr-0 ${
                selectedCategory === category.id
                  ? "bg-[#FFB5C5] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white"
              }`}
            >
              <StyledText className="font-space text-center">
                {category.label}
              </StyledText>
            </StyledPressable>
          ))}
        </StyledView>

        {/* Items Grid */}
        <StyledScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <StyledView className="flex-row flex-wrap justify-between">
            {getItemsForCategory().map((item) => (
              <StyledView key={item.name} className="w-[48%]">
                {renderItem(item)}
              </StyledView>
            ))}
          </StyledView>
          <StyledView className="h-6" />
        </StyledScrollView>
      </StyledView>

      {/* Purchase Modal */}
      {renderPurchaseModal()}
    </StyledSafeAreaView>
  );
};
