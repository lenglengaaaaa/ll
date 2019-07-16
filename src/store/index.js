import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import overall from './modules/overall'
import user from './modules/user'
import asset from './modules/asset'
import equip from './modules/equip'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        overall,
        user,
        asset,
        equip
    },
})

export default store
