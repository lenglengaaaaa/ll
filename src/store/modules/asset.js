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
     * 验证资产编号是否存在
     * @param number 资产编号
     * @param type 资产类型
     */
    checkNo({commit},num,type){
        return request({
            method:'get',
            url:`${api.checkNo}`,
            data:{
                number:num,
                type
            }
        }).then(res=>{
            if(res.code===10000000){
                return true;
            }else{
                return false;
            }
        })
    },

    //==================================台区==================================

    /**
     * 获取台区列表
     * @param {
        *      size 每页显示大小
        *      current 页码
        *      projectId 项目id,0查询
        * }
        */
    getCourtsList({commit},obj){
        return request({
            method:'post',
            url:`${api.courtsList}`,
            data:obj
        }).then(res=>{
            if(res.code === 10000000&&res.data){
                return res;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *台区创建 
    * @param {
        *      name 台区名称
        *      number 台区资产编码
        *      detail 描述
        *      courtsType 台区类型
        *      mainComeline 主进线
        *      comeLine 副进线
        *      beforeVoltage 变压前的电压
        *      afterVoltage 变压后的电压
        *      electricityLevel 电流等级
        *      covoltageLevel 电压等级
        *      projectId 项目id
        *      longitude 经度
        *      latitude 纬度
        *      cutoff 所属断路柜
        *      location 位置
        * }
        */
    createCourts({commit},obj){
        return request({
            method:'post',
            url:`${api.createCourts}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *台区编辑 
    * @param {
        *      id 台区ID
        *      ...同上
        * }
        */
    updateCourts({commit},obj){
        return request({
            method:'post',
            url:`${api.updateCourts}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 删除台区
     * @param id 台区ID
     */
    deleteCourts({commit},id){
        return request({
            method:'get',
            url:`${api.deleteCourts}`,
            data:{
                id
            }
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 台区下拉
     * @param projectId 项目ID
     */
    getCourtsMenu({commit},id){
        return request({
            method:'get',
            url:`${api.courtsListAll}`,
            data:{
                projectId:id
            }
        }).then(res=>{
            if(res.code===10000000&&res.data){
                return res.data
            }else{
                tip(res.meassage)
                return false
            }
        })
    },

    //==================================配电房==================================

    /**
     * 获取配电房列表
     * @param {
        *      size 每页显示大小
        *      current 页码
        *      projectId 项目id,0查询
        * }
        */
    getRoomList({commit},obj){
        return request({
            method:'post',
            url:`${api.roomList}`,
            data:obj
        }).then(res=>{
            if(res.code === 10000000&&res.data){
                return res;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *创建配电房
    * @param {
        *      name 配电房名称
        *      number 配电房资产编码
        *      detail 描述
        *      courtsId 关联的台区id
        *      mainComeline 主进线
        *      comeLine 副进线
        *      projectId 项目id
        *      longitude 经度
        *      latitude 纬度
        *      location 位置
        * }
        */
    createRoom({commit},obj){
        return request({
            method:'post',
            url:`${api.createRoom}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *配电房编辑 
    * @param {
        *      id 配电房ID
        *      ...同上
        * }
        */
    updateRoom({commit},obj){
        return request({
            method:'post',
            url:`${api.updateRoom}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 删除配电房
     * @param id 配电房ID
     */
    deleteRoom({commit},id){
        return request({
            method:'get',
            url:`${api.deleteRoom}`,
            data:{
                id
            }
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 配电房下拉
     * @param courtsId 台区ID
     */
    getRoomMenu({commit},id){
        return request({
            method:'get',
            url:`${api.roomListAll}`,
            data:{
                courtsId:id
            }
        }).then(res=>{
            if(res.code===10000000&&res.data){
                return res.data
            }else{
                tip(res.meassage)
                return false
            }
        })
    },

    //==================================配电柜==================================

    /**
     * 获取配电柜列表
     * @param {
        *      size 每页显示大小
        *      current 页码
        *      projectId 项目id,0查询
        * }
        */
    getChestList({commit},obj){
        return request({
            method:'post',
            url:`${api.chestList}`,
            data:obj
        }).then(res=>{
            if(res.code === 10000000&&res.data){
                return res;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *创建配电柜
    * @param {
        *      name 配电柜名称
        *      number 配电柜资产编码
        *      detail 描述
        *      parentId 所属父类id（父类id为0时为配电房中的配电柜）
        *      roomId 关联的配电房id（配电房外的配电柜这个值可为空但是其父类对应的配电房id不能为空）
        *      mainComeline 主进线
        *      comeLine 副进线
        *      projectId 项目id
        *      longitude 经度
        *      latitude 纬度
        *      location 位置
        * }
        */
    createChest({commit},obj){
        return request({
            method:'post',
            url:`${api.createChest}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *配电柜编辑 
    * @param {
        *      id 配电柜ID
        *      ...同上
        * }
        */
    updateChest({commit},obj){
        return request({
            method:'post',
            url:`${api.updateChest}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 删除配电柜
     * @param id 配电房ID
     * @param parentId 所属父类id（父类id为0时为配电房中的配电柜）
     */
    deleteChest({commit},id,parentId){
        return request({
            method:'get',
            url:`${api.deleteChest}`,
            data:{
                id,
                parentId
            }
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 配电柜下拉
     * @param roomId 配电房ID
     * @param chestType 配电柜类型，0 室内 1 室外 2所有（考虑到 室外配电柜 新建时，需要获取一次父配电柜<父配电柜只能是室内配电房>的下拉列表，chestType = 0 ,获取所有室内配电柜，chestType = 1时获取所有室外，为chestType  = 2 时所有配电柜）
     */
    getChestMenu({commit},id,type){
        return request({
            method:'get',
            url:`${api.chestListAll}`,
            data:{
                roomId:id,
                chestType:type
            }
        }).then(res=>{
            if(res.code===10000000&&res.data){
                return res.data
            }else{
                tip(res.meassage)
                return false
            }
        })
    },

    //==================================井盖==================================

    /**
     * 获取井盖列表
     * @param {
        *      size 每页显示大小
        *      current 页码
        *      projectId 项目id,0查询
        * }
        */
    getTrapList({commit},obj){
        return request({
            method:'post',
            url:`${api.trapList}`,
            data:obj
        }).then(res=>{
            if(res.code === 10000000&&res.data){
                return res;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *创建井盖
    * @param {
        *      name 井盖名称
        *      number 井盖资产编码
        *      detail 描述
        *      lineIds 井盖关联的线缆，多个之间逗号隔开  
        *      projectId 项目id
        *      longitude 经度
        *      latitude 纬度
        *      location 位置
        * }
        */
    createTrap({commit},obj){
        return request({
            method:'post',
            url:`${api.createTrap}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *井盖编辑 
    * @param {
        *      id 井盖ID
        *      ...同上
        * }
        */
    updateTrap({commit},obj){
        return request({
            method:'post',
            url:`${api.updateTrap}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 删除井盖
     * @param id 井盖ID
     */
    deleteTrap({commit},id){
        return request({
            method:'get',
            url:`${api.deleteTrap}`,
            data:{
                id
            }
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 井盖下拉
     * @param courtsId 台区ID
     */
    getTrapMenu({commit},id){
        return request({
            method:'get',
            url:`${api.trapListAll}`,
            data:{
                courtsId:id
            }
        }).then(res=>{
            if(res.code===10000000&&res.data){
                return res.data
            }else{
                tip(res.meassage)
                return false
            }
        })
    },

    //==================================线缆==================================

    /**
     * 获取线缆列表
     * @param {
        *      size 每页显示大小
        *      current 页码
        *      projectId 项目id,0查询
        * }
        */
    getLineList({commit},obj){
        return request({
            method:'post',
            url:`${api.lineList}`,
            data:obj
        }).then(res=>{
            if(res.code === 10000000&&res.data){
                return res;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *创建线缆
    * @param {
        *      name 线缆名称
        *      number 线缆资产编码
        *      detail 描述
        *      parentId  所属父类id（父类id为非0时表示所属公司管辖的区段线缆信息）
        *      projectId 项目id
        *      longitude 经度
        *      latitude 纬度
        *      location 位置
        * }
        */
    createLine({commit},obj){
        return request({
            method:'post',
            url:`${api.createLine}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
    *线缆编辑 
    * @param {
        *      id 井盖ID
        *      ...同上
        * }
        */
    updateLine({commit},obj){
        return request({
            method:'post',
            url:`${api.updateLine}`,
            data:obj
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 删除线缆
     * @param id 井盖ID
     */
    deleteLine({commit},id){
        return request({
            method:'get',
            url:`${api.deleteLine}`,
            data:{
                id
            }
        }).then(res=>{
            if(res.code===10000000){
                tip(res.meassage,'success')
                return true;
            }else{
                tip(res.meassage)
                return false;
            }
        })
    },

    /**
     * 线缆下拉
     * @param courtsId 台区ID
     */
    getLineMenu({commit},id){
        return request({
            method:'get',
            url:`${api.lineListAll}`,
            data:{
                courtsId:id
            }
        }).then(res=>{
            if(res.code===10000000&&res.data){
                return res.data
            }else{
                tip(res.meassage)
                return false
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
