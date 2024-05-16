import React from 'react';
import "./navbar.css";
import * as Icons from '@mui/icons-material';

const Navbar = ({ onToolSelect }) => {
  const icons = [
    { icon: <Icons.Mouse />, label: 'select' },
    { icon: <Icons.FontDownload />, label: 'Text' },
    { icon: <Icons.Note />, label: 'Shape' },
    { icon: <Icons.Create />, label: 'Pen' }
  ];

  const handleIconClick = (label) => {
    if (onToolSelect) {
      onToolSelect(label);
    }
  };

  return (
    <div className="navbar">
      {icons.map((item, index) => (
        <div key={index} className="navbar__item" onClick={() => handleIconClick(item.label)}>
          {item.icon}
          <span className="navbar__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
