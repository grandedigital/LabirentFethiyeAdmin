/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';

// material ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from 'moment';


// project imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { ThemeMode, Gender } from 'config';
import { openSnackbar } from 'api/snackbar';
import { insertCustomer, updateCustomer } from 'api/customer';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// assets
import { Camera, CloseCircle, Trash } from 'iconsax-react';
import { VillaGetPriceForReservation, VillaIsAvailible } from 'services/villaServices';
import { dateToString } from 'utils/custom/dateHelpers';
import { useNavigate, useParams } from 'react-router';
import Loader from 'components/Loader';
import { AddReservation, ChangeReservation, GetReservation, GetReservationIsAvailable } from 'services/reservationServices';




// CONSTANT
const getInitialValues = (data) => {
    const newReservation = {
        name: '',
        surname: '',
        idNo: '',
        phone: '',
        email: '',
        checkIn: '',
        checkOut: '',
        discount: data?.discount || 0,
        total: 0,
        villa: {},
        amount: 0,
        reservationStatus: '',
        customerPaymentType: '',
        description: data?.note || '',
        reservation_infos: {},
        homeOwner: false
    };

    return newReservation;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormReservationUpdate({ closeModal, setIsAdded }) {
    const theme = useTheme();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [priceType, setPriceType] = useState('')
    const [data, setData] = useState({})

    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);

    const [reservationItem, setReservationItem] = useState([]);


    useEffect(() => {
        GetReservation(params?.id).then((res) => {
            setDate1(new Date(res?.data?.checkIn))
            setDate2(new Date(res?.data?.checkOut))
            setPriceType(res?.data?.priceType)
            setData(res?.data)
            setLoading(false);
        })
    }, []);

    useEffect(() => {
        if (data?.checkIn && data?.homeOwner !== true) {
            if ((new Date(data?.checkIn)).toString() !== (new Date(date1)).toString() || (new Date(data?.checkOut)).toString() !== (new Date(date2)).toString()) {
                setLoading(true)
                VillaGetPriceForReservation(data?.villaId !== null ? data?.villaId : data?.roomId, dateToString(date1), dateToString(date2), data?.villaId !== null ? false : true).then((res) => {
                    if (res?.statusCode === 200) {
                        setPriceType(res?.data?.priceType)
                        var fakeDate = new Date(moment(date1).format('YYYY-MM-DD'));
                        var days = [];
                        res.data.days.map((priceDate) => {
                            while (fakeDate >= new Date(res.data.checkIn) && fakeDate <= new Date(res.data.checkOut)) {
                                if (fakeDate >= new Date(moment(date2).format('YYYY-MM-DD'))) break;
                                days.push({ date: moment(fakeDate).format('YYYY-MM-DD'), price: priceDate.price });
                                fakeDate.setDate(fakeDate.getDate() + 1);
                            }
                        });
                        var toplam = 0;
                        var rezItem = [];
                        for (var i = 0; i < days.length; i++) {
                            toplam = toplam + Number(days[i].price);
                            rezItem.push({ day: days[i].date, price: days[i].price });
                        }
                        setReservationItem(rezItem);

                        let time1 = date1.getTime();
                        let time2 = date2.getTime();

                        let timeDifference = Math.abs(time2 - time1);
                        let dayDifference = timeDifference / (1000 * 60 * 60 * 24);

                        if (toplam > 0 && (rezItem.length === parseInt(dayDifference))) {
                            setFieldValue('amount', toplam);
                            setIsAvailable(true);
                            setLoading(false);
                        } else {
                            openSnackbar({
                                open: true,
                                message: 'Seçtiğiniz tarihlerde fiyat bilgisi bulunamadı.',
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                }
                            });
                            setLoading(false);
                        }
                    }
                    else if (res?.errors[0]?.description) {
                        openSnackbar({
                            open: true,
                            message: res?.errors[0]?.description ? res?.errors[0]?.description : 'Hata',
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            }
                        });
                        setLoading(false);
                    } else {
                        openSnackbar({
                            open: true,
                            message: 'Hata',
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            }
                        });
                        setLoading(false);
                    }

                })
            }
        }
    }, [date1, date2])




    const ReservationSchema = Yup.object().shape({
    });

    const [openAlert, setOpenAlert] = useState(false);

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
        closeModal();
    };

    const formik = useFormik({
        initialValues: getInitialValues(data),
        validationSchema: ReservationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                setLoading(true);

                if (new Date(date1) >= new Date(date2)) {
                    openSnackbar({
                        open: true,
                        message: 'Lütfen Tarihleri Kontrol Ediniz.',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        }
                    });
                    setLoading(false)
                } else {

                    formik.values.checkIn = moment(date1).format('YYYY-MM-DD').toString();
                    formik.values.checkOut = moment(date2).format('YYYY-MM-DD').toString();

                    const fd = new FormData()
                    fd.append('Id', params.id)
                    fd.append('CheckIn', formik.values.checkIn)
                    fd.append('CheckOut', formik.values.checkOut)
                    if (data?.homeOwner !== true) {
                        fd.append('Discount', formik.values.discount)
                        fd.append('Note', formik.values.description)
                    }

                    await ChangeReservation(fd).then((res) => {
                        if (res?.statusCode === 200) {
                            openSnackbar({
                                open: true,
                                message: 'Rezervasyon güncellendi.',
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                }
                            });
                            location.reload()
                        } else {
                            openSnackbar({
                                open: true,
                                message: res?.errors[0]?.description ? res?.errors[0]?.description : 'Hata',
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                }
                            });
                        }
                        setLoading(false);
                        setSubmitting(false);
                        closeModal();
                    })
                }


            } catch (error) {
                // console.error(error);
            }
        }
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

    if (loading)
        return (
            <Box sx={{ p: 5 }}>
                <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                </Stack>
            </Box>
        );

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Rezervasyon Güncelle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid item xs={12} md={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="checkIn">Giriş Tarihi</InputLabel>
                                            <DatePicker
                                                id="checkIn"
                                                value={date1}
                                                onChange={(newValue) => { setDate1(newValue); }}
                                                slotProps={{ textField: { fullWidth: true } }} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="checkOut">Çıkış Tarihi</InputLabel>
                                            <DatePicker
                                                id="checkOut"
                                                value={date2}
                                                minDate={date1}
                                                disabled={!date1}
                                                onChange={(newValue) => setDate2(newValue)}
                                                slotProps={{ textField: { fullWidth: true } }} />
                                        </Stack>
                                    </Grid>
                                    {
                                        data?.homeOwner !== true &&
                                        <>
                                            < Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="İndirim">İndirim </InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="discount"
                                                        name="discount"
                                                        placeholder="İndirim Uygula"
                                                        value={formik.values.discount}
                                                        onChange={formik.handleChange}
                                                    />
                                                </Stack>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Divider />
                                                <Stack direction="row" spacing={2} alignItems="center">

                                                    <Button color="warning" size="large" onClick={() => null}>
                                                        Toplam Fiyat : {formik?.values?.amount !== 0 ? formik?.values?.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : data?.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {priceType === 1 ? ' TL' : priceType === 2 ? ' USD' : priceType === 3 ? ' EUR' : priceType === 4 ? ' GBP' : ''}
                                                    </Button>

                                                    <Button size="large" onClick={() => null}>
                                                        İndirimli Fiyat : {formik?.values?.amount !== 0 ? (formik?.values?.amount - formik?.values?.discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : (data?.amount - formik?.values?.discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {priceType === 1 ? ' TL' : priceType === 2 ? ' USD' : priceType === 3 ? ' EUR' : priceType === 4 ? ' GBP' : ''}
                                                    </Button>

                                                </Stack>
                                                <Divider />
                                            </Grid>


                                            <Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="description">Rezervasyon Notları</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="description"
                                                        name="description"
                                                        multiline
                                                        rows={5}
                                                        placeholder="Rezervasyon Notları"
                                                        value={formik.values.description}
                                                        onChange={formik.handleChange}
                                                    />
                                                </Stack>
                                            </Grid>
                                        </>
                                    }
                                </Grid>

                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="space-between" alignItems="normal">
                                <Button type="submit" variant="contained" size='large' disabled={isSubmitting}>
                                    GÜNCELLE
                                </Button>
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider >
        </>
    );
}
