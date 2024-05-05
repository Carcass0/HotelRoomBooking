import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import { Link } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

function Auth() {
  const [password, setPassword] = useState<string>('')
  const truePassword = 'password12345'

  function handlePasswordEnter() {
    if(password === truePassword) {
      window.location.href = "databaseManagement/"
    }
  }

  return (
    <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      <Link to='/' style={{textAlign: 'center', display: 'block'}}>На главную страницу</Link>
       <Typography sx={{textAlign: 'center'}} variant="h4" gutterBottom color='black'>
          Введите пароль
        </Typography>
        <TextField 
                    id="outlined-basic" 
                    label="Пароль" 
                    variant="outlined" 
                    sx={{width: '25%'}} inputProps={{ maxLength: 32 }}
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}/>
      <Button variant="outlined" sx={{width: '25%', marginBottom: '1%', marginTop: '1%'}} onClick={handlePasswordEnter}>Войти</Button>
    </Box>
  );
}

export default Auth;