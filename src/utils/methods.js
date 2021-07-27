import store from '../store';
import AMap from "@/utils/AMap";
import moment from 'moment';
import { message } from 'element-ui'

/** 
 * 提示函数 
 * @param msg 提示信息
 * @param type 状态
 */
export const tip = (msg,type='error') => {   
    //1) 关闭已存在的弹窗
    store.state.app.Message && store.state.app.Message.close();

    //2) 弹出新弹窗
    const object = message({
        // showClose:true,//是否可关闭
        type,
        message:msg,
        // duration: 6000, 
    });

    //3) 将message对象进行保存
    store.dispatch('app/setMessage', object);
}

/**
 * sleep函数
 */
export const sleep = (time=500) => {
    return new Promise(resolve => setTimeout(resolve,time))
}

/**
 * 资产管理页面,对单个表单项进行重置
 * @param arr 要清除的表单prop值,['roomId']
 */
export const resetSingle =(_this,arr=[],form="equipForm")=>{
    const _fields = _this.$children[0].$refs[form].fields;
    _fields.map(item=>{
        if(arr.includes(item.prop)){
            // _this.form[item.prop]&&item.resetField();
            item.resetField();
        }
    })
}

/**
 * 判断是否最后一条,是请求上一页
 */
export const judgeLastData=(list,current)=>{
    const nextSize = list.length - 1;
    if(nextSize === 0 ){
        if(current===1){
            return 1;
        }else{
            return current -1;
        }
    }else{
        return 1
    }
}

/**
 * 判断sessionStorage中是否有userDetail
 */
export const judgeUserDetail = () =>{
    if(store.state.user.userDetail){
        return new Promise((resolve,reject)=>{
            resolve(store.state.user.userDetail)
        })
    }else{
        return store.dispatch('user/getAccountDetail').then(res=>{
            if(!res)return;
            return res;
        })  
    }
}

/**
 * 判断sessionStorage中是否有equipTypeMenu
 */
export const judgeEquipTypeMenu = () =>{
    if(!store.state.equip.equipTypeMenu.length){
        return store.dispatch('equip/getEquipTypeMenu').then(res=>{
            if(!res)return;
            return res;
        })  
    }
}

/**
 * 拆分字符串
 */
export const splitString = (value) =>{
    const data  = `${value}`;
    if(data.length !==6)return data;
    const result = [data.slice(0,2),data.slice(0,4),data];
    return result;
}

/**
 * 判断两个对象是否相同
 */
export const judgeObject = (x,y) =>{
    // If both x and y are null or undefined and exactly the same 
    //判断 x , y 是否 null 或 undefined 和是否全等(地址)
    if ( x === y ) return true;

    // If they are not strictly equal, they both need to be Objects 
    //如果两者严格下不相等 , 它们都需要是Object类型
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;

    //They must have the exact same prototype chain,the closest we can do is test the constructor. 
    //两者需要完成相同的原型链(接近的事情就是测试构造函数)
    if ( x.constructor !== y.constructor ) return false;

    for ( var p in x ) { 
        //Inherited properties were tested using x.constructor === y.constructor
        //使用x.构造函数===y.构造函数测试继承原型
        if ( x.hasOwnProperty( p ) ) { 
            if ( ! y.hasOwnProperty( p ) ) return false;

        // If they have the same strict value or identity then they are equal 
        //如它们拥有相同的值或者特性则相同
            if ( x[ p ] === y[ p ] ) continue;

        // Numbers, Strings, Functions, Booleans must be strictly equal 
        // 数字 , 字符串 , 函数 , 布尔 必须完成相等
            if ( typeof( x[ p ] ) !== "object" ) return false;

        // Objects and Arrays must be tested recursively 
        // 对象 和 数组 需 递归测试
            if ( ! Object.equals( x[ p ], y[ p ] ) ) return false;
        } 
    } 
    for ( p in y ) { 
        // allows x[ p ] to be set to undefined 
        // 允许x[p]设置为undefined
        if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
    } 
    return true;
    
    // 简单版
    // return Object.keys(x).every(item=>{
    //     return item in y && x[item] == y[item]
    // })
}

