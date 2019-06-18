import Cookies from 'js-cookie'

const state={
    appObj:{}, //应用对象
    breadcrumbs:[], //应用页面,面包屑对象
    isCollapse:false, //侧板收缩状态
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false
    },
    device: 'desktop'
}

const mutations={
    SET_APP:(state,obj)=>{
        state.appObj=obj
    },
    SET_BREAD:(state,arr)=>{
        state.breadcrumbs = arr
    },
    SET_STATUS:(state,flag)=>{
        state.isCollapse = flag
    },
    //切换侧边栏状态
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
    },
    //关闭侧边栏
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        Cookies.set('sidebarStatus', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
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

    closeSideBar({ commit }, { withoutAnimation }) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
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
