import { get, post, remove, put } from './request';


const GetAllUsers = () => {
    return get(`/Users/GetAll`, true);
}


export { GetAllUsers }