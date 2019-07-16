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
     * @param 
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


}   

//vuex  实例化 Vuex.store   注意暴露
export default {
    namespaced:true,
    state,
    mutations,
    actions
}
