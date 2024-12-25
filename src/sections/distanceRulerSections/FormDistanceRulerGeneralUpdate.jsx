/* eslint-disable prettier/prettier */
import { useState } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText, Box, Tabs, Tab, Typography } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { openSnackbar } from 'api/snackbar';
import useUser from 'hooks/useUser';
import { DistanceRulerUpdate } from 'services/distanceRulerServices';


const getInitialValues = (selectedItem, selectedLanguage) => {
    const data = selectedItem?.distanceRulerDetails?.find((itm) => itm.languageCode === selectedLanguage)

    const newPriceDate = {
        value: selectedItem?.value,
        icon: selectedItem?.icon || ''
    };
    return newPriceDate;
};

export default function FormDistanceRulerGeneralUpdate({ closeModal, setIsEdit, apart = false, selectedItem }) {
    const user = useUser()
    const [selectedLanguage, setSelectedLanguage] = useState(user?.config?.companyLanguages[0] || '')

    const validationSchema = Yup.object({
        icon: Yup.string().required('Icon Seçmek zorunlu'),
        value: Yup.string().required('Mesafe zorunlu'),
    });

    const formik = useFormik({
        initialValues: getInitialValues(selectedItem, selectedLanguage),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fd = new FormData()
                fd.append('Id', selectedItem.id)
                fd.append('Icon', values.icon)
                fd.append('Value', values.value)

                await DistanceRulerUpdate(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: "Mesafe Cetveli güncellendi.",
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
                })

                setSubmitting(false);
                closeModal();
                setIsEdit(true)

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
                        <DialogTitle>Mesafe Cetveli Düzenle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid item xs={12} md={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="value">Mesafe *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="value"
                                                name="value"
                                                placeholder="Mesafe Yazınız.."
                                                value={formik.values.value}
                                                onChange={formik.handleChange}
                                                error={formik.touched.value && Boolean(formik.errors.value)}
                                                helperText={formik.touched.value && formik.errors.value}
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


