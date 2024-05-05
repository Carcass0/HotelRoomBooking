import { useState } from 'react';
import './RoomInfo.css';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import { IRoom } from '../../interfaces';
import { AccordionDetails, AccordionSummary, Button, TextField } from '@mui/material';

interface IProps {
  room: IRoom,
  fetchRooms: () => void
}

function RoomInfo(props: IProps) {
  const [customerName, setCustomerName] = useState<string>('')
  const [stayDuration, setStayDuration] = useState<number>(1)

  function handleCheckIn() {
    if (customerName) {
      var response = {
        customer_name: customerName,
        room_number: props.room.room_numbers[0],
        stay_duration: stayDuration
      }
      console.log(props.room.room_numbers[0])
      fetch('http://localhost:8000/move-in', {
          method: 'POST',
          body: JSON.stringify(response),
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status == 0) {
              props.fetchRooms()
              window.location.href = "pay/"
            }
            })
          .catch((error) => {
            console.log(error)
          })
    }
  }

  function handleStayDuration(e: React.ChangeEvent<HTMLInputElement>) {
    var nextValue = Math.max(Number(0), Math.min(Number(21), Number(e.target.value)));
    if (!Number.isInteger(nextValue)) {
      nextValue = Math.floor(nextValue)
    }
    if (nextValue === 0) {
      nextValue = 1
    }
    setStayDuration(nextValue)
  }

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
      <Accordion>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Заселение
        </AccordionSummary>
        <AccordionDetails>
          <Box display='flex' alignItems='center' flexDirection='column'>
        <TextField 
                    id="outlined-basic" 
                    label="Имя постояльца" 
                    variant="outlined" 
                    sx={{width: '25%'}} inputProps={{ maxLength: 32 }}
                    value={customerName}
                    onChange={(e) => {setCustomerName(e.target.value)}}/>
        <Typography variant="h5" sx={{margin: '1%'}}>Количество дней пребывания</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={stayDuration} onChange={handleStayDuration}></input>
        <Button variant="outlined" sx={{width: '25%', margin: '1%'}} onClick={handleCheckIn}>Заселить</Button>
        </Box>
        </AccordionDetails>
      </Accordion>
       </Box>
    </Box>
  );
}

export default RoomInfo;