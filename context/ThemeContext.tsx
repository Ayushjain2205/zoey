import React, { createContext, useContext, useState } from "react";

export type ChatMode = "BFF" | "COACH" | "MANAGER" | "GF" | "SHOPPER";

export interface ThemeColors {
  main: string;
  light: string;
  lighter: string;
  dark: string;
}

export const modeColors: Record<string, ThemeColors> = {
  BFF: {
    main: "#E0B3FF",
    light: "#F0E5FF",
    lighter: "#F8F5FF",
    dark: "#B366FF",
  },
  MANAGER: {
    main: "#BAFFC9",
    light: "#E5FFE9",
    lighter: "#F5FFF7",
    dark: "#7AFF8F",
  },
  COACH: {
    main: "#BAE1FF",
    light: "#E5F4FF",
    lighter: "#F5FAFF",
    dark: "#7AC2FF",
  },
  SHOPPER: {
    main: "#7EE8E8",
    light: "#E5FDFD",
    lighter: "#F5FEFE",
    dark: "#4AD8D8",
  },
  GF: {
    main: "#FFB3BA",
    light: "#FFE5E8",
    lighter: "#FFF5F7",
    dark: "#FF7A85",
  },
};

export interface ChatModeConfig {
  name: ChatMode;
  image: any;
  color: string;
}

export const CHAT_MODES: ChatModeConfig[] = [
  {
    name: "BFF",
    image: require("../assets/images/zoey.png"),
    color: modeColors.BFF.main,
  },
  {
    name: "COACH",
    image: require("../assets/images/zoey_coach.png"),
    color: modeColors.COACH.main,
  },
  {
    name: "MANAGER",
    image: require("../assets/images/zoey_manager.png"),
    color: modeColors.MANAGER.main,
  },
  {
    name: "GF",
    image: require("../assets/images/zoey_gf.png"),
    color: modeColors.GF.main,
  },
  {
    name: "SHOPPER",
    image: require("../assets/images/zoey_shopper.png"),
    color: modeColors.SHOPPER.main,
  },
];

interface ThemeContextType {
  selectedMode: ChatModeConfig;
  setSelectedMode: (mode: ChatModeConfig) => void;
  currentTheme: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedMode, setSelectedMode] = useState<ChatModeConfig>(
    CHAT_MODES[0]
  );

  const currentTheme = modeColors[selectedMode.name];

  return (
    <ThemeContext.Provider
      value={{
        selectedMode,
        setSelectedMode,
        currentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
