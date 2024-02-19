import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export default function Loading({ loading }) {
  if (!loading) return null;

  return (
    <Backdrop open>
      <Box
        display="flex"
        gap={2}
        alignItems="center"
        flexDirection="column"
        p={4}
        textAlign="center"
      >
        <CircularProgress size={30} />
        <Typography>{loading}</Typography>
      </Box>
    </Backdrop>
  );
}
