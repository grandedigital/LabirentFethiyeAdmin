/* eslint-disable prettier/prettier */
import { get, post, remove } from './request'
import * as qs from 'qs'

const PriceTableAdd = (payload) => post('/PriceTables/Create', payload, true, true)
const PriceTableUpdate = (payload) => post('/PriceTables/Update', payload, true, true)
const PriceTableUpdateDetail = (payload) => post('/PriceTables/UpdateDetail', payload, true, true)
const PriceTableCreateDetail = (payload) => post('/PriceTables/CreateDetail', payload, true, true)

const PriceTableRemove = (id) => get(`/PriceTables/DeleteHard/${id}`, true)

const GetPriceTable = (id) => {
    return get(`/PriceTables/GetAll?VillaId=${id}`, true);
}

const GetPriceTableApart = (id) => {
    return get(`/PriceTables/GetAll?HotelId=${id}`, true);
}


const GetPriceTableRoom = (id) => {
    return get(`/PriceTables/GetAll?RoomId=${id}`, true);
}


export { PriceTableAdd, PriceTableRemove, GetPriceTable, GetPriceTableApart, PriceTableUpdate, PriceTableUpdateDetail, PriceTableCreateDetail,GetPriceTableRoom }