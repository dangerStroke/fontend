import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
// 登录验证
export default new Vuex.Store({
    state: {
        user: false,
        oldVipNum:0,
        oldOrderNum:0,
        oldApplyNum:0,
        newVipNum:0,
        newOrderNum:0,
        newApplyNum:0,
    },
    mutations: {
        // 登录
        login(state, user) {
            state.user = user;
            localStorage.setItem("userInfo", user);
        },
        // 退出
        logout(state, user) {
            state.user = "";
            localStorage.setItem("userInfo", "");
        },
        setOrderNum(state,num) {
            if(state.oldOrderNum == 0) {
                state.oldOrderNum = num
            }else {
                state.newOrderNum = num
            }
        },
        setVipNum(state,num) {
            if(state.oldVipNum == 0) {
                state.oldVipNum = num
            }else {
                state.newVipNum = num
            }
        },
        setApplyNum(state,num) {
            if(state.oldApplyNum == 0) {
                state.oldApplyNum = num
            }else {
                state.newApplyNum = num
            }
        },
        setOldOrderNum(state,num) {
            state.oldOrderNum = num
        },
        setOldApplyNum(state,num) {
            state.oldApplyNum = num
        },
        setOldVipNum(state,num) {
            state.oldVipNum = num
        }
    },

})