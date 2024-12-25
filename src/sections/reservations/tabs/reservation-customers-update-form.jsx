/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { useParams } from 'react-router';
import { GetAllPaymentTypes } from 'services/paymentTypeServices';
import { openSnackbar } from 'api/snackbar';
import { AddReservationInfo, GetReservationInfo, UpdateReservationInfo } from 'services/reservationInfoServices';
import Loader from 'components/Loader';


const getInitialValues = (customer) => {
    const newPriceDate = {
        name: customer?.name || '',
        surname: customer?.surname || '',
        idNo: customer?.idNo || '',
        phone: customer?.phone || '',
        peopleType: customer?.peopleType || '',
        email: customer?.email || '',
        reservation: {}
    };
    return newPriceDate;
};

export default function ReservationCustomerUpdateForm({ closeModal, setIsEdit, villaId, id }) {
    const params = useParams();
    const [customer, setCustomer] = useState([])
    const [loading, setLoading] = useState(true)
    const validationSchema = Yup.object({
        name: Yup.string().max(255).required('İsim tarihi zorunludur'),
        surname: Yup.string().max(255).required('Soyisim zorunludur'),
        idNo: Yup.string().max(15).required('Tc no zorunludur'),
        phone: Yup.string().max(255),
        peopleType: Yup.string().max(255).required('Bu alan zorunludur')
    });

    useEffect(() => {
        GetReservationInfo(id).then((res) => {
            setCustomer(res?.data)
            setLoading(false)
        })
    }, []);




    const formik = useFormik({
        initialValues: getInitialValues(customer),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                const fd = new FormData()
                fd.append('Id', id)
                fd.append('IdNo', values.idNo)
                fd.append('Name', values.name)
                fd.append('Surname', values.surname)
                fd.append('Phone', values.phone)
                fd.append('PeopleType', values.peopleType)
                fd.append('Email', values.email)

                await UpdateReservationInfo({ data: fd }).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Misafir Düzenlendi.',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                    } else {
                        openSnackbar({
                            open: true,
                            message: res?.errors[0]?.description ? res?.errors[0]?.description : 'Hata',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            }
                        });
                    }
                    setIsEdit(true);
                    setSubmitting(false);
                    closeModal();
                })

            } catch (error) {
                console.log("error => ", error);
            }
        }
    });

    if (loading) return <Loader open={loading} />

    const { handleChange, handleSubmit, isSubmitting } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Misafir Düzenle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">İsim *</InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            id="name"
                                            name="name"
                                            placeholder="İsim Yazınız.."
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="surname">Soyisim *</InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            id="surname"
                                            name="surname"
                                            placeholder="Soyisim Yazınız.."
                                            value={formik.values.surname}
                                            onChange={formik.handleChange}
                                            error={formik.touched.surname && Boolean(formik.errors.surname)}
                                            helperText={formik.touched.surname && formik.errors.surname}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="surname">Tc no *</InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            id="idNo"
                                            name="idNo"
                                            placeholder="Tc no Yazınız.."
                                            value={formik.values.idNo}
                                            onChange={formik.handleChange}
                                            error={formik.touched.idNo && Boolean(formik.errors.idNo)}
                                            helperText={formik.touched.idNo && formik.errors.idNo}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="phone">Telefon </InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            id="phone"
                                            name="phone"
                                            placeholder="İsteğe bağlı Telefon Numarsı.."
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                                            helperText={formik.touched.phone && formik.errors.phone}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="email">Email </InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            name="email"
                                            placeholder="İsteğe bağlı Email adresi.."
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        {' '}
                                        <InputLabel htmlFor="peopleType">Yaş Grubu * </InputLabel>{' '}
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-label="peopleType"
                                                value={formik.values.peopleType}
                                                onChange={formik.handleChange}
                                                name="peopleType"
                                                id="peopleType"
                                            >
                                                <FormControlLabel value="1" control={<Radio />} label="Yetişkin" />
                                                <FormControlLabel value="2" control={<Radio />} label="Çocuk" />
                                                <FormControlLabel value="3" control={<Radio />} label="Bebek" />
                                            </RadioGroup>
                                        </FormControl>
                                        {formik.errors.peopleType && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.peopleType}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="end" alignItems="end">
                                <Stack direction="row" spacing={2} alignItems="end">
                                    <Button type="submit" variant="contained" size='large'>
                                        KAYDET
                                    </Button>
                                </Stack>
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider >
        </>
    );
}


