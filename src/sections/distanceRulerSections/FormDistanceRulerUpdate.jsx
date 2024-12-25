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
import { LanguageCircle } from 'iconsax-react';
import useUser from 'hooks/useUser';
import { DistanceRulerCreateDetail, DistanceRulerUpdateDetail } from 'services/distanceRulerServices';


const getInitialValues = (selectedItem, selectedLanguage) => {
    const data = selectedItem?.distanceRulerDetails?.find((itm) => itm.languageCode === selectedLanguage)

    const newPriceDate = {
        name: data?.name || ''
    };
    return newPriceDate;
};

export default function FormDistanceRulerUpdate({ closeModal, setIsEdit, apart = false, selectedItem }) {
    const user = useUser()
    const [value, setValue] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState(user?.config?.companyLanguages[0] || '')

    const validationSchema = Yup.object({
        name: Yup.string().required('Başlık Yazmak Zorunludur')
    });

    const formik = useFormik({
        initialValues: getInitialValues(selectedItem, selectedLanguage),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const id = selectedItem?.distanceRulerDetails?.find((itm) => itm.languageCode === selectedLanguage)?.id

                const fdDetail = new FormData()
                fdDetail.append('Name', values.name)

                if (id) {
                    fdDetail.append('Id', id)
                    await DistanceRulerUpdateDetail(fdDetail).then((res) => {
                        if (res?.statusCode === 200) {
                            openSnackbar({
                                open: true,
                                message: "Mesafe Cetveli detayları güncellendi.",
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
                } else {
                    fdDetail.append('DistanceRulerId', selectedItem?.id)
                    fdDetail.append('LanguageCode', selectedLanguage)
                    await DistanceRulerCreateDetail(fdDetail).then((res) => {
                        if (res?.statusCode === 200) {
                            openSnackbar({
                                open: true,
                                message: "Mesafe Cetveli detayları eklendi.",
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
                }

                setSubmitting(false);
                closeModal();
                setIsEdit(true)

            } catch (error) {
                // console.error(error);
            }
        }
    });

    const { handleSubmit, isSubmitting } = formik;

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setSelectedLanguage(user?.config?.companyLanguages[newValue])
    };

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Mesafe Cetveli Detayları Düzenle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', marginBottom: 3 }}>
                                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
                                    {
                                        user?.config?.companyLanguages.map((itm, i) => {
                                            return (
                                                <Tab key={i} label={itm} style={{ color: selectedItem?.distanceRulerDetails?.find((item) => item.languageCode === itm) ? '#107d4f' : '#d35a00' }} component={Typography} icon={<LanguageCircle />} iconPosition="start" />
                                            )
                                        })
                                    }
                                </Tabs>
                            </Box>
                            <Grid item xs={12} md={12}>
                                <Grid container spacing={3}>
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
                                    {/* <Grid item xs={12}>
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
                                    </Grid> */}
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


