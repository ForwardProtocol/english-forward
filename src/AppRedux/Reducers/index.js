import { combineReducers } from 'redux'
import Auth from './Auth';
import Search from './Search';
import Common from './Common';
const createRootReducer = (history) => combineReducers({
    auth: Auth,
    search: Search,
    common: Common
})

export default createRootReducer