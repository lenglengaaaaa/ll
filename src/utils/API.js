const env =process.env.NODE_ENV;

//根据环境不同,请求不同的接口
let url = env === 'development'? $cfg.dev_url : $cfg.pro_url ;

export const api={
    //=======================================登录登出=====================================================
    //登录 post
    login:`${url}/login`,

    //登出 get
    logout:`${url}/e_view/logout`,
    //=======================================用户中心=====================================================
    //用户列表 post
    accountList:`${url}/e_view/account/list`,

    //用户详情 get
    accountDetail:`${url}/e_view/account/detail`,

    //验证用户名是否存在 get
    checkAccout:`${url}/e_view/account/exist`,

    //用户创建 post
    createAccount:`${url}/e_view/account/create`,

    //用户修改 post
    updateAccount:`${url}/e_view/account/update`,

    //用户删除 get
    deleteAccount:`${url}/e_view/account/delete`,

    //用户头像上传 post
    uploadAvatar:`${url}/e_view/file/upload/image`,

    //用户更改头像 post
    updateAvatar:`${url}/e_view/image/update`,

    //修改密码 post
    updatePass:`${url}/e_view/account/update/password`,

    //设置用户操作密码 post 
    // setOperatePass:`${url}/e_view/account/set/operationPwd`,

    //修改用户操作密码 post
    updateOperatePass:`${url}/e_view/account/update/operationPwd`,

    //验证操作密码 
    checkOperatePass:`${url}/e_view/account/verify/operationPwd`,

    //=======================================全局=====================================================

    //获取区域树 get
    getAreaTree:`${url}/e_view/area/tree`,

    //全局搜索设备 get
    getAllDevice:`${url}/e_view/device/home/filter`,

    //===========================概览====================================

    //获取 在线设备/设备总数
    getOnlineDevice:`${url}/e_view/statistics/online/device`,

    //获取 未被冻结项目/项目总数
    getLiveProject:`${url}/e_view/statistics/project`,

    //获取首页概览下 设备的位置信息
    deviceAddressInAll:`${url}/e_view/statistics/device/loaction`,

    //获取首页概览下 网关的位置信息
    gatewayAddressInAll:`${url}/e_view/statistics/gateway/loaction`,

    //===========================项目管理====================================

    //项目列表 post
    projectList:`${url}/e_view/project/list`,
    
    //项目创建 post
    createProject:`${url}/e_view/project/create`,

    //项目修改 post
    updateProject:`${url}/e_view/project/update`,

    //项目冻结 get
    deleteProject:`${url}/e_view/project/delete`,

    //项目恢复 get
    recoveProject:`${url}/e_view/project/recove`,

    //========================== 网关管理=====================================

    //网关列表 post
    gatewayList:`${url}/e_view/gateway/list`,

    //网关创建 post
    createGateway:`${url}/e_view/gateway/create`,

    //网关修改 post
    updateGateway:`${url}/e_view/gateway/update`,

    //网关删除 post
    deleteGateway:`${url}/e_view/gateway/delete`,

    //网关激活 post
    activeGateway:`${url}/e_view/gateway/activate`,

    //验证mac & Card get
    checkMacOrCard:`${url}/e_view/gateway/exist`,

    //获取网关下拉 get
    getGatewayMenu:`${url}/e_view/gateway/list/all`,

    //===========================统计====================================
    
    //获取设备数量 get
    getEquipCountOnProject:`${url}/e_view/statistics/device/type`,

    //获取资产数量 get
    getAssetCountOnProject:`${url}/e_view/statistics/asset/project`,

    //获取soe数量 post
    getSoeCount:`${url}/e_view/warning/count`,

    //获取设备的经纬度、位置信息 get
    getDeviceAddress:`${url}/e_view/device/location`,

    //=======================================资产管理=====================================================
    //验证资产编号是否存在 get
    checkNo:`${url}/e_view/number/exist`,

    //获取资产下设备数量 get
    getEquipCount:`${url}/e_view/device/verify/hava`,

    //=================台区===================
    //台区创建 post
    createCourts:`${url}/e_view/courts/create`,

    //台区修改 post
    updateCourts:`${url}/e_view/courts/update`,

    //台区删除 get
    deleteCourts:`${url}/e_view/courts/delete`,

    //台区列表 post
    courtsList:`${url}/e_view/courts/list`,

    //台区下拉 get
    courtsListAll:`${url}/e_view/courts/list/all`,

    //================配电房===================
    //配电房创建 post
    createRoom:`${url}/e_view/room/create`,

    //配电房修改 post
    updateRoom:`${url}/e_view/room/update`,

    //配电房删除 get
    deleteRoom:`${url}/e_view/room/delete`,

    //配电房列表 post
    roomList:`${url}/e_view/room/list`,

    //配电房下拉 get
    roomListAll:`${url}/e_view/room/list/all`,

    //================配电柜===================
    //配电柜创建 post
    createChest:`${url}/e_view/chest/create`,

    //配电柜修改 post
    updateChest:`${url}/e_view/chest/update`,

    //配电柜删除 get
    deleteChest:`${url}/e_view/chest/delete`,

    //配电柜列表 post
    chestList:`${url}/e_view/chest/list`,

    //配电柜下拉 get
    chestListAll:`${url}/e_view/chest/list/all`,

    //获取出线下拉列表 get
    switchMenu:`${url}/e_view/switch/list`,

    //获取出线下相序 get
    outLineMenu:`${url}/e_view/outline/list`,

    //================井盖===================
    //井盖创建 post
    createTrap:`${url}/e_view/trap/create`,

    //井盖修改 post
    updateTrap:`${url}/e_view/trap/update`,

    //井盖删除 post
    deleteTrap:`${url}/e_view/trap/delete`,

    //井盖列表 post
    trapList:`${url}/e_view/trap/list`,

    //井盖下拉 post
    trapMenu:`${url}/e_view/trap/list/all`,

    //井盖下所有线缆 post
    lineInTrapMenu:`${url}/e_view/line-trap/line/list`,

    //获取井盖下线缆&设备数量 post
    getCountUnderTrap:`${url}/e_view/trap/sonList`,

    //================线缆&主线缆===================
    //线缆创建 post
    createLine:`${url}/e_view/line/create`,

    //线缆修改 post
    updateLine:`${url}/e_view/line/update`,

    //线缆删除 post
    deleteLine:`${url}/e_view/line/delete`,

    //线缆列表 post
    lineList:`${url}/e_view/line/list`,

    //线缆下拉 post
    lineListAll:`${url}/e_view/line/list/all`,

    //线缆树状下拉 post 
    lineTree:`${url}/e_view/line/list/tree`,

    //线缆下所有井盖
    trapBelowLine:`${url}/e_view/line-trap/list`,

    //获取主线缆下线缆&设备数量 post
    getCountUnderMainLine:`${url}/e_view/line/sonList`,

    //=======================================设备管理=====================================================

    //验证dev_EUI是否存在 get
    checkEUI:`${url}/e_view/device/exist`,

    //验证目标地址域是否已经存在 get
    checkAddress:`${url}/e_view/device/address/isExist`,

    //设备类型下拉 get
    equipTypeMenu:`${url}/e_view/init/list`,

    //设备列表
    equipList:`${url}/e_view/device/list`,

    //设备创建 post
    createEquip:`${url}/e_view/device/create`,

    //设备编辑 post
    updateEquip:`${url}/e_view/device/update`,

    //设备删除 post
    deleteEquip:`${url}/e_view/device/delete`,

    //设备列表下拉 post
    equipMenu:`${url}/e_view/device/search`,

    //配电柜下魔戒数据(详情) get
    ringDetail:`${url}/e_view/chest/view`,

    //获取配电房下魔戒历史数据 post
    ringHistoryData:`${url}/e_view/data/statistics/switch/history`,

    //获取配电房/配电柜下的设备列表 post
    equipInAsset:`${url}/e_view/device/room/list`,

    //获取井盖下线缆的数据数据(实时) post
    getLineCurrentData:`${url}/e_view/data/statistics/trap/current`,

    //获取井盖下线缆的数据(历史) post
    getTrapLineHistory:`${url}/e_view/data/statistics/trap/history`,

    //获取魔节的最新数据(实时) post
    getCurrentMagicData:`${url}/e_view/data/statistics/current/cmterminal`,

    //获取资产下的环境（多个魔节）历史数据 post
    getMagicHistoryData:`${url}/e_view/data/statistics/history/cmterminal`,

    //获取资产下s800的实时数据 post
    gets800CurrentData:`${url}/e_view/data/statistics/s800/current`,

    //获取资产下s800的历史数据 post
    gets800HistoryData:`${url}/e_view/data/statistics/s800/history`,

    //获取资产下的s801、s802、s803 实时数据 post
    getSensorCurrentData:`${url}/e_view/data/statistics/other/current`,

    //获取资产下的s801、s802、s803 历史数据 post
    getSensorHistoryData:`${url}/e_view/data/statistics/other/history`,

    //导出资产下的环境（多个魔节）历史数据 post
    getMagicHistoryExecl:`${url}/e_view/data/statistics/history/cmterminal/execl`,

    //导出井盖下线缆的历史数据 post
    getTrapHistoryExecl:`${url}/e_view/data/statistics/trap/history/execl`,

    //导出资产下s800的历史数据 post
    getS800HistoryExecl:`${url}/e_view/data/statistics/s800/history/execl`,

    //导出资产下s801、s802、s803的历史数据 post
    getSensorHistoryExecl:`${url}/e_view/data/statistics/other/history/execl`,

    //导出配电柜下单个出线的历史视图 post
    getRingHistoryExecl:`${url}/e_view/data/statistics/switch/history/execl`,

    //Lora 设备激活时获取随机设备地址 get
    getRandomEui:`${url}/e_view/device/random/address`,

    //Lora 设备激活 post
    activateDevice:`${url}/e_view/device/lora/activate`,

    //=======================================阈值设置=====================================================

    //查看告警阈值设置详情 get
    getDeviceThreshold:`${url}/e_view/deviceThreshold/info`,

    //新增告警阈值设置 post 
    addThresholdSet:`${url}/e_view/deviceThreshold/create`,

    //修改告警阈值设置 post
    updateThresholdSet:`${url}/e_view/deviceThreshold/update`,

    //删除告警阈值设置 post
    deleteThresholdSet:`${url}/e_view/deviceThreshold/delete`,

    //=======================================告警管理=====================================================

    //获取告警列表 post
    getAlarmList:`${url}/e_view/warning/list`,

    //获取告警详情 get
    getAlarmDetail:`${url}/e_view/warning/info`,

    //告警处理
    alarmHandle:`${url}/e_view/warning/dispose`,

    //告警导出
    exportAlarm:`${url}/e_view/warning/execl`,

    //=======================================应用管理=====================================================

    //获取应用列表 post
    getAppList:`${url}/e_view/app/list`,

    //新增应用 post
    createApp:`${url}/e_view/app/create`,

    //编辑应用 post
    updateApp:`${url}/e_view/app/update`,

    //删除应用 post
    deleteApp:`${url}/e_view/app/delete`,

    //=======================================系统操作管理=====================================================

    //获取系统操作管理列表 post
    operationList:`${url}/e_view/operation/find/list`,

    //=======================================权限管理=====================================================

    //创建角色 post
    createRole:`${url}/e_view/role/create`,

    //验证角色名称是否已经被使用 get
    verifyRoleName:`${url}/e_view/role/verify/name/isUse`,

    //编辑角色 post
    updateRole:`${url}/e_view/role/update`,

    //根据角色id，获取其下的所有子角色 get
    getChildRole:`${url}/e_view/role/searchSon`,

    //====================================前面用于角色管理中创建、编辑、删除等

    //获取项目整个权限树 get
    getPowerTree:`${url}/e_view/permission/tree`,

    //获取父级相关的权限配置信息 get 7.2.5
    //用于角色权限&账户管理分配权限
    getParentLevelPower:`${url}/e_view/role/permission/info`,

    //获取指定账户 所属角色的权限信息 get 7.2.6
    //查询某个账户它的角色权限相关信息，账户进行权限修改或者分配时，需要先获到它的角色权限
    getAccountPower:`${url}/e_view/role/accountOfRole/permission`,

    //获取指定角色父角色的权限信息 get 7.2.7
    //查询指定的角色 它的 父角色的权限相关信息，角色进行权限修改或者分配时，需要先获到它的父角色权限
    getRolePower:`${url}/e_view/role/parent/permission`,

    //顺序 7.2.5 -> 7.2.6 or 7.2.7

    //根据父类的资产id，获取所有的其子类子类资产相关权限 post
    //给账户或者角色  初次分配或者修改权限时，资产相关的权限会因为勾选数量的变化，影响到附属资产的级联变动
    getSubClassPower:`${url}/e_view/role/assest/change`,

    //为角色分配权限(用于创建&编辑) post
    allotRolePower:`${url}/e_view/role/allocation/permission`,

    //为账户分配权限(用于创建&编辑) post
    allotAccountPower:`${url}/e_view/role/allocation/permission/account`,

}

export default function(Vue){
    Vue.prototype.$api = api;
}