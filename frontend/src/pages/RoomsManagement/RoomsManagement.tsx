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
    const [roomNumberCheckOut, setRoomNumberCheckOut] = useState<number>(1)
    const [roomNumberInitialMoving, setRoomNumberInitialMoving] = useState<number>(1)
    const [roomNumberFinalMoving, setRoomNumberFinalMoving] = useState<number>(1)
    const [name, setName] = useState<string>('');

    function handleRoomNumber(e: React.ChangeEvent<HTMLInputElement>) {
        var nextValue = Math.max(Number(0), Math.min(Number(1000), Number(e.target.value)));
        if (!Number.isInteger(nextValue)) {
          nextValue = Math.floor(nextValue)
        }
        setRoomNumberCheckOut(nextValue)
      }

      function handleCheckOut() {
        if (roomNumberCheckOut != 0) {
            var response = {
                room_number: roomNumberCheckOut,
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

        function handleMoving() {
            if (roomNumberInitialMoving != 0) {
                var response = {
                    room_number: roomNumberInitialMoving,
                  }
                  fetch('http://localhost:8000/move', {
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
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Номер для выселения</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={roomNumberCheckOut} onChange={handleRoomNumber}></input>
        <Button variant="outlined" sx={{width: '10%', margin: '1%'}} onClick={handleCheckOut}>Выселить</Button>
        </Box>
        <Typography sx={{textAlign: 'center'}} variant="h4" gutterBottom color='black'>
          Переселение
        </Typography>
        <Box display='flex' alignItems='center' flexDirection='column'>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Изначальный номер</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={roomNumberInitialMoving} onChange={handleRoomNumber}></input>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Конечный номер</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={roomNumberInitialMoving} onChange={handleRoomNumber}></input>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Оставшееся количество дней пребывания</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={roomNumberInitialMoving} onChange={handleRoomNumber}></input>
        <Button variant="outlined" sx={{width: '10%', margin: '1%'}} onClick={handleCheckOut}>Выселить</Button>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Имя постояльца</Typography>
        <TextField 
                    id="outlined-basic" 
                    label="Имя номера" 
                    variant="outlined" 
                    sx={{width: '25%'}} inputProps={{ maxLength: 32 }}
                    value={name}
                    onChange={(e) => {setName(e.target.value)}}/>
        </Box>
        <Button variant="outlined" sx={{width: '10%', margin: '1%'}} onClick={handleMoving}>Переселить</Button>
    </Box>
  );
}

export default RoomsManagement;
