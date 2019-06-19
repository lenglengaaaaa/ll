import Cookies from 'js-cookie'

const state={
    appObj:{}, //应用对象
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    },
    device: 'desktop'
}

const mutations={
    SET_APP:(state,obj)=>{
        state.appObj=obj
    },
    SET_STATUS:(state,flag)=>{
        state.isCollapse = flag
    },
    //切换侧边栏状态
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
    },
    //关闭侧边栏
    CLOSE_SIDEBAR: (state) => {
        Cookies.set('sidebarStatus', 0)
        state.sidebar.opened = false
    },
    //视窗问题
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    }
}

const actions= {
    //set appObj
    setApp({commit},obj){
        commit('SET_APP', obj)
    },

    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },

    closeSideBar({ commit }) {
        commit('CLOSE_SIDEBAR')
    },
    
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    }
}   

export default {
    namespaced:true,
    state,
    mutations,
    actions
}
