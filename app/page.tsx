"use client";

import "./globals.css";
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Canvas from '../components/canvas/Canvas';
import Sidebar from "../components/sidebar/Sidebar.tsx";

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  return (
    <div>
      <Navbar onToolSelect={handleToolSelect} />
      <div className="flex">
      <Canvas selectedTool={selectedTool} />
      <Sidebar />
      </div>

    </div>
  );
}
