import axios from 'axios';
// 引入路由
import router from '../router';
// 引入状态管理
import store from '../vuex/store';
import { Message } from 'element-ui';

// 响应拦截器
axios.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        if(response.data.code != 200) {
            Message({
                message: response.data.msg,
                type: 'error'
            })
            return
        }
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                store.commit('logout', 'false')
                router.push({ path: '/login' })
                localStorage.clear()
                Message({
                    message: '登录过期，请重新登录！',
                    type: 'error'
                })
            }
        }
        // 将错误传递给Promise的catch处理
        return Promise.reject(error);
    }
);


// 登录请求方法
const loginreq = (method, url, params) => {
    return axios({
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
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
            "Authorization":localStorage.getItem('logintoken'),
            ...headers
        },
        data: params,
    }).then(res => res.data);
};

export {
    loginreq,
    req
};
