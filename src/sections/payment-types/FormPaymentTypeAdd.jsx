/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';

// material ui

import { Box, Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { openSnackbar } from 'api/snackbar';



import Loader from 'components/Loader';
import { CreatePaymentType } from 'services/paymentTypeServices';


const getInitialValues = () => {
    const newReservation = {
        title: '',
        shortDescription: ''
    };


    return newReservation;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormPaymentTypeAdd({ closeModal, setIsAdded }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, []);

    const ReservationSchema = Yup.object().shape({
        title: Yup.string().required('Başlık zorunlu'),
        shortDescription: Yup.string().required('Açıklama zorunlu'),
    });

    const [openAlert, setOpenAlert] = useState(false);

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
        closeModal();
    };

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: ReservationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                setLoading(true);

                const fd = new FormData()

                fd.append('Title', formik.values.title)
                fd.append('Description', formik.values.shortDescription)

                await CreatePaymentType(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Ödeme Türü eklendi.',
                            variant: 'alert',

                            alert: {
                                color: 'success'
                            }
                        });
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
                    setIsAdded(true)
                    closeModal();
                })

            } catch (error) {
                console.error(error);
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

    if (loading) return (<Loader open={loading} />)

    const handleChangeEditor = (value) => {
        setFieldValue('longDescription', value)
    };

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Ödeme Türü Ekle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid spacing={3} container >
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="title">Başlık</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="title"
                                            name="title"
                                            placeholder="Başlık"
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            error={formik.touched.title && Boolean(formik.errors.title)}
                                            helperText={formik.touched.title && formik.errors.title}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="shortDescription">Açıklama</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="shortDescription"
                                        multiline
                                        rows={4}
                                        placeholder="Açıklama"
                                        {...getFieldProps('shortDescription')}
                                        error={Boolean(touched.shortDescription && errors.shortDescription)}
                                        helperText={touched.shortDescription && errors.shortDescription}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="end" alignItems="normal">
                                <Button type="submit" variant="contained" color='primary' size='large'>
                                    KAYDET
                                </Button>
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider >
        </>
    );
}


