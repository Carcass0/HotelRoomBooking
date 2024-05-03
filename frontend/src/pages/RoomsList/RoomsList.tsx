import { useState, useCallback, useEffect } from 'react';
import './RoomsList.css';
import { IRoom } from '../../interfaces';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RoomInfo from '../../components/RoomInfo/RoomInfo';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

function RoomsList() {
  const [rooms, setRooms] = useState<IRoom[]>([])
  const [name, setName] = useState<string>('');
  const [stayDuration, setStayDuration] = useState<string>('');
  const [capacity, setCapacity] = useState<number>(1);
  const [stars, setStars] = useState<number>(1);

  const marks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
  {
    value:4,
    label:'4'
  }
  ];

  const fetchRooms = useCallback(() => {
    fetch('http://localhost:8000/')
    .then(response => response.json())
    .then(data => {
        setRooms(data)
    })
    .catch(error => console.error(error));
}, [])

    useEffect(fetchRooms, []);
  
  function handleCapacity(event: Event, newValue: number | number[]) {
    setCapacity(newValue as number);
  };

  function handleStars(event: Event, newValue: number | number[]) {
    setStars(newValue as number);
  };

  function handleName(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  };

  function handleStayDuration(event: React.ChangeEvent<HTMLInputElement>) {
    setStayDuration(event.target.value);
  };

  function handleFiltersSending() {
    var filter = {
      name: name,
      capacity: capacity,
      stars: stars,
      amenities: [],
      beds: [],
      stay_duration: stayDuration
    }
    fetch('http://localhost:8000/', {
      method: 'POST',
      body: JSON.stringify(filter),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((data) => {
          setName('')
          setCapacity(1)
          setStars(1)
          setRooms(data)
        })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Box>
       <Typography sx={{textAlign: 'center'}} variant="h2" color='black'>
          Hotel-project
        </Typography>
        <Box className='filterBox'>
          <Typography variant="h4" textAlign="center">Фильтрация номеров</Typography>
          <Box className='filterBoxContent'>
          <TextField 
                    id="outlined-basic" 
                    label="Имя номера" 
                    variant="outlined" 
                    sx={{width: '25%'}} inputProps={{ maxLength: 32 }}
                    value={name}
                    onChange={handleName}/>
            <Box>
            <Typography variant="h5">Вместимость</Typography>
            <Box className='slider'>
            <Slider value={capacity} onChange={handleCapacity} step={1} min={1} max={3} marks={marks} />
            </Box>
            </Box>
            <Box>
            <Typography variant="h5">Рейтинг</Typography>
            <Box className='slider'>
            <Slider className='slider' value={stars} onChange={handleStars} step={1} min={1} max={4} marks={marks} />
            </Box>
            <TextField 
                    id="outlined-basic" 
                    label="Количество дней пребывания" 
                    variant="outlined" 
                    sx={{width: '25%'}} inputProps={{ maxLength: 32 }}
                    value={stayDuration}
                    onChange={handleStayDuration}/>
            </Box>
            <Button variant="outlined" sx={{width: '25%'}} onClick={handleFiltersSending}>Отправить</Button>
          </Box>
        </Box>
        <Box>
          {
            rooms && (
              rooms.map((item) => {
                return (
                  <RoomInfo room={item} key={item.room_number}></RoomInfo>
                )
            }))
          }
        </Box>
    </Box>
  );
}

export default RoomsList;
