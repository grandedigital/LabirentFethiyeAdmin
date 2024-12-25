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
import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
import { PhotoPost, Upload, UploadSingle } from 'services/photoService';
import Loader from 'components/Loader';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';


const getInitialValues = () => {
    const newDistanceRuler = {
        files: null,
        villa: {},
        videoLink: '',
        title: ''
    };
    return newDistanceRuler;
};

export default function FormVideoAdd({ closeModal, setIsEdit, setLoading, apart = false, room = false, villa = false }) {
    const params = useParams();

    const [uploadLoading, setUploadLoading] = useState(false);

    const validationSchema = Yup.object({
        files: Yup.mixed().required('Lütfen Resim Seçiniz.'),
        title: Yup.string().required('Başlık yazınız.'),
        videoLink: Yup.string().required('Video linki zorunlu')
    });

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let fd = new FormData();
                formik.values.files.forEach((file) => { fd.append('FormFile', file); });
                if (apart) {
                    fd.append('HotelId', params.id)
                } else if (room) {
                    fd.append('RoomId', params.id)
                } else if (villa) {
                    fd.append('VillaId', params.id)
                }
                fd.append('Title', values.title)
                fd.append('VideoLink', values.videoLink)

                setUploadLoading(true);

                await UploadSingle(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Video Eklendi',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                        setSubmitting(false);
                        setIsEdit(true);
                        setLoading(true);
                        setUploadLoading(false)
                        closeModal();
                    }
                });


            } catch (error) {
                // console.error(error);
            }
        }
    });

    const { values, handleSubmit, setFieldValue, touched, errors, isSubmitting, getFieldProps } = formik;
    const [list, setList] = useState(false);

    if (uploadLoading) return (<Loader open={uploadLoading} />)

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Video Yükle</DialogTitle>
                        <Divider />

                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1.5} alignItems="center">
                                        <SingleFileUpload
                                            showList={list}
                                            setFieldValue={setFieldValue}
                                            files={values.files}
                                            error={touched.files && !!errors.files}
                                        />
                                    </Stack>
                                    {touched.files && errors.files && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.files}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="villa-title">Başlık</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="villa-title"
                                            placeholder="Başlık"
                                            {...getFieldProps('title')}
                                            error={Boolean(touched.title && errors.title)}
                                            helperText={touched.title && errors.title}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="villa-videoLink">Video Linki</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="villa-videoLink"
                                            placeholder="Video Linki"
                                            {...getFieldProps('videoLink')}
                                            error={Boolean(touched.videoLink && errors.videoLink)}
                                            helperText={touched.videoLink && errors.videoLink}
                                        />
                                    </Stack>
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


