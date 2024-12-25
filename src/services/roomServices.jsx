/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'
import * as qs from 'qs'

const GetRoom = (id) => get(`/Rooms/Get/${id}`, true)
const GetRoomAvailableDates = (id) => get(`/Rooms/GetRoomAvailableDates?RoomId=${id}`, true)
const AddRoom = (payload) => post(`/Rooms/Create`, payload, true, true);
const CreateRoomDetail = (payload) => post(`/Rooms/CreateDetail`, payload, true, true);
const UpdateRoomDetail = (payload) => post(`/Rooms/UpdateDetail`, payload, true, true);

const GetRoomName = (id) => get(`/Rooms/Get/${id}`, true)

const GetRoomList = (apartId) => {
    return get(`/Rooms/GetAll?HotelId=${apartId}`, true);
}


const GetReservationListTop5 = (roomId) => {
    const query = qs.stringify({
        populate: ['reservation_infos'],
        sort: ['checkIn:asc'],
        //fields: ['id'],
        // populate: {
        //     villa: {
        //         fields: ['id', 'name']
        //     }
        // },
        filters: {
            room: {
                id: {
                    $eq: roomId
                }
            },
            homeOwner: {
                $eq: false
            }
        }
    })
    return get(`/api/reservations?${query}`);
}


// const GetReservations = (page, size, sort = true, fieldName = 'id', filter, id, homeOwner = false) => {
//     if (!homeOwner) {
//         return get(`/api/reservations?sort=${fieldName}:${sort ? 'desc' : 'asc'}&pagination[page]=${page}&pagination[pageSize]=${size}&populate[reservation_infos][fields][0]=name&populate[reservation_infos][fields][1]=surname&filters[$and][0][room][id][$eq]=${id}&filters[$and][1][homeOwner][$eq]=false&filters[$and][2][reservation_infos][name][$containsi]=${filter}`);
//     } else {
//         return get(`/api/reservations?sort=${fieldName}:${sort ? 'desc' : 'asc'}&pagination[page]=${page}&pagination[pageSize]=${size}&populate[reservation_infos][fields][0]=name&populate[reservation_infos][fields][1]=surname&filters[$and][0][room][id][$eq]=${id}`);
//     }
// }
const RoomChangeState = (payload) => post(`/Rooms/Update`, payload, true, true);

// const GetReservations = (id, page, size) => {
//     return get(`/Reservations/GetAll?RoomId=${id}&Page=${page}&Size=${size}`, true);
// }
const GetReservations = (id, page, size, homeOwner, agencyOwner, search = '', orderByCustomerName = null, orderByReservationStatus = null, orderByCheckIn = null, orderByCheckOut = null, orderByPrice = null) => {
    return get(`/Reservations/GetAllForRoom?RoomId=${id}&Pagination.Page=${page}&Pagination.Size=${size}&HomeOwner=${homeOwner}&AgencyOwner=${agencyOwner}${search !== '' ? `&CustomerSearchName=${search}` : ''}${orderByCustomerName !== null ? `&OrderByCustomerName=${orderByCustomerName}` : ''}${orderByReservationStatus !== null ? `&OrderByReservationStatus=${orderByReservationStatus}` : ''}${orderByCheckIn !== null ? `&OrderByCheckIn=${orderByCheckIn}` : ''}${orderByCheckOut !== null ? `&OrderByCheckOut=${orderByCheckOut}` : ''}${orderByPrice !== null ? `&OrderByPrice=${orderByPrice}` : ''}`, true);
}


const RoomIsAvailible = (roomId, date1, date2) => {
    const query = qs.stringify({
        sort: ['checkIn:asc'],
        fields: ['id'],
        populate: {
            room: {
                fields: ['id', 'name']
            }
        },
        filters: {
            $and: [
                {
                    room: {
                        id: {
                            $eq: roomId
                        }
                    }
                },
                {
                    reservationStatus: {
                        $ne: 110
                    }
                },
                {
                    $or: [
                        {
                            $and: [
                                { checkIn: { $gt: date1 } },
                                { checkIn: { $lt: date2 } }
                            ]
                        },
                        {
                            $and: [
                                { checkIn: { $lte: date1 } },
                                { checkOut: { $gt: date1 } }
                            ]
                        },
                        {
                            $and: [
                                { checkIn: { $lt: date2 } },
                                { checkOut: { $gte: date2 } }
                            ]
                        }
                    ]
                }
            ]
        }
    })
    return get(`/api/reservations?${query}`);
}


const RoomGetPriceForReservation = (roomId, date1, date2) => {
    return get(`/Reservations/GetReservationPrice?RoomId=${roomId}&CheckIn=${date1}&CheckOut=${date2}`, true);
}

export { GetRoom, GetRoomList, GetReservations, GetReservationListTop5, RoomChangeState, AddRoom, RoomIsAvailible, RoomGetPriceForReservation, GetRoomName, CreateRoomDetail, UpdateRoomDetail,GetRoomAvailableDates }