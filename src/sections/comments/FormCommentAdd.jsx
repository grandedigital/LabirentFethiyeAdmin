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

import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { openSnackbar } from 'api/snackbar';


// assets

import { useNavigate, useParams } from 'react-router';
import Loader from 'components/Loader';
import ReactQuill from 'react-quill';
import { CreateCategory } from 'services/categoryServices';
import useUser from 'hooks/useUser';
import { CreateComment } from 'services/commentServices';


// CONSTANT
const getInitialValues = () => {
    const newReservation = {
        title: '',
        longDescription: '',
        languageCode: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
        rating: 5
    };


    return newReservation;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormCommentAdd({ closeModal, setIsAdded, villa = false, apart = false }) {
    const user = useUser()
    const theme = useTheme();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        setLoading(false);
    }, []);

    const ReservationSchema = Yup.object().shape({
        title: Yup.string().required('Başlık zorunlu'),
        longDescription: Yup.string().required('Yorum zorunlu'),
        rating: Yup.number().required('Yorum zorunlu').min('1', "Min 1").max('5', 'Max 5')
        // languageCode: Yup.string().required('dil zorunlu'),
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

                if (villa) {
                    fd.append('VillaId', params.id)
                } else if (apart) {
                    fd.append('HotelId', params.id)
                }

                fd.append('Name', formik.values.name)
                fd.append('SurName', formik.values.surname)
                fd.append('Title', formik.values.title)
                fd.append('Phone', formik.values.phone)
                fd.append('Email', formik.values.email)
                fd.append('Rating', formik.values.rating.toString().replace('.', ','))
                fd.append('CommentText', formik.values.longDescription)


                await CreateComment(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Yorum eklendi.',
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

    if (loading) return (<Loader open={loading} />)

    const handleChangeEditor = (value) => {
        setFieldValue('longDescription', value)
    };

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Yorum Ekle</DialogTitle>
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
                                    <ReactQuill style={{ height: '250px', marginBottom: '40px' }} onChange={handleChangeEditor} />
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


