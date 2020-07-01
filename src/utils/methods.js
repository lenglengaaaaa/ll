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
    const {list,data,type='magic',startTime,endTime} = obj;
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
        case 's800':
        case 'sensor':
            return {
                co:{value:null,createTime:null},
                infrared:{value:null,createTime:null},
                liquid:{value:null,createTime:null},
                batteryA:{value:null,createTime:null},
                shake:{value:null,createTime:null},
                node433:{value:null,createTime:null},
                signal:{value:null,createTime:null},
                CBTemp:{value:null,createTime:null}
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
export const dataProcessing=(list,dataMap,type='line')=>{
    const result = list.reduce((pre,current)=>{
        const { id, name, number, isDelete, deviceType, deviceAdress } = current;
        const currentData = type==='line'? dataMap[id] :
                                type==='s800' || type === 'sensor' ? dataMap[deviceAdress]: '';
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
                    currentDataFilter(currentData,type):defaultValue(type)
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
