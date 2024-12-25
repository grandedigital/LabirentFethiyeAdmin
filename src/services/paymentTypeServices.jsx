/* eslint-disable prettier/prettier */
import { get, post } from './request';


const GetAllPaymentTypes = () => {
    return get(`/PaymentTypes/GetAll`, true);
}

const CreatePaymentType = (payload) => post(`/PaymentTypes/Create`, payload, true, true);

const DeletePaymentTypes = (id) => {
    return get(`/PaymentTypes/Delete/${id}`, true);
}


export { GetAllPaymentTypes, CreatePaymentType, DeletePaymentTypes }