
//默认请求地址
const default_url = "http://eplusview.com:8088"

const api={
    //测试
    musicBroadcasting:`https://api.apiopen.top/musicBroadcasting`

    //====================================================================================================
}

export default function(Vue){
    Vue.prototype.$api = api;
}