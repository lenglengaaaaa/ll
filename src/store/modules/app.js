import Cookies from 'js-cookie'

const state={
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    },
    device: 'desktop',
    alarmBox:[]
}

const mutations={
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
    },
    SAVE_ALARM:(state,alarm) => {
        state.alarmBox = alarm;
    }
}

const actions= {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }) {
        commit('CLOSE_SIDEBAR')
    },
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    },
    saveAlarm({commit},alarm){
        commit('SAVE_ALARM', alarm)
    }
}   

export default {
    namespaced:true,
    state,
    mutations,
    actions
}
