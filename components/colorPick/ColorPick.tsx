import React, { useState, useContext } from 'react';
import { SketchPicker } from 'react-color';
import { SelectedColor } from "../context/Color";

const ColorPicker = () => {
  const [background, setBackground] = useState('#fff');
  const { setCurrentColor } = useContext(SelectedColor);

  const handleChangeComplete = (color) => {
    setBackground(color.hex);
    setCurrentColor(color.hex); // Assuming setCurrentColor expects a string
  };

  return (
    <SketchPicker
      color={background}
      onChange={handleChangeComplete}
    />
  );
}

export default ColorPicker;
