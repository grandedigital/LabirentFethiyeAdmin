/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';


const GetAllReservationInfos = (reservationId) => {

    return get(`/ReservationInfos/GetAll?ReservationId=${reservationId}`, true);

}

const GetReservationInfo = (id) => {

    return get(`/ReservationInfos/Get/${id}`, true);

}

const UpdateReservationInfo = ({ data }) => {
    return post(`/ReservationInfos/Update`, data, true, true)
}

const AddReservationInfo = (payload) =>
    post(
        `/ReservationInfos/Create`, payload, true, true
    );

const ReservationInfoRemove = (id) => get(`/ReservationInfos/DeleteHard/${id}`, true)


export { GetAllReservationInfos, AddReservationInfo, ReservationInfoRemove, GetReservationInfo, UpdateReservationInfo }