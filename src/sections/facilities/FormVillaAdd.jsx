import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import { Box, Chip, Grid, Stack, Button, Switch, Divider, TextField, InputLabel, Typography, Autocomplete, DialogContent, DialogActions, FormControlLabel, FormControl, RadioGroup, Radio, FormHelperText } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { openSnackbar } from 'api/snackbar';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router';

// assets
import { CloseCircle } from 'iconsax-react';
import { Categories } from 'services/categoryServices';
import 'react-quill/dist/quill.snow.css';
import { VillaAdd, VillaCategoryAsign } from 'services/villaServices';
import { getTowns } from 'services/townServices';
import useConfig from 'hooks/useConfig';
import { GetAllUsers } from 'services/userServices';

// CONSTANT
const getInitialValues = () => {
  const newVilla = {
    slug: '',
    name: '',
    room: 0,
    bath: 0,
    person: 0,
    featureTextRed: '',
    featureTextBlue: '',
    featureTextWhite: '',
    wifiPassword: '',
    waterMaterNumber: '',
    electricityMeterNumber: '',
    internetMeterNumber: '',
    googleMap: '',
    region: '',
    descriptionShort: '',
    descriptionLong: '',
    onlineReservation: false,
    categories: [],
    metaTitle: '',
    metaDescription: '',
    isRent: true,
    isSale: false,
    priceType: 0,
    villaOwner: '',
    villaOwnerPhone: '',
    villaNumber: '',
    personel: ''
  };
  return newVilla;
};

