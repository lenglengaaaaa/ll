import {request} from '@/utils/Request'
import {api} from '@/utils/API'
import {message} from 'element-ui'

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
    * 获取用户列表 ✔
    * @param {
    *      size  每页大小
    *      current 当前页码
    *      filterStr 通过角色名称查询
    * }
    */
    getRoleList({commit},obj){
        return request({
            method:'post',
            url:`${api.getRoleList}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                return res;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
    * 创建角色 ✔
    * @param {
    *      parentId 父角色的id，选择创建的角色属于哪个角色下
    *      name 角色名称
    *      detail 角色描述
    * }
    */
    createRole({commit},obj){
        return request({
            method:'post',
            url:`${api.createRole}`,
            data:{
                parentId:obj.parentId,
                name:obj.name,
                detail:obj.detail
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

    /**
    * 验证角色名称是否已经被使用 ✔
    * @param {
    *      id id不传或者值为null/0 时，为新增角色时验证 , Id >0 时,编辑角色信息验证名称是否被使用
    *      name 角色名称
    * }
    */
    verifyRoleName({commit},obj){
        return request({
            method:'get',
            url:`${api.verifyRoleName}`,
            data:{
                id:obj.id,
                name:obj.name,
            }
        }).then(res=>{
            if(res&&res.code===10000000){
                return true;
            }else{
                return false;
            }
        })
    },

    /**
    * 根据账户id，获取其下的所有子角色 ✔
    * @param {
    *      id 角色主键自增id , 如果不传或者值为0，查询当前登录用户的角色相关子角色信息(不传)
    * }
    */
    getChildRole({commit},id){
        return request({
            method:'get',
            url:`${api.getChildRole}`,
            data:{
                id
            }
        }).then(res=>{
            if(res&&res.code===10000000){
                return res.data;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
    * 编辑角色 ✔
    * @param {
    *      id 角色主键自增id
    *      name 角色名称（需要验证一次角色名是否已经存在被使用）
    *      detail 角色描述
    * }
    */
    updateRole({commit},obj){
        return request({
            method:'post',
            url:`${api.updateRole}`,
            data:{
                id:obj.id,
                name:obj.name,
                detail:obj.detail
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

    /**
    * 获取角色基本信息 
    * @param {
    *      id 角色id
    * }
    */
    getRoleInfo({commit},id){
        return request({
            method:'get',
            url:`${api.getRoleInfo}`,
            data:{
                id
            }
        }).then(res=>{
            if(res&&res.code===10000000){
                return res.data;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
    * 删除角色 ✔
    * @param {
    *      id 角色id
    *       (1) 删除角色成功;
    *       (2) 删除失败，请先删除这个角色下的所有子角色;
    *       (3) 删除失败，请先删除这个角色下的所有账户
    * }
    */
    deleteRole({commit},id){
        return request({
            method:'get',
            url:`${api.deleteRole}`,
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
}   

export default {
    namespaced:true,
    state,
    mutations,
    actions
}
