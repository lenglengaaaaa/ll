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
    // /**
    // *用户创建 
    // * @param {
    //     *      name 账户名称
    //     *      userName 用户名
    //     *      password 密码
    //     *      phoneNum 手机号
    //     *      email 邮箱
    //     *      description 描述
    //     * }
    //     */
    // createAccount({commit},obj){
    //     return request({
    //         method:'post',
    //         url:`${api.createAccount}`,
    //         data:obj
    //     }).then(res=>{
    //         if(res.code===10000000){
    //             tip(res.meassage,'success')
    //             return true;
    //         }else{
    //             tip(res.meassage)
    //             return false;
    //         }
    //     })
    // },

}   

//vuex  实例化 Vuex.store   注意暴露
export default {
    namespaced:true,
    state,
    mutations,
    actions
}
