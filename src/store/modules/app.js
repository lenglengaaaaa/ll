import Cookies from 'js-cookie'

const state={
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    },
    device: 'desktop',
    alarmBox:[],
    alarmFlag:Cookies.get('alarmFlag') ? !!+Cookies.get('alarmFlag') : true,
    tab_index:'',
    Message:null
}

const mutations={
    //切换侧边栏状态
    TOGGLE_SIDEBAR: (state,flag) => {
        if(flag){
            state.sidebar.opened = flag;
        }else{
            state.sidebar.opened = !state.sidebar.opened
        }
        state.sidebar.opened ? Cookies.set('sidebarStatus', 1) : Cookies.set('sidebarStatus', 0);
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
    },

    SWITCH_ALARM:(state)=>{
        state.alarmFlag = !state.alarmFlag;
        state.alarmFlag ? Cookies.set('alarmFlag', 1) : Cookies.set('alarmFlag', 0);
    },

    TAB_INDEX:(state,label)=>{
        state.tab_index = label;
    },

    /**
     * 消息提示
     * @rule 一次只显示一条提示信息
     */
    SET_MESSAGE_OBJ:(state,object)=>{
        state.Message = object;
    }
}

const actions= {
    toggleSideBar({ commit },flag) {
        commit('TOGGLE_SIDEBAR',flag);
    },
    closeSideBar({ commit }) {
        commit('CLOSE_SIDEBAR');
    },
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device);
    },
    saveAlarm({commit},alarm){
        commit('SAVE_ALARM', alarm);
    },
    switchAlarm({commit}){
        commit('SWITCH_ALARM');
    },
    selectTab({commit},label){
        commit('TAB_INDEX',label);
    },
    setMessage({commit},object){
        commit('SET_MESSAGE_OBJ',object);
    }
}   

export default {
    namespaced:true,
    state,
    mutations,
    actions
}
