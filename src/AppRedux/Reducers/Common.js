import { LANGUAGE_LIST_SUCCESS } from "../Actions/ActionTypes";

const INIT_STATE = {
    languages: []
}

export default function commonReduser(state = INIT_STATE, action) {
    switch (action.type) {
        case LANGUAGE_LIST_SUCCESS: {
            return {
                ...state,
                languages: action.payload
            }
        }
        default: {
            return state;
        }
    }
}