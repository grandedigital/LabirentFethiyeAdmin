// material-ui
import { Dialog, Button, Stack, Typography, DialogContent } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { openSnackbar } from 'api/snackbar';

// assets
import { Trash } from 'iconsax-react';
import { ReservationRemove } from 'services/reservationServices';
import { GetAllReservationItems, ReservationItemRemove } from 'services/reservationItemServices';
import { GetAllReservationInfos, ReservationInfoRemove } from 'services/reservationInfoServices';

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function ReservationModalDelete({ open, handleClose, setLoading, setIsDeleted, selectedItem }) {
  const deletehandler = async () => {
    setLoading(true);

    await ReservationRemove(selectedItem?.id).then((res) => {
      if (!res?.error) {
        openSnackbar({
          open: true,
          message: 'Rezervasyon silindi.',
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          variant: 'alert',

          alert: {
            color: 'success'
          }
        });
        setIsDeleted(true);
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
      {
        open &&
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Stack alignItems="center" spacing={3.5}>
            <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
              <Trash variant="Bold" />
            </Avatar>
            <Stack spacing={2}>
              <Typography variant="h4" align="center">
                Rezervasyonu Silmek istediğinize eminimisiniz?
              </Typography>
              <Typography align="center">
                <Typography variant="subtitle1" component="span">
                  {
                    selectedItem?.villa?.name ?
                      selectedItem?.villa?.name :
                      selectedItem?.room?.name
                  }
                  {" "}
                </Typography>
                tesisine bağlı {""}
                <Typography variant="subtitle1" component="span">
                  {
                    selectedItem?.length !== 0 &&
                      selectedItem?.homeOwner === true ? 'Ev Sahibi' : selectedItem?.reservationInfos[0]?.name + ' ' + selectedItem?.reservationInfos[0]?.surname
                  }
                  {" "}
                </Typography>
                adındaki rezervasyonu silmek istediğinize emin misiniz?
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
      }
    </Dialog>
  );
}