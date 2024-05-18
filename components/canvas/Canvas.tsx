"use client";

import React, { useRef, useEffect, useContext, useState } from 'react';
import { SelectedTool } from '../context/SelectedTool';
import { SelectedColor } from '../context/Color';
import { fabric } from 'fabric';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const { currentTool, setCurrentTool } = useContext(SelectedTool);
  const { currentColor } = useContext(SelectedColor);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentShapeRef = useRef<fabric.Object | null>(null);
  const currentToolRef = useRef(currentTool);
  const currentColorRef = useRef(currentColor);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

  useEffect(() => {
    currentToolRef.current = currentTool;
    if (fabricCanvasRef.current) {
      if (currentTool === 'Pen') {
        fabricCanvasRef.current.isDrawingMode = true;
        fabricCanvasRef.current.freeDrawingBrush.color = currentColorRef.current;
        fabricCanvasRef.current.freeDrawingBrush.width = 4;
      } else {
        fabricCanvasRef.current.isDrawingMode = false;
      }
    }
  }, [currentTool]);

  useEffect(() => {
    currentColorRef.current = currentColor;
    if (fabricCanvasRef.current) {
      if (currentToolRef.current === 'Pen') {
        fabricCanvasRef.current.freeDrawingBrush.stroke = currentColorRef.current;
      } else if (selectedObject) {
        // Check if selected object is a path (brush stroke)
        if (selectedObject.type === 'path') {
          selectedObject.set('stroke', currentColorRef.current);
        } else {
          selectedObject.set('fill', currentColorRef.current);
          selectedObject.set('stroke', currentColorRef.current);
        }
        fabricCanvasRef.current.renderAll();
      }
    }
  }, [currentColor]);
  

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.width = canvasElement.parentElement?.clientWidth || window.innerWidth - 230;
      canvasElement.height = canvasElement.parentElement?.clientHeight || window.innerHeight;

      const fabricCanvas = new fabric.Canvas(canvasElement);
      fabricCanvasRef.current = fabricCanvas;

      fabricCanvas.on('mouse:down', handleMouseDown);
      fabricCanvas.on('mouse:move', handleMouseMove);
      fabricCanvas.on('mouse:up', handleMouseUp);
      fabricCanvas.on('selection:created', handleObjectSelected);
      fabricCanvas.on('selection:updated', handleObjectSelected);
      fabricCanvas.on('selection:cleared', handleObjectDeselected);

      return () => {
        fabricCanvas.off('mouse:down', handleMouseDown);
        fabricCanvas.off('mouse:move', handleMouseMove);
        fabricCanvas.off('mouse:up', handleMouseUp);
        fabricCanvas.off('selection:created', handleObjectSelected);
        fabricCanvas.off('selection:updated', handleObjectSelected);
        fabricCanvas.off('selection:cleared', handleObjectDeselected);
        fabricCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && fabricCanvasRef.current) {
        const canvasElement = canvasRef.current;
        canvasElement.width = canvasElement.parentElement?.clientWidth || window.innerWidth;
        canvasElement.height = canvasElement.parentElement?.clientHeight || window.innerHeight;
        fabricCanvasRef.current.setWidth(canvasElement.width);
        fabricCanvasRef.current.setHeight(canvasElement.height);
        fabricCanvasRef.current.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseDown = (event) => {
    if (currentToolRef.current === 'select' || currentToolRef.current === 'Pen') return;

    const pointer = fabricCanvasRef.current.getPointer(event.e);
    startPosRef.current = { x: pointer.x, y: pointer.y };
    isDrawingRef.current = true;

    let shape;
    const shapeOptions = {
      left: pointer.x,
      top: pointer.y,
      fill: currentColorRef.current,
      stroke: currentColorRef.current,
      strokeWidth: 2,
    };

    if (currentToolRef.current === 'rectangle') {
      shape = new fabric.Rect({ ...shapeOptions, width: 0, height: 0 });
    } else if (currentToolRef.current === 'circle') {
      shape = new fabric.Circle({ ...shapeOptions, radius: 0 });
    } else if (currentToolRef.current === 'triangle') {
      shape = new fabric.Polygon([
        { x: pointer.x, y: pointer.y },
        { x: pointer.x, y: pointer.y },
        { x: pointer.x, y: pointer.y }
      ], { ...shapeOptions });
    } else if (currentToolRef.current === 'Text') {
      shape = new fabric.Textbox('Sample Text', {
        ...shapeOptions,
        fontSize: 20,
        fill: currentColorRef.current,
      });
    }

    if (shape) {
      fabricCanvasRef.current.add(shape);
      currentShapeRef.current = shape;
    }
  };

  const handleMouseMove = (event) => {
    if (!isDrawingRef.current || !currentShapeRef.current) return;

    const pointer = fabricCanvasRef.current.getPointer(event.e);

    if (currentToolRef.current === 'rectangle') {
      const width = pointer.x - startPosRef.current.x;
      const height = pointer.y - startPosRef.current.y;
      currentShapeRef.current.set({ width: Math.abs(width), height: Math.abs(height) });
      if (width < 0) currentShapeRef.current.set({ left: pointer.x });
      if (height < 0) currentShapeRef.current.set({ top: pointer.y });
    } else if (currentToolRef.current === 'circle') {
      const radius = Math.sqrt(Math.pow(pointer.x - startPosRef.current.x, 2) + Math.pow(pointer.y - startPosRef.current.y, 2)) / 2;
      currentShapeRef.current.set({ radius });
      currentShapeRef.current.set({ left: startPosRef.current.x - radius, top: startPosRef.current.y - radius });
    } else if (currentToolRef.current === 'triangle') {
      const triangle = currentShapeRef.current as fabric.Polygon;
      const points = [
        { x: startPosRef.current.x, y: pointer.y },
        { x: (startPosRef.current.x + pointer.x) / 2, y: startPosRef.current.y },
        { x: pointer.x, y: pointer.y }
      ];
      triangle.set({ points });
    }

    fabricCanvasRef.current.renderAll();
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    currentShapeRef.current = null;
    if (currentToolRef.current !== 'Pen') {
      setCurrentTool("select");
    }
  };

  const handleObjectSelected = (event) => {
    setSelectedObject(event.selected[0]);
  };

  const handleObjectDeselected = () => {
    setSelectedObject(null);
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', outline: 'none' }}
      />
    </div>
  );
};

export default Canvas;
