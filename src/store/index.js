import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {request} from '@/utils/Request'

Vue.use(Vuex);

/*1.state在vuex中用于存储数据*/
const state={
    token: getToken(),
    name: '',
    avatar: ''
}

/*2.mutations里面放的是方法，方法主要用于改变state里面的数据
*/
const mutations={
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    }
}

/*3、优点类似计算属性 ，改变state里面的count数据的时候会触发 getters里面的方法 获取新的值 (基本用不到)*/
const getters= {

}


/*
4、 基本没有用
Action 类似于 mutation，不同在于：
Action 提交的是 mutation，而不是直接变更状态。
Action 可以包含任意异步操作。
*/
const actions= {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            commit('SET_TOKEN', '111')
            setToken('111')
            resolve()
            // login({ username: username.trim(), password: password }).then(response => {
            //     const { data } = response
                // commit('SET_TOKEN', data.token)
                // setToken(data.token)
            //     resolve()
            // }).catch(error => {
            //     reject(error)
            // })
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
            const { data } = response
            if (!data) {
                reject('Verification failed, please Login again.')
            }
            const { name, avatar } = data
            commit('SET_NAME', name)
            commit('SET_AVATAR', avatar)
            resolve(data)
        }).catch(error => {
            reject(error)
        })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
            // logout(state.token).then(() => {
            //     commit('SET_TOKEN', '')
            //     removeToken()
            //     resolve()
            // }).catch(error => {
            //     reject(error)
            // })
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
const store = new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})


export default store;

