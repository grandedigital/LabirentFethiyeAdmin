/* eslint-disable prettier/prettier */
import { useMediaQuery, Grid, Stack, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Loader from 'components/Loader';
import { Add, Edit, Trash } from 'iconsax-react';
import DistanceRulerModal from 'sections/distanceRulerSections/DistanceRulerModal';
import DistanceRulerModalDelete from 'sections/distanceRulerSections/DistanceRulerModalDelete';
import PriceTableModalDelete from 'sections/priceTableSections/PriceTableModalDelete';
import PriceTableModal from 'sections/priceTableSections/PriceTableModal';
import { GetDistanceRuler } from 'services/distanceRulerServices';
import { GetPriceTable } from 'services/priceTableServices';
import PriceTableUpdateModal from 'sections/priceTableSections/PriceTableUpdateModal';
import DistanceRulerUpdateModal from 'sections/distanceRulerSections/DistanceRulerUpdateModal';
import FacilityActionSelectModal from '../FacilityActionSelectModal';
import DistanceRulerGeneralUpdateModal from 'sections/distanceRulerSections/DistanceRulerGeneralUpdateModal';
import PriceTableGeneralUpdateModal from 'sections/priceTableSections/PriceTableGeneralUpdateModal';

export default function VillaContentSection() {
    const params = useParams();
    const [priceTable, setPriceTable] = useState();
    const [distanceRuler, setDistanceRuler] = useState([])
    const [loading, setLoading] = useState(true);

    const [distanceRulerModal, setDistanceRulerModal] = useState(false)
    const [distanceRulerModalDelete, setDistanceRulerModalDelete] = useState(false);
    const [selectedDistanceDeleteItem, setSelectedDistanceDeleteItem] = useState([])

    const [priceTableModal, setPriceTableModal] = useState(false)
    const [priceTableModalDelete, setPriceTableModalDelete] = useState(false);
    const [selectedPriceDeleteItem, setSelectedPriceDeleteItem] = useState([])

    const [updatePriceTableModal, setUpdatePriceTableModal] = useState(false)
    const [updateGeneralPriceTableModal, setUpdateGeneralPriceTableModal] = useState(false)
    const [selectedPriceTableItem, setSelectedPriceTableItem] = useState([])

    const [updateDistanceRulerModal, setUpdateDistanceRulerModal] = useState(false)
    const [updateGeneralDistanceRulerModal, setUpdateGeneralDistanceRulerModal] = useState(false)
    const [selectedDistanceRulerItem, setSelectedDistanceRulerItem] = useState('')

    const [isEdit, setIsEdit] = useState(true);
    const [distanceRulerDeleteId, setDistanceRulerDeleteId] = useState('');
    const [priceTableDeleteId, setPriceTableDeleteId] = useState('');

    const [facilitySelectModal, setFacilitySelectModal] = useState(false)
    const [facilitySelectModal2, setFacilitySelectModal2] = useState(false)

    useEffect(() => {
        async function fetchData() {
            await GetDistanceRuler(params.id).then((res) => {
                setDistanceRuler(res.data)
            })
            await GetPriceTable(params.id).then((res) => {
                setPriceTable(res.data)
            })
            setLoading(false);
            setIsEdit(false);
        }
        if (isEdit) {
            setLoading(true);
            fetchData()
        }
    }, [isEdit])

    const handleClose = () => {
        setDistanceRulerModalDelete(!distanceRulerModalDelete);
    };

    const handleClosePriceTable = () => {
        setPriceTableModalDelete(!priceTableModalDelete);
    };
    if (loading) return (<Loader open={loading} />)

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container spacing={3}>

                    {(priceTable && distanceRuler) && (
                        <>
                            <Grid item xs={12}>
                                <MainCard content={false} title="MESAFE CETVELİ" secondary={
                                    <Button variant="contained" startIcon={<Add />} onClick={() => { setDistanceRulerModal(true) }} size="large">
                                        Mesafe Ekle
                                    </Button>}>
                                    {/* table */}
                                    <TableContainer>
                                        <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">Başlık</TableCell>
                                                    <TableCell align="left">Mesafe</TableCell>
                                                    <TableCell align="right" sx={{ pr: 3 }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    distanceRuler && distanceRuler.map((row) => {
                                                        return (
                                                            <TableRow hover key={row.id}>
                                                                <TableCell align="left">{row?.distanceRulerDetails[0]?.name}</TableCell>
                                                                <TableCell align="left">{row?.value}</TableCell>
                                                                <TableCell sx={{ pr: 3 }} align="right">
                                                                    <Stack direction="row" spacing={0}>
                                                                        <Tooltip title="Delete">
                                                                            <IconButton
                                                                                color="error"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleClose();
                                                                                    setDistanceRulerDeleteId(row.id);
                                                                                    setSelectedDistanceDeleteItem(row?.distanceRulerDetails[0])
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
                                                                                    // setUpdateDistanceRulerModal(true)
                                                                                    setFacilitySelectModal(true)
                                                                                    setSelectedDistanceRulerItem(row)
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
                                    <FacilityActionSelectModal setFacilityDetailModal={setUpdateDistanceRulerModal} setFacilityGeneralModal={setUpdateGeneralDistanceRulerModal} title={selectedDistanceRulerItem !== '' ? selectedDistanceRulerItem?.distanceRulerDetails[0]?.name : ''} open={facilitySelectModal} handleClose={() => setFacilitySelectModal(false)} />
                                    <DistanceRulerModal open={distanceRulerModal} modalToggler={setDistanceRulerModal} villaId={params.id} setIsEdit={setIsEdit} />
                                    <DistanceRulerModalDelete villa={true} selectedItem={selectedDistanceDeleteItem} setIsEdit={setIsEdit} id={distanceRulerDeleteId} title={distanceRulerDeleteId} open={distanceRulerModalDelete} handleClose={handleClose} />
                                    <DistanceRulerUpdateModal open={updateDistanceRulerModal} modalToggler={setUpdateDistanceRulerModal} selectedItem={selectedDistanceRulerItem} setIsEdit={setIsEdit} />
                                    <DistanceRulerGeneralUpdateModal open={updateGeneralDistanceRulerModal} modalToggler={setUpdateGeneralDistanceRulerModal} selectedItem={selectedDistanceRulerItem} setIsEdit={setIsEdit} />
                                </MainCard>
                            </Grid>
                            <Grid item xs={12}>
                                <MainCard content={false} title="Fiyat Tablosu" secondary={
                                    <Button variant="contained" startIcon={<Add />} onClick={() => { setPriceTableModal(true) }} size="large">
                                        Fiyat Ekle
                                    </Button>}>
                                    {/* table */}
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
                                                    priceTable && priceTable.map((row) => {
                                                        return (
                                                            <TableRow hover key={row.id}>
                                                                <TableCell align="left">{row?.priceTableDetails[0]?.title}</TableCell>
                                                                <TableCell align="left">{row?.priceTableDetails[0].description}</TableCell>
                                                                <TableCell align="left">{row?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {row?.villa?.priceType === 1 ? ' TL' : row?.villa?.priceType === 2 ? ' USD' : row?.villa?.priceType === 3 ? ' EUR' : row?.villa?.priceType === 4 ? ' GBP' : ''}</TableCell>
                                                                <TableCell sx={{ pr: 3 }} align="right">
                                                                    <Stack direction="row" spacing={0}>
                                                                        <Tooltip title="Delete">
                                                                            <IconButton
                                                                                color="error"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleClosePriceTable();
                                                                                    setPriceTableDeleteId(row.id);
                                                                                    setSelectedPriceDeleteItem(row.priceTableDetails[0])
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
                                                                                    setFacilitySelectModal2(true)
                                                                                    setSelectedPriceTableItem(row)
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
                                    <FacilityActionSelectModal setFacilityDetailModal={setUpdatePriceTableModal} setFacilityGeneralModal={setUpdateGeneralPriceTableModal} title={selectedPriceTableItem.length !== 0 ? selectedPriceTableItem?.priceTableDetails[0]?.title : ''} open={facilitySelectModal2} handleClose={() => setFacilitySelectModal2(false)} />
                                    <PriceTableModal open={priceTableModal} modalToggler={setPriceTableModal} villaId={params.id} setIsEdit={setIsEdit} />
                                    <PriceTableUpdateModal open={updatePriceTableModal} modalToggler={setUpdatePriceTableModal} selectedItem={selectedPriceTableItem} setIsEdit={setIsEdit} />
                                    <PriceTableModalDelete villa={true} selectedItem={selectedPriceDeleteItem} setIsEdit={setIsEdit} id={priceTableDeleteId} title={priceTableDeleteId} open={priceTableModalDelete} handleClose={handleClosePriceTable} />
                                    <PriceTableGeneralUpdateModal open={updateGeneralPriceTableModal} modalToggler={setUpdateGeneralPriceTableModal} selectedItem={selectedPriceTableItem} setIsEdit={setIsEdit} />
                                </MainCard>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
        </Grid >
    );
}