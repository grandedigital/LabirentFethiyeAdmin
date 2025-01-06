/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';

// material ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, FormControlLabel, RadioGroup, Radio, FormHelperText } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

import { openSnackbar } from 'api/snackbar';


// assets

import { useNavigate, useParams } from 'react-router';
import Loader from 'components/Loader';
import ReactQuill from 'react-quill';
import useUser from 'hooks/useUser';
import { CreateComment, GetCommentById, UpdateComment } from 'services/commentServices';


// CONSTANT
const getInitialValues = ({ data }) => {
    const newReservation = {
        title: data?.title || '',
        longDescription: data?.commentText || '',
        languageCode: '',
        name: data?.name || '',
        surname: data?.surName || '',
        email: data?.email || '',
        phone: data?.phone || '',
        rating: data?.rating || '',
        generalStatusType: data?.generalStatusType || 1,
    };


    return newReservation;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormCommentUpdate({ closeModal, setIsAdded, selectId }) {
    const user = useUser()
    const theme = useTheme();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [data, setData] = useState('')


    useEffect(() => {
        GetCommentById(selectId).then((res) => {
            setData(res?.data)
            setLoading(false);
        })
    }, []);

    const ReservationSchema = Yup.object().shape({
        longDescription: Yup.string().required('Yorum zorunlu'),
        name: Yup.string().required('İsim zorunlu'),
        surname: Yup.string().required('Soyisim zorunlu'),
        rating: Yup.number().required('Yorum zorunlu').min('1', "Min 1").max('5', 'Max 5')
    });

    const [openAlert, setOpenAlert] = useState(false);

    const formik = useFormik({
        initialValues: getInitialValues({ data: data }),
        validationSchema: ReservationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setLoading(true);
                const fd = new FormData()

                fd.append('Id', selectId)
                fd.append('Title', formik.values.title)
                fd.append('Name', formik.values.name)
                fd.append('SurName', formik.values.surname)
                fd.append('CommentText', formik.values.longDescription)
                fd.append('GeneralStatusType', formik.values.generalStatusType)

                await UpdateComment(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Yorum düzenlendi.',
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


    if (loading) return (<Loader open={loading} />)

    const handleChangeEditor = (value) => {
        setFieldValue('longDescription', value)
    };

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Yorum Düzenle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid spacing={3} container >
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
                                        <InputLabel htmlFor="generalStatusType">Durum</InputLabel>
                                        <FormControl>
                                            <RadioGroup row aria-label="generalStatusType" value={formik.values.generalStatusType} onChange={(e, value) => setFieldValue('generalStatusType', parseInt(value))} name="generalStatusType" id="generalStatusType">
                                                <FormControlLabel value={1} control={<Radio />} label="Aktif" />
                                                <FormControlLabel value={2} control={<Radio />} label="Pasif" />
                                                <FormControlLabel value={3} control={<Radio />} label="Silinmiş" />
                                            </RadioGroup>
                                        </FormControl>
                                        {formik.errors.generalStatusType && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.generalStatusType}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} lg={6}>
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
                                <Grid item xs={12} lg={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="rating">Yıldız</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="rating"
                                            name="rating"
                                            placeholder="Başlık"
                                            disabled
                                            value={formik.values.rating}
                                            onChange={formik.handleChange}
                                            type='number'
                                            error={formik.touched.rating && Boolean(formik.errors.rating)}
                                            helperText={formik.touched.rating && formik.errors.rating}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">İsim</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="name"
                                            name="name"
                                            placeholder="İsim"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="surname">Soyisim</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="surname"
                                            name="surname"
                                            placeholder="Soyisim"
                                            value={formik.values.surname}
                                            onChange={formik.handleChange}
                                            error={formik.touched.surname && Boolean(formik.errors.surname)}
                                            helperText={formik.touched.surname && formik.errors.surname}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            name="email"
                                            disabled
                                            placeholder="Email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="phone">Telefon No</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="phone"
                                            name="phone"
                                            disabled
                                            placeholder="Telefon No"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                                            helperText={formik.touched.phone && formik.errors.phone}
                                        />
                                    </Stack>
                                </Grid>
                                {/* <Grid item xs={12}>
                                    <InputLabel htmlFor="shortDescription">Kısa Açıklama</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="shortDescription"
                                        multiline
                                        rows={5}
                                        placeholder="Kısa Açıklama"
                                        {...getFieldProps('shortDescription')}
                                        error={Boolean(touched.shortDescription && errors.shortDescription)}
                                        helperText={touched.shortDescription && errors.shortDescription}
                                    />
                                </Grid> */}
                                <Grid item xs={12}>
                                    <InputLabel style={{ marginBottom: '10px' }} htmlFor="longDescription">Yorum</InputLabel>
                                    <ReactQuill style={{ height: '250px', marginBottom: '40px' }} value={formik.values.longDescription} onChange={handleChangeEditor} />
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


