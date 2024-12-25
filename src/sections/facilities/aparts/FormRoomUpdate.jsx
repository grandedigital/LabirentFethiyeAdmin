/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText, Typography, Switch } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { useNavigate, useParams } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { GetRoom, RoomChangeState } from 'services/roomServices';
import Loader from 'components/Loader';
import ReactQuill from 'react-quill';


const getInitialValues = ({ data }) => {
    if (data.length !== 0) {
        const newPriceDate = {
            // name: data?.roomDetails[0]?.name || "",
            waterMaterNumber: data?.waterMaterNumber || "",
            electricityMeterNumber: data?.electricityMeterNumber || "",
            internetMeterNumber: data?.internetMeterNumber || "",
            wifiPassword: data?.wifiPassword || "",
            person: data?.person || 0,
            bath: data?.bath || 0,
            room: data?.rooms || 0,
            // descriptionShort: data?.roomDetails[0]?.descriptionShort || "",
            // descriptionLong: data?.roomDetails[0]?.descriptionLong || "",
            // featureTextRed: data?.roomDetails[0]?.featureTextRed || "",
            // featureTextBlue: data?.roomDetails[0]?.featureTextBlue || "",
            // featureTextWhite: data?.roomDetails[0]?.featureTextWhite || "",
            metaTitle: data?.metaTitle || '',
            metaDescription: data?.metaDescription || '',
            onlineReservation: data?.onlineReservation || false,
            slug: '',
        };
        return newPriceDate;
    }
};

