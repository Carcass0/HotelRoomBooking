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
    const [roomNumberSituation, setRoomNumberSituation] = useState<number>(1)
    const [stayDuration, setStayDuration] = useState<number>(1)
    const [name, setName] = useState<string>('');
    const [situation, setSituation] = useState<string>('');

    function handleRoomNumberCheckOut(e: React.ChangeEvent<HTMLInputElement>) {
        var nextValue = Math.max(Number(0), Math.min(Number(1000), Number(e.target.value)));
        if (!Number.isInteger(nextValue)) {
          nextValue = Math.floor(nextValue)
        }
        setRoomNumberCheckOut(nextValue)
      }
    
      function handleRoomNumberInitialMoving(e: React.ChangeEvent<HTMLInputElement>) {
        var nextValue = Math.max(Number(0), Math.min(Number(1000), Number(e.target.value)));
        if (!Number.isInteger(nextValue)) {
          nextValue = Math.floor(nextValue)
        }
        setRoomNumberInitialMoving(nextValue)
      }

      function handleRoomNumberFinalMoving(e: React.ChangeEvent<HTMLInputElement>) {
        var nextValue = Math.max(Number(0), Math.min(Number(1000), Number(e.target.value)));
        if (!Number.isInteger(nextValue)) {
          nextValue = Math.floor(nextValue)
        }
        setRoomNumberFinalMoving(nextValue)
      }

      function handleDayDuration(e: React.ChangeEvent<HTMLInputElement>) {
        var nextValue = Math.max(Number(0), Math.min(Number(1000), Number(e.target.value)));
        if (!Number.isInteger(nextValue)) {
          nextValue = Math.floor(nextValue)
        }
        setStayDuration(nextValue)
      }

      function handleRoomNumberSituation(e: React.ChangeEvent<HTMLInputElement>) {
        var nextValue = Math.max(Number(0), Math.min(Number(1000), Number(e.target.value)));
        if (!Number.isInteger(nextValue)) {
          nextValue = Math.floor(nextValue)
        }
        setRoomNumberSituation(nextValue)
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
                      console.log("complete!")
                    }
                    })
                  .catch((error) => {
                    console.log(error)
                  })
        }
        }

        function handleMoving() {
            if (roomNumberInitialMoving !== 0 && roomNumberFinalMoving !== 0 && stayDuration !== 0 && name) {
                var response = {
                  old_number: roomNumberInitialMoving,
                  new_number: roomNumberFinalMoving,
                  remaining_stay_duration: stayDuration,
                  customer_name: name
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
                          console.log("complete!")
                        }
                        })
                      .catch((error) => {
                        console.log(error)
                      })
            }
            }

            function handleSendingSituation() {
              if (roomNumberSituation !== 0 && situation) {
                  var response = {
                    room_number: roomNumberSituation,
                    description: situation
                    }
                    fetch('http://localhost:8000/accident', {
                        method: 'POST',
                        body: JSON.stringify(response),
                        headers: {
                          'Content-Type': 'application/json',
                        }
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          if (data.status == 0) {
                            console.log("complete!")
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
        <Box className='area'>
        <Typography sx={{textAlign: 'center'}} variant="h4" gutterBottom color='black'>
          Выезд из комнаты
        </Typography>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Номер для выселения</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={roomNumberCheckOut} onChange={handleRoomNumberCheckOut}></input>
        <Button variant="outlined" sx={{width: '25%', margin: '1%'}} onClick={handleCheckOut}>Выселить</Button>
        </Box>
        <Box className='area'>
        <Typography sx={{textAlign: 'center'}} variant="h4" gutterBottom color='black'>
          Переселение
        </Typography>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Изначальный номер</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={roomNumberInitialMoving} onChange={handleRoomNumberInitialMoving}></input>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Конечный номер</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={roomNumberFinalMoving} onChange={handleRoomNumberFinalMoving}></input>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Оставшееся количество дней пребывания</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={stayDuration} onChange={handleDayDuration}></input>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Имя постояльца</Typography>
        <TextField 
                    id="outlined-basic" 
                    label="Имя" 
                    variant="outlined" 
                    sx={{width: '25%'}} inputProps={{ maxLength: 32 }}
                    value={name}
                    onChange={(e) => {setName(e.target.value)}}/>
        <Button variant="outlined" sx={{width: '25%', margin: '1%'}} onClick={handleMoving}>Переселить</Button>
        </Box>
        <Box className='area'>
        <Typography sx={{textAlign: 'center'}} variant="h4" gutterBottom color='black'>
          Обработка внештатной ситуации
        </Typography>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Номер</Typography>
        <input type="number" name="stayDuration" style={{width: 45}} value={roomNumberSituation} onChange={handleRoomNumberSituation}></input>
        <Typography variant="h5" sx={{marginBottom: '1%'}}>Описание ситуации</Typography>
        <TextField 
                    id="outlined-basic" 
                    label="Описание" 
                    variant="outlined" 
                    sx={{width: '25%'}} inputProps={{ maxLength: 32 }}
                    value={situation}
                    onChange={(e) => {setSituation(e.target.value)}}/>
        <Button variant="outlined" sx={{width: '25%', margin: '1%'}} onClick={handleSendingSituation}>Отправить</Button>
        </Box>
    </Box>
  );
}

export default RoomsManagement;
