import React, { createContext, useContext, useState } from "react";

interface CoinsContextType {
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
}

const CoinsContext = createContext<CoinsContextType | undefined>(undefined);

export const CoinsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [coins, setCoins] = useState(2450); // Starting with 2450 coins

  const addCoins = (amount: number) => {
    setCoins((prev) => prev + amount);
  };

  const spendCoins = (amount: number): boolean => {
    if (coins >= amount) {
      setCoins((prev) => prev - amount);
      return true;
    }
    return false;
  };

  return (
    <CoinsContext.Provider value={{ coins, addCoins, spendCoins }}>
      {children}
    </CoinsContext.Provider>
  );
};

export const useCoins = () => {
  const context = useContext(CoinsContext);
  if (context === undefined) {
    throw new Error("useCoins must be used within a CoinsProvider");
  }
  return context;
};
