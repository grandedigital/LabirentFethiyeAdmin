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

import { UpdateWebPage } from 'services/websiteServices';

// CONSTANT
const getInitialValues = (selectedItem) => {

    const newReservation = {
        metaTitle: selectedItem?.metaTitle || '',
        metaDesc: selectedItem?.metaDescription || '',
    };

    return newReservation;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormWebsiteSeoUpdate({ closeModal, setIsAdded, selectedItem }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, []);

    const ReservationSchema = Yup.object().shape({
        metaTitle: Yup.string().required('Meta Title zorunlu zorunlu'),
        metaDesc: Yup.string().required('Meta Description zorunlu'),
    });

    const formik = useFormik({
        initialValues: getInitialValues(selectedItem),
        validationSchema: ReservationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setSubmitting(true)
                setLoading(true);
                const fd = new FormData()

                fd.append('Id', selectedItem?.id)
                fd.append('MetaTitle', formik.values.metaTitle)
                fd.append('MetaDescription', formik.values.metaDesc)

                await UpdateWebPage(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Seo düzenlendi.',
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
                        <DialogTitle>Seo Düzenle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid spacing={3} container >
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="metaTitle">Seo Meta Title</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="metaTitle"
                                            name="metaTitle"
                                            placeholder="Seo Meta Title"
                                            value={formik.values.metaTitle}
                                            onChange={formik.handleChange}
                                            error={formik.touched.metaTitle && Boolean(formik.errors.metaTitle)}
                                            helperText={formik.touched.metaTitle && formik.errors.metaTitle}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="metaDesc">Seo Meta Description</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="metaDesc"
                                            name="metaDesc"
                                            placeholder="Seo Meta Description"
                                            value={formik.values.metaDesc}
                                            onChange={formik.handleChange}
                                            error={formik.touched.metaDesc && Boolean(formik.errors.metaDesc)}
                                            helperText={formik.touched.metaDesc && formik.errors.metaDesc}
                                        />
                                    </Stack>
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


