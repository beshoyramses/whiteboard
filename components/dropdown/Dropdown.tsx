"use client";


import React, {useContext} from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'; // Import the Material UI icons
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined';
import Crop54OutlinedIcon from '@mui/icons-material/Crop54Outlined';
import { SelectedTool } from '../context/SelectedTool';

const Dropdown = (props) => {
    // Define mapping of shapes to Material UI icons
    const shapeIcons = {
        rectangle: <Crop54OutlinedIcon />,
        circle: <CircleOutlinedIcon />,
        triangle: <ChangeHistoryOutlinedIcon />
    };

    const menuItems = [
        { label: 'rectangle', shape: 'rectangle' },
        { label: 'circle', shape: 'circle' },
        { label: 'triangle', shape: 'triangle' },
    ];

    const {setCurrentTool} = useContext(SelectedTool);

    const setTool = (tool) => {
        setCurrentTool(tool)
    }

    return (
        <DropdownMenu>
        <DropdownMenuTrigger style={{ color: '#fff' , outline: 'none'}}>{props.title}</DropdownMenuTrigger>
        <DropdownMenuContent style={{background: '#3e3e3e', color: '#fff'}}>
            <DropdownMenuLabel>Choose shape</DropdownMenuLabel>
            {menuItems.map((item, index) => (
                <DropdownMenuItem key={index} style={{outline: 'none'}} onClick={() => {setTool(item.label)}}>
                    {shapeIcons[item.shape]} <span style={{display: 'inline-block', marginLeft: '11px'}}>{item.label}</span>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
    );
}

export default Dropdown;
