/* eslint-disable prettier/prettier */
import { useState } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

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
import { DistanceRulerAdd } from 'services/distanceRulerServices';
import { openSnackbar } from 'api/snackbar';
import useConfig from 'hooks/useConfig';


const getInitialValues = () => {
    const newDistanceRuler = {
        name: '',
        value: '',
        icon: '',
        villa: {},
        apart: {}
    };
    return newDistanceRuler;
};

export default function FormDistanceRulerAdd({ closeModal, setIsEdit, apart = false }) {
    const user = useConfig()
    const params = useParams();

    const validationSchema = Yup.object({
        name: Yup.string().required('Başlık Yazmak Zorunludur'),
        value: Yup.string().required('Değer" Yazmak Zorunludur'),
        icon: Yup.string().required('Icon Seçmek Zorunludur')
    });

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let data = {}
                if (apart) {
                    formik.values.apart = { connect: [params.id] };
                    data = {
                        data: {
                            name: values.name,
                            value: values.value,
                            icon: values.icon,
                            apart: values.apart
                        }
                    }
                } else {
                    formik.values.villa = { connect: [params.id] };
                    data = {
                        data: {
                            name: values.name,
                            value: values.value,
                            icon: values.icon,
                            villa: values.villa
                        }
                    }
                }

                const fd = new FormData()
                if (apart) {
                    fd.append('HotelId', params.id)
                } else {
                    fd.append('VillaId', params.id)
                }
                fd.append('Icon', values.icon)
                fd.append('LanguageCode', user?.config?.companyDefaultLanguage || 'tr')
                fd.append('Name', values.name)
                fd.append('Value', values.value)

                await DistanceRulerAdd(fd).then((res) => {
                    setIsEdit(true);
                    if (!res?.error) {
                        openSnackbar({
                            open: true,
                            message: 'Mesafe Eklendi',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                    }
                    else {
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
                    setSubmitting(false);
                    closeModal();
                })
            } catch (error) {
                // console.error(error);
            }
        }
    });

    const { handleSubmit, isSubmitting } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Mesafe Ekle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid item xs={12} md={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="languageCode">Dil</InputLabel>
                                            <FormControl>
                                                <RadioGroup row aria-label="languageCode" value={user?.config?.companyDefaultLanguage || 'tr'} name="languageCode" id="languageCode">
                                                    <FormControlLabel disabled value="tr" control={<Radio />} label="TR" />
                                                    <FormControlLabel disabled value="en" control={<Radio />} label="EN" />
                                                </RadioGroup>
                                            </FormControl>
                                            {formik.errors.languageCode && (
                                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                                    {formik.errors.languageCode}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="name">Başlık *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="name"
                                                name="name"
                                                placeholder="Başlık Yazınız.."
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                error={formik.touched.name && Boolean(formik.errors.name)}
                                                helperText={formik.touched.name && formik.errors.name}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="icon">Icon *</InputLabel>
                                            <FormControl>
                                                <RadioGroup row aria-label="icon" value={formik.values.icon} onChange={formik.handleChange} name="icon" id="icon">
                                                    <FormControlLabel value="shopping-cart" control={<Radio />} label="Market" />
                                                    <FormControlLabel value="lamp" control={<Radio />} label="Restoran" />
                                                    <FormControlLabel value="airplane" control={<Radio />} label="Havaalanı" />
                                                    <FormControlLabel value="sun-fog" control={<Radio />} label="Deniz" />
                                                    <FormControlLabel value="buildings-2" control={<Radio />} label="Merkez" />
                                                    <FormControlLabel value="bus" control={<Radio />} label="Toplu Taşıma" />
                                                </RadioGroup>
                                            </FormControl>
                                            {formik.errors.icon && (
                                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                                    {' '}
                                                    {formik.errors.icon}{' '}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="value">Mesafe *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="value"
                                                name="value"
                                                placeholder="Değer Yazınız.."
                                                value={formik.values.value}
                                                onChange={formik.handleChange}
                                                error={formik.touched.value && Boolean(formik.errors.value)}
                                                helperText={formik.touched.value && formik.errors.value}
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


