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
            if(res&&res.code===10000000&&res.data){
                return true
            }else{
                res&&tip(res.meassage)
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
     * 删除项目
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
            method:'post',
            url:`${api.getGatewayMenu}`,
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
