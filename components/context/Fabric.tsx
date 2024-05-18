// CanvasContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fabric } from 'fabric';

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  const [fabricCanvas, setFabricCanvas] = useState(null);

  useEffect(() => {
    const canvas = new fabric.Canvas('canvas', {
      selection: true,
      preserveObjectStacking: true,
    });
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <CanvasContext.Provider value={{ fabricCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
