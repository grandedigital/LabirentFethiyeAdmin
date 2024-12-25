// material-ui
import { Dialog, Button, Stack, Typography, DialogContent } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { openSnackbar } from 'api/snackbar';

// assets
import { Trash } from 'iconsax-react';
import { VillaRemove } from 'services/villaServices';

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function VillaModalDelete({ id, title, open, handleClose, setLoading, setIsDeleted }) {
  const deletehandler = async () => {
    setLoading(true)
    await VillaRemove(id).then((res) => {
      setIsDeleted(true);
      if (!res?.error) {
        openSnackbar({
          open: true,
          message: 'Villa silindi.',
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
              Villayı Silmek istediğinize eminimisiniz?
            </Typography>
            <Typography align="center">
              By deleting
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{title}&quot;{' '}
              </Typography>
              user, all task assigned to that user will also be deleted.
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