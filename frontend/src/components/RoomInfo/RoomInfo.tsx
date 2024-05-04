import { useState } from 'react';
import './RoomInfo.css';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import { IRoom } from '../../interfaces';
import { AccordionDetails, AccordionSummary } from '@mui/material';

interface IProps {
  room: IRoom
}

function RoomInfo(props: IProps) {
  return (
    <Box className='roomInfo'>
      <Box className='content'>
       <Typography variant="h3">{props.room.name}</Typography>
       <Box sx={{display: 'flex'}}>
        <Typography variant="h5">Звёзды: {props.room.stars}/5</Typography>
        <Typography sx={{marginLeft: '27%' }} variant="h5">Количество: {props.room.room_numbers.length}</Typography>
        <Typography sx={{marginLeft: '20%' }} variant="h5">Вместимость: {props.room.capacity}</Typography>
        </Box>
       <Accordion>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Особенности
        </AccordionSummary>
        <AccordionDetails>
        {props.room.amenities.map((amenity, index) => {
        return (
          <Typography key={index} variant="h5">{amenity}</Typography>
        )
       })}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Кровати
        </AccordionSummary>
        <AccordionDetails>
        {props.room.beds.map((bed, index) => {
        return (
          <Typography key={index} variant="h5">{bed}</Typography>
        )
       })}
        </AccordionDetails>
      </Accordion>
       
       </Box>
    </Box>
  );
}

export default RoomInfo;