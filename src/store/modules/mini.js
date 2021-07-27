import { request } from '@/utils/Request'
import { api } from '@/utils/API'
import router from '@/router'
import { tip, get_Menu_authority } from '@/utils/methods'
import store from '@/store'

const state={

}

const mutations={
}


// ⭐ 小程序接口调用
const actions= {

    // ---------------------------- ❤ 装置创建-------------------------------------------------------

    /**
      * 魔戒创建 post
      * @param Integer communicationTechnology 通讯技术（1、NB-IOT，2、LoRa，3、4G）
      * @param String ringName 设备名称
      * @param String assetsCode 资产编号
      * @param Integer transformerId 所属台区
      * @param Integer voltageConcentratorId 所属集中器
      * @param Integer distributionRoomId 所属配电房
      * @param Integer distributionCabinetId 所属配电柜
      * @param String loopCode 所属回路
      * @param String phaseSequence 相序
      * @param String positionInformation 位置信息
      * @param Integer isIndependent 是否为独立传感器（1、是；0、否）
      */
    ringCreate({commit},data){
        return request({
            url:api.ringCreate,
            method:"post",
            data
        }).then(res=>{
            if( !res ){
                tip("创建失败");
                return false;
            }else{
                tip("创建成功",'success');
                return true;
            };
        })
    },

    /**
      * 创建
      * 集中器创建 post
      * @param Integer communicationTechnology 通讯技术（1、NB-IOT，2、LoRa，3、4G）
      * @param String voltageConcentratorName 集中器名称
      * @param String assetsCode 资产编号
      * @param Integer voltageConcentratorEui 集中器EUI
      * @param Integer transformerId 所属台区/变压器
      * @param Integer distributionRoomId 所属配电房 
      * @param String positionInformation 位置信息
      */
    concentratorCreate({commit},data){
        return request({
            url:api.concentratorCreate,
            method:"post",
            data
        }).then(res=>{
            if( !res ){
                tip("创建失败");
                return false;
            }else{
                tip("创建成功",'success');
                return true;
            };
        })
    },

    /**
      * 创建
      * 线缆传感器创建 post
      * @param Integer communicationTechnology 通讯技术（1、NB-IOT，2、LoRa，3、4G）
      * @param String cableName 线缆名称
      * @param String assetsCode 资产编号
      * @param Integer assetsType 所属资产类型（1、低压；2、高压）
      * @param Integer transformerId 所属台区or井盖ID
      * @param Integer roomId 所属配电房or线缆ID 
      * @param Integer cabinetId 所属魔节或配电柜ID 
      * @param String positionInformation 位置信息
      */
    cableTempCreate({commit},data){
        return request({
            url:api.cableTempCreate,
            method:"post",
            data
        }).then(res=>{
            if( !res ){
                tip("创建失败");
                return false;
            }else{
                tip("创建成功",'success');
                return true;
            };
        })
    },

    /**
      * 创建
      * 独立传感器创建 post
      * @param Integer assetsType 所属资产类型（1、低压；2、高压）
      * @param Integer sensorType 传感器类型（1、红外；2、液位；3、烟感）
      * @param Integer communicationTechnology 通讯技术（1、NB-IOT，2、LoRa，3、4G）
      * @param String name 名称
      * @param String assetsCode 资产编号
      * @param String eui 设备EUI false
      * @param Integer transformerId 所属台区or井盖ID
      * @param Integer hostId 所属主机ID（魔节ID或集中器ID 
      * @param String positionInformation 位置信息
      */
    independentSensorCreate({commit},data){
        return request({
            url:api.independentSensorCreate,
            method:"post",
            data
        }).then(res=>{
            if( !res ){
                tip("创建失败");
                return false;
            }else{
                tip("创建成功",'success');
                return true;
            };
        })
    },

    /**
      * 创建
      * 魔节创建 post
      * @param Integer communicationTechnology 通讯技术（1、NB-IOT，2、LoRa，3、4G）
      * @param String magicFestivalName 魔节名称
      * @param String address 地址域
      * @param String eui 设备EUI
      * @param Integer assetsType 所属资产类型（1、井盖；2、台区）
      * @param Integer transformerId 所属台区or井盖ID
      * @param String positionInformation 位置信息 ?缺少
      */
    magicCreate({commit},data){
        return request({
            url:api.magicCreate,
            method:"post",
            data
        }).then(res=>{
            if( !res ){
                tip("创建失败");
                return false;
            }else{
                tip("创建成功",'success');
                return true;
            };
        })
    },

    /**
      * 创建
      * 电缆定位桩创建 post
      * @param Integer communicationTechnology 通讯技术（1、NB-IOT，2、LoRa，3、4G）
      * @param String name 名称
      * @param String assetsCode 资产编号
      * @param String eui 设备EUI
      * @param String cablePass 电缆通道
      * @param String noticePhoneA 通知电话A
      * @param String noticePhoneB 通知电话B
      * @param String noticePhoneC 通知电话C
      * @param String positionInformation 位置信息
      * @param String concentratorLongitude 位置经度
      * @param String concentratorLatitude 位置纬度
      */
    cablePileCreate({commit},data){
        return request({
            url:api.cablePileCreate,
            method:"post",
            data
        }).then(res=>{
            if( res && res.code == 10000000 ){
                tip("创建成功",'success');
                return true;
                
            }else{
                const { meassage } = res;
                tip(meassage);
                return false;
            };
        })
    },

    /**
     * 检验装置编号/EUI是否存在 get
     * @param Interger deviceType 装置类型（30、魔节；32、红外传感器；35、烟雾传感器；37、液位传感器；38、线缆温度传感器；40、线缆定位桩；33、集中器；36、魔戒）
     * @param String assetsCode 装置编号
     * @param String eui 装置EUI(魔节,集中器,电缆桩)
     */
    checkoutDeviceNumOrEui({commit},data){
        return request({
            method:'get',
            url:`${api.checkoutDeviceNumOrEui}`,
            data
        }).then(res=>{
            if( res && res.code === 10000000 ){
                return res.data
            }
        })
    },


    /**
     * 获取台区下拉
     * @param Integer projectId 项目ID
     */
    getCourtsMenu({commit},projectIds){
        return request({
            url:`${api.getCourtsMenu}?projectIds=${projectIds}`,
            method:"get",
        }).then(res=>{
            if( !res ){
                tip("获取台区列表失败");
                return false;
            }else{
                return res.data;
            };
        })
    },

    /**
     * 下拉列表
     * 获取配电房下拉 get
     * @param Integer courtsId 所属变压器/台区ID
     */
    getRoomMenu({commit},courtsId){
        return request({
            url:`${api.getRoomMenu}?courtsId=${courtsId}`,
            method:"get",
        }).then(res=>{
            if( !res ){
                tip("获取配电房列表失败");
                return false;
            }else{
                return res.data;
            };
        })
    },

    /**
      * 下拉列表
      * 获取集中器下拉 get
      * @param Integer courtsId 所属变压器/台区ID
      */
    getConcentratorMenu({commit},courtsId){
        return request({
            url:`${api.getConcentratorMenu}?courtsId=${courtsId}`,
            method:"get",
        }).then(res=>{
            if( !res ){
                tip("获取集中器列表失败");
                return false;
            }else{
                return res.data;
            };
        })
    },

    /**
      * 下拉列表
      * 获取配电柜下拉 get
      * @param Integer roomId 所属配电房ID
      */
    getChestMenu({commit},roomId){
        return request({
            url:`${api.getChestMenu}?roomId=${roomId}`,
            method:"get",
        }).then(res=>{
            if( !res ){
                tip("获取配电柜列表失败");
                return false;
            }else{
                return res.data;
            };
        })
    },

    /**
      * 下拉列表
      * 获取回路下拉 get
      * @param Integer chestId 所属配电柜ID
      */
    getLoopMenu({commit},chestId){
        return request({
            url:`${api.getLoopMenu}?chestId=${chestId}`,
            method:"get",
        }).then(res=>{
            if( !res ){
                tip("获取回路失败");
                return false;
            }else{
                return res.data;
            };
        })
    },

    /**
      * 下拉列表
      * 获取相序下拉 get
      * @param Integer loopId 所属回路ID
      */
    getPhaseMenu({commit},loopCode){
        return request({
            url:`${api.getPhaseMenu}?loopCode=${loopCode}`,
            method:"get",
        }).then(res=>{
            if( !res ){
                tip("获取相序失败");
                return false;
            }else{
                if( !res.data.length ){
                    tip(res.meassage);
                    return false;
                }
                return res.data;
            };
        })
    },

    /**
      * 下拉列表
      * 获取电缆井下拉 get
      * @param Integer projectIds 项目ID "1,2"
      */
    getTrapMenu({commit},projectIds){
        return request({
            url:`${api.getTrapMenu}?projectIds=${projectIds}`,
            method:"get",
        }).then(res=>{
            if( !res ){
                tip("获取电缆井列表失败");
                return false;
            }else{
                return res.data;
            };
        })
    },

    /**
      * 下拉列表
      * 获取主线缆下拉 get
      * @param Integer projectIds 项目ID "1,2"
      */
    getLineMenu({commit},projectIds){
        return request({
            url:`${api.getLineMenu}?projectIds=${projectIds}`,
            method:"get",
        }).then(res=>{
            if( !res ){
                tip("获取主线缆列表失败");
                return false;
            }else{
                return res.data;
            };
        })
    },

    /**
      * 下拉列表
      * 获取魔节下拉 get
      * @param Integer transformerOrTrap 所属井盖或台区ID
      */
    getMagicMenu({commit},transformerOrTrap){
        return request({
            url:`${api.getMagicMenu}?transformerOrTrap=${transformerOrTrap}`,
            method:"get",
        }).then(res=>{
            if( !res ){
                tip("获取魔节列表失败");
                return false;
            }else{
                return res.data;
            };
        })
    },

    /**
      * 下拉列表
      * 获取电缆通道下拉 get
      * @param Integer projectIds 项目ID "1,2"
      */
    getCableChannelMenu({commit},projectIds){
        return request({
            url:`${api.getCableChannelMenu}?projectIds=${projectIds}`,
            method:"get",
        }).then(res=>{
            if( !res ){
                tip("获取电缆通道列表失败");
                return false;
            }else{
                return res.data;
            };
        })
    }, 

    // ---------------------------- ❤ 下发 -------------------------------------------------------

    /**
     * 下发绑定列表 post
     * @param String address 装置编号
     */
    issueBinding({commit},address){
        return request({
            url:`${api.issueBinding}`,
            method:"post",
            data:{
                address
            }
        }).then(res=>{
            if( res && res.code == 10000000 ){
                tip("下发绑定成功","success");
                return true;
            }else{
                const { meassage } = res;
                if( meassage == "-1"){
                    // -1问题
                    tip("集中器不存在");
                }else{
                    tip(meassage);
                }
                return false;
            };
        })
    },
    

    // ---------------------------- ❤ 装置 -------------------------------------------------------

    /**
     * 根据地址域查询定位桩的通知号码
     * @param String assetsCode 装置编号
     */
    queryCablePilePhone({commit},assetsCode){
        return request({
            url:`${api.queryCablePilePhone}?assetsCode=${assetsCode}`,
            method:"get",
        }).then(res=>{
            if( res && res.code == 10000000 ){
                return res.data;
            }else{
                const { meassage } = res;
                tip(meassage);
                return false;
            };
        })
    },

    /**
     * 装置编辑 post
     * @param Integer id 装置ID 必填
     * @param Integer type 装置类型 必填
     * 
     * @param String name 装置名称
     * @param String position 装置位置信息
     * 
     * @param Integer courtsId 台区ID
     * @param Integer roomId 配电房ID
     * @param Integer chestId 配电柜ID
     * @param String loopCode 所属出现线路
     * @param String phaseSequence 所属相序
     * @param Integer vcId 集中器ID
     * 
     * @param Integer trapId 电缆井ID
     * @param Integer lineId 主线缆ID
     * @param Integer magicId 魔节ID
     * 
     * @param String phoneA 通知号码A
     * @param String phoneB 通知号码B
     * @param String phoneC 通知号码C
     * @param String longitude 经度
     * @param String latitude 纬度
     */
    editDevice({commit},data){
        return request({
            url:`${api.editDevice}`,
            method:"post",
            data
        }).then(res=>{
            if( res && res.code == 10000000 ){
                tip("编辑成功",'success');
                return true;
            }else{
                const { meassage } = res;
                tip(meassage);
                return false;
            };
        })
    },

    /**
      * 装置删除 post
      * @param Interger deviceType 装置类型
      * @param String oidAssets 旧的地址域
      * @param Interger userId 用户ID
      * @param String operationPwd 用户操作密码
      */
    deleteDevice({commit},data){
        return request({
            url:`${api.deleteDevice}`,
            method:"post",
            data
        }).then(res=>{
            if( res && res.code == 10000000 ){
                tip("删除成功",'success');
                return true;
            }else{
                const { meassage } = res;
                tip(meassage);
                return false;
            };
        })
    },

     // ---------------------------- ❤ 配电柜 -------------------------------------------------------
    /**
      * 根据配电柜ID查询配电柜树状图(配电柜->回路->相序)
      * @param Integer projectId 项目ID
      * @param Integer chestId 配电柜ID
      */
    getChestFullTree({commit},options){
        const { projectId, chestId } = options;
        return request({
            url:`${api.getChestFullTree}?chestId=${chestId}&projectId=${projectId}`,
            method:"get"
        }).then(res=>{
            if( res && res.data){
                return res.data;
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
