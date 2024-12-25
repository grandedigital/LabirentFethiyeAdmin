/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request'
import * as qs from 'qs'

const Upload = (payload) => post(`/Photos/CreateMultiPhoto`, payload, true, true)
const UploadSingle = (payload) => post(`/Photos/Create`, payload, true, true)
const UploadWebPhoto = (payload) => post(`/WebPages/CreatePhoto`, payload, true, true)


const GetPhotos = (villaId) => {
    return get(`/Photos/GetAll?villaId=${villaId}`, true);
}

const GetPhotosApart = (apartId) => {
    return get(`/Photos/GetAll?hotelId=${apartId}`, true);
}

const GetPhotosRoom = (roomId) => {
    return get(`/Photos/GetAll?roomId=${roomId}`, true);
}

const GetPhotosWebPages = (id) => {
    return get(`/WebPages/GetAllWebPhoto?WebPageId=${id}`, true);
}

const DeleteWebPhoto = (id) => {
    return get(`/WebPages/DeleteHardWebPhoto/${id}`, true);
}
const PhotoPut = (payload) => post(`/Photos/UpdateLine`, payload, true, true);
const PhotoPost = (payload) => post(`/api/photos`, payload, true);

const PhotoRemove = (id) => get('/Photos/DeleteHard/' + id, true)
const PhotoRemoveHard = (id) => remove('/api/upload/files/' + id)

//--- /api/upload/files/:id	


export { GetPhotos, PhotoPut, PhotoPost, Upload, PhotoRemove, PhotoRemoveHard, GetPhotosApart, GetPhotosRoom, UploadSingle, UploadWebPhoto, GetPhotosWebPages,DeleteWebPhoto }
