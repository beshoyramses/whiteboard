"use client";

import React, { createContext, useState, ReactNode } from 'react';

interface DrawSettingsContextType {
  currentSize: number | null;
  setCurrentSize: (size: number | null) => void;
  isFilled: boolean;
  setIsFilled: (filled: boolean) => void;
}

export const DrawSettingsContext = createContext<DrawSettingsContextType | undefined>(undefined);

export const DrawSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [currentSize, setCurrentSize] = useState<number | null>(null);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  return (
    <DrawSettingsContext.Provider value={{ currentSize, setCurrentSize, isFilled, setIsFilled }}>
      {children}
    </DrawSettingsContext.Provider>
  );
};
