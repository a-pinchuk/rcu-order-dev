import { TextField } from '@mui/material';
import { styled } from '@mui/system';

export const WhiteTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgb(255, 255, 255)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.87)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.87)',
    },
  },
  '& .MuiOutlinedInput-input': {
    backgroundColor: 'transparent',
    color: 'white',
  },
  '& .MuiInputLabel-outlined.Mui-focused': {
    color: 'white',
  },
  '& .MuiInputLabel-outlined': {
    color: 'white',
  },
});
