import { useState } from 'react';
import './DatabaseManagment.css';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';


function DatabaseManagment() {
  const [data, setData] = useState<string>('')
  const [sql, setSql] = useState<string>('')

  function getData(mode: string) {
    var request = {
      request: mode
    }
    console.log(request)
    fetch('http://localhost:8000/db-request', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((data) => {
          var stringifiedData = JSON.stringify(data, null, 2)
          setData(stringifiedData)
        })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Box>
       <Typography sx={{textAlign: 'center'}} variant="h2" gutterBottom color='black'>
          Панель администратора
        </Typography>
        <Button variant="outlined" sx={{width: '25%', marginBottom: '1%', marginTop: '1%'}} onClick={() => getData('0')}>Показать комнаты</Button>
        <Button variant="outlined" sx={{width: '25%', marginBottom: '1%', marginTop: '1%'}} onClick={() => getData('1')}>Показать типы комнат</Button>
        <Button variant="outlined" sx={{width: '25%', marginBottom: '1%', marginTop: '1%'}} onClick={() => getData('2')}>Показать клиентов</Button>
        <Button variant="outlined" sx={{width: '25%', marginBottom: '1%', marginTop: '1%'}} onClick={() => getData('3')}>Показать резервации</Button>
        {data && (
          <Box textAlign='left' display='flex' justifyContent='center'>
          <pre>{data}</pre>
        </Box>
        )}
        <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <TextField 
                    id="outlined-basic" 
                    label="SQL" 
                    variant="outlined" 
                    sx={{width: '25%'}} inputProps={{ maxLength: 32 }}
                    value={sql}
                    onChange={(e) => setSql(e.target.value)}/>
        <Button variant="outlined" sx={{width: '25%', marginBottom: '1%', marginTop: '1%'}} onClick={() => getData(sql)}>Выполнить SQL</Button>
        </Box>
    </Box>
  );
}

export default DatabaseManagment;
