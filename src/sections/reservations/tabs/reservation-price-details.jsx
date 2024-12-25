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
import { GetAllReservationItems } from 'services/reservationItemServices';
import { GetAvailibleDate } from 'services/reservationServices';
import { dateToString, days, stringToDate } from 'utils/custom/dateHelpers';

export const header = [
    { label: 'Tarih', key: 'name' },
    { label: 'Fiyat', key: 'fat' }
];

// ==============================|| MUI TABLE - BASIC ||============================== //

export default function ReservationPriceDetailSection() {
    const params = useParams();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    let today = new Date();

    useEffect(() => {
        GetAllReservationItems(params.id).then((res) => { setData(res.data); setLoading(false); })
    }, [])
    
    if (loading) return (<Loader open={loading} />)
    return (
        <MainCard content={false} title="">
            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Tarih</TableCell>
                            <TableCell align="left">Fiyat</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {data && data.reservationItems.map((item, index) => {
                            return (<TableRow hover key={index}>
                                <TableCell align="left">{stringToDate(item.day)}</TableCell>
                                <TableCell align="left">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {data?.priceType === 1 ? ' TL' : data?.priceType === 2 ? ' USD' : data?.priceType === 3 ? ' EUR' : data?.priceType === 4 ? ' GBP' : ''}</TableCell>
                            </TableRow>);
                        }
                        )}

                    </TableBody>
                </Table>
            </TableContainer >
        </MainCard >
    );
}
