import { getToken, setToken, removeToken } from '@/utils/auth'
import {request} from '@/utils/Request'
import {api} from '@/utils/API'
import { message } from 'element-ui'

/** 
 * 提示函数 
 */
const tip = (msg,type="error") => {    
    message({
        type,
        message:msg,
        // duration: 1000, 
    });
}

const state={
    token: getToken(),
    userDetail:{}
}

const mutations={
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_USER: (state, obj) => {
        state.userDetail = obj
    },
}

const actions= {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return request({
                method:'post',
                url:`${api.login}?accountName=${username}&password=${password}`,
            }).then(res=>{
                if(res.code===10000000&&res.data){
                    const { jtoken,user_detail } = res.data
                    sessionStorage.setItem('userDetail',JSON.stringify(user_detail))
                    commit('SET_TOKEN', jtoken)
                    setToken(jtoken)
                    return true;
                }else{
                    tip(res.meassage)
                    return false;
                }   
            })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            request({
                url:`${api.logout}`
            }).then(()=>{
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    },

    getAccountList({commit},obj){
        return request({
            method:'post',
            url:`${api.accountList}`,
            data:obj
        }).then(res=>{
            if(res.code === 10000000&&res.data){
                return res;
            }else{
                tip(res.meassage)
            }
        })
    },

    //验证账户名是否存在
    checkAccout({commit},name){
        return request({
            url:`${api.checkAccout}?accountName=${name}`
        }).then(res=>{
            if(res.code===10000000){
                return true;
            }else{
                return false;
            }
        })
    },

    //用户创建
    createAccount({commit},obj){
        return request({
            method:'post',
            url:`${api.createAccount}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
            }else{
                tip(res.meassage)
            }
        })
    }
}   

//vuex  实例化 Vuex.store   注意暴露
export default {
    namespaced:true,
    state,
    mutations,
    actions
}
