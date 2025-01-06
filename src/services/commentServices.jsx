/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'

const GetCommentsForVilla = (page, size, villaId) => get(`/Comments/GetAll?Pagination.Page=${page}&Pagination.Size=${size}&VillaId=${villaId}`, true)
const GetCommentsForApart = (page, size, hotelId) => get(`/Comments/GetAll?Pagination.Page=${page}&Pagination.Size=${size}&HotelId=${hotelId}`, true)
const GetCommentById = (id) => get(`/Comments/Get?Id=${id}`, true)
const CreateComment = (fd) => post(`/Comments/Create`, fd, true, true)
const UpdateComment = (fd) => post(`/Comments/Update`, fd, true, true)


export { GetCommentsForVilla, GetCommentsForApart, CreateComment, GetCommentById, UpdateComment }