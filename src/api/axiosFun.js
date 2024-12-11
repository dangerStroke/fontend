import axios from 'axios';
// 登录请求方法
const loginreq = (method, url, params) => {
    console.log(params)
    return axios({
        method: method,
        url: url,
        headers: {
            // 'Content-Type': 'application/json;charset=UTF-8',
        },
        data: params,
    }).then(res => res.data);
};
// 通用公用方法
const req = (method, url, params, headers) => {
    return axios({
        method: method,
        url: url,
        headers: {
            'Authorization': localStorage.getItem('logintoken'),
            ...headers
        },
        data: params,
    }).then(res => res.data);
};

export {
    loginreq,
    req
}