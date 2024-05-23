"use client";

import React, { useContext } from 'react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ColorPicker from "../colorPick/ColorPick";
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { DrawSettingsContext } from '../context/drawSettings'; // Update the path as needed
import jsPDF from 'jspdf'; // Add jsPDF
import "./sidebar.css";

const Sidebar = () => {
  const drawSettings = useContext(DrawSettingsContext);

  if (!drawSettings) {
    throw new Error('DrawSettingsContext must be used within a DrawSettingsProvider');
  }

  const { currentSize, setCurrentSize, isFilled, setIsFilled } = drawSettings;

  const handleSizeChange = (event: Event, newValue: number | number[]) => {
    setCurrentSize(Array.isArray(newValue) ? newValue[0] : newValue);
  };

  const handleFillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFilled(event.target.checked);
  };

  const handleImportImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result;
        if (imageSrc) {
          const event = new CustomEvent('importImage', { detail: imageSrc });
          window.dispatchEvent(event);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportPDF = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataURL = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF('landscape');
      pdf.addImage(dataURL, 'JPEG', 10, 10, 280, 150);
      pdf.save('canvas.pdf');
    }
  };

  return (
    <div className='sidebar'>
      <ul>
        <li><button type="button"><RestartAltIcon /></button></li>
        <li><button type="button"><DeleteIcon /></button></li>
      </ul>
      <div>
        <ColorPicker />
      </div>
      <div className='mt-10 text-white'>
        <FormControlLabel 
          control={<Checkbox checked={isFilled} onChange={handleFillChange} />} 
          label={<><span>Fill</span><FormatColorFillIcon /></>} 
        />
        <div>Brush Size : {currentSize}</div>
        <Box sx={{ width: 200 }} className={"mr-auto ml-auto"}>
          <Slider
            aria-label="Brush Size"
            value={currentSize || 2}
            onChange={handleSizeChange}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={2}
            max={180}
          />
        </Box>
      </div>
      <div className="mt-10 text-white">
        <Button
          variant="contained"
          component="label"
        >
          Import Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImportImage}
          />
        </Button>
      </div>
      <div className="mt-10 text-white">
        <Button
          variant="contained"
          onClick={handleExportPDF}
        >
          Export as PDF
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
