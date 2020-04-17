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
    equipTypeMenu: JSON.parse(sessionStorage.getItem('equipTypeMenu'))
}

const mutations={
    SET_MENU: (state, menu) => {
        state.equipTypeMenu = menu;
    },
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
     * 验证目标地址域是否已经存在
     * @param deviceAddress 地址域
     */
    checkAddress({commit},deviceAddress){
        return request({
            method:'get',
            url:`${api.checkAddress}`,
            data:{
                deviceAddress
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
    getEquipTypeMenu({commit},number=0){
        return request({
            method:'get',
            url:`${api.equipTypeMenu}`,
            data:{
                type:number
            }
        }).then(res=>{
            if(res&&res.code===10000000){
                sessionStorage.setItem('equipTypeMenu',JSON.stringify(res.data));
                commit('SET_MENU', res.data)
                return res.data;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 获取设备列表
      * @param {
        *      size 每页显示条数
        *      current 当前页码
        *      deviceType 设备类型
        *      commWay 通讯技术,0:NB,1:Lora
        *      projectId 项目id
        *      trapId 井盖ID
        *      roomId 配电房ID
        *      chestId 配电柜ID
        *      lineId 线缆ID
        *      isSingle 是否为独立
        *      filterStr 模糊查询
        * }
        */
    getEquipList({commit},obj){
        return request({
            method:'post',
            url:`${api.equipList}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res;
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

    /**
     * 设备下拉列表
     * @param {
        *      deviceType 设备ID
        *      projectId 项目ID
        *      isSon 是否是附属传感器（0.为是 1.为否）
        *      isSingle 是否为独立上传（0.为是 1.为否）
        *      commWay 使用的通讯技术（0.NB-IoT 1.LoRa）
        *      trapId 井盖id
        *      roomId 关联的配电房id
        *      chestId 关联的配电柜id
        *      lineId 关联的线缆id
        *      parentId 父类id
        *      gatewayId 关联的网关Id
        * 
        *      ** 所有字段都可以不传，或者传null
        * }
    */
    getEquipMenu({commit},obj){
        return request({
            method:'post',
            url:`${api.equipMenu}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res.data;
            }else{
                res&&tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 获取配电柜下魔戒视图(详情数据)
     * @param id 配电柜ID
     */
    getRingDetail({commit},id){
        return request({
            method:'get',
            url:`${api.ringDetail}`,
            data:{
                id
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

    /**
     * 获取配电房下魔戒历史数据
     * @param queryId 相序ID
     * @param startTime 开始时间,不传默认为结束时间前7天
     * @param endTime 结束时间,不传默认为当前时间
     */
    getRingHistoryData({commit},obj){
        return request({
            method:'post',
            url:`${api.ringHistoryData}`,
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
     * 获取资产下设备列表
     *  @param {
     *      roomId 配电房ID,二选一
     *      chestId 配电柜ID,二选一
     *      type  0 魔戒 1 独立传感器列表
     *      size 每页显示条目个数
     *      current 当前页码
     * }
     */
    getEquipInAsset({commit},obj){
        return request({
            method:'post',
            url:`${api.equipInAsset}`,
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
     * 获取井盖下线缆的数据(实时)
     * @param {
    *      queryId  井盖ID
    * }
    */
    getLineCurrentData({commit},queryId){
        return request({
            method:'post',
            url:`${api.getLineCurrentData}`,
            data:{
                queryId
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


    /**
     * 获取井盖下线缆的数据(历史)
     * @param {
     *      queryId  井盖ID
     *      startTime 开始时间
     *      endTime  结束时间
     * }
     */
    getTrapLineHistory({commit},obj){
        return request({
            method:'post',
            url:`${api.getTrapLineHistory}`,
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
     * 获取魔节的最新数据(实时)
     * @param {
    *      queryId  魔节ID
    *      assetId  资产ID
    *      assetType  0:配电柜 1:配电房 2:井盖
    * }
    */
    getCurrentMagicData({commit},obj){
        return request({
            method:'post',
            url:`${api.getCurrentMagicData}`,
            data:obj
        }).then(res=>{
            if( res && res.code===10000000 && res.data ){
                return res.data;
            }else{
                res&&tip(res.meassage);
                return false
            }
        })
    },

    /**
     * 获取魔节的历史数据
     * @param {
    *      assetId  资产ID
    *      assetType  0:配电柜 1:配电房 2:井盖
    *      startTime 起始时间
    *      endTime 结束时间
    * }
    */
    getMagicHistoryData({commit},obj){
        return request({
            method:'post',
            url:`${api.getMagicHistoryData}`,
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
     * 获取资产下s800的实时数据
     * @param {
     *      assetId  资产ID
     *      assetType  0:配电柜 1:配电房 2:井盖
     * }
     */
    gets800CurrentData({commit},obj){
        return request({
            method:'post',
            url:`${api.gets800CurrentData}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res.data
            }else{
                if(res && res.code !== 10000000 ) res&&tip(res.meassage)
                return false
            }
        })
    },

    /**
     * 获取资产下s800的历史数据
     * @param {
        *      assetId  资产ID
        *      assetType  0:配电柜 1:配电房 2:井盖
        *      startTime 起始时间 (2019-01-01)
        *      endTime 结束时间 (2019-01-1)
        * }
        */
    gets800HistoryData({commit},obj){
        return request({
            method:'post',
            url:`${api.gets800HistoryData}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res.data
            }else{
                res&&tip(res.meassage);
                return false
            }
        })
    },

    /**
     * 获取资产下的s801、s803、s805 实时数据
     * @param {
     *      assetId  资产ID
     *      assetType  0:配电柜 1:配电房 2:井盖
     * }
     */
    getS801CurrentData({commit},obj){
        return request({
            method:'post',
            url:`${api.getS801CurrentData}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000 && res.data){
                return res.data;
            }else{
                if(res && res.code !== 10000000 ) res&&tip(res.meassage);
                return false
            }
        })
    },

    getS803CurrentData({commit},obj){
        return request({
            method:'post',
            url:`${api.getS803CurrentData}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000 && res.data){
                return res.data;
            }else{
                if(res && res.code !== 10000000 ) res&&tip(res.meassage);
                return false
            }
        })
    },

    getS805CurrentData({commit},obj){
        return request({
            method:'post',
            url:`${api.getS805CurrentData}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000 && res.data){
                return res.data;
            }else{
                if(res && res.code !== 10000000 ) res&&tip(res.meassage);
                return false
            }
        })
    },

    /**
     * 获取资产下的s801、s803、s805 历史数据
     * @param {
     *      assetId  资产ID
     *      assetType  0:配电柜 1:配电房 2:井盖
     *      createTime 起始时间 (2019-01-01)
     *      endTime 结束时间 (2019-01-1)
     *      key 环境变量
     * }
     */
    getS801HistoryData({commit},obj){
        return request({
            method:'post',
            url:`${api.getS801HistoryData}`,
            data:obj
        }).then(res=>{
            if(res && res.code===10000000 && res.data){
                return res.data
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    getS803HistoryData({commit},obj){
        return request({
            method:'post',
            url:`${api.getS803HistoryData}`,
            data:obj
        }).then(res=>{
            if(res && res.code===10000000&&res.data){
                return res.data
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    getS805HistoryData({commit},obj){
        return request({
            method:'post',
            url:`${api.getS805HistoryData}`,
            data:obj
        }).then(res=>{
            if(res && res.code===10000000&&res.data){
                return res.data
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    /**
     * 导出资产下的魔节历史数据
     * @param 同历史数据
     */
    getMagicHistoryExecl({commit},obj){
        return request({
            method:'post',
            url:`${api.getMagicHistoryExecl}`,
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
     * 导出井盖下线缆的历史数据
     * @param 同历史数据
     */
    getTrapHistoryExecl({commit},obj){
        return request({
            method:'post',
            url:`${api.getTrapHistoryExecl}`,
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
     * 导出资产下s800的历史数据
     * @param 同历史数据
     */
    getS800HistoryExecl({commit},obj){
        return request({
            method:'post',
            url:`${api.getS800HistoryExecl}`,
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
     * 导出资产下s801、s803、s805的历史数据
     * @param 同历史数据
     */
    getS801HistoryExecl({commit},obj){
        return request({
            method:'post',
            url:`${api.getS801HistoryExecl}`,
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

    getS803HistoryExecl({commit},obj){
        return request({
            method:'post',
            url:`${api.getS803HistoryExecl}`,
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

    getS805HistoryExecl({commit},obj){
        return request({
            method:'post',
            url:`${api.getS805HistoryExecl}`,
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
     * 导出配电柜下单个出线的历史视图
     * @param 同历史数据
     */
    getRingHistoryExecl({commit},obj){
        return request({
            method:'post',
            url:`${api.getRingHistoryExecl}`,
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
     * Lora 设备激活时获取随机设备地址
     * @param deviceEui Lora 设备deviceEuii
     */
    getRandomEui({commit},deviceEui){
        return request({
            method:'get',
            url:`${api.getRandomEui}`,
            data:{
                deviceEui
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

    /**
     * Lora 设备激活
     * @param {
     *      appSKey  应用密钥
     *      devAddr  设备地址
     *      devEUI 设备eui
     *      fCntDown 下行帧数
     *      fCntUp 上行帧数
     *      nwkSKey 网络密钥
     * }
     */
    activateDevice({commit},obj){
        return request({
            method:'post',
            url:`${api.activateDevice}`,
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
    }
}   

//vuex  实例化 Vuex.store   注意暴露
export default {
    namespaced:true,
    state,
    mutations,
    actions
}
