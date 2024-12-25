import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { Eye } from 'iconsax-react';
import { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { GetAwaitingComments, GetAwaitingReservations, GetThreeDayReservations } from 'services/summariesServices';
import { useNavigate } from 'react-router';

// ==============================|| CONTACT US - MAIN ||============================== //

export default function Default() {
  const [loading, setLoading] = useState(true)
  const [awaitingReservations, setAwaitingReservations] = useState([])
  const [threeDayReservations, setThreeDayReservations] = useState([])
  const [awaitingComments, setAwaitingComments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      await GetAwaitingReservations().then((res) => {
        setAwaitingReservations(res?.data)
      })

      await GetThreeDayReservations().then((res) => {
        setThreeDayReservations(res?.data)
      })

      await GetAwaitingComments().then((res) => {
        setAwaitingComments(res?.data)
      })
      setLoading(false)
    }
    fetchData()

  }, [])

  if (loading) return <Loader open={loading} />

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} >
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <MainCard title="Onay Bekleyen Rezervasyonlar">
              <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Tesis Adı</TableCell>
                      <TableCell align="left">Müşteri</TableCell>
                      <TableCell align="left">Rez. Numarası</TableCell>
                      <TableCell align="left">Giriş</TableCell>
                      <TableCell align="left">Çıkış</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      awaitingReservations?.map((row, i) => {
                        return (
                          <TableRow hover key={i} sx={{ cursor: 'Pointer' }} onClick={() => { navigate(`/reservations/show/summary/${row.id}`) }}>
                            <TableCell sx={{ pl: 3 }} component="th" scope="row">
                              {row.facilityName}
                            </TableCell>
                            <TableCell align="left">{row?.customerName}</TableCell>
                            <TableCell align="left">{row?.reservationNumber}</TableCell>
                            <TableCell align="left">{row?.checkIn.split('T')[0]}</TableCell>
                            <TableCell align="left">{row?.checkOut.split('T')[0]}</TableCell>
                            <TableCell align="left">
                              <Tooltip title="View">
                                <IconButton color="secondary" >
                                  {<Eye />}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </Grid>

          <Grid item xs={12} lg={6}>
            <MainCard title="3 Günlük Giriş ve Çıkışlar">
              <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Tesis Adı</TableCell>
                      <TableCell align="left">Müşteri</TableCell>
                      <TableCell align="left">Rez. Numarası</TableCell>
                      <TableCell align="left">Giriş</TableCell>
                      <TableCell align="left">Çıkış</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      threeDayReservations?.map((row, i) => {
                        return (
                          <TableRow hover key={i} sx={{ cursor: 'Pointer' }} onClick={() => { navigate(`/reservations/show/summary/${row.id}`) }}>
                            <TableCell sx={{ pl: 3 }} component="th" scope="row">
                              {row.facilityName}
                            </TableCell>
                            <TableCell align="left">{row?.customerName}</TableCell>
                            <TableCell align="left">{row?.reservationNumber}</TableCell>
                            <TableCell align="left">{row?.checkIn.split('T')[0]}</TableCell>
                            <TableCell align="left">{row?.checkOut.split('T')[0]}</TableCell>
                            <TableCell align="left">
                              <Tooltip title="View">
                                <IconButton color="secondary" >
                                  {<Eye />}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </Grid>

          <Grid item xs={12} lg={6}>
            <MainCard title="Onay Bekleyen Yorumlar">
              <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">İsim</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      awaitingComments?.map((row, i) => {
                        return (
                          <TableRow hover key={row.id} sx={{ cursor: 'Pointer' }} >
                            <TableCell sx={{ pl: 3 }} component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="left">
                              <Tooltip title="View">
                                <IconButton color="secondary" >
                                  {<Eye />}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
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
  );
}
