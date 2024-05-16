"use client";

import React, { useRef, useEffect, useState } from 'react';

const Canvas = ({ selectedTool }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentStyle, setCurrentStyle] = useState({
    color: 'black',
    lineWidth: 3
  });
  const [drawingActions, setDrawingActions] = useState([]);
  const [textFields, setTextFields] = useState([]); // Array to store text fields
  const [mouseCursor, setMouseCursor] = useState('default'); // State for mouse cursor
  
  const handleCanvasClick = (e) => {
    if(selectedTool === 'Text') {
    const offsetX = e.nativeEvent.offsetX;
    const offsetY = e.nativeEvent.offsetY;
    setTextFields(prevFields => [...prevFields, { x: offsetX, y: offsetY, text: "" }]);
  };
}

  
  
console.log(selectedTool)

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    contextRef.current = context;
    reDrawPreviousData(context);
  }, []);

  useEffect(() => {
    // Change mouse cursor based on selected tool
    if (selectedTool === 'Text') {
      setMouseCursor('text');
    } else {
      setMouseCursor('default');
    }
  }, [selectedTool]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (selectedTool !== 'Pen') {
      setIsSelecting(true);
    }
    if (selectedTool === 'Pen') {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setDrawing(true);
      setCurrentPath([{ x: offsetX, y: offsetY }]);
    }
  };
  

  const draw = (e) => {
    if (!drawing) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    if (selectedTool === 'Pen') {
      contextRef.current.strokeStyle = currentStyle.color;
      contextRef.current.lineWidth = currentStyle.lineWidth;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
      setCurrentPath(prevPath => [...prevPath, { x: offsetX, y: offsetY }]);
    }
  };



  const finishDrawing = () => {
    if (selectedTool === 'Pen') {
      setDrawing(false);
      contextRef.current.closePath();
      setDrawingActions(prevActions => [...prevActions, currentPath]);
    }
  };

  const reDrawPreviousData = (context) => {
    drawingActions.forEach(path => {
      context.beginPath();
      context.moveTo(path[0].x, path[0].y);
      path.slice(1).forEach(({ x, y }) => {
        context.lineTo(x, y);
        context.stroke();
      });
      context.closePath();
    });
  };

  const handleTextChange = (index, e) => {
    const newTextFields = [...textFields];
    newTextFields[index].text = e.target.value;
    setTextFields(newTextFields);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', cursor: mouseCursor }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseOut={finishDrawing}
        style={{width: '100%', height: '100%', outline: 'none' }}
      />
      {textFields.map((field, index) => (
        <div key={index} style={{ position: 'absolute', top: field.y, left: field.x, resize: 'vertical' }}>
          <input
            type="text"
            value={field.text}
            onChange={(e) => handleTextChange(index, e)}
            placeholder="Type here"
            style={{ border: 'none', background: 'transparent', color: 'black', outline: 'none',}}
          />
        </div>
      ))}
    </div>
  );
};

export default Canvas;
