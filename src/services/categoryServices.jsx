import { get, post, remove } from './request'

export const Categories = () => get(`/Categories/GetAll`, true)

export const CategoriesList = (page, size, search, orderByName = null) => get(`/Categories/GetAll?Pagination.Page=${page}&Pagination.Size=${size}&SearchName=${search}${orderByName !== null ? `&OrderByName=${orderByName}` : ''}`, true)

export const CreateCategory = (payload) => post(`/Categories/Create`, payload, true, true)

export const UpdateCategoryDetail = (payload) => post(`/Categories/UpdateDetail`, payload, true, true)

export const UpdateCategory = (payload) => post(`/Categories/Update`, payload, true, true)

export const CreateCategoryDetail = (payload) => post(`/Categories/CreateDetail`, payload, true, true)