/* eslint-disable prettier/prettier */
import { useState } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { useParams } from 'react-router';
import { PriceTableAdd } from 'services/priceTableServices';
import { openSnackbar } from 'api/snackbar';
import useUser from 'hooks/useUser';


const getInitialValues = () => {
    const newPriceDate = {
        name: '',
        description: '',
        icon: '',
        price: 0,
        villa: {},
        apart: {}
    };
    return newPriceDate;
};

export default function FormPriceTableAdd({ closeModal, setIsEdit, apart = false }) {
    const user = useUser()
    const params = useParams();

    const validationSchema = Yup.object({
        name: Yup.string().required('Başlık Yazmak Zorunludur'),
        description: Yup.string().required('Açıklama" Yazmak Zorunludur'),
        icon: Yup.string().required('Icon Seçmek Zorunludur'),
        price: Yup.number().required('Fiyat Seçmek Zorunludur').min(1, 'En az 1 yazınız')
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
                        name: values.name,
                        description: values.description,
                        icon: values.icon,
                        price: values.price,
                        apart: { connect: [params.id] }
                    }
                } else {
                    formik.values.villa = { connect: [params.id] };
                    data = {
                        name: values.name,
                        description: values.description,
                        icon: values.icon,
                        price: values.price,
                        villa: { connect: [params.id] }
                    }
                }

                const fd = new FormData()
                if (apart) {
                    fd.append('RoomId', params.id)
                } else {
                    fd.append('VillaId', params.id)
                }
                fd.append('Icon', values.icon)
                fd.append('Price', values.price)
                fd.append('LanguageCode', user?.config?.companyDefaultLanguage || 'tr')
                fd.append('Title', values.name)
                fd.append('Description', values.description)

                await PriceTableAdd(fd).then((res) => {
                    setIsEdit(true);
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Fiyat Eklendi',
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
                        <DialogTitle>Fiyat Tablosu Ekle</DialogTitle>
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
                                                    <FormControlLabel value="cloud-drizzle" control={<Radio />} label="Yağmurlu" />
                                                    <FormControlLabel value="cloud-notif" control={<Radio />} label="Parçalı Bulut" />
                                                    <FormControlLabel value="sun" control={<Radio />} label="Güneş" />
                                                </RadioGroup>
                                            </FormControl>
                                            {formik.errors.icon && (
                                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                                    {formik.errors.icon}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="description">Açıklama *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="description"
                                                name="description"
                                                multiline
                                                rows={5}
                                                placeholder="Açıklama Yazınız.."
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                error={formik.touched.description && Boolean(formik.errors.description)}
                                                helperText={formik.touched.description && formik.errors.description}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="price">Fiyat *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="price"
                                                name="price"
                                                placeholder="Fiyat Yazınız.."
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                                error={formik.touched.price && Boolean(formik.errors.price)}
                                                helperText={formik.touched.price && formik.errors.price}
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


