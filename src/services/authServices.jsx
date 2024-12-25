/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'

const LoginService = (payload) => post(`/Auths/Login`, payload, true, true);

export { LoginService }