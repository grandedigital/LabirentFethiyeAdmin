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
import { DeleteWebPage } from 'services/websiteServices';

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function BlogModalDelete({ id, title, open, handleClose, setLoading, setIsDeleted, selectedItem }) {
  const deletehandler = async () => {
    setLoading(true);

    // await GetAllReservationItems(id).then((res) => {
    //   console.log("items => ", res.data);
    //   res.data.map((item) => {
    //     ReservationItemRemove(item.id);
    //   });
    // });

    // await GetAllReservationInfos(id).then((res) => {
    //   console.log("infos => ", res.data);
    //   res.data.map((item) => {
    //     ReservationInfoRemove(item.id);
    //   });
    // });

    await DeleteWebPage(selectedItem?.id).then((res) => {
      if (!res?.error) {
        openSnackbar({
          open: true,
          message: 'Sayfa silindi.',
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
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Sayfayı Silmek istediğinize eminimisiniz?
            </Typography>
            <Typography align="center">
              <Typography variant="subtitle1" component="span">
                {selectedItem.length !== 0 && selectedItem?.webPageDetails[0]?.title} {" "}
              </Typography>
              adındaki sayfayı silmek istediğinize emin misiniz?
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