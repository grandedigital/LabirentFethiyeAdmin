/* eslint-disable prettier/prettier */
import { useState } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from 'moment';

// project imports
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useParams } from 'react-router';
import { GetPriceForAddForm, PriceAdd, PricePut, PriceRemove } from 'services/priceServices';
import { openSnackbar } from 'api/snackbar';


const getInitialValues = () => {
    const newPriceDate = {
        price: '',
        checkIn: '',
        checkOut: '',
        villa: {}
    };
    return newPriceDate;
};

export default function FormPriceAdd({ closeModal, setIsEdit }) {
    const params = useParams();

    const validationSchema = Yup.object({
        price: Yup.number().required('Fiyat Yazmak Zorunludur')
    });

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                formik.values.checkIn = moment(date1).format('YYYY-MM-DD').toString();
                formik.values.checkOut = moment(date2).format('YYYY-MM-DD').toString();

                const fd = new FormData()
                fd.append('StartDate', formik.values.checkIn)
                fd.append('EndDate', formik.values.checkOut)
                fd.append('Price', formik.values.price)
                fd.append('VillaId', params.id)

                await PriceAdd(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Fiyat ekleme başarılı',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                    } else {
                        openSnackbar({
                            open: true,
                            message: res?.errors ? res?.errors[0]?.description : 'Hata',
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
                // console.error(error);
            }
        }
    });

    const { handleSubmit, isSubmitting } = formik;

    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Fiyat Ekle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid item xs={12} md={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="checkIn">Başlangıç Tarihi</InputLabel>
                                            <DatePicker
                                                id="checkIn"
                                                value={date1}
                                                onChange={(newValue) => { setDate1(newValue); }}
                                                slotProps={{ textField: { fullWidth: true } }} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="checkOut">Bitiş Tarihi</InputLabel>
                                            <DatePicker
                                                id="checkOut"
                                                value={date2}
                                                minDate={date1}
                                                disabled={!date1}
                                                onChange={(newValue) => setDate2(newValue)}
                                                slotProps={{ textField: { fullWidth: true } }} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="price">Fiyat </InputLabel>
                                            <TextField
                                                fullWidth
                                                id="price"
                                                name="price"
                                                placeholder="Fiyat"
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="end" alignItems="end">
                                <Stack direction="row" spacing={2} alignItems="end">
                                    <Button type="submit" variant="contained" size='large' disabled={isSubmitting}>
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