export default function FormRoomUpdate({ closeModal }) {
    const params = useParams();
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        GetRoom(params?.id).then((res) => {
            if (res?.statusCode !== 200) {
                navigate('/404')
            } else if (res?.data === null) {
                navigate('/404')
            }
            setData(res?.data)
            setLoading(false)
        })
    }, [])


    const validationSchema = Yup.object({
        // name: Yup.string().required('Başlık Yazmak Zorunludur'),
        room: Yup.number().required('Oda Zorunludur').min(1, 'En az 1 yazınız'),
        bath: Yup.number().required('Banyo Zorunludur').min(1, 'En az 1 yazınız'),
        person: Yup.number().required('Kişi Sayısı Zorunludur').min(1, 'En az 1 yazınız'),
    });

    const formik = useFormik({
        initialValues: getInitialValues({ data: data }),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fd = new FormData()
                fd.append('Id', params.id)
                // fd.append('Name', values.name)
                // fd.append('LanguageCode', 'tr')
                fd.append('Bath', values.bath)
                fd.append('Person', values.person)
                fd.append('Rooms', values.room)
                fd.append('WifiPassword', values.wifiPassword)
                fd.append('InternetMeterNumber', values.internetMeterNumber)
                fd.append('ElectricityMeterNumber', values.electricityMeterNumber)
                fd.append('WaterMaterNumber', values.waterMaterNumber)
                // fd.append('FeatureTextBlue', values.featureTextBlue)
                // fd.append('FeatureTextRed', values.featureTextRed)
                // fd.append('FeatureTextWhite', values.featureTextWhite)
                // fd.append('DescriptionShort', values.descriptionShort)
                // fd.append('DescriptionLong', values.descriptionLong)
                fd.append('MetaTitle', values.metaTitle)
                fd.append('MetaDescription', values.metaDescription)
                fd.append('OnlineReservation', values.onlineReservation)

                await RoomChangeState(fd).then((res) => {
                    if (res?.status === 400) {
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
                    else {
                        openSnackbar({
                            open: true,
                            message: 'Oda Güncellendi',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                    }
                    if (location.pathname === `/facilities/aparts/room-show/summary/${params?.id}`) {
                        location.reload()
                    } else {
                        navigate(`/facilities/aparts/room-show/summary/${params?.id}`)
                    }
                    setSubmitting(false);
                })


            } catch (error) {
                // console.error(error);
            }
        }
    });

    const { handleSubmit, isSubmitting, setFieldValue, getFieldProps, touched, errors, handleChange } = formik;

    const handleChangeEditor = (value) => {
        setFieldValue('descriptionLong', value)
    };

    if (loading) return <Loader open={loading} />

    if (formik?.values) {
        return (
            <>
                <FormikProvider value={formik}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            {/* <DialogTitle>Oda Düzenle</DialogTitle> */}
                            <DialogContent sx={{ p: 2.5 }}>
                                <Grid item xs={12} md={12}>
                                    <Grid container spacing={3}>
                                        {/* <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="name">Oda İsmi</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="name"
                                                    name="name"
                                                    placeholder="Oda İsmi"
                                                    value={formik?.values?.name}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                                    helperText={formik.touched.name && formik.errors.name}
                                                />
                                            </Stack>
                                        </Grid> */}
                                        <Grid item xs={12} lg={4}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="person">Kişi Sayısı</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="person"
                                                    name="person"
                                                    placeholder="Kişi Sayısı"
                                                    value={formik?.values?.person}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.person && Boolean(formik.errors.person)}
                                                    helperText={formik.touched.person && formik.errors.person}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="room">Oda Sayısı</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="room"
                                                    name="room"
                                                    placeholder="Oda Sayısı"
                                                    value={formik?.values?.room}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.room && Boolean(formik.errors.room)}
                                                    helperText={formik.touched.room && formik.errors.room}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="bath">Banyo Sayısı</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="bath"
                                                    name="bath"
                                                    placeholder="Banyo Sayısı"
                                                    value={formik?.values?.bath}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.bath && Boolean(formik.errors.bath)}
                                                    helperText={formik.touched.bath && formik.errors.bath}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="wifiPassword">Wifi Şifresi</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="wifiPassword"
                                                    name="wifiPassword"
                                                    placeholder="Wifi Şifresi"
                                                    value={formik?.values?.wifiPassword}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.wifiPassword && Boolean(formik.errors.wifiPassword)}
                                                    helperText={formik.touched.wifiPassword && formik.errors.wifiPassword}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="waterMaterNumber">Su Faturası Numarası</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="waterMaterNumber"
                                                    name="waterMaterNumber"
                                                    placeholder="Su Faturası Numarası"
                                                    value={formik?.values?.waterMaterNumber}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.waterMaterNumber && Boolean(formik.errors.waterMaterNumber)}
                                                    helperText={formik.touched.waterMaterNumber && formik.errors.waterMaterNumber}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="electricityMeterNumber">Elektrik Fatura Numarası</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="electricityMeterNumber"
                                                    name="electricityMeterNumber"
                                                    placeholder="Elektrik Fatura Numarası"
                                                    value={formik?.values?.electricityMeterNumber}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.electricityMeterNumber && Boolean(formik.errors.electricityMeterNumber)}
                                                    helperText={formik.touched.electricityMeterNumber && formik.errors.electricityMeterNumber}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="internetMeterNumber">İnternet Fatura Numarası</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="internetMeterNumber"
                                                    name="internetMeterNumber"
                                                    placeholder="İnternet Fatura Numarası"
                                                    value={formik?.values?.internetMeterNumber}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.internetMeterNumber && Boolean(formik.errors.internetMeterNumber)}
                                                    helperText={formik.touched.internetMeterNumber && formik.errors.internetMeterNumber}
                                                />
                                            </Stack>
                                        </Grid>
                                        {/* <Grid item xs={12} lg={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="featureTextRed">Kırmızı Etiket</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="featureTextRed"
                                                name="featureTextRed"
                                                placeholder="Kırmızı Etiket"
                                                value={formik?.values?.featureTextRed}
                                                onChange={formik.handleChange}
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
                                                value={formik?.values?.featureTextBlue}
                                                onChange={formik.handleChange}
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
                                                value={formik?.values?.featureTextWhite}
                                                onChange={formik.handleChange}
                                                error={formik.touched.featureTextWhite && Boolean(formik.errors.featureTextWhite)}
                                                helperText={formik.touched.featureTextWhite && formik.errors.featureTextWhite}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="descriptionShort">Kısa Açıklama</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="descriptionShort"
                                            multiline
                                            rows={5}
                                            placeholder="Kısa Açıklama"
                                            {...getFieldProps('descriptionShort')}
                                            error={Boolean(touched.descriptionShort && errors.descriptionShort)}
                                            helperText={touched.descriptionShort && errors.descriptionShort}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="longDescription">Genel Açıklama</InputLabel>
                                        <ReactQuill style={{ height: '400px', marginBottom: '40px' }} value={formik?.values?.descriptionLong} onChange={handleChangeEditor} />
                                    </Grid> */}

                                        <Grid item xs={12} lg={6}>
                                            <InputLabel htmlFor="villa-metaTitle">Seo Meta Title</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="villa-metaTitle"
                                                placeholder="Meta Başlık"
                                                {...getFieldProps('metaTitle')}
                                                error={Boolean(touched.metaTitle && errors.metaTitle)}
                                                helperText={touched.metaTitle && errors.metaTitle}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <InputLabel htmlFor="villa-metaDescription">Seo Meta Description</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="villa-metaDescription"
                                                placeholder="Meta Açıklama"
                                                {...getFieldProps('metaDescription')}
                                                error={Boolean(touched.metaDescription && errors.metaDescription)}
                                                helperText={touched.metaDescription && errors.metaDescription}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">Online Reservation Status</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Tesisinize Online (Anlık) Rezervasyon Kabul Ediyormusunuz?
                                            </Typography>
                                            <FormControlLabel checked={formik?.values?.onlineReservation || false} onChange={(e) => setFieldValue('onlineReservation', e.target.checked)} control={<Switch sx={{ mt: 0 }} />} label="" labelPlacement="start" />
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
}


