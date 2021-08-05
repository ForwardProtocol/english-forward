import axios from 'axios';

function getToken() {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
        return undefined;
    }
    const state = JSON.parse(serializedState);
    if (state && state.auth && state.auth.user && state.auth.user.AccessToken) {
        return state.auth.user.AccessToken
    } else {
        return undefined;
    }
}
async function httpGet(url, params) {
    var data;
    var token = getToken();
    var URI = "http://159.65.134.245:4009/"//process.env.REACT_APP_API_URL; //"http://localhost:4009/";//
    await axios.get(URI + url, {
        params: params,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'access-token': token
        }
    })
        .then(res => {
            if (res.statusCode == 400) {
                data = { status: 0, message: 'fail in server validation' };
            }
            else {
                data = res.data;
            }
        }).catch((err) => {
            console.log('err service', err.message);
            data = { status: 0, message: err.message };
        })
    return data;
}

async function httpPost(url, dataArr, params) {
    var data;
    var token = getToken();
    if(url === "dashboard_controller/feed2")
        var URI = "http://159.65.134.245:4002/"
    else
        var URI = "http://159.65.134.245:4009/"//process.env.REACT_APP_API_URL; //"http://localhost:4009/";//"http://localhost:4009/";//
    await axios.post(URI + url, dataArr, {
        params: params,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'access-token': token
        }
    })
        .then(res => {
            if (res.statusCode == 400) {
                data = { status: 0, message: 'fail in server validation' };
            }
            else {
                data = res.data;
            }
        }).catch((err) => {
            console.log('err service', err.message);
            data = { status: 0, message: err.message };
        })
    return data;
}

export { httpGet, httpPost };