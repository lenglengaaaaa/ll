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
     * 验证设备EUI是否存在
     * @param devEUI 设备EUI
     */
    checkEUI({commit},devEUI){
        return request({
            method:'get',
            url:`${api.checkEUI}`,
            data:{
                devEUI
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
     * 设备类型下拉
     * @param type 操作表类型默认为0
     */
    getEquipMenu({commit},number){
        return request({
            method:'get',
            url:`${api.equipTypeMenu}`,
            data:{
                type:0
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
    *创建设备
    * @param {
        *      deviceType 设备类型
        *      name 设备名称
        *      number 设备资产编号
        *      deviceEui 设备EUI
        *      projectId 项目id
        *      detail 描述
        *      longitude 经度
        *      latitude 纬度
        *      location 位置
        *        
        *      trapId 井盖ID
        *      roomId 配电房ID
        *      chestId 配电柜ID
        *      parentId 父类ID
        *      lineId 线缆ID
        *      isSon 是否附属传感器
        *      isSingle 是否独立上传(否->附属,是->是or否附属)
        *      commWay 通讯技术(0:NB,1:LoRa)
        *      gateWayId 网关ID(为LoRa是选择)
        *      outLine 相序ID(魔戒)
        * }
        */
    createEquip({commit},obj){
        return request({
            method:'post',
            url:`${api.createEquip}`,
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
    *设备编辑
    * @param {
        *      id 设备ID
        *      ...同上
        * }
    */
    updateEquip({commit},obj){
        return request({
            method:'post',
            url:`${api.updateEquip}`,
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
     * 设备删除
     * @param {
        *      id 设备ID
        *      number 设备资产编号
        *      deviceEui 设备EUI
        *      isSon 是否附属
        *      isSingle 是否独立上传
        *      commWay 通讯技术
        * }
    */
    deleteEquip({commit},obj){
        return request({
            method:'post',
            url:`${api.deleteEquip}`,
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


}   

//vuex  实例化 Vuex.store   注意暴露
export default {
    namespaced:true,
    state,
    mutations,
    actions
}
