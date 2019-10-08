import {request} from '@/utils/Request'
import {api} from '@/utils/API'
import { message } from 'element-ui'

/** 
 * 提示函数 
 */
const tip = (msg,type="error") => {    
    message({
        type,
        message:msg,
        // duration: 1000, 
    });
}

const state={
}

const mutations={
}

const actions= {
    //==================================应用管理==================================
    /**
    * 应用查询
    * @param {
     *      "size":20,
     *      "current":1,
     *      "filterStr"  搜索
     * }
     */
    getAppList({commit},obj){
        return request({
            method:'post',
            url:`${api.getAppList}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    /**
    *应用创建 
    * @param {
        *      id 应用ID
        *      appKey 应用密钥
        *      name 应用名称
        *      detail 应用描述
        *      appType 应用类型
        *      httpsWay https接入方式
        *      netModel 入网类型
        *      agentliteWay AgentLite接入方式
        *      coapWay coap接入方式
        *      mqttWay mqtt接入方式
        * }
        */
    createApp({commit},obj){
        return request({
            method:'post',
            url:`${api.createApp}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *应用编辑 
    * @param {
        *      id 应用ID
        *      appKey 应用密钥
        *      name 应用名称
        *      detail 应用描述
        *      appType 应用类型
        *      httpsWay https接入方式
        *      netModel 入网类型
        *      agentliteWay AgentLite接入方式
        *      coapWay coap接入方式
        *      mqttWay mqtt接入方式
        * }
        */
    updateApp({commit},obj){
        return request({
            method:'post',
            url:`${api.updateApp}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *应用删除 
    * @param {
        *      id 应用ID
        * }
        */
    deleteApp({commit},id){
        return request({
            method:'post',
            url:`${api.deleteApp}`,
            data:{
                id
            }
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },


    //==================================系统操作管理==================================
    /**
     * 获取系统操作管理列表
     * @param {
     *      "type":0,  // 操作类型 0全部 1 创建 2 修改 3 删除 4 其他
     *      "size":20,
     *      "current":1,
     *      "startTime":"2019-01-02",   开始时间，默认为结束时间前7天
     *      "endTime":"2019-8-14"      结束时间,默认为当前时间
     * }
     */
    getOperationList({commit},obj){
        return request({
            method:'post',
            url:`${api.operationList}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

}   

//vuex  实例化 Vuex.store   注意暴露
export default {
    namespaced:true,
    state,
    mutations,
    actions
}
