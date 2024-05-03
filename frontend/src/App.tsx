import { useState } from 'react';
import './App.css';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function App() {
  const [capacity, setCapacity] = useState<number>(1);
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
  ];

  function handleCapacity(event: Event, newValue: number | number[]) {
    setCapacity(newValue as number);
  };

  return (
    <Box>
       <Typography sx={{textAlign: 'center'}} variant="h2" gutterBottom color='black'>
          Hotel-project
        </Typography>
        <Box className='sliders'>
          <Slider value={capacity} onChange={handleCapacity} step={1} min={1} max={3} marks={marks} />
        </Box>
    </Box>
  );
}

export default App;
