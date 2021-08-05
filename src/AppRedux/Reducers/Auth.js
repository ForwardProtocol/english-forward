import { ADD_USER_SUCCESS, REMOVE_USER, REGISTER_USER_SUCCESS, REGISTER_USER, RESET_SIGNUP, SIGNUP, SHOW_LOADER, HIDE_LOADER } from '../Actions/ActionTypes'
const INIT_STATE = {
    user: null,
    signUp: false,
    loading: false,
}

export default function authReduser(state = INIT_STATE, action) {
    switch (action.type) {
        case ADD_USER_SUCCESS: {
            return {
                ...state,
                user: action.payload
            }
        }
        case RESET_SIGNUP: {
            return {
                ...state,
                signUp: action.payload,
            }
        }
        case SIGNUP: {
            return {
                ...state,
                signUp: true,
            }
        }
        case REGISTER_USER_SUCCESS: {
            return {
                ...state,
                signUp: action.payload ? true : false,
                user: action.payload,

            }
        }
        case SHOW_LOADER: {
            return {
                ...state,
                loading: true,
            }
        }
        case HIDE_LOADER: {
            return {
                ...state,
                loading: false
            }
        }
        case REMOVE_USER: {
            return INIT_STATE
        }
        default: {
            return state
        }
    }
}