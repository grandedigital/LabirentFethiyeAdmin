/* eslint-disable prettier/prettier */
// material-ui
import { Dialog, Button, Stack, Typography, DialogContent } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { openSnackbar } from 'api/snackbar';

// assets
import { Trash } from 'iconsax-react';
import { PaymentRemove } from 'services/paymentServices';

export default function PaymentModalDelete({ id, title, open, handleClose, setIsEdit, selectedItem }) {
  const deletehandler = async () => {
    await PaymentRemove(id).then((res) => {
      setIsEdit(true);
      if (!res?.error) {
        openSnackbar({
          open: true,
          message: 'Fiyat Silindi',
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });
      }
      else {
        openSnackbar({
          open: true,
          message: res?.errors[0]?.description ? res?.errors[0]?.description : 'Hata',
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'error'
          }
        });
      }
      handleClose();
    })
  };

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
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Ödemeyi silmek istiyormusunuz?
            </Typography>
            <Typography align="center">
              <Typography variant="subtitle1" component="span">
                {selectedItem?.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL {""}
              </Typography>
              tutarındaki ödemeyi silmek istediğinize emin misiniz?
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deletehandler} autoFocus>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

