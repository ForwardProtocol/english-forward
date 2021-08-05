import { SET_SEARCH, RESET_SEARCH } from "../Actions/ActionTypes";

const INIT_STATE = {
    searchText: null
}

export default function searchReduser(state = INIT_STATE, action) {
    switch (action.type) {
        case SET_SEARCH: {
            return {
                ...state,
                searchText: action.payload
            }
        }
        case RESET_SEARCH: {
            return {
                ...state,
                searchText: null,
            }
        }
        default: {
            return state;
        }
    }
}