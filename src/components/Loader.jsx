import LinearProgress from '@mui/material/LinearProgress';
import { Box, Modal } from '@mui/material';


export default function Loader({open=false}) {
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <LinearProgress style={{ margin: 'auto 20%' }} />
      </Box>
    </Modal>
  );
}
