/**
 * 全局配置
 */

const cfg = {
    //开发地址
    dev_url:"http://47.92.235.125:8888",
    //生产地址
    pro_url:"http://eplusview.com:8088",
    //mqtt
    mqttUrl:"ws://eplusview.com:1884",
    mqttAccount:{
        username:"loraserver",
        password:"jbl21513118"
    },
    //顶部导航栏
    navMenU:[],
    //侧边栏列表
    siderMenu:[]
}

window.$cfg = cfg