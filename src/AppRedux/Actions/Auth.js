import { ADD_USER_SUCCESS, REMOVE_USER, REGISTER_USER_SUCCESS, RESET_SIGNUP, SIGNUP, SHOW_LOADER, HIDE_LOADER } from './ActionTypes';
import { httpGet, httpPost } from '../../Services/HttpServices';
import { toast } from 'react-toastify';

export const showLoader = (data) => {
    return {
        type: SHOW_LOADER,
    }
}

export const hideLoader = (data) => {
    return {
        type: HIDE_LOADER
    }
}

export const addUserSuccess = (data) => {
    return {
        type: ADD_USER_SUCCESS,
        payload: data
    }
}

export const signUpSuccess = (data) => {
    return {
        type: SIGNUP,
        payload: data
    }
}

export const postUser = (data) => (dispatch) => {
    dispatch(showLoader());
    httpPost('user_controller/login', data)
        .then(res => {
            dispatch(hideLoader());
            console.log('res', res)
            if (res && !res.status) {
                toast.error(res.message);
            }
            if(res.EmailExists === false){
                dispatch(signUpSuccess(true))        
            }
            else{
                dispatch(addUserSuccess(res && res.data || null))
            }
        })
        .catch(err => {
            dispatch(hideLoader())
            console.log('errr', err)
        })
}

export const removeUser = () => {
    return {
        type: REMOVE_USER,
    }
}

export const registerUserSuccess = (data) => {
    return {
        type: REGISTER_USER_SUCCESS,
        payload: data
    }
}

export const registerUser = (data) => (dispatch) => {
    dispatch(showLoader());
    httpPost('user_controller/signup_email', data)
        .then(res => {
            dispatch(hideLoader())
            console.log('res', res)
            if (res && !res.status) {
                toast.error(res.message);
            }
            if (res && res.data) {
                res.data._id = res.data.UserID;
            }
            dispatch(registerUserSuccess(res && res.data || null))
        })
        .catch(err => {
            dispatch(hideLoader())
            console.log('errr', err)
        })
}
export const resetSignUp = () => {
    return {
        type: RESET_SIGNUP
    }
}