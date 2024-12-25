// material-ui
import { Dialog, Button, Stack, Typography, DialogContent } from '@mui/material';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function FacilityActionSelectModal({ title, open, handleClose, setFacilityDetailModal, setFacilityGeneralModal }) {

  const navigateHandler = async () => {
    setFacilityGeneralModal(true)
    handleClose();
  };

  const updateModalHandle = async () => {
    setFacilityDetailModal(true)
    handleClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Lütfen yapacağınız işlemi seçiniz
            </Typography>
            <Typography align="center">
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{title}&quot;{' '}
              </Typography>
              için işlem yapıyorsunuz.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth color="warning" onClick={updateModalHandle} variant="contained">
              Dil seçenekleri
            </Button>
            <Button fullWidth color="primary" variant="contained" onClick={navigateHandler} autoFocus>
              Genel güncelleme
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}