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
import PriceModal from 'sections/priceSections/PriceModal';
import PriceModalDelete from 'sections/priceSections/PriceModalDelete';
import { GetPrices } from 'services/priceServices';
import { stringToDate } from 'utils/custom/dateHelpers';

export const header = [
    { label: 'Başlangıç Tarihi', key: 'name' },
    { label: 'Bitiş Tarihi', key: 'calories' },
    { label: 'Fiyat', key: 'fat' }
];

// ==============================|| MUI TABLE - BASIC ||============================== //

export default function VillaPriceSection() {
    const params = useParams();
    const [data, setData] = useState();
    const [priceDeleteId, setPriceDeleteId] = useState('');
    const [isDeleted, setIsDeleted] = useState(false)
    const [loading, setLoading] = useState(true);
    const [priceModal, setPriceModal] = useState(false);
    const [priceModalDelete, setPriceModalDelete] = useState(false);
    const [selectedDeleteItem, setSelectedDeleteItem] = useState([])

    const [isEdit, setIsEdit] = useState(true);


    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            GetPrices(params.id).then((res) => { setData(res.data); setIsEdit(false); setLoading(false); })
        }
    }, [isEdit])

    useEffect(() => {
        if (isDeleted) {
            setIsDeleted(false)
            setLoading(true)
            VillaServices.Villas(pagination.pageIndex + 1, pagination.pageSize, sorting[0]?.desc, sorting[0]?.id.replace('attributes_', ''), globalFilter).then((res) => { setData(res); setLoading(false); });
        }
    }, [isDeleted])

    // useEffect(() => {
    //     if (isEdit) {
    //         setLoading(true);
    //         GetPrices(params.id).then((res) => { setData(res.data); setIsEdit(false); setLoading(false); })
    //     }
    // }, [isEdit])

    const handleClose = () => {
        setPriceModalDelete(!priceModalDelete);
    };

    if (loading) return (<Loader open={loading} />)
    return (
        <MainCard content={false} title="REZERVASYON FİYATLARI" secondary={
            <Button variant="contained" startIcon={<Add />} onClick={() => { setPriceModal(true) }} size="large">
                Fiyat Ekle
            </Button>}>
            {/* table */}
            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Başlangıç Tarihi</TableCell>
                            <TableCell align="left">Bitiş Tarihi</TableCell>
                            <TableCell align="left">Fiyat</TableCell>
                            <TableCell align="right" sx={{ pr: 3 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.map((row) => (
                            <TableRow hover key={row.id}>
                                <TableCell align="left">{stringToDate(row.startDate)}</TableCell>
                                <TableCell align="left">{stringToDate(row.endDate)}</TableCell>
                                <TableCell align="left">{row.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {row?.villa?.priceType === 1 ? ' TL' : row?.villa?.priceType === 2 ? ' USD' : row?.villa?.priceType === 3 ? ' EUR' : row?.villa?.priceType === 4 ? ' GBP' : ''}</TableCell>
                                <TableCell sx={{ pr: 3 }} align="right">
                                    <Stack direction="row" spacing={0}>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClose();
                                                    setPriceDeleteId(row.id);
                                                    setSelectedDeleteItem(row)
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
            <PriceModalDelete setIsEdit={setIsEdit} id={priceDeleteId} title={priceDeleteId} open={priceModalDelete} handleClose={handleClose} selectedItem={selectedDeleteItem}/>
            <PriceModal open={priceModal} modalToggler={setPriceModal} villaId={params.id} setIsEdit={setIsEdit} />
        </MainCard>
    );
}
