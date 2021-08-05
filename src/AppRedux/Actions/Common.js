import { httpGet, httpPost } from '../../Services/HttpServices';
import { toast } from 'react-toastify';
import { LANGUAGE_LIST, LANGUAGE_LIST_SUCCESS } from './ActionTypes';


export const languageListSuccess = (list) => {
    return {
        type: LANGUAGE_LIST_SUCCESS,
        payload: list
    }
}

export const languageList = (data) => (dispatch) => {
    httpPost('language_controller/list', {})
        .then(res => {
            console.log('res', res)
            if (res && !res.status) {
                toast.error(res.message);
            }
            dispatch(languageListSuccess(res && res.data || null))
        })
        .catch(err => {
            console.log('errr', err)
        })
}