export default function FormVillaAdd() {
  const user = useConfig()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [towns, setTowns] = useState([])
  const [personels, setPersonels] = useState([])

  useEffect(() => {
    Categories().then((res) => setCategories(res));
    getTowns().then((res) => {
      setTowns(res?.data)
    })
    GetAllUsers().then((res) => {
      setPersonels(res?.data)
    })
    setLoading(false);
  }, []);

  const VillaSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Lütfen villa adı yazınız..'),
    room: Yup.number().moreThan(0, "Oda sayısı 0'dan büyük olmalıdır").required('Oda Sayısı zorunludur'),
    bath: Yup.number().moreThan(0, "Banyo sayısı 0'dan büyük olmalıdır").required('Banyo Sayısı zorunludur'),
    // categories: Yup.array().of(Yup.string()).min(1, 'En az bir adet kategori zorunludur.').required('En az bir adet kategori zorunludur.'),
    person: Yup.number().moreThan(0, "Kişi sayısı 0'dan büyük olmalıdır").required('Kişi Sayısı zorunludur'),
    region: Yup.string().max(255).required('Lütfen bölge seçiniz..'),
    onlineReservation: Yup.boolean().required('Rezervasyon seçeneği zorunludur'),
    priceType: Yup.number().moreThan(0, "Fiyat türü zorunlu").required('Fiyat türü zorunlu'),
    personel: Yup.string().max(255).required('Personel seçimi zorunlu..'),
    villaNumber: Yup.string().max(255).required('Villa numarası zorunlu..'),
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: VillaSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {

        values.slug = values.name
          .toString()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-');

        const fd = new FormData()

        console.log(values);
        

        fd.append('Name', values.name)
        fd.append('LanguageCode', user?.config?.companyDefaultLanguage || 'tr')
        fd.append('DescriptionShort', values.descriptionShort)
        fd.append('DescriptionLong', values.descriptionLong)
        fd.append('Room', values.room)
        fd.append('Bath', values.bath)
        fd.append('Person', values.person)
        fd.append('OnlineReservation', values.onlineReservation)
        fd.append('GoogleMap', values.googleMap)
        fd.append('MetaTitle', values.metaTitle)
        fd.append('MetaDescription', values.metaDescription)
        // fd.append('Slug', values.slug)
        fd.append('TownId', values.region)
        fd.append('FeatureTextBlue', values.featureTextBlue)
        fd.append('FeatureTextRed', values.featureTextRed)
        fd.append('FeatureTextWhite', values.featureTextWhite)
        fd.append('WifiPassword', values.wifiPassword)
        fd.append('InternetMeterNumber', values.internetMeterNumber)
        fd.append('ElectricityMeterNumber', values.electricityMeterNumber)
        fd.append('WaterMaterNumber', values.waterMaterNumber)
        fd.append('isSale', values.isSale)
        fd.append('isRent', values.isRent)
        fd.append('VillaOwnerName', values.villaOwner)
        fd.append('VillaOwnerPhone', values.villaOwnerPhone)
        fd.append('VillaNumber', values.villaNumber)
        fd.append('PriceType', values.priceType)

        if (values?.personel !== '') {
          fd.append('PersonalId', values?.personel)
        }
        await VillaAdd(fd).then(async (res) => {
          const fdd = new FormData()
          fdd.append('VillaId', res?.data?.id)
          formik.values.categories.map((itm, i) => {
            fdd.append(`CategoryIds[${i}]`, itm)
          })
          if (formik?.values?.categories.length !== 0) {
            await VillaCategoryAsign(fdd).then(() => {
              if (res?.statusCode === 200) {
                openSnackbar({
                  open: true,
                  message: 'Yeni Villa Eklendi.',
                  variant: 'alert',

                  alert: {
                    color: 'success'
                  }
                });
                setSubmitting(false);
                navigate(`/facilities/villas-show/summary/${res?.data?.id}`);
              } else {
                openSnackbar({
                  open: true,
                  message: 'Hata',
                  variant: 'alert',

                  alert: {
                    color: 'error'
                  }
                });
                setSubmitting(false);
              }
            })
          } else {
            if (res?.statusCode === 200) {
              openSnackbar({
                open: true,
                message: 'Yeni Villa Eklendi.',
                variant: 'alert',

                alert: {
                  color: 'success'
                }
              });
              setSubmitting(false);
              navigate(`/facilities/villas-show/summary/${res?.data?.id}`);
            } else {
              openSnackbar({
                open: true,
                message: res?.errors[0]?.description ? res?.errors[0]?.description : 'Hata',
                variant: 'alert',

                alert: {
                  color: 'error'
                }
              });
              setSubmitting(false);
            }
          }
        });
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
    setFieldValue('descriptionLong', value)
  };

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent sx={{ p: 2.5 }}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <InputLabel sx={{ marginBottom: 1.5 }}>Personel</InputLabel>
                    <Autocomplete
                      fullWidth
                      id="basic-autocomplete-label"
                      options={personels}
                      getOptionLabel={(option) => `${option?.name}`}
                      isOptionEqualToValue={(option, value) => option?.id === value?.id}
                      onChange={(e, value) => setFieldValue('personel', value?.id)}
                      renderInput={(params) => <TextField {...params} helperText={errors.personel} error={Boolean(errors.personel)} label="Personel" />}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="villa-owner">Villa Sahibi</InputLabel>
                      <TextField
                        fullWidth
                        id="villa-owner"
                        placeholder="Villa Sahibi"
                        {...getFieldProps('villaOwner')}
                        error={Boolean(touched.villaOwner && errors.villaOwner)}
                        helperText={touched.villaOwner && errors.villaOwner}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="villa-owner-phone">Villa Sahibi Telefon No</InputLabel>
                      <TextField
                        fullWidth
                        id="villa-owner-phone"
                        placeholder="Villa Sahibi Telefon No"
                        {...getFieldProps('villaOwnerPhone')}
                        error={Boolean(touched.villaOwnerPhone && errors.villaOwnerPhone)}
                        helperText={touched.villaOwnerPhone && errors.villaOwnerPhone}
                      />
                    </Stack>
                  </Grid>
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
                  <Grid item xs={6}>
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
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="villa-region">Bölge</InputLabel>
                      <TextField
                        fullWidth
                        id="villa-region"
                        placeholder="Bölge"
                        {...getFieldProps('region')}
                        error={Boolean(touched.region && errors.region)}
                        helperText={touched.region && errors.region}
                      />
                    </Stack>
                  </Grid> */}
                  <Grid item xs={6}>
                    <InputLabel sx={{ marginBottom: 1.5 }}>Bölge</InputLabel>
                    <Autocomplete
                      fullWidth
                      id="basic-autocomplete-label"
                      disableClearable
                      options={towns}
                      getOptionLabel={(option) => `${option?.name}`}
                      isOptionEqualToValue={(option, value) => option?.id === value?.id}
                      onChange={(e, value) => setFieldValue('region', value?.id)}
                      renderInput={(params) => <TextField {...params} helperText={errors.region} error={Boolean(errors.region)} label="Bölge" />}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="categories">Kategori</InputLabel>

                      <Autocomplete
                        id="categories"
                        multiple
                        fullWidth
                        autoHighlight
                        freeSolo
                        disableCloseOnSelect
                        options={categories?.data?.map((item) => item?.categoryDetails[0]?.name) || []}
                        getOptionLabel={(option) => option}
                        onChange={(event, newValue) => {
                          var x = [];
                          categories?.data?.map(function (item) {
                            if (newValue.includes(item?.categoryDetails[0]?.name)) {
                              x.push(item.id);
                            }
                          });
                          setFieldValue('categories', x);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="categories"
                            placeholder="Kategori Seç"
                            error={touched.categories && Boolean(errors.categories)}
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => {
                            let error = false;
                            if (touched.categories && errors.categories && typeof errors.categories !== 'string') {
                              if (typeof errors.categories[index] === 'object') error = true;
                            }

                            return (
                              <Chip
                                {...getTagProps({ index })}
                                variant="combined"
                                key={index}
                                label={option}
                                deleteIcon={<CloseCircle style={{ fontSize: '0.75rem' }} />}
                                sx={{ color: 'text.primary' }}
                              />
                            );
                          })
                        }
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-person">Kişi Sayısı</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-person"
                      placeholder="Kişi Sayısı"
                      {...getFieldProps('person')}
                      error={Boolean(touched.person && errors.person)}
                      helperText={touched.person && errors.person}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-room">Oda Sayısı</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-room"
                      placeholder="Oda Sayısı"
                      {...getFieldProps('room')}
                      error={Boolean(touched.room && errors.room)}
                      helperText={touched.room && errors.room}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-bath">Banyo Sayısı</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-bath"
                      placeholder="Banyo Sayısı"
                      {...getFieldProps('bath')}
                      error={Boolean(touched.bath && errors.bath)}
                      helperText={touched.bath && errors.bath}
                    />
                  </Grid>

                  <Grid item xs={4}>
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
                  </Grid>

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
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
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
                    <ReactQuill style={{ height: '400px', marginBottom: '40px' }} onChange={handleChangeEditor} />
                  </Grid>



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
                  <Grid item xs={6}>
                    <InputLabel htmlFor="villaNumber">Villa Numarası</InputLabel>
                    <TextField
                      fullWidth
                      id="villaNumber"
                      placeholder="Villa Numarası"
                      {...getFieldProps('villaNumber')}
                      error={Boolean(touched.villaNumber && errors.villaNumber)}
                      helperText={touched.villaNumber && errors.villaNumber}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Online Reservation Status</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tesisinize Online (Anlık) Rezervasyon Kabul Ediyormusunuz?
                    </Typography>
                    <FormControlLabel control={<Switch sx={{ mt: 0 }} />} label="" labelPlacement="start" onChange={() => { setFieldValue('onlineReservation', !getFieldProps('onlineReservation').value) }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Kiralık</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tesisiniz kiralık mı olacak ?
                    </Typography>
                    <FormControlLabel control={<Switch sx={{ mt: 0 }} />} label="" checked={formik?.values?.isRent} labelPlacement="start" onChange={() => { setFieldValue('isRent', !getFieldProps('isRent').value) }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Satılık</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tesisiniz satılık mı olacak ?
                    </Typography>
                    <FormControlLabel control={<Switch sx={{ mt: 0 }} />} label="" checked={formik?.values?.isSale} labelPlacement="start" onChange={() => { setFieldValue('isSale', !getFieldProps('isSale').value) }} />
                  </Grid>
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