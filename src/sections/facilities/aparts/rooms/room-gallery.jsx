/* eslint-disable prettier/prettier */
import { Box, Button, Grid, IconButton, Stack, Tooltip } from '@mui/material';

// third-party


// project-imports
import MainCard from 'components/MainCard';
import { forwardRef, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { GetPhotosRoom, PhotoPut } from 'services/photoService';
import { ReactSortable } from 'react-sortablejs';
import Loader from 'components/Loader';
import { Add, ArrangeHorizontal, CloudChange, PlayCircle, Trash } from 'iconsax-react';
import { openSnackbar } from 'api/snackbar';
import PhotoModal from 'sections/photoSections/PhotoModal';
import PhotoModalDelete from 'sections/photoSections/PhotoModalDelete';
import VideoModal from 'sections/photoSections/VideoModal';
const CustomComponent = forwardRef < HTMLDivElement > ((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});

export default function RoomGallerySection() {
  const params = useParams();

  const [photo, setPhoto] = useState();
  const [lineChangeLoading, setLineChangeLoading] = useState(true);
  const [photoList, setPhotoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoModal, setPhotoModal] = useState(false)
  const [isEdit, setIsEdit] = useState(true);
  const [photoDeleteId, setPhotoDeleteId] = useState('');
  const [photoModalDelete, setPhotoModalDelete] = useState(false);
  const [selectedPhotoDeleteItem, setSelectedPhotoDeleteItem] = useState("")

  const [videoModal, setVideoModal] = useState(false)

  useEffect(() => {
    if ((params.id && loading) || lineChangeLoading || isEdit)
      GetPhotosRoom(params.id).then((res) => {
        setPhoto([])
        res?.data.map((itm) => {
          if (itm?.videoLink === null) {
            setPhoto((prevValues) => [...prevValues, itm])
          }
        })
        // setPhoto(res.data);
        setPhotoList(res.data);
        setLoading(false);
        setLineChangeLoading(false);
        setIsEdit(false)
      })
  }, [loading, lineChangeLoading, isEdit])


  const handeLineSave = () => {
    setLoading(true)
    const fd = new FormData()

    photo.forEach((item, index) => {
      fd.append(`[${index}].Id`, item.id)
      fd.append(`[${index}].Line`, index)
      if (photo.length === index + 1) {
        PhotoPut(fd).then((res) => {

          setLineChangeLoading(true);
          openSnackbar({
            open: true,
            message: 'Sıralama Düzenlendi.',
            variant: 'alert',
            alert: {
              color: 'success'
            }
          });

        });
      }
    });
  };

  const handleClose = () => {
    setPhotoModalDelete(!photoModalDelete);
  };

  if (loading) return (<Loader open={loading} />)
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <MainCard>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ paddingBottom: 4, overflowX: 'auto' }}>


                <Stack direction="row" alignItems="center" spacing={2}>
                  <Button variant="contained" startIcon={<Add />} size="large" onClick={() => { setPhotoModal(true) }}>
                    Resim Ekle
                  </Button>
                  {
                    photoList.some(photo => photo.videoLink !== null) ? ''
                      :
                      <Button variant="contained" startIcon={<Add />} size="large" onClick={() => { setVideoModal(true) }}>
                        Video Ekle
                      </Button>
                  }
                  {
                    photo?.length > 0 &&
                    <Button variant="contained" color='warning' startIcon={<ArrangeHorizontal />} onClick={handeLineSave} size="large">
                      SIRALAMAYI KAYDET
                    </Button>
                  }
                </Stack>
              </Stack>
              <Grid container spacing={1.25}>
                {!loading && (
                  <>
                    {
                      photoList.some(photo => photo.videoLink !== null) ?
                        <div style={{ width: '160px', height: '170px', float: 'left', margin: '10px', position: 'relative' }}>
                          <img width={160} height={140} style={{ border: '3px solid #999696' }} src={`${import.meta.env.VITE_APP_BACKEND_URL}/Uploads/RoomPhotos/k_${photoList.find((pht) => pht.videoLink !== null)?.image}`} alt="" />
                          <PlayCircle size={50} color='white' style={{ position: 'absolute', left: '35%', top: '25%' }} />
                          <Stack direction="row" spacing={0}>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClose();
                                  setPhotoDeleteId(photoList.find((pht) => pht.videoLink !== null).id);
                                  setSelectedPhotoDeleteItem(photoList.find((pht) => pht.videoLink !== null))
                                }}
                              >
                                <Trash />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </div> : ''
                    }
                    <ReactSortable tag={CustomComponent} list={photo} setList={setPhoto}>
                      {photo.map((item, index) => (
                        <div style={{ width: '160px', height: '170px', float: 'left', margin: '10px' }} key={index} data-index={index}>
                          <img src={`${import.meta.env.VITE_APP_BACKEND_URL}/Uploads/RoomPhotos/k_${item.image}`} width={160} height={140} style={{ border: '3px solid #999696' }} />
                          <Stack direction="row" spacing={0}>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClose();
                                  setPhotoDeleteId(item.id);
                                  setSelectedPhotoDeleteItem(item)
                                  // console.log("photoId => ", Number(item.id));
                                }}
                              >
                                <Trash />
                              </IconButton>
                            </Tooltip>
                          </Stack>

                          {/* <span style={{ float: 'left', lineHeight: '16px' }}>[id: {item.id}] - </span>
                        <span style={{ float: 'left', lineHeight: '16px' }}>[index: {index}] - </span>
                        <span style={{ float: 'left', lineHeight: '16px' }}>[line: {item.attributes.line}]</span> */}

                        </div>
                      ))}
                    </ReactSortable>
                  </>
                )}

              </Grid>
              <PhotoModalDelete room={true} selectedItem={selectedPhotoDeleteItem} setIsEdit={setIsEdit} id={photoDeleteId} title={photoDeleteId} open={photoModalDelete} handleClose={handleClose} />

              <PhotoModal room={true} open={photoModal} modalToggler={setPhotoModal} villaId={params.id} setIsEdit={setIsEdit} lastLine={photo[photoList.length - 1]?.line} setLoading={setLoading} />
              <VideoModal room={true} open={videoModal} modalToggler={setVideoModal} villaId={params.id} setIsEdit={setIsEdit} setLoading={setLoading} />
            </MainCard>
          </Grid>

        </Grid>
      </Grid>
    </Grid>
  );
}
