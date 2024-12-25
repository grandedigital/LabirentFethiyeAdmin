/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';

// material ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, FormControlLabel, RadioGroup, Radio, FormHelperText, Tabs, Tab, Typography } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

import CircularWithPath from 'components/@extended/progress/CircularWithPath';


import { openSnackbar } from 'api/snackbar';

// assets
import { LanguageCircle, Profile } from 'iconsax-react';

import { useNavigate, useParams } from 'react-router';

import ReactQuill from 'react-quill';
import { CreateCategoryDetail, UpdateCategoryDetail } from 'services/categoryServices';
import useUser from 'hooks/useUser';
import { VillaCreateDetail, VillaUpdateDetail } from 'services/villaServices';
import { CreateApartDetail, UpdateApartDetail } from 'services/apartServices';
import { CreateRoomDetail, UpdateRoomDetail } from 'services/roomServices';


// CONSTANT
const getInitialValues = (selectedItem, selectedLanguage, newData) => {
    const data = selectedItem?.roomDetails?.find((itm) => itm.languageCode === selectedLanguage)
    if (data) {
        const newReservation = {
            title: newData.find(item => item.lang === selectedLanguage)?.title || data?.name || '',
            shortDescription: newData.find(item => item.lang === selectedLanguage)?.shortDescription || data?.descriptionShort || '',
            longDescription: newData.find(item => item.lang === selectedLanguage)?.longDescription || data?.descriptionLong || '',
            featureTextBlue: newData.find(item => item.lang === selectedLanguage)?.featureTextBlue || data?.featureTextBlue || '',
            featureTextRed: newData.find(item => item.lang === selectedLanguage)?.featureTextRed || data?.featureTextRed || '',
            featureTextWhite: newData.find(item => item.lang === selectedLanguage)?.featureTextWhite || data?.featureTextWhite || '',
        };
        return newReservation;
    } else {
        const newReservation = {
            title: newData.find(item => item.lang === selectedLanguage)?.title || '',
            shortDescription: newData.find(item => item.lang === selectedLanguage)?.shortDescription || '',
            longDescription: newData.find(item => item.lang === selectedLanguage)?.longDescription || '',
            featureTextBlue: newData.find(item => item.lang === selectedLanguage)?.featureTextBlue || '',
            featureTextRed: newData.find(item => item.lang === selectedLanguage)?.featureTextRed || '',
            featureTextWhite: newData.find(item => item.lang === selectedLanguage)?.featureTextWhite || '',
        };
        return newReservation;
    }
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormRoomDetailUpdate({ closeModal, setIsAdded, selectedItem }) {
    const user = useUser()
    const theme = useTheme();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [value, setValue] = useState(0);
    const [newData, setNewData] = useState([
        {
            title: '',
            shortDescription: '',
            longDescription: '',
            featureTextBlue: '',
            featureTextRed: '',
            featureTextWhite: '',
            lang: 'tr'
        },
        {
            title: '',
            shortDescription: '',
            longDescription: '',
            featureTextBlue: '',
            featureTextRed: '',
            featureTextWhite: '',
            lang: 'en'
        }
    ])
    const [selectedLanguage, setSelectedLanguage] = useState(user?.config?.companyLanguages[0] || '')

    useEffect(() => {
        setLoading(false);
    }, []);

    const ReservationSchema = Yup.object().shape({
        title: Yup.string().required('Başlık zorunlu'),
        // icon: Yup.string().required('icon zorunlu'),
    });

    const [openAlert, setOpenAlert] = useState(false);

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
        closeModal();
    };

    const formik = useFormik({
        initialValues: getInitialValues(selectedItem, selectedLanguage, newData),
        validationSchema: ReservationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                setLoading(true);

                const id = selectedItem?.roomDetails?.find((itm) => itm.languageCode === selectedLanguage)?.id

                const fd = new FormData()


                // fd.append('Icon', formik.values.icon)
                fd.append('Name', formik.values.title)
                fd.append('DescriptionShort', formik.values.shortDescription)
                fd.append('DescriptionLong', formik.values.longDescription)
                fd.append('FeatureTextBlue', formik.values.featureTextBlue)
                fd.append('FeatureTextRed', formik.values.featureTextRed)
                fd.append('FeatureTextWhite', formik.values.featureTextWhite)

                if (id) {
                    fd.append('Id', id)

                    await UpdateRoomDetail(fd).then((res) => {
                        if (res?.statusCode === 200) {
                            openSnackbar({
                                open: true,
                                message: 'Oda düzenlendi.',
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
                        setIsAdded(true)
                        closeModal();
                    })
                } else {
                    fd.append('RoomId', selectedItem?.id)
                    fd.append('LanguageCode', selectedLanguage)
                    await CreateRoomDetail(fd).then((res) => {
                        if (res?.statusCode === 200) {
                            openSnackbar({
                                open: true,
                                message: 'Oda detayları eklendi.',
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


    const handleChangeEditor = (value) => {
        setFieldValue('longDescription', value)
        setNewData(prevData => prevData.map(item => item.lang === selectedLanguage ? { ...item, longDescription: value } : item))
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setSelectedLanguage(user?.config?.companyLanguages[newValue])
    };

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Dil Seçenekleri</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', marginBottom: 3 }}>
                                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
                                    {
                                        user?.config?.companyLanguages.map((itm, i) => {
                                            return (
                                                <Tab key={i} label={itm} style={{ color: selectedItem?.roomDetails?.find((item) => item.languageCode === itm) ? '#107d4f' : '#d35a00' }} component={Typography} icon={<LanguageCircle />} iconPosition="start" />
                                            )
                                        })
                                    }
                                </Tabs>
                            </Box>
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
                                            onChange={(e) => { setFieldValue('title', e.target.value); setNewData(prevData => prevData.map(item => item.lang === selectedLanguage ? { ...item, title: e.target.value } : item)); }}
                                            error={formik.touched.title && Boolean(formik.errors.title)}
                                            helperText={formik.touched.title && formik.errors.title}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="shortDescription">Kısa Açıklama</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="shortDescription"
                                        multiline
                                        rows={5}
                                        placeholder="Kısa Açıklama"
                                        name='shortDescription'
                                        value={formik.values.shortDescription}
                                        onChange={(e) => { setFieldValue('shortDescription', e.target.value); setNewData(prevData => prevData.map(item => item.lang === selectedLanguage ? { ...item, shortDescription: e.target.value } : item)); }}
                                        error={Boolean(touched.shortDescription && errors.shortDescription)}
                                        helperText={touched.shortDescription && errors.shortDescription}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel style={{ marginBottom: '10px' }} htmlFor="longDescription">Genel Açıklama</InputLabel>
                                    <ReactQuill style={{ height: '250px', marginBottom: '40px' }} value={formik?.values?.longDescription} onChange={handleChangeEditor} />
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="featureTextRed">Kırmızı Etiket</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="featureTextRed"
                                            name="featureTextRed"
                                            placeholder="Kırmızı Etiket"
                                            value={formik.values.featureTextRed}
                                            onChange={(e) => { setFieldValue('featureTextRed', e.target.value); setNewData(prevData => prevData.map(item => item.lang === selectedLanguage ? { ...item, featureTextRed: e.target.value } : item)); }}
                                            error={formik.touched.featureTextRed && Boolean(formik.errors.featureTextRed)}
                                            helperText={formik.touched.featureTextRed && formik.errors.featureTextRed}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="featureTextBlue">Mavi Etiket</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="featureTextBlue"
                                            name="featureTextBlue"
                                            placeholder="Mavi Etiket"
                                            value={formik.values.featureTextBlue}
                                            onChange={(e) => { setFieldValue('featureTextBlue', e.target.value); setNewData(prevData => prevData.map(item => item.lang === selectedLanguage ? { ...item, featureTextBlue: e.target.value } : item)); }}
                                            error={formik.touched.featureTextBlue && Boolean(formik.errors.featureTextBlue)}
                                            helperText={formik.touched.featureTextBlue && formik.errors.featureTextBlue}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="featureTextWhite">Beyaz Etiket</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="featureTextWhite"
                                            name="featureTextWhite"
                                            placeholder="Beyaz Etiket"
                                            value={formik.values.featureTextWhite}
                                            onChange={(e) => { setFieldValue('featureTextWhite', e.target.value); setNewData(prevData => prevData.map(item => item.lang === selectedLanguage ? { ...item, featureTextWhite: e.target.value } : item)); }}
                                            error={formik.touched.featureTextWhite && Boolean(formik.errors.featureTextWhite)}
                                            helperText={formik.touched.featureTextWhite && formik.errors.featureTextWhite}
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


