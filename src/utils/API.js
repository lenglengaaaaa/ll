//开发地址
const dev_url=$cfg.dev_url;

//生产地址
const pro_url =$cfg.pro_url

const api={
    //测试
    musicBroadcasting:`https://api.apiopen.top/musicBroadcasting`,

    //用户管理
    userList:`${pro_url}/appring/16`

    //====================================================================================================
}

export default function(Vue){
    Vue.prototype.$api = api;
}