/* eslint-disable prettier/prettier */
// material-ui
import { Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Loader from 'components/Loader';

// project-imports
import MainCard from 'components/MainCard';
import { Add, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PriceModal from 'sections/priceSections/PriceModal';
import PriceModalDelete from 'sections/priceSections/PriceModalDelete';
import { GetPrices } from 'services/priceServices';
import { GetAllPaymentsByVilla } from 'services/paymentServices';
import { GetReservation } from 'services/reservationServices';
import VillaPaymentsModal from '../villa-payments-modal';
import ReservationPaymentsUpdateModal from 'sections/reservations/tabs/reservation-payments-update-modal';
import PaymentModalDelete from 'sections/reservations/tabs/reservation-payments-delete-modal';

export const header = [
    { label: 'Başlangıç Tarihi', key: 'name' },
    { label: 'Bitiş Tarihi', key: 'calories' },
    { label: 'Fiyat', key: 'fat' }
];

// ==============================|| MUI TABLE - BASIC ||============================== //

export default function VillaAccountingSection({ apart = false, villa = false, room = false }) {
    const params = useParams();
    const [data, setData] = useState();
    const [paymentDeleteId, setPaymentDeleteId] = useState('');
    const [isDeleted, setIsDeleted] = useState(false)
    const [loading, setLoading] = useState(true);
    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentModalDelete, setPaymentModalDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(0)
    const [paymentUpdateModal, setPaymentUpdateModal] = useState(false)
    const [selectedPaymentDeleteItem, setSelectedPaymentDeleteItem] = useState([])

    const [isEdit, setIsEdit] = useState(true);


    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            GetAllPaymentsByVilla(params.id, villa ? 'villa' : apart ? 'apart' : room ? 'room' : '').then((res) => { setData(res.data); setIsEdit(false); setLoading(false); })
        }
    }, [isEdit])

    // useEffect(() => {
    //     if (isDeleted) {
    //         setIsDeleted(false)
    //         setLoading(true)
    //         VillaServices.Villas(pagination.pageIndex + 1, pagination.pageSize, sorting[0]?.desc, sorting[0]?.id.replace('attributes_', ''), globalFilter).then((res) => { setData(res); setLoading(false); });
    //     }
    // }, [isDeleted])


    // useEffect(() => {
    //     if (isEdit) {
    //         setLoading(true);
    //         GetPrices(params.id).then((res) => { setData(res.data); setIsEdit(false); setLoading(false); })
    //     }
    // }, [isEdit])


    //console.log("villa => ", data.attributes.villa.data.id);
    const handleClose = () => {
        setPaymentModalDelete(!paymentModalDelete);
    };

    if (loading) return (<Loader open={loading} />)
    return (
        <MainCard content={false} title={
            <Button variant="contained" startIcon={<Add />} onClick={() => { setPaymentModal(true) }} size="large">
                Ödeme Ekle
            </Button>} >
            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Tutar</TableCell>
                            <TableCell align="left">Ödeme Türü</TableCell>
                            <TableCell align="left">Açıklama</TableCell>
                            <TableCell align="left">Tarih</TableCell>
                            <TableCell align="left">Tür</TableCell>
                            <TableCell align="right" sx={{ pr: 3 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.map((row) => (
                            <TableRow style={{ cursor: 'pointer' }} onClick={() => { setSelectedId(row?.id); setPaymentUpdateModal(true); setSelectedPaymentDeleteItem(row) }} hover key={row.id}>
                                <TableCell align="left">{row?.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {row?.priceType === 1 ? ' TL' : row?.priceType === 2 ? ' USD' : row?.priceType === 3 ? ' EUR' : row?.priceType === 4 ? ' GBP' : ''}</TableCell>
                                <TableCell align="left">{row?.paymentType?.title}</TableCell>
                                <TableCell align="left">{row?.description}</TableCell>
                                <TableCell align="left">{row?.createdAt.toString().split('T')[0]}</TableCell>
                                <TableCell align="left">
                                    {
                                        row?.inOrOut ?
                                            <Chip color="success" label="Gelir" size="small" variant="light" /> :
                                            <Chip color="error" label="Gider" size="small" variant="light" />
                                    }
                                </TableCell>
                                <TableCell sx={{ pr: 3 }} align="right">
                                    <Stack direction="row" spacing={0}>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClose();
                                                    setPaymentDeleteId(Number(row.id));
                                                    setSelectedPaymentDeleteItem(row)
                                                }}
                                            >
                                                <Trash />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <PaymentModalDelete selectedItem={selectedPaymentDeleteItem} setIsEdit={setIsEdit} id={Number(paymentDeleteId)} title={paymentDeleteId} open={paymentModalDelete} handleClose={handleClose} />
            <VillaPaymentsModal open={paymentModal} modalToggler={setPaymentModal} setIsEdit={setIsEdit} villa={villa} apart={apart} room={room} />
            <ReservationPaymentsUpdateModal selectedItem={selectedPaymentDeleteItem} open={paymentUpdateModal} modalToggler={setPaymentUpdateModal} setIsEdit={setIsEdit} id={selectedId} />
        </MainCard>
    );
}
