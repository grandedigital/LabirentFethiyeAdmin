/* eslint-disable prettier/prettier */
import { get, remove } from './request';


const GetAllReservationItems = (reservationId) => {

    return get(`/Reservations/Get/${reservationId}`, true);

}

const ReservationItemRemove = (id) => remove('/api/reservation-items/' + id)


export { GetAllReservationItems, ReservationItemRemove }