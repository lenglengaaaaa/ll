import { getToken, setToken, removeToken } from '@/utils/auth'
import { request } from '@/utils/Request'
import { api } from '@/utils/API'
import router from '@/router'
import { tip, get_Menu_authority } from '@/utils/methods'
import store from '@/store'

const state={
    token: getToken(),
    userDetail: null,
    permissionIds: null,
    permissionVO: null
}

const mutations={
    SET_TOKEN: (state, token) => {
        state.token = token ;
    },
    SET_PERMISSIONIDS: (state, ids) => {
        state.permissionIds = ids ;
    },
    SET_PERMISSIONVO: (state, vo) => {
        state.permissionVO = vo ;
    },
    SET_USERDETAIL: (state, detail) => {
        state.userDetail = detail;
    }
}

const actions= {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return request({
                method:'post',
                url:`${api.login}?accountName=${username}&password=${password}`,
            }).then(res=>{
                if(res && res.code===10000000 && res.data){
                    const { jtoken, user_detail } = res.data;

                    //setUserDetail
                    commit('SET_USERDETAIL', user_detail);
                    
                    //setToken
                    commit('SET_TOKEN', jtoken);
                    setToken(jtoken);

                    // 获取菜单权限信息
                    return  get_Menu_authority(user_detail.permissionVO);

                }else{
                    res&&tip(res.meassage)
                    return false;
                }   
            })
    },

    // user logout
    logout({ dispatch,commit, state }) {
        return request({
            url:`${api.logout}`
        }).then(()=>{
            dispatch('resetToken');
        }).finally(()=>{
            router.push({name:'Login'})
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            store.dispatch('overall/saveAlarm', [])
            sessionStorage.clear();
            removeToken()
            resolve()
        })
    },

    /**
     * 获取用户列表
     * @param {
     *      size 每页显示大小
     *      current 页码
     *      projectId 项目id,0查询
     * }
     */
    getAccountList({commit},obj){
        return request({
            method:'post',
            url:`${api.accountList}`,
            data:obj
        }).then(res=>{
            if(res&&res.code === 10000000&&res.data){
                return res;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 获取用户详情
     * @param id 用户ID
     */
    getAccountDetail({commit},id){
        return request({
            method:'get',
            url:`${api.accountDetail}`,
            data:{id}
        }).then(res=>{
            if(res&&res.code === 10000000&&res.data){
                commit('SET_USERDETAIL', res.data);
                return res.data;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 验证账户名是否存在
     * @param accountName 账户名称
     */
    checkAccout({commit},name){
        return request({
            method:'get',
            url:`${api.checkAccout}`,
            data:{
                accountName:name
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
    *用户创建 
    * @param {
        *      name 账户名称
        *      userName 用户名
        *      password 密码
        *      operationPwd 操作密码
        *      phoneNum 手机号
        *      email 邮箱
        *      description 描述
        *      roleId 账户所属角色
        * }
        */
    createAccount({commit},obj){
        return request({
            method:'post',
            url:`${api.createAccount}`,
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
    *用户编辑 
    * @param {
        *      id 用户ID
        *      name 账户名称
        *      userName 用户名
        *      phoneNum 手机号
        *      email 邮箱
        *      description 描述
        * }
        */
    updateAccount({commit},obj){
        return request({
            method:'post',
            url:`${api.updateAccount}`,
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
     * 用户删除
     * @param id 用户ID
     */
    deleteAccount({commit},id){
        return request({
            method:'get',
            url:`${api.deleteAccount}`,
            data:{
                id
            }
        }).then(res=>{
            if(res&&res.code ===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *修改密码 
    * @param {
        *      id 用户ID
        *      oldPassword 旧密码
        *      firstNewPassword 新密码
        *      againNewPassword 再次验证新密码
        * }
        */
    updatePass({dispatch,commit},obj){
        return request({
            method:'post',
            url:`${api.updatePass}`,
            data:obj
        }).then(res=>{
            if(res&&res.code ===10000000){
                tip(res.meassage,'success')
                setTimeout(() => {
                    dispatch('resetToken').then(res=>{
                        router.push({name:'Login'})
                    })
                }, 1000);
            }else{
                res&&tip(res.meassage)
            }
        })
    },

    /**
     * 头像上传
     * @param file 图片
     */
    uploadAvatar({commit},file){
        return request({
            method:'post',
            url:`${api.uploadAvatar}`,
            data:{
                file
            }
        }).then(res=>{
            if(res&&res.code ===10000000&&res.data){
                tip(res.meassage,'success')
                return res.data;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 头像更新
     * @param {
     *       id 图片ID
     *       accountId 用户ID
     *       name 图片名字
     *       iamgePath 图片地址
        }
    */
    updateAvatar({commit},obj){
        return request({
            method:'post',
            url:`${api.updateAvatar}`,
            data:obj
        }).then(res=>{
            if(res&&res.code ===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },
    
    /**
     * 设置用户操作密码
     * @param id 用户ID
     * @param operationPwd 操作密码
     */
    // setOperatePass({commit},obj){
    //     return request({
    //         method:'post',
    //         url:`${api.setOperatePass}`,
    //         data:{
    //             id:obj.id,
    //             operationPwd:obj.operationPwd
    //         }
    //     }).then(res=>{
    //         if(res&&res.code ===10000000){
    //             return true;
    //         }else{
    //             res&&tip(res.meassage)
    //             return false;
    //         }
    //     })
    // },

    /**
     * 修改用户操作密码
     * @param id 用户ID
     * @param password 登录密码
     * @param operationPwd 操作密码
     */
    updateOperatePass({commit},obj){
        return request({
            method:'post',
            url:`${api.updateOperatePass}`,
            data:{
                id:obj.id,
                password:obj.password,
                operationPwd:obj.operationPwd
            }
        }).then(res=>{
            if(res&&res.code ===10000000){
                tip(`${res.meassage}`,'success')
                return true;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 验证用户操作密码
     * @param id 用户ID
     * @param operationPwd 操作密码
     */
    checkOperatePass({commit},obj){
        return request({
            method:'post',
            url:`${api.checkOperatePass}`,
            data:{
                id:obj.id,
                operationPwd:obj.operationPwd
            }
        }).then(res=>{
            if(res&&res.code ===10000000){
                return true;
            }else{
                return false;
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
