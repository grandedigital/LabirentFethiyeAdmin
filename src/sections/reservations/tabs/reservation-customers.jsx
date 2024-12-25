/* eslint-disable prettier/prettier */
// material-ui
import { Button, IconButton, Stack, Tooltip } from '@mui/material';
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
import { GetAllReservationInfos } from 'services/reservationInfoServices';
import ReservationCustomerModal from './reservation-customers-modal';
import CustomerModalDelete from './reservation-customers-delete-modal';
import ReservationCustomerUpdateModal from './reservation-customers-update-modal';

export const header = [
    { label: 'Başlangıç Tarihi', key: 'name' },
    { label: 'Bitiş Tarihi', key: 'calories' },
    { label: 'Fiyat', key: 'fat' }
];

// ==============================|| MUI TABLE - BASIC ||============================== //

export default function ReservationCustomerSection() {
    const params = useParams();
    const [data, setData] = useState();
    const [customerDeleteId, setCustomerDeleteId] = useState('');
    const [isDeleted, setIsDeleted] = useState(false)
    const [loading, setLoading] = useState(true);
    const [customerModal, setCustomerModal] = useState(false);
    const [customerUpdateModal, setCustomerUpdateModal] = useState(false)
    const [customerModalDelete, setCustomerModalDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(0)
    const [selectedCustomerDeleteItem, setSelectedCustomerDeleteItem] = useState([])

    const [isEdit, setIsEdit] = useState(true);


    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            GetAllReservationInfos(params.id).then((res) => { setData(res.data); setIsEdit(false); setLoading(false); })
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
        setCustomerModalDelete(!customerModalDelete);
    };

    if (loading) return (<Loader open={loading} />)
    return (
        <MainCard content={false} title={
            <Button variant="contained" startIcon={<Add />} onClick={() => { setCustomerModal(true) }} size="large">
                Misafir Ekle
            </Button>} >
            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 3 }} align="left">Ad Soyad</TableCell>
                            <TableCell align="left">Yaş Grubu</TableCell>
                            <TableCell align="left">Telefon</TableCell>
                            <TableCell align="left">E-mail</TableCell>
                            <TableCell align="left">Tc-no</TableCell>
                            <TableCell align="right" sx={{ pr: 3 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.map((row,i) => (
                            <TableRow style={{ cursor: 'pointer' }} onClick={(e) => { setCustomerUpdateModal(true); setSelectedId(row.id) }} hover key={i}>
                                <TableCell align="left">{row.name} {row.surname}</TableCell>
                                <TableCell align="left">{row.peopleType}</TableCell>
                                <TableCell align="left">{row.phone}</TableCell>
                                <TableCell align="left">{row.email}</TableCell>
                                <TableCell align="left">{row.idNo}</TableCell>
                                <TableCell sx={{ pr: 3 }} align="right">
                                    {!row.owner && (
                                        <Stack direction="row" spacing={0}>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleClose();
                                                        setCustomerDeleteId(row.id);
                                                        setSelectedCustomerDeleteItem(row)
                                                    }}
                                                >
                                                    <Trash />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    )}

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomerModalDelete selectedItem={selectedCustomerDeleteItem} setIsEdit={setIsEdit} id={customerDeleteId} title={customerDeleteId} open={customerModalDelete} handleClose={handleClose} />
            <ReservationCustomerModal open={customerModal} modalToggler={setCustomerModal} setIsEdit={setIsEdit} />
            <ReservationCustomerUpdateModal open={customerUpdateModal} id={selectedId} modalToggler={setCustomerUpdateModal} setIsEdit={setIsEdit} />
        </MainCard>
    );
}
