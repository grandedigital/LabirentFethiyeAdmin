/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'

const GetAwaitingReservations = () => get(`/Summaries/GetReservationsAwaitingConfirmation`, true)
const GetThreeDayReservations = () => get(`/Summaries/GetThreeDayCheckInCheckOutReservation`, true)
const GetAwaitingComments = () => get(`/Summaries/GetCommentsAwaitingApproval`, true)



export { GetAwaitingReservations, GetThreeDayReservations, GetAwaitingComments }