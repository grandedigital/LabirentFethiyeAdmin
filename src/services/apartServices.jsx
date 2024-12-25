/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'
import * as qs from 'qs'


const Aparts = (page, size, search, orderByName = null) => get(`/Hotels/GetAll?Pagination.Page=${page}&Pagination.Size=${size}&SearchName=${search}${orderByName !== null ? `&OrderByName=${orderByName}` : ''}`, true)
const GetApart = (id) => get(`/Hotels/Get/${id}`, true)

const ApartChangeState = (payload) => post(`/Hotels/Update`, payload, true, true);

const CreateApart = (payload) => post(`/Hotels/Create`, payload, true, true);
const CreateApartDetail = (payload) => post(`/Hotels/CreateDetail`, payload, true, true);
const UpdateApartDetail = (payload) => post(`/Hotels/UpdateDetail`, payload, true, true);

const GetApartName = (id) => get(`/api/aparts/${id}?fields=name`)


const GetApartFull = (id) => {
    const query = qs.stringify({
        populate: ['distance_rulers', 'price_tables'],
        // populate: {
        //     price_tables: {
        //         fields: ['id', 'name', 'value']
        //     }
        // }        
    });
    return get(`/api/aparts/${id}?${query}`);
}


// const Villas = (page, size, sort = true, fieldName = 'id', filter) => get(`/api/villas?sort=${fieldName}:${sort ? 'desc' : 'asc'}&publicationState=preview&filters[name][$containsi]=${filter}&pagination[page]=${page}&pagination[pageSize]=${size}`)
// const GetVillaName = (id) => get(`/api/villas/${id}?fields=name`)
// const GetVilla = (id) => get(`/api/villas/${id}?populate[photos][sort]=line:asc&populate[photos][populate][0]=photo&populate[reservations][populate][reservation_infos][filters][owner][$eq]=true&populate[reservations][sort][0]=createdAt:desc`)
// const GetVillaDetail = (id) => get(`/api/villas/${id}?populate[0]=categories`)
// const VillaAdd = (payload) => post('/api/villas', payload, true)
// const VillaRemove = (id) => remove('/api/villas/' + id)
// const VillaUpdate = (id, data) => put(`/api/villas/${id}`, data, true)


// const VillaIsAvailible = (villaId, date1, date2) => {
//     const query = qs.stringify({
//         sort: ['checkIn:asc'],
//         fields: ['id'],
//         populate: {
//             villa: {
//                 fields: ['id', 'name']
//             }
//         },
//         filters: {
//             $and: [
//                 {
//                     villa: {
//                         id: {
//                             $eq: villaId
//                         }
//                     }
//                 },
//                 {
//                     reservationStatus: {
//                         $ne: 110
//                     }
//                 },
//                 {
//                     $or: [
//                         {
//                             $and: [
//                                 { checkIn: { $gt: date1 } },
//                                 { checkIn: { $lt: date2 } }
//                             ]
//                         },
//                         {
//                             $and: [
//                                 { checkIn: { $lte: date1 } },
//                                 { checkOut: { $gt: date1 } }
//                             ]
//                         },
//                         {
//                             $and: [
//                                 { checkIn: { $lt: date2 } },
//                                 { checkOut: { $gte: date2 } }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         }
//     })
//     return get(`/api/reservations?${query}`);
// }

// const VillaGetPriceForReservation = (villaId, date1, date2) => {
//     const query = qs.stringify({
//         sort: ['checkIn:asc'],
//         fields: ['checkIn', 'checkOut', 'price'],
//         populate: {
//             villa: {
//                 fields: ['id', 'name']
//             }
//         },
//         filters: {
//             $and: [
//                 {
//                     villa: {
//                         id: {
//                             $eq: villaId
//                         }
//                     }
//                 },
//                 {
//                     $or: [
//                         {
//                             $and: [
//                                 { checkIn: { $gt: date1 } },
//                                 { checkIn: { $lte: date2 } }
//                             ]
//                         },
//                         {
//                             $and: [
//                                 { checkIn: { $lte: date1 } },
//                                 { checkOut: { $gte: date1 } }
//                             ]
//                         },
//                         {
//                             $and: [
//                                 { checkIn: { $lte: date2 } },
//                                 { checkOut: { $gte: date2 } }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         }
//     });
//     return get(`/api/price-dates?${query}`);
// }

// const GetVillaFull = (id) => {
//     const query = qs.stringify({
//         populate: ['distance_rulers', 'price_tables'],
//         // populate: {
//         //     price_tables: {
//         //         fields: ['id', 'name', 'value']
//         //     }
//         // }        
//     });
//     return get(`/api/villas/${id}?${query}`);
// }


// const VillaChangeState = (id, payload) => put(`/api/villas/${id}`, payload, true);


// export { Villas, GetVillaName, GetVilla, VillaAdd, VillaRemove, VillaIsAvailible, VillaGetPriceForReservation, GetVillaFull, VillaChangeState, GetVillaDetail, VillaUpdate }
export { Aparts, GetApart, ApartChangeState, GetApartFull, CreateApart, GetApartName, CreateApartDetail, UpdateApartDetail }