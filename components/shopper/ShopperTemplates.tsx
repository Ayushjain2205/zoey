import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { styled } from "nativewind";
import { Feather } from "@expo/vector-icons";
import { ThemeColors } from "../../context/ThemeContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledPressable = styled(Pressable);

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: any; // Local image require() or remote URL
  isPrime: boolean;
}

export interface ProductCollection {
  title: string;
  products: Product[];
}

// Product Collections
export const techDeals: ProductCollection = {
  title: "Today's Tech Deals 🎯",
  products: [
    {
      id: "1",
      name: "Apple AirPods Pro (2nd Generation)",
      description:
        "Active Noise Cancelling, Transparency Mode, Spatial Audio with Dynamic Head Tracking",
      price: 249.99,
      rating: 4.8,
      reviews: 31250,
      image: require("../../assets/images/products/airpods.jpg"),
      isPrime: true,
    },
    {
      id: "2",
      name: "Apple Watch Series 9 [GPS 41mm]",
      description:
        "Smart Watch w/Starlight Aluminum Case with Starlight Sport Band. Fitness Tracker, Blood Oxygen",
      price: 329.99,
      rating: 4.9,
      reviews: 8420,
      image: require("../../assets/images/products/watch.jpg"),
      isPrime: true,
    },
    {
      id: "3",
      name: "MacBook Air 15-inch M2",
      description:
        "Apple M2 chip with 8‑core CPU, 10‑core GPU, 16‑core Neural Engine",
      price: 1299.99,
      rating: 4.9,
      reviews: 2150,
      image: require("../../assets/images/products/macbook.jpg"),
      isPrime: true,
    },
    {
      id: "4",
      name: "iPad Air (5th Generation)",
      description: "10.9-inch, M1 chip, 64GB, Wi-Fi, All-day Battery Life",
      price: 559.99,
      rating: 4.8,
      reviews: 12340,
      image: require("../../assets/images/products/iphone.jpeg"),
      isPrime: true,
    },
  ],
};

// More collections can be added here (e.g., fashionDeals, homeDeals, etc.)

interface TemplateProps {
  currentTheme: ThemeColors;
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <StyledText key={i} className="text-yellow-400 text-lg">
        ★
      </StyledText>
    );
  }
  return <StyledView className="flex-row">{stars}</StyledView>;
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <StyledView className="bg-white border-2 border-black rounded-xl overflow-hidden mb-2">
    <StyledView className="flex-row p-3">
      {/* Product Image */}
      <StyledView className="mr-3">
        <StyledImage
          source={product.image}
          className="w-24 h-24 rounded-lg border border-gray-200"
          resizeMode="cover"
        />
      </StyledView>

      {/* Product Info */}
      <StyledView className="flex-1 justify-between">
        <StyledView>
          <StyledText
            className="font-space font-bold text-base"
            numberOfLines={1}
          >
            {product.name}
          </StyledText>

          {/* Rating and Prime inline */}
          <StyledView className="flex-row items-center mt-1">
            <StyledView className="flex-row">
              {[...Array(5)].map((_, i) => (
                <StyledText
                  key={i}
                  className="text-yellow-400 text-sm mr-[1px]"
                >
                  ★
                </StyledText>
              ))}
            </StyledView>
            <StyledText className="font-space text-xs text-gray-500 ml-1">
              ({product.reviews.toLocaleString()})
            </StyledText>
            {product.isPrime && (
              <StyledView className="flex-row items-center ml-2">
                <Feather name="package" size={12} color="#00A8E1" />
                <StyledText className="font-space text-xs text-[#00A8E1] ml-0.5">
                  Prime
                </StyledText>
              </StyledView>
            )}
          </StyledView>

          <StyledText
            className="font-space text-xs text-gray-500 mt-1"
            numberOfLines={2}
          >
            {product.description}
          </StyledText>
        </StyledView>

        {/* Price and Button */}
        <StyledView className="flex-row items-center justify-between mt-2">
          <StyledText className="font-space font-bold text-lg">
            ${product.price}
          </StyledText>
          <StyledPressable className="bg-black rounded-lg px-3 py-1.5">
            <StyledView className="flex-row items-center">
              <Feather name="shopping-cart" size={14} color="white" />
              <StyledText className="font-space text-white text-xs font-bold ml-1">
                View
              </StyledText>
            </StyledView>
          </StyledPressable>
        </StyledView>
      </StyledView>
    </StyledView>
  </StyledView>
);

export const ProductGrid: React.FC<
  TemplateProps & { collection: ProductCollection }
> = ({ collection, currentTheme }) => (
  <StyledView className="bg-white border-2 border-black rounded-xl overflow-hidden mb-4">
    {/* Header */}
    <StyledView
      className="px-3 py-2 border-b-2 border-black"
      style={{ backgroundColor: currentTheme.main }}
    >
      <StyledText className="font-space text-base font-bold">
        {collection.title}
      </StyledText>
    </StyledView>

    {/* Product Grid */}
    <StyledView className="p-2">
      {collection.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </StyledView>
  </StyledView>
);

// Shopper mode simulation helpers
export interface ShopperResponse {
  type: "products" | "message";
  content: ProductCollection | string;
}

export const handleShopperMessage = (text: string): ShopperResponse | null => {
  const lowerText = text.toLowerCase();

  // Tech deals
  if (
    lowerText.includes("tech") ||
    lowerText.includes("apple") ||
    lowerText.includes("electronics") ||
    lowerText.includes("gadgets")
  ) {
    return {
      type: "products",
      content: techDeals,
    };
  }

  // General shopping questions
  if (lowerText.includes("deals") || lowerText.includes("sale")) {
    return {
      type: "message",
      content:
        "I can help you find the best deals! What kind of products are you interested in? We have great deals on tech, fashion, home goods, and more! 🛍️",
    };
  }

  // Return null if no specific shopping response is needed
  return null;
};
