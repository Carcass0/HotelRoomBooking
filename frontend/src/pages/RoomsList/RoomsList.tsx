import { useState, useCallback, useEffect } from 'react';
import './RoomsList.css';
import { IRoom } from '../../interfaces';
import {MARKS, AMENITY_TYPES} from '../../consts';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RoomInfo from '../../components/RoomInfo/RoomInfo';
import TextField from '@mui/material/TextField';
import { Button, FormControlLabel, FormGroup } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

function RoomsList() {
  const [rooms, setRooms] = useState<IRoom[]>([])
  const [name, setName] = useState<string>('');
  const [stayDuration, setStayDuration] = useState<number>(1);
  const [bedsNum, setBedsNum] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [amenities, setAmenities] = useState<string[]>([])

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

  function handleBedsNum(event: Event, newValue: number | number[]) {
    setBedsNum(newValue as number);
  };

  function handleAmenitiesChange(isChecked: boolean, item: string) {
    if (isChecked) {
      setAmenities(amenities.concat([item]))
    } else {
      var removedIndex = amenities.indexOf(item);
      if (removedIndex !== -1) {
        setAmenities(amenities.filter((value, index) => removedIndex!==index))
      }
    }
  };

  function handleFiltersSending() {
    var filter = {
      name: name,
      capacity: capacity,
      stars: stars,
      amenities: amenities,
      beds: [],
      stay_duration: stayDuration
    }
    console.log(filter)
    fetch('http://localhost:8000/', {
      method: 'POST',
      body: JSON.stringify(filter),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((data) => {
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
            <Slider value={capacity} onChange={handleCapacity} step={1} min={0} max={3} marks={MARKS} />
            </Box>
            </Box>
            <Box>
            <Typography variant="h5">Рейтинг</Typography>
            <Box className='slider'>
            <Slider className='slider' value={stars} onChange={handleStars} step={1} min={0} max={4} marks={MARKS} />
            </Box>
            <Typography variant="h5">Количество дней пребывания</Typography>
            <input type="number" name="stayDuration" style={{width: 45}} value={stayDuration} onChange={handleStayDuration}></input>
            <Typography variant="h5">Количество кроватей</Typography>
            <Box className='slider'>
            <Slider className='slider' value={bedsNum} onChange={handleBedsNum} step={1} min={0} max={4} marks={MARKS} />
            </Box>
            </Box>
            <Typography variant="h5">Особенности</Typography>
            <FormGroup sx={{marginLeft: '10%'}}>
            {
              AMENITY_TYPES.map((item) => {
                return (
                  <FormControlLabel control={<Checkbox />} key={item} label={item} onChange={(e, isChecked) => handleAmenitiesChange(isChecked, item)}/>
                )
            })
          }
            </FormGroup>
            <Button variant="outlined" sx={{width: '25%', marginBottom: '1%'}} onClick={handleFiltersSending}>Найти</Button>
          </Box>
        </Box>
        <Box>
          {
            rooms && (
              rooms.map((item, index) => {
                return (
                  <RoomInfo room={item} key={index}></RoomInfo>
                )
            }))
          }
        </Box>
    </Box>
  );
}

export default RoomsList;
