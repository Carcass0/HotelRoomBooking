import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useState } from 'react';

function Auth() {
  const [password, setPassword] = useState<string>('')

  return (
    <Box>
      <Link to='/' style={{textAlign: 'center', display: 'block'}}>На главную страницу</Link>
       <Typography sx={{textAlign: 'center'}} variant="h4" gutterBottom color='black'>
          Введите пароль
        </Typography>
        <TextField 
                    id="outlined-basic" 
                    label="Имя номера" 
                    variant="outlined" 
                    sx={{width: '25%'}} inputProps={{ maxLength: 32 }}
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}/>
    </Box>
  );
}

export default Auth;