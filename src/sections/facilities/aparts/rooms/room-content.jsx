/* eslint-disable prettier/prettier */
import { useMediaQuery, Grid, Stack, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton } from '@mui/material';


// project-imports
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Loader from 'components/Loader';
import { Add, Edit, Trash } from 'iconsax-react';
import PriceTableModalDelete from 'sections/priceTableSections/PriceTableModalDelete';
import PriceTableModal from 'sections/priceTableSections/PriceTableModal';
import { GetPriceTableRoom } from 'services/priceTableServices';
import PriceTableUpdateModal from 'sections/priceTableSections/PriceTableUpdateModal';
import FacilityActionSelectModal from 'sections/facilities/FacilityActionSelectModal';
import PriceTableGeneralUpdateModal from 'sections/priceTableSections/PriceTableGeneralUpdateModal';

export default function RoomContentSection() {
    const params = useParams();
    const [loading, setLoading] = useState(true);

    const [priceTable, setPriceTable] = useState([])

    const [facilityActionSelectModal, setFacilityActionSelectModal] = useState(false)
    const [updateGeneralPriceTableModal, setUpdateGenralPriceTableModal] = useState(false)

    const [priceTableModal, setPriceTableModal] = useState(false)
    const [priceTableModalDelete, setPriceTableModalDelete] = useState(false);
    const [selectedPriceDeleteItem, setSelectedPriceDeleteItem] = useState([])

    const [updatePriceTableModal, setUpdatePriceTableModal] = useState(false)
    const [selectedPriceTableItem, setSelectedPriceTableItem] = useState([])

    const [isEdit, setIsEdit] = useState(true);
    const [priceTableDeleteId, setPriceTableDeleteId] = useState('');


    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            GetPriceTableRoom(params.id).then((res) => {
                setPriceTable(res.data);
                setLoading(false);
                setIsEdit(false);
            })
        }
    }, [isEdit])

    const handleClosePriceTable = () => {
        setPriceTableModalDelete(!priceTableModalDelete);
    };
    if (loading) return (<Loader open={loading} />)

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container spacing={3}>

                    {true && (
                        <>
                            <Grid item xs={12}>
                                <MainCard content={false} title="Fiyat Tablosu" secondary={
                                    <Button variant="contained" startIcon={<Add />} onClick={() => { setPriceTableModal(true) }} size="large">
                                        Fiyat Ekle
                                    </Button>}>

                                    <TableContainer>
                                        <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">Başlık</TableCell>
                                                    <TableCell align="left">Açıklama</TableCell>
                                                    <TableCell align="left">Fiyat</TableCell>
                                                    <TableCell align="right" sx={{ pr: 3 }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    priceTable && priceTable.map((item, i) => {
                                                        return (
                                                            <TableRow hover key={i}>
                                                                <TableCell align="left">{item.priceTableDetails[0].title}</TableCell>
                                                                <TableCell align="left">{item.priceTableDetails[0].description}</TableCell>
                                                                <TableCell align="left">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {item?.room?.hotel?.priceType === 1 ? ' TL' : item?.room?.hotel?.priceType === 2 ? ' USD' : item?.room?.hotel?.priceType === 3 ? ' EUR' : item?.room?.hotel?.priceType === 4 ? ' GBP' : ''}</TableCell>
                                                                <TableCell sx={{ pr: 3 }} align="right">
                                                                    <Stack direction="row" spacing={0}>
                                                                        <Tooltip title="Delete">
                                                                            <IconButton
                                                                                color="error"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleClosePriceTable();
                                                                                    setPriceTableDeleteId(item.id);
                                                                                    setSelectedPriceDeleteItem(item)
                                                                                }}
                                                                            >
                                                                                <Trash />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Edit">
                                                                            <IconButton
                                                                                color="primary"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    // setUpdatePriceTableModal(true)
                                                                                    setFacilityActionSelectModal(true)
                                                                                    setSelectedPriceTableItem(item)
                                                                                }}
                                                                            >
                                                                                <Edit />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <FacilityActionSelectModal setFacilityGeneralModal={setUpdateGenralPriceTableModal} setFacilityDetailModal={setUpdatePriceTableModal} title={selectedPriceTableItem.length !== 0 ? selectedPriceTableItem.priceTableDetails[0]?.title : ''} open={facilityActionSelectModal} handleClose={() => setFacilityActionSelectModal(false)} />
                                    <PriceTableModal apart={true} open={priceTableModal} modalToggler={setPriceTableModal} villaId={params.id} setIsEdit={setIsEdit} />
                                    <PriceTableUpdateModal apart={true} open={updatePriceTableModal} modalToggler={setUpdatePriceTableModal} selectedItem={selectedPriceTableItem} setIsEdit={setIsEdit} />
                                    <PriceTableModalDelete selectedItem={selectedPriceDeleteItem} setIsEdit={setIsEdit} id={priceTableDeleteId} title={priceTableDeleteId} open={priceTableModalDelete} handleClose={handleClosePriceTable} />
                                    <PriceTableGeneralUpdateModal open={updateGeneralPriceTableModal} modalToggler={setUpdateGenralPriceTableModal} selectedItem={selectedPriceTableItem} setIsEdit={setIsEdit} />
                                </MainCard>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
        </Grid >
    );
}