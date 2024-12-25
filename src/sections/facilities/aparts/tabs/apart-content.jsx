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
import { GetDistanceRulerApart } from 'services/distanceRulerServices';
import DistanceRulerUpdateModal from 'sections/distanceRulerSections/DistanceRulerUpdateModal';
import FacilityActionSelectModal from 'sections/facilities/FacilityActionSelectModal';
import DistanceRulerGeneralUpdateModal from 'sections/distanceRulerSections/DistanceRulerGeneralUpdateModal';

export default function ApartContentSection() {
    const params = useParams();
    const [loading, setLoading] = useState(true);

    const [distanceRuler, setDistanceRuler] = useState([])
    const [updateGeneralDistanceRulerModal, setUpdateGeneralDistanceRulerModal] = useState(false)

    const [faciltyActionSelectModal, setFacilityActionSelectModal] = useState(false)

    const [distanceRulerModal, setDistanceRulerModal] = useState(false)
    const [distanceRulerModalDelete, setDistanceRulerModalDelete] = useState(false);
    const [selectedDistanceDeleteItem, setSelectedDistanceDeleteItem] = useState([])

    const [updateDistanceRulerModal, setUpdateDistanceRulerModal] = useState(false)
    const [selectedDistanceRulerItem, setSelectedDistanceRulerItem] = useState('')

    const [isEdit, setIsEdit] = useState(true);
    const [distanceRulerDeleteId, setDistanceRulerDeleteId] = useState('');


    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            setIsEdit(false)
            GetDistanceRulerApart(params.id).then((res) => {
                setDistanceRuler(res?.data)
                setLoading(false);
            })
        }
    }, [isEdit])

    const handleClose = () => {
        setDistanceRulerModalDelete(!distanceRulerModalDelete);
    };

    if (loading) return (<Loader open={loading} />)

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container spacing={3}>

                    {true && (
                        <>
                            <Grid item xs={12}>
                                <MainCard content={false} title="MESAFE CETVELİ" secondary={
                                    <Button variant="contained" startIcon={<Add />} onClick={() => { setDistanceRulerModal(true) }} size="large">
                                        Mesafe Ekle
                                    </Button>}>
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
                                                    distanceRuler && distanceRuler.map((item, i) => {
                                                        return (
                                                            <TableRow hover key={i}>
                                                                <TableCell align="left">{item.distanceRulerDetails[0].name}</TableCell>
                                                                <TableCell align="left">{item.value}</TableCell>
                                                                <TableCell sx={{ pr: 3 }} align="right">
                                                                    <Stack direction="row" spacing={0}>
                                                                        <Tooltip title="Delete">
                                                                            <IconButton
                                                                                color="error"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleClose();
                                                                                    setDistanceRulerDeleteId(item.id);
                                                                                    setSelectedDistanceDeleteItem(item)
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
                                                                                    setFacilityActionSelectModal(true)
                                                                                    setSelectedDistanceRulerItem(item)
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
                                    <FacilityActionSelectModal setFacilityGeneralModal={setUpdateGeneralDistanceRulerModal} setFacilityDetailModal={setUpdateDistanceRulerModal} title={selectedDistanceRulerItem !== '' ? selectedDistanceRulerItem.distanceRulerDetails[0]?.name : ''} open={faciltyActionSelectModal} handleClose={() => setFacilityActionSelectModal(false)} />
                                    <DistanceRulerModal apart={true} open={distanceRulerModal} modalToggler={setDistanceRulerModal} villaId={params.id} setIsEdit={setIsEdit} />
                                    <DistanceRulerModalDelete selectedItem={selectedDistanceDeleteItem} setIsEdit={setIsEdit} id={distanceRulerDeleteId} title={distanceRulerDeleteId} open={distanceRulerModalDelete} handleClose={handleClose} />
                                    <DistanceRulerUpdateModal open={updateDistanceRulerModal} modalToggler={setUpdateDistanceRulerModal} selectedItem={selectedDistanceRulerItem} setIsEdit={setIsEdit} />
                                    <DistanceRulerGeneralUpdateModal open={updateGeneralDistanceRulerModal} modalToggler={setUpdateGeneralDistanceRulerModal} selectedItem={selectedDistanceRulerItem} setIsEdit={setIsEdit} />
                                </MainCard>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
        </Grid >
    );
}