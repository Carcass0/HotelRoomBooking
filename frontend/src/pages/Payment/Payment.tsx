import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import { Link } from 'react-router-dom';

function Payment() {
  return (
    <Box>
       <Typography sx={{textAlign: 'center'}} variant="h2" gutterBottom color='black'>
          Оплата производится другой ИС.
        </Typography>
        <Link to='/' style={{textAlign: 'center', display: 'block'}}>На главную страницу</Link>
    </Box>
  );
}

export default Payment;