/**
 * 设备历史数据筛选
 * @param object 过滤对象
 * @param names 名称对象
 * @param data 数据
 */
// export const filterData = (obj) =>{
//     const {object,names,data} = obj; 
//     let result = _.cloneDeep(object)
//     let timeArray= [];

//     for(let i in data){
//         const name = names[i];
//         const keys= Object.keys(object);

//         //因为result & temporaryObj 是相同的对象,需进行clone,否则超过最大调用堆栈大小.
//         let temporaryObj =  _.cloneDeep(object);
//         data[i].forEach((item,index)=>{
//             timeArray.push(new Date(item.createTime).getTime());
//             for(let k of keys){ temporaryObj[k].push([moment(item.createTime).format("MM-DD HH:mm:ss"),item[k]])};
//         })
//         for(let k of keys){ result[k].push({name,data:temporaryObj[k]}) };
//     }
//     const timeResult = timeArray.sort().map(item => moment(item).format("MM-DD HH:mm:ss"));

//     return {
//         result,
//         timeResult
//     }
// }

/**
 * 时间差,moment.format取值
 */
export const timeDiff = (startTime,endTime) =>{
    const dayDiff = moment(endTime).diff(moment(startTime),'day');
    const isSameDay = moment(endTime).isSame(startTime,'day');
    const isSameYear = moment(endTime).isSame(startTime,'year');
    switch (true) {
        case (dayDiff >= 365) || !isSameYear:
            return 'YYYY-MM-DD HH:mm:ss';
        case !isSameDay:
            return 'MM-DD HH:mm:ss';
        case isSameDay :
            return 'HH:mm:ss'
        default:
            return 'HH:mm:ss'
    }
}

/**
 * 线缆、S800设备历史数据筛选(最新)
 * @param list 设备列表
 * @param data 数据
 * @param type 类型
 */
export const lastDataFilter = ( obj ) =>{
    const { list, data, type='magic', startTime, endTime } = obj;
    const diffTime = timeDiff(startTime,endTime);
    let timeArray= [];
    const result = list.reduce((pre,current)=>{
        const { id, deviceType, deviceAdress, name } = current ;
        const currentData = type==='magic' ? data[deviceAdress] :
                                type==='sensor'? data[deviceAdress] 
                                    : data[id];
        // if( isDelete || !currentData ) return pre;
        if( !currentData ) return pre;
        let values = [];
        currentData.forEach( value =>{
            values.push([moment(value.createTime).format(diffTime),value.keyValue]);
            timeArray.push(moment(value.createTime).valueOf());
        })
        return [...pre, { name, data:values}];
    },[])
    const timeResult = _.sortBy(timeArray).map(item => moment(item).format(diffTime)) || [];
    return {
        result,
        timeResult
    }
}

/**
 * 魔节历史数据筛选
 */
export const magicDataFilter = (params) =>{
    const { data, name, startTime, endTime } = params;
    const diffTime = timeDiff(startTime,endTime);
    let timeArray= [];
    let obj = {};
    data.forEach(single=>{
        timeArray.push(moment(single.createTime).valueOf());
        const { decodeHex } = single;
        for(let item in decodeHex){
            if(item==='cbtemp'||item==='lat'||item==='lng'||item==='mode'||item==='status'||item==='shake') continue;
            if(!obj[item]) obj[item] = [];
            obj[item].push([moment(single.createTime).format(diffTime),decodeHex[item]]);
        }
    })
    let result = {};
    for(let k in obj){
        if(!result[k]) result[k] = [];
        result[k].push({ name,data:obj[k] });
    }
    const timeResult = _.sortBy(timeArray).map(item => moment(item).format(diffTime)) || [];
    return {
        result,
        timeResult
    }
}



/**
 * 设备历史数据筛选(NEW)
 * @param list 设备列表
 * @param data 数据
 * @param type 类型
 */
