import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import { Box, Chip, Grid, Stack, Button, Switch, Divider, TextField, InputLabel, Typography, Autocomplete, DialogContent, DialogActions, FormControlLabel, FormControl, RadioGroup, FormHelperText, Radio } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { openSnackbar } from 'api/snackbar';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router';

// assets
import { CloseCircle } from 'iconsax-react';
import 'react-quill/dist/quill.snow.css';
import { ApartChangeState, GetApart } from 'services/apartServices';
import { getTowns } from 'services/townServices';

// CONSTANT
const getInitialValues = (villa) => {
  if (villa.length !== 0) {
    const newVilla = {
      slug: villa?.slug || '',
      name: villa?.hotelDetails[0]?.name || '',
      // featureTextRed: villa?.hotelDetails[0]?.featureTextRed || '',
      // featureTextBlue: villa?.hotelDetails[0]?.featureTextBlue || '',
      // featureTextWhite: villa?.hotelDetails[0]?.featureTextWhite || '',
      wifiPassword: villa?.wifiPassword || '',
      waterMaterNumber: villa?.waterMaterNumber || '',
      electricityMeterNumber: villa?.electricityMeterNumber || '',
      internetMeterNumber: villa?.internetMeterNumber || '',
      googleMap: villa?.googleMap || '',
      region: villa?.townId || '',
      // descriptionShort: villa?.hotelDetails[0]?.descriptionShort || '',
      // descriptionLong: villa?.hotelDetails[0]?.descriptionLong || '',
      metaTitle: villa?.metaTitle || '',
      metaDescription: villa?.metaDescription || '',
      room: villa?.room || 0,
      bath: villa?.bath || 0,
      person: villa?.person || 0,
      priceType: villa?.priceType || 0
    };
    return newVilla;
  }
};

