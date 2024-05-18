import React, { useContext } from 'react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import ColorPicker from "../colorPick/ColorPick";
import { SelectedColor } from '../context/Color';
import "./sidebar.css";

const Sidebar = () => {
  const { fabricCanvas } = useContext(FabricContext); 

  const handleReset = () => {
    // Clear the canvas
    fabricCanvas.clear();
  };

  const handleDelete = () => {
    // Delete the selected object
    const selectedObject = fabricCanvas.getActiveObject();
    if (selectedObject) {
      fabricCanvas.remove(selectedObject);
    }
  };

  return (
    <div className='sidebar'>
      <ul>
        <li><button type="button" onClick={handleReset}><RestartAltIcon /></button></li>
        <li><button type="button" onClick={handleDelete}><DeleteIcon /></button></li>
      </ul>
      <div>
        <ColorPicker />
      </div>
    </div>
  );
}

export default Sidebar;
