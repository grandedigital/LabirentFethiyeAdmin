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
import { AddReservationInfo } from 'services/reservationInfoServices';


const getInitialValues = () => {
    const newPriceDate = {
        name: '',
        surname: '',
        idNo: '',
        phone: '',
        email: '',
        peopleType: '',
        reservation: {}
    };
    return newPriceDate;
};

export default function ReservationCustomerAddForm({ closeModal, setIsEdit, villaId }) {
    const params = useParams();
    const [paymentType, setPaymentType] = useState();
    const validationSchema = Yup.object({
        name: Yup.string().max(255).required('İsim tarihi zorunludur'),
        surname: Yup.string().max(255).required('Soyisim zorunludur'),
        idNo: Yup.number()
            .typeError('Please enter a valid number')
            .required('Id no required')
            .integer('Number must be an integer'),
        phone: Yup.string().max(255),
        peopleType: Yup.string().max(255).required('Bu alan zorunludur')
    });

    useEffect(() => {
        GetAllPaymentTypes().then((res) => { setPaymentType(res.data); })
    }, []);

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (!params.id) {
                    alert('Rezervasyon Id hatali..');
                    return;
                }

                const fd = new FormData()
                fd.append('ReservationId', params.id)
                fd.append('IdNo', values.idNo)
                fd.append('Name', values.name)
                fd.append('Surname', values.surname)
                fd.append('Phone', values.phone)
                fd.append('Email', values.email)
                fd.append('PeopleType', values.peopleType)
                fd.append('Owner', false)

                await AddReservationInfo(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Misafir Eklendi',
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

    const { handleChange, handleSubmit, isSubmitting } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Misafir Ekle</DialogTitle>
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
                                        <InputLabel htmlFor="phone">Email </InputLabel>
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


