/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText, Tooltip, IconButton } from '@mui/material';

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
import { GetPhotosWebPages, PhotoPost, Upload, UploadWebPhoto } from 'services/photoService';
import Loader from 'components/Loader';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import { Trash } from 'iconsax-react';
import WebsitePhotoDeleteModal from './WebsitePhotoDeleteModal';


const getInitialValues = () => {
    const newDistanceRuler = {
        files: null,
        villa: {},
        title: ''
    };
    return newDistanceRuler;
};

export default function FormWebsitePhotoAdd({ closeModal, websiteId, setIsEdit, setLoading }) {
    const [photos, setPhotos] = useState([])
    const [uploadLoading, setUploadLoading] = useState(true);
    const [deletePhotoModal, setDeletePhotoModal] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [isDeleted, setIsDeleted] = useState(false)

    useEffect(() => {
        GetPhotosWebPages(websiteId).then((res) => {
            setPhotos(res?.data)
            setUploadLoading(false)
        })
    }, [])

    useEffect(() => {
        if (isDeleted) {
            setIsDeleted(false)
            setUploadLoading(true)
            GetPhotosWebPages(websiteId).then((res) => {
                setPhotos(res?.data)
                setUploadLoading(false)
            })
        }
    }, [isDeleted])



    const params = useParams();


    const validationSchema = Yup.object({
        files: Yup.mixed().required('Lütfen Resim Seçiniz.'),
        title: Yup.string().required('Başlık zorunlu')
    });

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let fd = new FormData();
                formik.values.files.forEach((file) => { fd.append('FormFile', file); });
                fd.append('Title', values.title)
                fd.append('WebPageId', websiteId)
                setUploadLoading(true);

                await UploadWebPhoto(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Resim Eklendi',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                    }
                    setSubmitting(false);
                    setIsEdit(true);
                    setLoading(true);
                    setUploadLoading(false)
                    closeModal();
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
            <WebsitePhotoDeleteModal setIsDeleted={setIsDeleted} id={deleteId} open={deletePhotoModal} handleClose={() => setDeletePhotoModal(false)} />
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Resim Yükle</DialogTitle>
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
                                <Grid item xs={12}>
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
                                {
                                    photos.length > 0 &&
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="villa-title">Yüklü Resimler</InputLabel>
                                            <Divider />
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                {
                                                    photos && photos.map((itm, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <div>
                                                                    <img style={{ maxWidth: '272px', width: '100%' }} src={`${import.meta.env.VITE_APP_BACKEND_URL}/Uploads/WebPhotos/k_${itm?.image}`} alt="" />
                                                                </div>
                                                                <Tooltip title="Delete">
                                                                    <IconButton
                                                                        color="error"
                                                                        onClick={(e) => {
                                                                            setDeletePhotoModal(true)
                                                                            setDeleteId(itm?.id)
                                                                        }}
                                                                    >
                                                                        <Trash />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </Stack>
                                    </Grid>
                                }
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


