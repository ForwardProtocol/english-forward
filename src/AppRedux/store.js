import { applyMiddleware, compose, createStore } from 'redux'
//import {routerMiddleware} from 'connected-react-router'
import thunk from 'redux-thunk';
import createRootReducer from './Reducers'
import { saveState, loadState } from './localStorage';
const createBrowserHistory = require('history').createBrowserHistory;


export const history = createBrowserHistory();

//const routeMiddleware = routerMiddleware(history);

const middlewares = [thunk];//routeMiddleware


export default function configureStore(preloadedState) {
    const persistState = loadState();
    const store = createStore(
        createRootReducer(history), // root reducer with router state
        persistState,
        compose(
            applyMiddleware(
                // routerMiddleware(history), // for dispatching history actions
                ...middlewares
            ),
        ),
    );
    store.subscribe(() => {
        saveState(store.getState());
    })
    //sagaMiddleware.run(rootSaga);
    return store;
}
