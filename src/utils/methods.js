import store from '../store'
import { resolve } from 'url';

/**
 * 资产管理页面,对单个表单项进行重置
 * @param arr 要清除的表单prop值,['roomId']
 */
export const resetSingle =(_this,arr=[],form="equipForm")=>{
    const _fields = _this.$children[0].$refs[form].fields;
    _fields.map(item=>{
        if(arr.includes(item.prop)){
            _this.form[item.prop]&&item.resetField();
        }
    })
}

/**
 * 判断是否最后一条,是请求上一页
 */
export const judgeLastData=(list,current)=>{
    const nextSize = list.length - 1;
    if(!nextSize){
        if(current===1){
            return 1;
        }else{
            return current -1;
        }
    }
}

/**
 * 判断sessionStorage中是否有userDetail
 */
export const judgeUserDetail = () =>{
    if(sessionStorage.getItem('userDetail')){
        return new Promise((resolve,reject)=>{
            resolve(JSON.parse(sessionStorage.getItem('userDetail')))
        })
    }else{
        return store.dispatch('user/getAccountDetail').then(res=>{
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
}

/**
 * 设备历史数据筛选
 * @param object 过滤对象
 * @param names 名称对象
 * @param data 数据
 */
export const filterData = (obj) =>{
    const {object,names,data} = obj; 
    let result = _.cloneDeep(object)
    let timeArray= [];

    for(let i in data){
        const name = names[i];
        const keys= Object.keys(object);

        //因为result & temporaryObj 是相同的对象,需进行clone,否则超过最大调用堆栈大小.
        let temporaryObj =  _.cloneDeep(object);
        data[i].forEach((item,index)=>{
            timeArray.push(new Date(item.createTime).getTime());
            for(let k of keys){ temporaryObj[k].push([moment(item.createTime).format("MM-DD HH:mm:ss"),item[k]])};
        })
        for(let k of keys){ result[k].push({name,data:temporaryObj[k]}) };
    }
    const timeResult = timeArray.sort().map(item => moment(item).format("MM-DD HH:mm:ss"));

    return {
        result,
        timeResult
    }
}