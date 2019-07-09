import { getToken, setToken, removeToken } from '@/utils/auth'
import {request} from '@/utils/Request'
import {api} from '@/utils/API'

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
        return new Promise((resolve, reject) => {
            request({
                method:'post',
                url:`${api.login}?accountName=${username}&password=${password}`,
            }).then(res=>{
                const { jtoken,user_detail } = res.data
                commit('SET_TOKEN', jtoken)
                commit('SET_USER', user_detail)
                setToken(jtoken)
                resolve()
            }).catch(error=>{
                reject(error)
            })
        })
    },

    // get user info
    // getInfo({ commit, state }) {
    //     return new Promise((resolve, reject) => {
    //     getInfo(state.token).then(response => {
    //         const { data } = response
    //         if (!data) {
    //             reject('Verification failed, please Login again.')
    //         }
    //         const { name, avatar } = data
    //         commit('SET_NAME', name)
    //         commit('SET_AVATAR', avatar)
    //         resolve(data)
    //     }).catch(error => {
    //         reject(error)
    //     })
    //     })
    // },

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
}   

//vuex  实例化 Vuex.store   注意暴露
export default {
    namespaced:true,
    state,
    mutations,
    actions
}
