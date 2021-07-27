/**
 * 全局配置
 */
var cfg = {
    //环境(dev/pro)
    environment:'pro',

    //地址
    request_url:{
        //开发
        "dev":"http://47.92.235.125:8888",
        //生产
        "pro":"http://47.106.170.98:8089"
    },

    //小程序请求地址
    mini_url:{
        //开发
        "dev":"https://www.eplusview.com:8083",
        //生产
        "pro":"https://www.eplusview.com:8083"
    },

    //开发地址mqtt
    dev_mqtt:{
        'mqttUrl':'ws://47.92.235.125:1884',
        'mqttAccount':{
            username:"",
            password:""
        }
    },
    //生产地址mqtt
    pro_mqtt:{
        'mqttUrl':'ws://47.106.170.98:1884',
        'mqttAccount':{
            username:"loraserver",
            password:"jbl21513118"
        }
        
    },

    //解析服务器地址
    analysis_url:{
        "dev":"http://47.92.235.125:8899",
        "pro":"http://47.106.170.98:5555"
    },
    
    //地图中心
    mapCenter:[ 113.952658, 22.531542 ]
}

window.$cfg = cfg