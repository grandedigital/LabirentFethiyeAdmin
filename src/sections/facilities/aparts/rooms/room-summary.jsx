/* eslint-disable prettier/prettier */
import { useMediaQuery, Grid, Stack, List, Divider, ListItem, ListItemIcon, Typography, ListItemSecondaryAction, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton } from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

import { Add, CallCalling, Eye, Gps, Sms, Trash, Wifi } from 'iconsax-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import Loader from 'components/Loader';
import { GetRoom, GetReservationListTop5, RoomChangeState } from 'services/roomServices';


export default function RoomSummarySection() {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const params = useParams();
  const [villa, setVilla] = useState();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservation] = useState([])

  useEffect(() => {

    if (params.id && loading) {
      GetRoom(params.id).then((res) => {
        setVilla(res.data);
        setLoading(false)
        // GetReservationListTop5(params.id).then((res) => {
        //   setReservation(res.data)
        //   setLoading(false)
        // })
      })
    }

  }, [loading])

  async function changeStateHandle() {

    const fd = new FormData()
    fd.append('Id', params.id)

    if (villa?.generalStatusType === 1) {
      fd.append('GeneralStatusType', 2)
    } else if (villa?.generalStatusType === 2) {
      fd.append('GeneralStatusType', 1)
    }

    await RoomChangeState(fd).then((res) => {
      setLoading(true)
      if (res?.statusCode === 200) {
        if (villa?.generalStatusType === 1) {
          openSnackbar({
            open: true,
            message: 'Oda Yayından Kaldırıldı.',
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'warning'
            }
          });
        } else if (villa?.generalStatusType === 2) {
          openSnackbar({
            open: true,
            message: 'Oda Yayınlandı.',
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            }
          });
        }
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
    })
  }


  if (loading) return (<Loader open={loading} />)
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={4} xl={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {villa && (
                <MainCard>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="flex-end">
                        <div onClick={() => changeStateHandle()}>
                          <Chip style={{ cursor: 'pointer' }} label={villa?.generalStatusType === 2 ? 'Pasif' : 'Aktif'} size="small" color={villa?.generalStatusType === 2 ? 'error' : 'success'} />
                        </div>
                      </Stack>
                      <Stack spacing={2.5} alignItems="center">
                        <Avatar alt={villa.roomDetails[0].name} size="xxl" src={villa?.photos?.length > 0 ? `${import.meta.env.VITE_APP_BACKEND_URL}/Uploads/RoomPhotos/k_${villa?.photos[0]?.image}` : ''} />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{villa.roomDetails[0].name}</Typography>
                          <Typography color="secondary">{villa.roomDetails[0].region}</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="space-around" alignItems="center">
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{villa.rooms}</Typography>
                          <Typography color="secondary">Oda</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{villa.bath}</Typography>
                          <Typography color="secondary">Banyo</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{villa.person}</Typography>
                          <Typography color="secondary">Kapasite</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                        <ListItem>
                          <ListItemIcon>
                            <Wifi size={18} />
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">{villa?.wifiPassword || '-'}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <span>Su No</span>
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">{villa?.waterMaterNumber || '-'}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <span>Elektrik No</span>
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">{villa?.electricityMeterNumber || '-'}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <span>İnternet No</span>
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">{villa?.internetMeterNumber || '-'}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </MainCard>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={7} md={8} xl={9}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MainCard title="Son 5 Rezervasyon">
                <TableContainer>
                  <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Misafir</TableCell>
                        <TableCell align="left">Giriş Tarihi</TableCell>
                        <TableCell align="left">Çıkış Tarihi</TableCell>
                        <TableCell align="left">Tutar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reservations &&
                        reservations?.map((row, i) => {
                          return (
                            <TableRow hover key={row.id}>
                              <TableCell sx={{ pl: 3 }} component="th" scope="row">
                                {row.attributes.reservation_infos?.data[0]?.attributes.name}{' '}
                                {row.attributes.reservation_infos?.data[0]?.attributes.surname}
                              </TableCell>
                              <TableCell align="left">{row.attributes.checkIn}</TableCell>
                              <TableCell align="left">{row.attributes.checkOut}</TableCell>
                              <TableCell align="left">{row.attributes.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
