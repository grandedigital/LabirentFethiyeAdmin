/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'
import * as qs from 'qs'

// const Villas = (page, size, sort = true, fieldName = 'id', filter) => get(`/api/villas?sort=${fieldName}:${sort ? 'desc' : 'asc'}&publicationState=preview&filters[name][$containsi]=${filter}&pagination[page]=${page}&pagination[pageSize]=${size}`)
const Villas = (page, size, search, orderByName = null, orderByOnlineReservation = null, orderByPerson = null) => get(`/Villas/GetAll?Pagination.Page=${page}&Pagination.Size=${size}&SearchName=${search}${orderByName !== null ? `&OrderByName=${orderByName}` : ''}${orderByPerson !== null ? `&OrderByPerson=${orderByPerson}` : ''}${orderByOnlineReservation !== null ? `&OrderByOnlineReservation=${orderByOnlineReservation}` : ''}`, true)
const GetVillaName = (id) => get(`/Villas/Get/${id}`, true)
const GetVilla = (id) => get(`/Villas/Get/${id}`, true)
const GetVillaDetail = (id) => get(`/Villas/Get/${id}`, true)
const VillaAdd = (payload) => post('/Villas/Create', payload, true, true)
const VillaRemove = (id) => remove('/api/villas/' + id)
const VillaUpdate = (data) => post(`/Villas/Update`, data, true, true)
const VillaCategoryAsign = (payload) => post('/Villas/VillaCategoryAsign', payload, true, true)
const VillaUpdateDetail = (data) => post(`/Villas/UpdateDetail`, data, true, true)
const VillaCreateDetail = (data) => post(`/Villas/CreateDetail`, data, true, true)
const GetVillaAvailableDates = (id) => get(`/Villas/GetVillaAvailableDates?VillaId=${id}`, true)



const VillaIsAvailible = (villaId, date1, date2) => {
    const query = qs.stringify({
        sort: ['checkIn:asc'],
        fields: ['id'],
        populate: {
            villa: {
                fields: ['id', 'name']
            }
        },
        filters: {
            $and: [
                {
                    villa: {
                        id: {
                            $eq: villaId
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

const VillaGetPriceForReservation = (villaId, date1, date2, room = false) => {
    if (room) {
        return get(`/Reservations/GetReservationPrice?RoomId=${villaId}&CheckIn=${date1}&CheckOut=${date2}`, true);
    } else {
        return get(`/Reservations/GetReservationPrice?VillaId=${villaId}&CheckIn=${date1}&CheckOut=${date2}`, true);
    }
}

const GetVillaFull = (id) => {
    const query = qs.stringify({
        populate: ['distance_rulers', 'price_tables'],
        // populate: {
        //     price_tables: {
        //         fields: ['id', 'name', 'value']
        //     }
        // }        
    });
    return get(`/api/villas/${id}?${query}`);
}


export { Villas, GetVillaName, GetVilla, VillaAdd, VillaRemove, VillaIsAvailible, VillaGetPriceForReservation, GetVillaFull, GetVillaDetail, VillaUpdate, VillaCategoryAsign, VillaUpdateDetail, VillaCreateDetail, GetVillaAvailableDates }