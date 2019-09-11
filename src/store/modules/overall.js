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
    /**
    *获取区域树 
    */
    getAreaTree({commit}){
        return request({
            method:'get',
            url:`${api.getAreaTree}`,
        }).then(res=>{
            if(res&&res.code===10000000){
                sessionStorage.setItem('areaTree',JSON.stringify(res.data));
            }else{
                res&&tip(res.meassage)
            }
        })
    },


    /**
     * 验证mac & Card
     * @param {
        *      type 0:mac 1:card
        *      encode 输入值
        * }
     */
    checkMacOrCard({commit},obj={type:0,value:''}){
        return request({
            method:'get',
            url:`${api.checkMacOrCard}`,
            data:{
                type:obj.type,
                encode:obj.value
            }
        }).then(res=>{
            if(res&&res.code===10000000){
                return true
            }else{
                return false
            }
        })
    },

    //==================================项目管理==================================

    /**
     * 项目列表
     * @param {
        *      size 显示数量
        *      current 当前页码
        * }
     */
    getProjectList({commit},obj){
        return request({
            method:'post',
            url:`${api.projectList}`,
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
     * 创建项目
     * @param {
        *      name 显示数量
        *      detail 项目描述
        *      areaId  所属区域ID
        *      location 地址
        * }
        */
    createProject({commit},obj){
        return request({
            method:'post',
            url:`${api.createProject}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    /**
     * 修改项目
     * @param {
        *      name 显示数量
        *      detail 项目描述
        *      areaId  所属区域ID
        *      location 地址
        * }
        */
    updateProject({commit},obj){
        return request({
            method:'post',
            url:`${api.updateProject}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    /**
     * 冻结项目
     * @param id 项目ID
    */
    deleteProject({commit},id){
        return request({
            method:'get',
            url:`${api.deleteProject}`,
            data:{
                id
            }
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    /**
     * 恢复项目
     * @param id 项目ID
     */
    recoveProject({commit},id){
        return request({
            method:'get',
            url:`${api.recoveProject}`,
            data:{
                id
            }
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },
    
    //==================================网关管理==================================

    /**
     * 获取网关列表
     * @param {
        *      size 显示数量
        *      current 当前页码
        * }
     */
    getGatewayList({commit},obj){
        return request({
            method:'post',
            url:`${api.gatewayList}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res
            }else{
                res&&tip(res.meassage);
                return false;
            }
        })
    },

    /**
     * 创建网关
     * @param {
        *      name 网关名称
        *      number 资产编号
        *      detail 详情描述
        *      mac mac地址 
        *      card 卡号
        *      adress 网关地址
        *      longitude 经度 
        *      latitude 纬度
        *      location 位置
        * }
     */
    createGateway({commit},obj){
        return request({
            method:'post',
            url:`${api.createGateway}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true
            }else{
                res&&tip(res.meassage);
                return false;
            }
        })
    },

    /**
     * 编辑网关
     * @param {
     *         id 网关id
        *      name 网关名称
        *      number 资产编号
        *      detail 详情描述
        *      mac mac地址 
        *      card 卡号
        *      adress 网关地址
        *      longitude 经度 
        *      latitude 纬度
        *      location 位置
        * }
     */
    updateGateway({commit},obj){
        return request({
            method:'post',
            url:`${api.updateGateway}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true
            }else{
                res&&tip(res.meassage);
                return false;
            }
        })
    },

    /**
     * 删除网关
     * @param {
        *      id 网关ID
        *      number 资产编号
        *      mac mac地址 
        *      card 卡号
        * }
     */
    deleteGateway({commit},obj){
        return request({
            method:'post',
            url:`${api.deleteGateway}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true
            }else{
                res&&tip(res.meassage);
                return false;
            }
        })
    },

    /**
     * 网关激活
     * @param {
        *      id 网关ID
        *      name 网关名称
        *      number 资产编号
        *      mac mac地址 
        *      card 卡号
        * }
     */
    activeGateway({commit},obj){
        return request({
            method:'post',
            url:`${api.activeGateway}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return true
            }else{
                res&&tip(res.meassage);
                return false;
            }
        })
    },

    
    /**
     * 获取网关下拉列表
     * @param {
     *      size 显示数量
     *      current 当前页码
     * }
     */
    getGatewayMenu({commit},obj){
        return request({
            method:'get',
            url:`${api.getGatewayMenu}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res.data
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    //==================================统计==================================
    /**
     * 获取项目下不同设备数量
     * @param projectId 项目ID
     */
    getEquipCount({commit},projectId){
        return request({
            method:'get',
            url:`${api.getEquipCountOnProject}`,
            data:{projectId}
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res.data
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    /**
     * 获取项目下soe数量
     * @param {
     *      query 查询ID
     *      queryType 0项目 1配电柜 2配电房 3线缆 4井盖 5相序
     *      startTime 起始时间
     *      endTime 结束时间
     *      timeType 查询时间类型 0月 1年
     * }
     */
    getSoeCount({commit},obj){
        return request({
            method:'post',
            url:`${api.getSoeCount}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res.data
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    /**
     * 获取设备的经纬度、位置信息
     * @param projectId 项目ID
     */
    getDeviceAddress({commit},projectId){
        return request({
            method:'get',
            url:`${api.getDeviceAddress}`,
            data:{
                projectId
            }
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res.data
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },


    //==================================告警管理==================================
    /**
     * 获取告警列表
     * @param {
     *      "projectId":1,  项目id
     *      "status":0,     告警状态 0 未处理 1 已处理 2 不处理 3 延期
     *      "size":20,
     *      "current":1,
     *      "startTime":"2019-01-02",   开始时间，默认为结束时间前7天
     *      "endTime":"2019-8-14"      结束时间,默认为当前时间
     * }
     */
    getAlarmList({commit},obj){
        return request({
            method:'post',
            url:`${api.getAlarmList}`,
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
     * 获取告警详情
     * @param id 告警ID
     * @param type 0独立告警 1附属告警
     */
    getAlarmDetail({commit},obj){
        return request({
            method:'get',
            url:`${api.getAlarmDetail}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res.data
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    /**
     * 告警处理
     * @param {
     *      warning 告警ID
     *      details 告警处理详情
     *      type 0独立告警 1附属告警
     *      status 告警状态 0未处理 1已处理 2不处理 3延期
     * }
     */
    handleAlarm({commit},obj){
        return request({
            method:'post',
            url:`${api.alarmHandle}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                res&&tip(res.meassage,'success')
                return true;
            }else{
                res&&tip(res.meassage)
                return false
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
