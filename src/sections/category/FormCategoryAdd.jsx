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


// CONSTANT
const getInitialValues = () => {
    const newReservation = {
        title: '',
        shortDescription: '',
        longDescription: '',
        languageCode: '',
        icon: '',
        metaDesc: '',
        metaTitle: ''
    };


    return newReservation;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormCategoryAdd({ closeModal, setIsAdded }) {
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
        icon: Yup.string().required('icon zorunlu'),
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

                fd.append('Icon', formik.values.icon)
                fd.append('Name', formik.values.title)
                fd.append('LanguageCode', user?.config?.companyDefaultLanguage || 'tr')
                fd.append('DescriptionShort', formik.values.shortDescription)
                fd.append('DescriptionLong', formik.values.longDescription)
                fd.append('MetaTitle', formik.values.metaTitle)
                fd.append('MetaDescription', formik.values.metaDesc)

                await CreateCategory(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Kategori eklendi.',
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
                        <DialogTitle>Kategori Ekle</DialogTitle>
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
                                <Grid item xs={12}>
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
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel style={{ marginBottom: '10px' }} htmlFor="longDescription">Genel Açıklama</InputLabel>
                                    <ReactQuill style={{ height: '250px', marginBottom: '40px' }} onChange={handleChangeEditor} />
                                </Grid>
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
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="icon">Icon</InputLabel>
                                        <FormControl>
                                            <RadioGroup row aria-label="icon" value={formik.values.icon} onChange={formik.handleChange} name="icon" id="icon">
                                                <FormControlLabel value="icon-1" control={<Radio />} label="Yağmurlu" />
                                                <FormControlLabel value="icon-2" control={<Radio />} label="Parçalı Bulut" />
                                                <FormControlLabel value="icon-3" control={<Radio />} label="Güneş" />
                                            </RadioGroup>
                                        </FormControl>
                                        {formik.errors.icon && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.icon}
                                            </FormHelperText>
                                        )}
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