// export const newFilterData = (obj) =>{
//     const {list,data,type='magic',startTime,endTime} = obj;
//     const diffTime = timeDiff(startTime,endTime);
//     let timeArray= [];
//     const result = list.reduce((pre,current)=>{
//         const { id, deviceType ,deviceAdress, name, isDelete } = current ;
//         const currentData = type==='magic' ? data[deviceAdress] :
//                                 type==='sensor'? data[deviceAdress] 
//                                     : data[id];
//         // if( isDelete || !currentData ) return pre;
//         if( !currentData ) return pre;
//         let obj = {};
//         currentData.forEach(single=>{
//             for(let item in single){
//                 if(item==='cbtemp'||item==='lat'||item==='lng'||item==='mode'||item==='status'||item==='shake') continue;
//                 if(item==='createTime'){
//                     timeArray.push(moment(single.createTime).valueOf());
//                     continue;
//                 }
//                 if(!obj[item]) obj[item] = [];
//                 obj[item].push([moment(single.createTime).format(diffTime),single[item]]);
//             }
//         })
//         for(let k in obj){
//             if(!pre[k]) pre[k] = [];
//             pre[k].push({ name,data:obj[k] });
//         }
//         return pre;
//     },{})
//     const timeResult = _.sortBy(timeArray).map(item => moment(item).format(diffTime)) || [];
//     return {
//         result,
//         timeResult
//     }
// }

/**
 * 文件下载功能
 */
export const downFile = (content, filename='')=>{
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    eleLink.href = content;
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
}


// 800系列参数
const CommonParams = {
    batteryA:{value:null,createTime:null},
    shake:{value:null,createTime:null},
    node433:{value:null,createTime:null},
    signal:{value:null,createTime:null},
    CBTemp:{value:null,createTime:null}
}

/**
 * 设备视图,无数据有设备时默认值
 */
const defaultValue = (type)=>{
    switch (type) {
        case 'line':
            return {
                batteryA:{value:null,createTime:null},
                CBTemp:{value:null,createTime:null},
                lineA:{value:null,createTime:null},
                lineTemp:{value:null,createTime:null},
                lineV:{value:null,createTime:null},
                node433:{value:null,createTime:null},
                shake:{value:null,createTime:null},
                signal:{value:null,createTime:null}
            }
        case '801':
            return {
                co:{value:null,createTime:null},
                ...CommonParams
            }
        case '803':
            return {
                infrared:{value:null,createTime:null},
                ...CommonParams
            }
        case '805':
            return {
                liquid:{value:null,createTime:null},
                ...CommonParams
            }
        case 's800':
        case 'sensor':
            return {
                co:{value:null,createTime:null},
                infrared:{value:null,createTime:null},
                liquid:{value:null,createTime:null},
                ...CommonParams
            }
        default:
            
    }
}

/**
 * 数据视图实时数据过滤
 * @param list 设备列表
 * @param dataMap 数据
 * @param type 设备类型
 */
export const dataProcessing=( list, dataMap, type='line' )=>{
    const result = list.reduce((pre,current)=>{
        const { id, name, number, isDelete, deviceType, deviceAdress } = current;
        const currentData = type==='line'? dataMap[id] : dataMap[deviceAdress];
        if(isDelete) return pre;
        return [
            ...pre,
            {
                id,
                number,
                name,
                deviceAdress,
                createTime:currentData?
                    moment(currentData.createTime).format('YYYY-MM-DD HH:mm:ss'):null,
                data:currentData?
                    currentDataFilter(currentData,type): defaultValue(type)
            }
        ]
    },[])
    return result;
}

//实时数据过滤 --配合上方处理函数使用
export const currentDataFilter = (res,type)=>{
    let arr ;
    switch (type) {
        case 'magic':
            arr = ['temp','hum','o2','h2s','co','ch4','o3','bat']
            break;
        case 'line':
            arr = ['batteryA','CBTemp','lineA','lineTemp','lineV','node433','shake','signal']
            break;
        case '801':
            arr = ['co','batteryA','shake','node433','signal','CBTemp']
            break;
        case '803':
            arr = ['infrared','batteryA','shake','node433','signal','CBTemp']
            break;
        case '805':
            arr = ['liquid','batteryA','shake','node433','signal','CBTemp']
            break;
        case 's800':
        case 'sensor':
            arr = ['co','infrared','liquid','batteryA','shake','node433','signal','CBTemp']
            break;
        default:
            
    }
    let obj = {};
    for(let i in res){
        if(i==='creatTime')break;
        if(arr.includes(i)){
            obj[i] = {
                value:res[i].keyValue,
                createTime:res[i].createTime && moment(res[i].createTime).format('YYYY-MM-DD HH:mm:ss')
            };
        }
    }
    return obj;
}

