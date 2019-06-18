const state={
    screenWidth:document.body.clientWidth, //监听视窗
    appObj:{}, //应用对象
    breadcrumbs:[], //应用页面,面包屑对象
    isCollapse:false //侧板收缩状态
}

const mutations={
    SET_WIDTH:(state,width)=>{
        state.screenWidth = width
    },
    SET_APP:(state,obj)=>{
        state.appObj=obj
    },
    SET_BREAD:(state,arr)=>{
        state.breadcrumbs = arr
    },
    SET_STATUS:(state,flag)=>{
        state.isCollapse = flag
    }
}

const actions= {
    //set screenWidth
    getScreenWidth({commit}){
        window.onresize=()=>{
            const width = document.body.clientWidth
            commit('SET_WIDTH', width)
        }
    },

    //set appObj
    setApp({commit},obj){
        commit('SET_APP', obj)
    },
}   

export default {
    namespaced:true,
    state,
    mutations,
    actions
}
