"use client";

import { createContext,useState } from "react";

export const SelectedTool = createContext({
    currentTool: null,
    setCurrentTool: () => null,
})

export const SelectedToolProvider = ({ children }) => {
    const [currentTool, setCurrentTool] = useState(null);
    const value = { currentTool, setCurrentTool};
    return <SelectedTool.Provider value={value}>{children}</SelectedTool.Provider>
}  