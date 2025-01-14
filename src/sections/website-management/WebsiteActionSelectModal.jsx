// material-ui
import { Dialog, Button, Stack, Typography, DialogContent } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function WebsiteActionSelectModal({ title, open, handleClose, websiteDetailModal, websiteSeoModal }) {
  const navigateHandler = async () => {
    websiteSeoModal(true)
    handleClose();
  };

  const updateModalHandle = async () => {
    websiteDetailModal(true)
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
              {
                title.length !== 0 &&
                <Typography variant="subtitle1" component="span">
                  {' '}
                  &quot;{title?.webPageDetails[0]?.title || ''}&quot;{' '}
                </Typography>
              }
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