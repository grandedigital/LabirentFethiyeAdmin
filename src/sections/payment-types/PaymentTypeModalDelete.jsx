// material-ui
import { Dialog, Button, Stack, Typography, DialogContent } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { openSnackbar } from 'api/snackbar';

// assets
import { Trash } from 'iconsax-react';
import { ReservationRemove } from 'services/reservationServices';
import { DeletePaymentTypes } from 'services/paymentTypeServices';

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function PaymentTypeModalDelete({ id, title, open, handleClose, setLoading, setIsDeleted, selectedItem }) {
  const deletehandler = async () => {
    setLoading(true);

    await DeletePaymentTypes(id).then((res) => {
      if (res?.statusCode === 200) {
        openSnackbar({
          open: true,
          message: 'Ödeme Türü silindi.',
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          variant: 'alert',

          alert: {
            color: 'success'
          }
        });
        setIsDeleted(true);
      } else {
        openSnackbar({
          open: true,
          message: res?.errors[0]?.description ? res?.errors[0]?.description : 'Hata',
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          variant: 'alert',

          alert: {
            color: 'success'
          }
        });
      }
      handleClose();
    });
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
              Ödeme türünü silmek istediğinize emin misiniz?
            </Typography>
            <Typography align="center">
              <Typography variant="subtitle1" component="span">
                {selectedItem?.title} {""}
              </Typography>
              başlıklı ödeme türünü silmek istediğinize emin misiniz?
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