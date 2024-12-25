/* eslint-disable prettier/prettier */
// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Loader from 'components/Loader';

// project-imports
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { GetAvailibleDateRoom } from 'services/reservationServices';
import { GetRoomAvailableDates } from 'services/roomServices';
import { dateToString, days } from 'utils/custom/dateHelpers';

export const header = [
  { label: 'Başlangıç Tarihi', key: 'name' },
  { label: 'Bitiş Tarihi', key: 'calories' },
  { label: 'Fiyat', key: 'fat' }
];

// ==============================|| MUI TABLE - BASIC ||============================== //

export default function RoomAvailableDateSection() {
  const params = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  let today = new Date();

  useEffect(() => {
    GetRoomAvailableDates(params.id).then((res) => { setData(res.data); setLoading(false); })
  }, [])

  if (loading) return (<Loader open={loading} />)
  return (
    <MainCard content={false} title="MÜSAİT TARİHLER">
      <TableContainer>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Giriş Tarihi</TableCell>
              <TableCell align="left">Çıkış Tarihi</TableCell>
              <TableCell align="left">Gece</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data && data.map((item, i) => {
                return (
                  <TableRow key={i} hover>
                    <TableCell align="left">{item?.startDate}</TableCell>
                    <TableCell align="left">{item?.endDate}</TableCell>
                    <TableCell align="left">{item?.nightCount} Gece</TableCell>
                  </TableRow>
                )
              })
            }

          </TableBody>
        </Table>
      </TableContainer >
    </MainCard >
  );
}
