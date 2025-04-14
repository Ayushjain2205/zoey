import React, { createContext, useContext, useState } from "react";

export type ChatMode =
  | "DOCTOR"
  | "NUTRITIONIST"
  | "THERAPIST"
  | "TRAINER"
  | "SLEEP"
  | "MEDITATION";

export interface ThemeColors {
  main: string;
  light: string;
  lighter: string;
  dark: string;
}

export const modeColors: Record<string, ThemeColors> = {
  DOCTOR: {
    main: "#BAE1FF",
    light: "#E5F4FF",
    lighter: "#F5FAFF",
    dark: "#7AC2FF",
  },
  NUTRITIONIST: {
    main: "#BAFFC9",
    light: "#E5FFE9",
    lighter: "#F5FFF7",
    dark: "#7AFF8F",
  },
  THERAPIST: {
    main: "#E0B3FF",
    light: "#F0E5FF",
    lighter: "#F8F5FF",
    dark: "#B366FF",
  },
  TRAINER: {
    main: "#FFB3BA",
    light: "#FFE5E8",
    lighter: "#FFF5F7",
    dark: "#FF7A85",
  },
  SLEEP: {
    main: "#7EE8E8",
    light: "#E5FDFD",
    lighter: "#F5FEFE",
    dark: "#4AD8D8",
  },
  MEDITATION: {
    main: "#FFE4B3",
    light: "#FFF4E5",
    lighter: "#FFF9F5",
    dark: "#FFD27A",
  },
};

export interface ChatModeConfig {
  name: ChatMode;
  image: any;
  color: string;
}

export const CHAT_MODES: ChatModeConfig[] = [
  {
    name: "DOCTOR",
    image: require("../assets/images/zoey_doctor.png"),
    color: modeColors.DOCTOR.main,
  },
  {
    name: "NUTRITIONIST",
    image: require("../assets/images/zoey_nutritionist.png"),
    color: modeColors.NUTRITIONIST.main,
  },
  {
    name: "THERAPIST",
    image: require("../assets/images/zoey_therapist.png"),
    color: modeColors.THERAPIST.main,
  },
  {
    name: "TRAINER",
    image: require("../assets/images/zoey_trainer.png"),
    color: modeColors.TRAINER.main,
  },
  {
    name: "SLEEP",
    image: require("../assets/images/zoey_sleep.png"),
    color: modeColors.SLEEP.main,
  },
  {
    name: "MEDITATION",
    image: require("../assets/images/zoey_meditation.png"),
    color: modeColors.MEDITATION.main,
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