/**
 * 原始GPS坐标转换为高德坐标
 */
export const xyTransformation =async (position) => {
    if(!position[0])return false;
    const resMap =await AMap();
    const fetchValue = () =>{
        return new Promise((resolve)=>{
            resMap.convertFrom(position, 'gps', function (status, result) {
                if (result.info === 'ok') {
                    const {lng,lat} = result.locations[0];
                    resolve([lng,lat])
                }
                resolve(position)
            });
        })
    }
    return await fetchValue();
}

/**
 * 菜单权限
 */
export const menuPermission = (id)=>{
    switch (id) {
        case '1':
            return 'Overall'
        case '2':
            return 'Gateway'
        case '111':
            return 'Project'
        default:
            return 'Senior'
    }
}


/**
 * 深拷贝
 */
export const deepCopy = (obj) => {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}

/**
 * 判断是否为手机端
 */
export const isMobile = () => {
    const Flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    return Flag ? true : false;
}

/**
 * 获取菜单权限信息
 */
export const get_Menu_authority = (permissionVO) =>{
    //所有权限
    store.commit('user/SET_PERMISSIONVO', permissionVO);

    //菜单权限信息
    const { basiPermissionIds, menuPermissionIds } = permissionVO;
    const hasEleven = basiPermissionIds && basiPermissionIds.permissionIds.split(',').some(item => item == 11);
    const permissionIds = _.sortBy([
        hasEleven && '111',
        ...(menuPermissionIds?menuPermissionIds.permissionIds.split(','):[])
    ]);
    store.commit('user/SET_PERMISSIONIDS', [...permissionIds,'66','67']);

    return ["1","2","111","14","15","16","17","18","19","20","21"].filter(item=>{
        return permissionIds.includes(item);
    })
}


/**
 * @time 2020/10/23
 * 折线图Y轴单位
 */
export const getYAxisUnit = (value) =>{
    switch (value) {
        case "temp":
        case "lineTemp":
        case "CBTemp":
            return "℃"
        case "hum":
        case "o2":
        case "h2s":
        case "co":
        case "ch4":
        case "o3":
            return "%"
        case "bat":
        case "lineV":
        case "batteryA":
        case "v":
        case "batteryV":
            return "V"
        case "signal":
        case "signalNB":
            return "csq"
        case "lineA":
            return "A"
        case "node433":
            return "Mhz"
        case "illumination":
            return "lx"
        case "inclination":
            return "°"
        default:
            return "";
    }
}


//--------------------------------- ⭐小程序 ---------------------------------------------

    /**
     * 环境变量单位
     */
export const getUnit = (value) =>{
    switch (value) {
        case "temperature"://
        case "lineTemp"://
        case "cbtemp"://
            return "℃"
        case "humidity"://
        case "o2"://
        case "methane"://
        // case "co"://
            return "%"
        case "h2s"://
        case "o3"://
            return "ppm"
        case "lineV"://
        case "batteryA":
        case "batteryV"://
        case "avoltage"://
        case "batteryVoltage"://
        // case "voltage"://
            return "V"
        case "signalIntensity"://
            return "dbm"
        case "signalNB"://
            return "csq"
        case "lineA"://
        case "current"://
            return "A"
        case "node433":
            return "Mhz"
        case "illumination"://
            return "lx"
        case "inclination"://
            return "°"
        default:
            return "";
    }
}
    
