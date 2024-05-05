import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"

function Payment() {
  return (
    <Box>
       <Typography sx={{textAlign: 'center'}} variant="h2" gutterBottom color='black'>
          Оплата производится другой ИС.
        </Typography>
    </Box>
  );
}

export default Payment;
