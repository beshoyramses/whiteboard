"use client";

import React, { createContext, useState, ReactNode } from 'react';

interface ToolContextType {
  currentTool: string | null;
  setCurrentTool: (tool: string | null) => void;
}

export const SelectedTool = createContext<ToolContextType | undefined>(undefined);

export const SelectedToolProvider = ({ children }: { children: ReactNode }) => {
  const [currentTool, setCurrentTool] = useState<string | null>(null);

  return (
    <SelectedTool.Provider value={{ currentTool, setCurrentTool }}>
      {children}
    </SelectedTool.Provider>
  );
};
