"use client";


import React, {useContext} from 'react';
import "./navbar.css";
import * as Icons from '@mui/icons-material';
import { SelectedTool } from '../context/SelectedTool';
import Dropdown from '../dropdown/Dropdown';

const Navbar = () => {
  const icons = [
    { icon: <Icons.Mouse />, label: 'select' },
    { icon: <Icons.FontDownload />, label: 'Text' },
    { icon: <Icons.Note />, label: 'Shape' , isDropdown: true,},
    { icon: <Icons.Create />, label: 'Pen' }
  ];

  const {setCurrentTool} = useContext(SelectedTool);
  
  const setTool = (item) => {
    setCurrentTool(item);
  }

  return (
    <div className="navbar">
      {icons.map((item, index) => (
        item.isDropdown ? <Dropdown key={item.label} title={item.icon}/>:
        <div key={index} className="navbar__item" onClick={() => {setTool(item.label)}}>
          {item.icon}
          <span className="navbar__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