export default function FormApartUpdate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [villa, setVilla] = useState([])
  const [towns, setTowns] = useState([])
  const params = useParams()

  useEffect(() => {
    async function fetchData() {
      await GetApart(params?.id).then((res) => {
        setVilla(res?.data)
        if (res?.statusCode !== 200) {
          navigate('/404')
        } else if (res?.data === null) {
          navigate('/404')
        }
      })
      await getTowns().then((res) => {
        setTowns(res?.data)
      })
      setLoading(false);
    }
    fetchData()
  }, []);


  const VillaSchema = Yup.object().shape({
    // name: Yup.string().max(255).required('Lütfen villa adı yazınız..'),
    region: Yup.string().max(255).required('Lütfen bölge yazınız..'),
    room: Yup.number().required('Bu alan zorunlu').min(1, 'Min 1'),
    bath: Yup.number().required('Bu alan zorunlu').min(1, 'Min 1'),
    person: Yup.number().required('Bu alan zorunlu').min(1, 'Min 1'),
    priceType: Yup.number().required('Fiyat türü zorunlu').min(1, 'Fiyat türü zorunlu'),
  });

  const formik = useFormik({
    initialValues: getInitialValues(villa),
    validationSchema: VillaSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {


        const fd = new FormData()

        fd.append('Id', params.id)
        fd.append('TownId', formik.values.region)
        // fd.append('Name', formik.values.name)
        // fd.append('DescriptionShort', formik.values.descriptionShort)
        // fd.append('DescriptionLong', formik.values.descriptionLong)
        fd.append('Room', formik.values.room)
        fd.append('GoogleMap', formik.values.googleMap)
        fd.append('MetaTitle', formik.values.metaTitle)
        fd.append('MetaDescription', formik.values.metaDescription)
        // fd.append('Slug', formik.values.slug)
        fd.append('LanguageCode', 'tr')
        fd.append('Bath', formik.values.bath)
        fd.append('Person', formik.values.person)
        // fd.append('FeatureTextWhite', formik.values.featureTextWhite)
        // fd.append('FeatureTextRed', formik.values.featureTextRed)
        // fd.append('FeatureTextBlue', formik.values.featureTextBlue)
        fd.append('WifiPassword', formik.values.wifiPassword)
        fd.append('InternetMeterNumber', formik.values.internetMeterNumber)
        fd.append('ElectricityMeterNumber', formik.values.electricityMeterNumber)
        fd.append('WaterMaterNumber', formik.values.waterMaterNumber)
        fd.append('PriceType', formik.values.priceType)

        await ApartChangeState(fd).then((res) => {
          if (res?.status === 400) {
            openSnackbar({
              open: true,
              message: res?.errors[0]?.description ? res?.errors[0]?.description : 'Hata',
              variant: 'alert',

              alert: {
                color: 'error'
              }
            });
          } else {
            openSnackbar({
              open: true,
              message: 'Apart Güncellendi.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            navigate(`/facilities/aparts/apart-show/summary/${res?.data?.id}`);
          }
        })
        setSubmitting(false)
      } catch (error) {
        // console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values } = formik;

  const handleChangeEditor = (value) => {
    if (formik?.values?.descriptionLong) {
      setFieldValue('descriptionLong', value)
    }
  };

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );



  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent sx={{ p: 2.5 }}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="priceType">Fiyat Türü</InputLabel>
                      <FormControl>
                        <RadioGroup row aria-label="priceType" value={formik.values.priceType} onChange={(e) => setFieldValue('priceType', parseInt(e.target.value))} name="priceType" id="priceType">
                          <FormControlLabel value={1} control={<Radio />} label="TL" />
                          <FormControlLabel value={2} control={<Radio />} label="USD" />
                          <FormControlLabel value={3} control={<Radio />} label="EUR" />
                          <FormControlLabel value={4} control={<Radio />} label="GBP" />
                        </RadioGroup>
                      </FormControl>
                      {formik.errors.priceType && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {formik.errors.priceType}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="villa-name">Villa Adı</InputLabel>
                      <TextField
                        fullWidth
                        id="villa-name"
                        placeholder="Villa Adı"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Stack>
                  </Grid> */}
                  <Grid item xs={12}>
                    <InputLabel sx={{ marginBottom: 1.5 }}>Bölge</InputLabel>
                    <Autocomplete
                      fullWidth
                      id="basic-autocomplete-label"
                      disableClearable
                      options={towns}
                      getOptionLabel={(option) => `${option?.name}`}
                      isOptionEqualToValue={(option, value) => option?.id === value?.id}
                      value={towns.find((item) => item.id === formik?.values?.region) || null}
                      onChange={(e, value) => setFieldValue('region', value?.id)}
                      renderInput={(params) => <TextField {...params} helperText={errors.region} error={Boolean(errors.region)} label="Bölge" />}
                    />
                  </Grid>




                  {/* <Grid item xs={4}>
                    <InputLabel htmlFor="villa-featureTextRed">Kırmızı Etiket</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-featureTextRed"
                      placeholder="Kırmızı Etiket"
                      {...getFieldProps('featureTextRed')}
                      error={Boolean(touched.featureTextRed && errors.featureTextRed)}
                      helperText={touched.featureTextRed && errors.featureTextRed}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-featureTextBlue">Mavi Etiket</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-featureTextBlue"
                      placeholder="Mavi Etiket"
                      {...getFieldProps('featureTextBlue')}
                      error={Boolean(touched.featureTextBlue && errors.featureTextBlue)}
                      helperText={touched.featureTextBlue && errors.featureTextBlue}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-featureTextWhite">Beyaz Etiket</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-featureTextWhite"
                      placeholder="Beyaz Etiket"
                      {...getFieldProps('featureTextWhite')}
                      error={Boolean(touched.featureTextWhite && errors.featureTextWhite)}
                      helperText={touched.featureTextWhite && errors.featureTextWhite}
                    />
                  </Grid> */}

                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-wifiPassword">Wifi Şifresi</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-wifiPassword"
                      placeholder="Wifi Şifresi"
                      {...getFieldProps('wifiPassword')}
                      error={Boolean(touched.wifiPassword && errors.wifiPassword)}
                      helperText={touched.wifiPassword && errors.wifiPassword}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-waterMaterNumber">Su Fatura Numarası</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-waterMaterNumber"
                      placeholder="Su Fatura Numarası"
                      {...getFieldProps('waterMaterNumber')}
                      error={Boolean(touched.waterMaterNumber && errors.waterMaterNumber)}
                      helperText={touched.waterMaterNumber && errors.waterMaterNumber}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-electricityMeterNumber">Elektrik Fatura Numarası</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-electricityMeterNumber"
                      placeholder="Elektrik Fatura Numarası"
                      {...getFieldProps('electricityMeterNumber')}
                      error={Boolean(touched.electricityMeterNumber && errors.electricityMeterNumber)}
                      helperText={touched.electricityMeterNumber && errors.electricityMeterNumber}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-internetMeterNumber">İnternet Fatura Numarası</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-internetMeterNumber"
                      placeholder="İnternet Fatura Numarası"
                      {...getFieldProps('internetMeterNumber')}
                      error={Boolean(touched.internetMeterNumber && errors.internetMeterNumber)}
                      helperText={touched.internetMeterNumber && errors.internetMeterNumber}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-room">Oda Sayısı</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-room"
                      placeholder="Oda sayısı"
                      {...getFieldProps('room')}
                      error={Boolean(touched.room && errors.room)}
                      helperText={touched.room && errors.room}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-bath">Banyo Sayısı</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-bath"
                      placeholder="Banyo sayısı"
                      {...getFieldProps('bath')}
                      error={Boolean(touched.bath && errors.bath)}
                      helperText={touched.bath && errors.bath}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-person">Kişi Sayısı</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-person"
                      placeholder="Kişi sayısı"
                      {...getFieldProps('person')}
                      error={Boolean(touched.person && errors.person)}
                      helperText={touched.person && errors.person}
                    />
                  </Grid>

                  {/* <Grid item xs={12}>
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



                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
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

                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-googleMap">Google Map</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-googleMap"
                      placeholder="Google Map"
                      {...getFieldProps('googleMap')}
                      error={Boolean(touched.googleMap && errors.googleMap)}
                      helperText={touched.googleMap && errors.googleMap}
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <Typography variant="subtitle1">Online Reservation Status</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tesisinize Online (Anlık) Rezervasyon Kabul Ediyormusunuz?
                    </Typography>
                    <FormControlLabel control={<Switch sx={{ mt: 0 }} />} label="" checked={formik?.values?.onlineReservation} labelPlacement="start" onChange={() => { setFieldValue('onlineReservation', !getFieldProps('onlineReservation').value) }} />
                  </Grid> */}
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="end" alignItems="end">
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="end">
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      KAYDET
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );

}