export const PICKER_MENU = {
    30:[ //魔节
        {value: "temperature",name: '环境温度'}, 
        {value: "humidity",name: '环境湿度'}, 
        {value: "o2",name: '氧气含量'}, 
        {value: "h2s",name: '硫化氢'}, 
        {value: "methane",name: '烷类'}, 
        {value: "o3",name: '臭氧'}, 
        {value: "batteryV",name: '电池电压'}
    ],
    32:[ //红外
        {value: "infrared",name: '红外数据'}, 
        {value: "shake",name: '震动数据'}, 
        {value: "cbtemp",name: '板子自身温度'}, 
        {value: "batteryV",name: '电池电压'},
        {value: "signalIntensity",name: '信号强度'}
    ],
    33:[ //集中器
        {value: "avoltage",name: '电压'}, 
        {value: "signalNB",name: '信号强度'},
    ],
    35:[ //烟雾
        {value: "co",name: '一氧化碳'}, 
        {value: "shake",name: '震动数据'}, 
        {value: "cbtemp",name: '板子自身温度'}, 
        {value: "batteryV",name: '电池电压'},
        {value: "signalIntensity",name: '信号强度'}
    ],
    36:[ //魔戒
        {value: "temperature",name: '温度'}, 
        {value: "current",name: '电流'}, 
        // {value: "voltage",name: '电压'}, 
        {value: "batteryVoltage",name: '电池电压'}, 
        {value: "signalIntensity",name: '信号强度'}, 
    ],
    37:[ //液位
        {value: "liquid",name: '液位数据'}, 
        {value: "shake",name: '震动数据'}, 
        {value: "cbtemp",name: '板子自身温度'}, 
        {value: "batteryV",name: '电池电压'},
        {value: "signalIntensity",name: '信号强度'}
    ],
    38:[ //线缆温度传感器
        {value: "lineTemp",name: '线缆温度'},
        // {value: "lineA",name: '线缆电流'},  
        // {value: "lineV",name: '线缆电压'}, 
        {value: "batteryV",name: '电池电压'},
        // {value: "cbtemp",name: '板子自身温度'}, 
        {value: "shake",name: '震动数据'}, 
        {value: "signalIntensity",name: '信号强度'}
    ],
    40:[ //电缆定位桩
        {value: "illumination",name: '光照强度'}, 
        {value: "inclination",name: '倾斜角度'}, 
        {value: "batteryV",name: '电池电压'}
    ]
}

//装置类型
export const DEVICE_TYPE = [
    { type:30, name:"电缆监测终端(魔节)" },
    { type:32, name:"红外传感器" },
    { type:33, name:"低压集中器" },
    { type:35, name:"烟雾传感器" },
    { type:36, name:"低压传感器(魔戒)" },
    { type:37, name:"液位传感器" },
    { type:38, name:"线缆温度传感器" },
    { type:40, name:"电缆定位桩" }
]

// 实时
export const PARAM_NAME = {
    temperature:"环境温度",
    humidity:"环境湿度",
    o2:"氧气含量",
    h2s:"硫化氢",
    methane:"烷类",
    o3:"臭氧",
    batteryV:"电池电压",
    cbtemp:"板子自身温度",
    infrared:"红外数据",
    shake:"震动数据",
    signalIntensity:"信号强度",
    avoltage:"电压",
    signalNB:"信号强度",
    co:"一氧化碳浓度",
    liquid:"液位数据",
    illumination:"光照强度",
    inclination:"倾斜角度",
    lineA:"线缆电流",
    lineV:"线缆电压",
    lineTemp:"线缆温度",
    batteryVoltage:"电池电压",
    current:"电流",
    voltage:"电压",
}

export const RETURN_PARAMS = {
    30:{ temperature:[], humidity:[], o2:[], h2s:[], methane:[], o3:[], batteryV:[] },
    32:{ infrared:[], signalIntensity:[], cbtemp:[], shake:[], batteryV:[] },
    33:{ avoltage:[], signalNB:[] },
    35:{ co:[], signalIntensity:[], cbtemp:[], shake:[], batteryV:[] },
    36:{ temperature:[], current:[], voltage:[], batteryVoltage:[], signalIntensity:[] },
    37:{ liquid:[], signalIntensity:[], cbtemp:[], shake:[], batteryV:[] },
    38:{ lineTemp:[], lineA:[], lineV:[], batteryV:[], cbtemp:[], shake:[], signalIntensity:[] },
    40:{ illumination:[], inclination:[], batteryV:[] }
}

