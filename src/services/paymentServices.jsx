/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';
import * as qs from 'qs'


const GetAllPaymentsByReservation = (reservationId) => {
    return get(`/Payments/GetAll?reservationId=${reservationId}`, true);
}

const GetAllPaymentsByVilla = (villaId, facility) => {
    if (facility === 'villa') {
        return get(`/Payments/GetAll?villaId=${villaId}`, true);
    } else if (facility === 'room') {
        return get(`/Payments/GetAll?roomId=${villaId}`, true);
    } else if (facility === 'apart') {
        return get(`/Payments/GetAll?hotelId=${villaId}`, true);
    }
}

const GetPayment = (id) => {
    return get(`/api/payments/${id}?populate=payment_type`);
}

const UpdatePayment = (fd) => {
    return post(`/Payments/Update`, fd, true, true)
}


const AddPayment = (payload) =>
    post(`/Payments/Create`, payload, true, true);

const PaymentRemove = (id) => remove('/api/payments/' + id)


export { GetAllPaymentsByReservation, AddPayment, PaymentRemove, GetPayment, UpdatePayment, GetAllPaymentsByVilla }