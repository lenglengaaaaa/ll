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
    //===============================================用户管理===================================================

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

    //==============================权限管理==============================================

    /**
    * 获取项目整个权限树 ✔
    */
    getPowerTree({commit}){
        return request({
            method:'get',
            url:`${api.getPowerTree}`,
            data:{}
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
    * 获取指定 角色/账户  id的权限信息 ✔
    * 根据角色或者账户的id，获取相关的权限配置信息 
    * @param {
    *      roleOrAccountId 角色/账户  的主键自增id
    *      type 区分是查询角色 还是 查询账户 0 角色  1 账户
    * }
    */
    getPowerInfo({commit},obj){
        return request({
            method:'get',
            url:`${api.getPowerInfo}`,
            data:obj
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
    * 根据父类的资产id，获取所有的其子类子类资产相关权限 ✔
    * 给账户或者角色  初次分配或者修改权限时，资产相关的权限会因为勾选数量的变化，影响到附属资产的级联变动
    * @param {
    *      roleOrAccountId 父角色ID
    *      type 区分是查询角色 还是 查询账户 0 角色  1 账户
    *      assetArr 勾选的资产id 数组 []
    *      assetType 0 项目 ， 1 台区， 2 配电房 井盖和配电柜下无权限配置的资产
    * }
    */
    getSubClassAssest({commit},obj){
        return request({
            method:'post',
            url:`${api.getSubClassAssest}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                return res.data;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    //===============角色==============================

    /**
    * 获取指定角色父角色的权限信息 ✔
    * 角色进行权限修改或者分配时，需要先获到它的父角色权限
    * @param {
    *      roleId 角色ID
    * }
    */
    getRoleParentPower({commit},roleId){
        return request({
            method:'get',
            url:`${api.getRoleParentPower}`,
            data:{
                roleId
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
    * 为角色分配权限(用于创建&编辑) ✔
    * 初次为新建的角色分配权限，所有的主键id 都为null
    * 修改角色的权限 ，此时存在三种情况，
    *   id为null，说明修改时增加赋予的权限 增加时id时null
        id项被删除，删除了相关权限， 不用传
        id对应的数据permissionIds 发生改变 修改时permisssionIds改变
    * @param {
    *      personId                 角色id
    *      id                       不同权限对应的主键id, 新增时为null，或者不传
    *      name                     资产名称，此接口无意义，不传
    *      assetId                  资产id，基础权限和菜单权限为null
    *      permissionIds            权限id字符串，逗号隔开
    *      basiPermissionIds        基础权限对象 {}
    *      menuPermissionIds        菜单权限对象 {}
    *      projecPermissionList     项目权限对象数组 []
    *      courtsPermissionList     台区权限对象数组 []
    *      roomPermissionList       配电房权限对象数组 []
    *      chestPermissionList      配电柜权限对象数组 []
    *      trapPermission           台区权限对象数组 []
    * }
    */
    allotRolePower({commit},obj){
        return request({
            method:'post',
            url:`${api.allotRolePower}`,
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

    //===============账户==============================
    /**
    * 获取某个账户它的角色权限相关信息 ✔
    * 账户进行权限修改或者分配时，需要先获到它的角色权限
    * @param {
    *      accountId 账户id
    * }
    */
    getAccountParentPower({commit},accountId){
        return request({
            method:'get',
            url:`${api.getAccountParentPower}`,
            data:{
                accountId
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
    * 为账户分配权限(用于创建&编辑) ✔
    * 修改账户的权限 ，此时存在三种情况，
    *   id为null，说明修改时增加赋予的权限 增加时id时null
        id项被删除，删除了相关权限， 不用传
        id对应的数据permissionIds 发生改变 修改时permisssionIds改变
    * @param {
    *      personId                 角色id
    *      id                       不同权限对应的主键id, 新增时为null，或者不传
    *      name                     资产名称，此接口无意义，不传
    *      assetId                  资产id，基础权限和菜单权限为null
    *      permissionIds            权限id字符串，逗号隔开
    *      basiPermissionIds        基础权限对象 {}
    *      menuPermissionIds        菜单权限对象 {}
    *      projecPermissionList     项目权限对象数组 []
    *      courtsPermissionList     台区权限对象数组 []
    *      roomPermissionList       配电房权限对象数组 []
    *      chestPermissionList      配电柜权限对象数组 []
    *      trapPermission           台区权限对象数组 []
    * }
    */
    allotAccountPower({commit},obj){
        return request({
            method:'post',
            url:`${api.allotAccountPower}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return res.data;
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
