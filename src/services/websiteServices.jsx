/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'

const CreateWebPage = (payload) => post(`/WebPages/Create`, payload, true, true);

const UpdateWebPage = (payload) => post(`/WebPages/Update`, payload, true, true);

const CreateWebPageDetail = (payload) => post(`/WebPages/CreateDetail`, payload, true, true);

const UpdateWebPageDetail = (payload) => post(`/WebPages/UpdateDetail`, payload, true, true);

const GetMenus = () => get(`/Menus/GetAll`, true)

const GetWebPages = (slug, page, size) => get(`/WebPages/GetAll?Slug=${slug}&Pagination.Page=${page}&Pagination.Size=${size}`, true)

const GetMenuBySlug = (slug) => get(`/Menus/GetMenuBySlug?slug=${slug}`, true)

const DeleteWebPage = (id) => get(`/WebPages/DeleteHard/${id}`, true)


export { GetMenus, GetWebPages, CreateWebPage, CreateWebPageDetail, UpdateWebPageDetail, GetMenuBySlug, DeleteWebPage, UpdateWebPage }