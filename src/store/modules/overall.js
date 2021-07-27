import {request} from '@/utils/Request'
import {api} from '@/utils/API'
import { tip } from '@/utils/methods'

const state={
    areaTree:[],
    alarmBox:[],
    pileAlarm:{}
}

const mutations={
    SET_AREATREE: (state, tree) => {
        state.areaTree = tree;
    },
    SAVE_ALARM:(state,alarm) => {
        state.alarmBox = alarm;
    },
    REPLACE_PILE:(state,alarm) => {
        state.pileAlarm = alarm;
    },
}

const actions= {
    saveAlarm({commit},alarm){
        commit('SAVE_ALARM', alarm);
    },
    replacePileAlarm({commit},alarm){
        commit('REPLACE_PILE', alarm);
    },
    /**
    *获取区域树 
    */
    getAreaTree({commit}){
        return request({
            method:'get',
            url:`${api.getAreaTree}`,
        }).then(res=>{
            if(res&&res.code===10000000){
                commit('SET_AREATREE', res.data);
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


    /**
     * 全局搜索设备,可以对 安装地址，设备名称，设备编号，eui 模糊搜索
     * 装置查询 GET
     * @param Integer deviceType 装置类型
     * @param String projectIds 项目ID
     * @param String nameOrAssetsCode 地址域或装置,编号名称
     * @param Integer pageNum 当前页
     * @param Integer pageSize 每页显示条数
    */
    getAllDevice({commit},data){
        return request({
            method:'get',
            url:`${api.deviceQuery}`,
            data
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res.data
            }else{
                return false
            }
        })
    },

    /**
     * ⭐ miniProgram
     * 根据项目ID查询地图上设备/设施 get
     * @param Integer projectId 项目ID
     */
    getMapLabel({commit},projectId){
        return request({
            method:'get',
            url:`${api.getMapLabel}?projectId=${projectId}`,
        }).then(res=>{
            if(res && res.code===10000000){
                return res.data
            }else{
                return false
            }
        })
    },

    /**
     *  ⭐ miniProgram
     *  获取设备告警统计数量 get
     *  @param Integer projectId 项目ID
    */
    getCountEquipmentTotal({commit},projectId){
        return request({
            url:`${api.getCountEquipmentTotal}?projectId=${projectId}`,
            method:"get"
        }).then(res=>{
            if( res && res.code===10000000 ){
                return res.data;
            }else{
                return false;
            }
        })
    },

    //==================================概览==================================

    /**
     * 获取 在线设备/设备总数
     */
    getOnlineDevice({commit}){
        return request({
            method:'get',
            url:`${api.getOnlineDevice}`,
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
     * 获取 在线设备/设备总数
     */
    getLiveProject({commit}){
        return request({
            method:'get',
            url:`${api.getLiveProject}`,
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
     * 获取首页概览下 设备的位置信息
     */
    getDeviceAddressInAll({commit}){
        return request({
            method:'get',
            url:`${api.deviceAddressInAll}`,
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
     * 获取首页概览下 网关的位置信息
     */
    getGatewayAddressInAll({commit}){
        return request({
            method:'get',
            url:`${api.gatewayAddressInAll}`,
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res.data
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
     * 获取不同设备数量
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
     * 获取soe数量
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
    // 旧接口
    getAlarmList_old({commit},obj){
        const { rank } = obj;
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
     * 获取一/二级告警列表
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
        const { rank } = obj;
        return request({
            method:'post',
            url:`${rank ==83? api.getStairAlarmList: api.getSecondAlarmList}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                return res
            }else{
                res&&tip("查询失败!")
                return false
            }
        })
    },

    /**
     * 获取告警详情(旧)
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
     * 获取一级/二级告警详情
     * @param {
     *      "projectId":1,  项目id
     *      "status":0,     告警状态 0 未处理 1 已处理 2 不处理 3 延期
     *      "size":20,
     *      "current":1,
     *      "startTime":"2019-01-02",   开始时间，默认为结束时间前7天
     *      "endTime":"2019-8-14"      结束时间,默认为当前时间
     *      "deviceAddress"     设备编码
     *      "cmdType"   设备所属告警类型一类告警必须填83
     * }
     */
    getRankAlarmDetail({comiit},obj){
        const { cmdType } = obj;
        return request({
            method:'post',
            url:`${cmdType== 1? api.getStairAlarmDetail: api.getSecondAlarmDetail}`,
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

    /**
     * 导出告警
     * @param {
     *      projectId 项目ID
     *      startTime 起始时间
     *      endTime   结束时间
     *      告警类型   0未处理  1已处理  2不处理  3延期
     * }
     */
    exportAlarm({commit},obj){
        return request({
            method:'post',
            url:`${api.exportAlarm}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000&&res.data){
                tip(res.meassage,'success')
                return res.data
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    //==================================阈值设置==================================
    /**
     * 查看告警阈值设置详情
     * @param {
     *       setId,         设备ID
     *       setType,       设备类型(0:设备 1:应用)
     *       deviceType    设备类型
     * }
     */
    getDeviceThreshold({commit},obj){
        return request({
            method:'get',
            url:`${api.getDeviceThreshold}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                return res.data
            }else{
                res&&tip(res.meassage)
                return false
            }
        })
    },

    /**
     * 新增告警阈值设置(第一次设置)
     * @param {
     *       setId,         设备ID
     *       setType,       设备类型(0:设备 1:应用)
     *       deviceType     设备类型
     *       deviceAddress  *设置应用时不需要
     *       deviceEui      *设置应用时不需要
     *       commWay        *使用的通讯技术（0.NB-IoT 1.LoRa）  设置应用时不需要
     *       payload        设置值域 json {"line":100}
     *       description    描述
     * }
     */
    addThresholdSet({commit},obj){
        return request({
            method:'post',
            url:`${api.addThresholdSet}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return res.data;
            }else{
                res&&tip(res.meassage);
                return false
            }
        })
    },

    /**
     * 修改告警阈值设置
     * @param {
     *       id             阈值ID      
     *       setId,         设备ID
     *       setType,       设备类型(0:设备 1:应用)
     *       deviceType     设备类型
     *       deviceAddress  *设置应用时不需要
     *       deviceEui      *设置应用时不需要
     *       commWay        *使用的通讯技术（0.NB-IoT 1.LoRa）  设置应用时不需要
     *       payload        设置值域 json {"line":100}
     *       description    描述
     * }
     */
    updateThresholdSet({commit},obj){
        return request({
            method:'post',
            url:`${api.updateThresholdSet}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip(res.meassage,'success')
                return res.data;
            }else{
                res&&tip(res.meassage);
                return false
            }
        })
    },

    /**
     * 删除告警阈值设置
     * @param {
     *       id             阈值ID      
     * }
     */
    deleteThresholdSet({commit},obj){
        return request({
            method:'get',
            url:`${api.deleteThresholdSet}`,
            data:obj
        }).then(res=>{
            if(res&&res.code===10000000){
                tip('成功重置为默认值','success')
                return res.data;
            }else{
                return false
            }
        })
    },


     //==================================高德API==================================
    /**
     * 根据 address or city 获取地址位置 
     * @param address 填写结构化地址信息:省份＋城市＋区县＋城镇＋乡村＋街道＋门牌号码(必填)
     * @param city 查询城市，可选：城市中文、中文全拼、citycode、adcode (非必填)
     */
    getGeocode({commit},address){
        return request({
            method:'get',
            url:`${api.getGeocode}`,
            data:{
                key:'b57bd156556a781335a71493a4c0b473',
                address
            }
        }).then(res=>{
            if(res && res.infocode == 10000 && res.geocodes.length){
                return res.geocodes;
            }else{
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