//基础信息
export const BASIC_MENU = {
    onlineStatus:{ name:"在线状态", sort:1 },
    name:{ name:"装置名称", sort:3 },
    address:{ name:"装置编号", sort:4 },
    eui:{ name:"EUI", sort:5 },
    affiliation:{ name:"所属资产", sort:6 },
    fatherName:{ name:"所属", sort:7 },
    createTime:{ name:"创建时间", sort:8 },
}

// 0 1 状态显示值判断
export const VALUS = {
    infrared:{ 0:"正常", 1:"入侵" },
    shake:{ 0:"正常", 1:"震动" },
    liquid:{ 0:"正常", 1:"浸水" },
    co:{ 0:"正常", 1:"过高" },
    onlineStatus:{ 0:"离线", 1:"在线"},
    voltage:{ 0:"失压", 1:"有压"}
}


export const DEVICE_COLUMN = {
    30:[  //魔节
        { key: 'temperature', title: '环境温度', width: 50 },
        { key: 'humidity', title: '环境湿度', width: 50 },
        { key: 'o2', title: '氧气', width: 50 },
        { key: 'h2s', title: '硫化氢', width: 50 },
        { key: 'methane', title: '甲烷', width: 50 },
        { key: 'o3', title: '臭氧', width: 50 },
        { key: 'batteryV', title: '电池电压', width: 50 },
        { key: 'dataTime', title: '上报时间', width: 80 },
    ],
    32:[ //红外
        { key: 'infrared', title: '红外数据', width: 50 },
        { key: 'batteryV', title: '电池电压', width: 50 },
        { key: 'cbtemp', title: '板子温度', width: 50 },
        { key: 'shake', title: '震动值', width: 50 },
        { key: 'signalIntensity', title: '信号强度', width: 50 },
        { key: 'dataTime', title: '上报时间', width: 80 },
    ],
    33:[ 
        { key: 'avoltage', title: '电压', width: 50 },
        { key: 'signalNB', title: '信号强度', width: 50 },
        { key: 'dataTime', title: '上报时间', width: 80 }
    ],
    35:[ //烟雾
        { key: 'co', title: '一氧化碳', width: 50 },
        { key: 'batteryV', title: '电池电压', width: 50 },
        { key: 'cbtemp', title: '板子温度', width: 50 },
        { key: 'shake', title: '震动值', width: 50 },
        { key: 'signalIntensity', title: '信号强度', width: 50 },
        { key: 'dataTime', title: '上报时间', width: 80 },
    ],
    37:[ //液位
        { key: 'liquid', title: '液位数据', width: 50 },
        { key: 'batteryV', title: '电池电压', width: 50 },
        { key: 'cbtemp', title: '板子温度', width: 50 },
        { key: 'shake', title: '震动值', width: 50 },
        { key: 'signalIntensity', title: '信号强度', width: 50 },
        { key: 'dataTime', title: '上报时间', width: 80 },
    ],
    36:[ //魔戒
        { key: 'current', title: '电流', width: 50 },
        { key: 'temperature', title: '温度', width: 50 },
        { key: 'batteryVoltage', title: '电池电压', width: 50 },
        { key: 'voltage', title: '电压', width: 50 },
        { key: 'dataTime', title: '上报时间', width: 100 }
    ],
    38:[ //线缆温度传感器
        { key: 'lineTemp', title: '线缆温度', width: 50 },
        { key: 'batteryV', title: '电池电压', width: 50 },
        { key: 'cbtemp', title: '板子温度', width: 50 },
        { key: 'shake', title: '震动值', width: 50 },
        { key: 'signalIntensity', title: '信号强度', width: 50 },
        { key: 'dataTime', title: '上报时间', width: 80 },
    ],
    40:[ //定位桩
        { key: "illumination", title: '光照强度', width: 50 }, 
        { key: "inclination", title: '倾斜角度', width: 50 }, 
        { key: "batteryV", title: '电池电压', width: 50 }, 
        { key: 'dataTime', title: '上报时间', width: 80 }
    ]
}
