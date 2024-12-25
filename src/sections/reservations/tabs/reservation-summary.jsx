/* eslint-disable prettier/prettier */
import { TableContainer, Table, TableRow, TableCell, TableBody, FormControl, Select, MenuItem, Link } from '@mui/material';

// third-party

// project-imports
import MainCard from 'components/MainCard';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import Loader from 'components/Loader';
import { GetReservation, UpdateReservation } from 'services/reservationServices';
import { days, stringToDate } from 'utils/custom/dateHelpers';

export default function ReservationSummarySection() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [reservation, setReservation] = useState([])

    useEffect(() => {
        if (params.id && loading) {
            GetReservation(params.id).then((res) => {
                setReservation(res.data);
                setLoading(false);
            })
        }

    }, [loading])



    const handleReservationStatusChange = (e) => {
        const fd = new FormData()
        fd.append('Id', params.id)
        fd.append('ReservationStatusType', e.target.value)
        UpdateReservation(fd).then((res) => {
            setLoading(true);
            openSnackbar({
                open: true,
                message: 'Rezervasyon Durumu Değiştirildi.',
                variant: 'alert',
                alert: {
                    color: 'success'
                }
            });
        });
    };

    if (loading) return (<Loader open={loading} />)
    return (
        <MainCard>
            {reservation &&
                <TableContainer>
                    <Table sx={{ maxWidth: '80%' }} aria-label="simple table">
                        <TableBody>
                            <TableRow hover>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    <b>Rezervasyon Durumu</b>
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    <FormControl fullWidth>
                                        <Select
                                            id="reservationStatus"
                                            value={reservation.reservationStatusType}
                                            onChange={handleReservationStatusChange}
                                        >
                                            {/* <MenuItem value={100}>Onay Bekliyor</MenuItem> */}
                                            <MenuItem value={3}>İptal Edildi</MenuItem>
                                            <MenuItem value={2}>Opsiyonlanmış</MenuItem>
                                            <MenuItem value={1}>Rezerve</MenuItem>
                                            {/* <MenuItem value={130}>Konaklama Başladı</MenuItem> */}
                                            {/* <MenuItem value={4}>Konaklama Bitti</MenuItem> */}
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                {!(reservation?.homeOwner) && <>
                                    <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#F5E7D3' }} component="th" scope="row">
                                        <b> GENEL TOPLAM</b>
                                    </TableCell>
                                    <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#F5E7D3' }} component="th" scope="row">
                                        : <b>{reservation.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {reservation?.priceType === 1 ? ' TL' : reservation?.priceType === 2 ? ' USD' : reservation?.priceType === 3 ? ' EUR' : reservation?.priceType === 4 ? ' GBP' : ''} </b>
                                    </TableCell>
                                </>}
                            </TableRow>
                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    <b>Rezervasyon Numarası</b>
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    :<b> {reservation.reservationNumber}</b>
                                </TableCell>
                                {

                                    !(reservation?.homeOwner) &&
                                    <>
                                        <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#F5B82A' }} component="th" scope="row">
                                            <b> YAPILAN ÖDEME</b>
                                        </TableCell>

                                        <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#F5B82A' }} component="th" scope="row">
                                            :{' '}
                                            <b>
                                                {reservation.payments?.reduce((a, v) => (a = a + v?.amount), 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{' '}
                                                {reservation?.priceType === 1 ? ' TL' : reservation?.priceType === 2 ? ' USD' : reservation?.priceType === 3 ? ' EUR' : reservation?.priceType === 4 ? ' GBP' : ''}
                                            </b>
                                        </TableCell>
                                    </>
                                }
                            </TableRow>

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Tesis Adı
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    :<b> <Link href={reservation?.villa?.name !== null ? `/facilities/villas-show/summary/${reservation?.villaId}` : `/facilities/aparts/room-show/summary/${reservation?.roomId}`} >{reservation?.villa?.name !== null ? reservation?.villa?.name : reservation?.room?.name}</Link></b>
                                </TableCell>
                                {
                                    !(reservation?.homeOwner) &&
                                    <>
                                    <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#83D4A9' }} component="th" scope="row">
                                        <b> KALAN</b>
                                    </TableCell>
                               
                                <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#83D4A9' }} component="th" scope="row">
                                    :{' '}
                                    <b style={{}}>
                                        {(reservation.total - reservation.payments?.reduce((a, v) => (a = a + v?.amount), 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{' '}
                                        {reservation?.priceType === 1 ? ' TL' : reservation?.priceType === 2 ? ' USD' : reservation?.priceType === 3 ? ' EUR' : reservation?.priceType === 4 ? ' GBP' : ''}
                                    </b>
                                </TableCell>
                                </>
                                 }
                            </TableRow>
                            {/* <TableRow hover>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Ödeme Türü
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    :{' '}
                                    <b>
                                        {reservation.attributes.customerPaymentType === '120'
                                            ? 'Admin Tarafında Oluşturuldu'
                                            : reservation.attributes.customerPaymentType === '110'
                                                ? 'Eft/Havale'
                                                : reservation.attributes.customerPaymentType === '100' && 'Kredi Kartı'}
                                    </b>
                                </TableCell>
                            </TableRow> */}

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Check In
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    :<b> {stringToDate(reservation.checkIn)}</b>
                                </TableCell>
                            </TableRow>

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Check Out
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    : <b>{stringToDate(reservation.checkOut)}</b>
                                </TableCell>
                            </TableRow>

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Gece Sayısı
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    : <b> {days(reservation.checkIn, reservation.checkOut)}</b>
                                </TableCell>
                            </TableRow>
                            {
                                !(reservation?.homeOwner) &&
                                <>
                                    <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                        <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                            Toplam
                                        </TableCell>
                                        <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                            : <b>{reservation.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {reservation?.priceType === 1 ? ' TL' : reservation?.priceType === 2 ? ' USD' : reservation?.priceType === 3 ? ' EUR' : reservation?.priceType === 4 ? ' GBP' : ''}</b>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                        <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                            İndirim
                                        </TableCell>
                                        <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                            : <b>{reservation.discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {reservation?.priceType === 1 ? ' TL' : reservation?.priceType === 2 ? ' USD' : reservation?.priceType === 3 ? ' EUR' : reservation?.priceType === 4 ? ' GBP' : ''}</b>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                        <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                            Genel Toplam
                                        </TableCell>
                                        <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                            : <b>{reservation.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {reservation?.priceType === 1 ? ' TL' : reservation?.priceType === 2 ? ' USD' : reservation?.priceType === 3 ? ' EUR' : reservation?.priceType === 4 ? ' GBP' : ''}</b>
                                        </TableCell>
                                    </TableRow>
                                </>
                            }
                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Rezervasyon Notları
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    : <b>{reservation.note} </b>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </MainCard>
    );
}
