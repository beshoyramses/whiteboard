"use client";
import "./globals.css";
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Canvas from '../components/Canvas/Canvas';

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  return (
    <div>
      <Navbar onToolSelect={handleToolSelect} />
      <Canvas selectedTool={selectedTool} />
    </div>
  );
}
