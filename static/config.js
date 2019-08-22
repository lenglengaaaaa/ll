/**
 * 全局配置
 */

const cfg = {
    //开发地址
    dev_url:"http://47.92.235.125:8888",
    //生产地址
    pro_url:"http://47.92.235.125:8888",
    //mqtt
    mqttUrl:"ws://eplusview.com:1884",
    mqttAccount:{
        username:"loraserver",
        password:"jbl21513118"
    },
    //地图中心
    mapCenter:[113.991244,22.595988]
}

window.$cfg = cfg