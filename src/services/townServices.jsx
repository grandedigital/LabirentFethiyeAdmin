import { get, post, remove } from './request'
import * as qs from 'qs'

const getTowns = () => {
    return get(`/Towns/GetAll`, true);
}


export { getTowns }