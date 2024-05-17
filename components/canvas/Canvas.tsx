import React, { useRef, useEffect, useContext } from 'react';
import { SelectedTool } from '../context/SelectedTool';
import { fabric } from 'fabric';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const { currentTool, setCurrentTool } = useContext(SelectedTool);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentShapeRef = useRef<fabric.Object | null>(null);
  const currentToolRef = useRef(currentTool);

  useEffect(() => {
    currentToolRef.current = currentTool;
    const fabricCanvas = fabricCanvasRef.current;

    if (fabricCanvas) {
      if (currentTool === 'Pen') {
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush.width = 2;
        fabricCanvas.freeDrawingBrush.color = 'black';
      } else {
        fabricCanvas.isDrawingMode = false;
      }
    }
  }, [currentTool]);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.width = canvasElement.parentElement?.clientWidth || window.innerWidth;
      canvasElement.height = canvasElement.parentElement?.clientHeight || window.innerHeight;

      const fabricCanvas = new fabric.Canvas(canvasElement);
      fabricCanvasRef.current = fabricCanvas;

      fabricCanvas.on('mouse:down', handleMouseDown);
      fabricCanvas.on('mouse:move', handleMouseMove);
      fabricCanvas.on('mouse:up', handleMouseUp);

      return () => {
        fabricCanvas.off('mouse:down', handleMouseDown);
        fabricCanvas.off('mouse:move', handleMouseMove);
        fabricCanvas.off('mouse:up', handleMouseUp);
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
    if (currentToolRef.current === 'rectangle') {
      shape = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: 'red',
        stroke: 'red',
        strokeWidth: 2,
      });
    } else if (currentToolRef.current === 'circle') {
      shape = new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: 'blue',
        stroke: 'blue',
        strokeWidth: 2,
      });
    } else if (currentToolRef.current === 'triangle') {
      shape = new fabric.Polygon([
        { x: pointer.x, y: pointer.y },
        { x: pointer.x, y: pointer.y },
        { x: pointer.x, y: pointer.y }
      ], {
        fill: 'green',
        stroke: 'green',
        strokeWidth: 2,
      });
    } else if (currentToolRef.current === 'Text') {
      shape = new fabric.Textbox('Sample Text', {
        left: pointer.x,
        top: pointer.y,
        fontSize: 20,
        fill: 'black',
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
