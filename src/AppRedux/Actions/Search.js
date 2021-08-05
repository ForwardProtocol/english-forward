import { httpGet, httpPost } from '../../Services/HttpServices';
import { SET_SEARCH, RESET_SEARCH } from './ActionTypes';

export const setSearch = (text) => {
    return {
        type: SET_SEARCH,
        payload: text,
    }
}

export const resetSearch = () => {
    return {
        type: RESET_SEARCH,
    }
}