/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'

const GetCommentsForVilla = (page, size, villaId) => get(`/Comments/GetAll?Pagination.Page=${page}&Pagination.Size=${size}&VillaId=${villaId}`, true)
const GetCommentsForApart = (page, size, hotelId) => get(`/Comments/GetAll?Pagination.Page=${page}&Pagination.Size=${size}&HotelId=${hotelId}`, true)
const CreateComment = (fd) => post(`/Comments/Create`, fd, true, true)


export { GetCommentsForVilla, GetCommentsForApart, CreateComment }