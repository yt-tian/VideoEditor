import request from '../utils/request'
// 登录接口
export const login = (username, userpass) => request({
    method: 'post',
    url: '/login',
    data: {
        username,
        userpass,
    }
});
// 注册接口
export const register = (username, userpass) => request({
    method: 'post',
    url: '/register',
    data: {
        username,
        userpass,
    }
});