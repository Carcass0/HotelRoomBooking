import { useState } from 'react';
import './RoomsManagement.css';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

function RoomsManagement() {
    const [roomNumber, setRoomNumber] = useState<number>(1)

    function handleRoomNumber(e: React.ChangeEvent<HTMLInputElement>) {
        var nextValue = Math.max(Number(0), Math.min(Number(1000), Number(e.target.value)));
        if (!Number.isInteger(nextValue)) {
          nextValue = Math.floor(nextValue)
        }
        setRoomNumber(nextValue)
      }

      function handleCheckOut() {
        if (roomNumber != 0) {
            var response = {
                room_number: roomNumber,
              }
              fetch('http://localhost:8000/move-out', {
                  method: 'POST',
                  body: JSON.stringify(response),
                  headers: {
                    'Content-Type': 'application/json',
                  }
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.status == 0) {
                      
                    }
                    })
                  .catch((error) => {
                    console.log(error)
                  })
        }
        }

  return (
    <Box>
       <Typography sx={{textAlign: 'center'}} variant="h2" color='black'>
          Управление номерами
        </Typography>
        <Link to='/' style={{textAlign: 'center', display: 'block'}}>К выбору номера</Link>
        <Typography sx={{textAlign: 'center'}} variant="h4" gutterBottom color='black'>
          Выезд из комнаты
        </Typography>
        <Box display='flex' alignItems='center' flexDirection='column'>
        <Typography variant="h5" sx={{margin: '1%'}}>Количество дней пребывания</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={roomNumber} onChange={handleRoomNumber}></input>
        <Button variant="outlined" sx={{width: '10%', margin: '1%'}} onClick={handleCheckOut}>Заселить</Button>
        </Box>
    </Box>
  );
}

export default RoomsManagement;
