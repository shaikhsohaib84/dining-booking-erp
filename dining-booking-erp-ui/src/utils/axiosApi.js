import axios from 'axios';

axios.interceptors.request.use(function (config) {
    config.baseURL = window.location.origin === 'http://localhost:3000' ? 'http://127.0.0.1:8000/erp/' : `${window.location.origin}/erp/`
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

export const GET = (url, config={}) => {
    return axios.get(`${url}`, {...config});
}

export const POST = (url, data, config=[]) => {
    return axios.post(url, data, ...config);
}

export const PUT = (url, data, config=[]) => {
    return axios.put(url, data, ...config);
}

export const DELETE = (url, config=[]) => {
    return axios.delete(url, ...config);
}