"use client";

import React, { createContext, useState, ReactNode } from 'react';

interface ColorContextType {
  currentColor: string;
  setCurrentColor: (color: string) => void;
}

export const SelectedColor = createContext<ColorContextType | undefined>(undefined);

export const SelectedColorProvider = ({ children }: { children: ReactNode }) => {
  const [currentColor, setCurrentColor] = useState('#fff');

  return (
    <SelectedColor.Provider value={{ currentColor, setCurrentColor }}>
      {children}
    </SelectedColor.Provider>
  );
};
