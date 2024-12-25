// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { PriceTableUpdate } from 'services/priceTableServices';
import { openSnackbar } from 'api/snackbar';


const getInitialValues = (selectedItem) => {
    const newPriceDate = {
        price: selectedItem?.price || 0,
        icon: selectedItem?.icon || ''
    };
    return newPriceDate;
};

export default function FormPriceTableGeneralUpdate({ closeModal, setIsEdit, apart = false, selectedItem }) {
    const validationSchema = Yup.object({
        icon: Yup.string().required('Icon Zorunludur'),
        price: Yup.number().required('Fiyat Zorunludur').min(1, 'min 1')
    });

    const formik = useFormik({
        initialValues: getInitialValues(selectedItem),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fdDetail = new FormData()
                fdDetail.append('Price', values.price)
                fdDetail.append('Id', selectedItem?.id)
                fdDetail.append('Icon', values?.icon)

                await PriceTableUpdate(fdDetail).then((res) => {
                    setIsEdit(true);
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Fiyat Tablosu Düzenlendi',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                    }
                    else {
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
                    setSubmitting(false);
                    closeModal();
                })

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
                        <DialogTitle>Fiyat Tablosu Düzenle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid item xs={12} md={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="price">Fiyat *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="price"
                                                name="price"
                                                placeholder="Fiyat Yazınız.."
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                                error={formik.touched.price && Boolean(formik.errors.price)}
                                                helperText={formik.touched.price && formik.errors.price}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="icon">Icon *</InputLabel>
                                            <FormControl>
                                                <RadioGroup row aria-label="icon" value={formik.values.icon} onChange={formik.handleChange} name="icon" id="icon">
                                                    <FormControlLabel value="cloud-drizzle" control={<Radio />} label="Yağmurlu" />
                                                    <FormControlLabel value="cloud-notif" control={<Radio />} label="Parçalı Bulut" />
                                                    <FormControlLabel value="sun" control={<Radio />} label="Güneş" />
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


