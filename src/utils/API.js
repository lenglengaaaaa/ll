// const env = process.env.NODE_ENV;

const { environment, analysis_url, request_url, mini_url }= window.$cfg;

//解析服务器接口
let analy_url = environment === 'dev'? analysis_url.dev : analysis_url.pro ;

//根据环境不同,请求不同的接口
let url = environment === 'dev'? request_url.dev : request_url.pro ;

// 小程序请求接口
let miniUrl = environment === 'dev'? mini_url.dev : mini_url.pro ;

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
    
    //配电柜出线Id(address) 规则验证 post
    verify_switchId:`${url}/e_view/switch/addressExist`,

    //配电柜修改 post
    updateChest:`${url}/e_view/chest/update`,

    //配电柜删除 get
    deleteChest:`${url}/e_view/chest/delete`,

    //配电柜列表 post
    chestList:`${url}/e_view/chest/list`,

    //获取配电柜详情 get
    getChestDetail:`${url}/e_view/chest/info`,

    //配电柜下拉 get
    chestListAll:`${url}/e_view/chest/list/all`,

    //获取出线下拉列表 get
    switchMenu:`${url}/e_view/switch/list`,

    //获取出线下相序 get
    outLineMenu:`${url}/e_view/outline/list`,

    //获取 进线设备(设施)列表 ,台区+配电柜 列表.
    getIncomingFacility:`${url}/e_view/courts/oneList`,

    // 获取 "台区/配电柜"--"主进线/备用进线"列表
    getIncomingLine:`${url}/e_view/loop/loopList`,

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

    //================电缆通道===================
    //电缆通道列表
    cableTrenchList:`${url}/e_view/aisle/list`,

    //创建电缆通道
    createCableTrench:`${url}/e_view/aisle/create`,

    //编辑/删除电缆通道
    editAndDeleteCableTrench:`${miniUrl}/device/updateAisleDetails`,

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

    //获取资产下的s801、s803、s805 实时数据 post 
    getS801CurrentData:`${url}/e_view/data/statistics/s801/current`,
    getS803CurrentData:`${url}/e_view/data/statistics/s803/current`,
    getS805CurrentData:`${url}/e_view/data/statistics/s805/current`,

    //获取资产下的s801、s802、s803 历史数据 post 
    getS801HistoryData:`${url}/e_view/data/statistics/s801/history`,
    getS803HistoryData:`${url}/e_view/data/statistics/s803/history`,
    getS805HistoryData:`${url}/e_view/data/statistics/s805/history`,


    //导出资产下的环境（多个魔节）历史数据 post
    getMagicHistoryExecl:`${url}/e_view/data/statistics/history/cmterminal/execl`,

    //导出井盖下线缆的历史数据 post
    getTrapHistoryExecl:`${url}/e_view/data/statistics/trap/history/execl`,

    //导出资产下s800的历史数据 post
    getS800HistoryExecl:`${url}/e_view/data/statistics/s800/history/execl`,

    //导出资产下s801、s803、s805的历史数据 post
    getS801HistoryExecl:`${url}/e_view/data/statistics/s801/history/execl`,
    getS803HistoryExecl:`${url}/e_view/data/statistics/s803/history/execl`,
    getS805HistoryExecl:`${url}/e_view/data/statistics/s805/history/execl`,

    //导出配电柜下单个出线的历史视图 post
    getRingHistoryExecl:`${url}/e_view/data/statistics/switch/history/execl`,

    //Lora 设备激活时获取随机设备地址 get
    getRandomEui:`${url}/e_view/device/random/address`,

    //Lora 设备激活 post
    activateDevice:`${url}/e_view/device/lora/activate`,

    //魔戒设备数据批量上传
    ring_batch_upload:`${analy_url}/deviceNew/import`,

    //更新集中器空中绑定信息
    update_concentrator_bindinig:`${analy_url}/api/device/updateBind`,

    //3.3.16 获取低压集中器的实时数据 post
    get_other_current:`${url}/e_view/data/statistics/lpconCentrator/current`,

    //3.3.17 获取低压集中器的历史数据 post
    get_other_history:`${url}/e_view/data/statistics/lpconCentrator/history`,

    //5.8 导出低压传感器历史数据 post
    export_other_history:`${url}/e_view/data/statistics/lpconCentrator/history/execl`,


    //----------------电缆桩-----------------------
    // 激活定位桩
    activatePile:`${analy_url}/api/spud/activation`,

    // 解除告警状态
    relieveAlarm:`${analy_url}/api/spud/removeWarn`,

    // 获取告警状态
    getAlaramStatusOfPile:`${url}/e_view/warn-status/getWarnStatus`,

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
    getAlarmDetail:`${url}/e_view/warnTime/info`,

    //告警处理
    alarmHandle:`${url}/e_view/warning/dispose`,

    //告警导出
    exportAlarm:`${url}/e_view/warning/execl`,

    //--------------12.18 新增告警分级-------------------------

    // 获取一级告警列表
    getStairAlarmList:`${url}/e_view/warnTime/stairList`,
    // 获取二级告警列表
    getSecondAlarmList:`${url}/e_view/warnTime/secondList`,

    //获取一级告警详情/列表
    getStairAlarmDetail:`${url}/e_view/warnTime/stairDetail`,
    //获取二级告警详情/列表
    getSecondAlarmDetail:`${url}/e_view/warnTime/secondDetail`,

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

    //根据账户id，获取其下的所有子角色 get
    getChildRole:`${url}/e_view/role/searchSon`,

    //编辑角色 post
    updateRole:`${url}/e_view/role/update`,

    //获取角色列表 post
    getRoleList:`${url}/e_view/role/page`,

    //获取角色基本信息 get
    getRoleInfo:`${url}/e_view/role/info`,

    //删除角色 get
    deleteRole:`${url}/e_view/role/delete`,

    //====================================前面用于角色管理中创建、编辑、删除等

    //获取项目整个权限树 get
    getPowerTree:`${url}/e_view/permission/tree`,

    //获取指定 角色/账户  id的权限信息  7.2.5
    getPowerInfo:`${url}/e_view/role/permission/info`,

    //获取指定账户 所属角色的权限信息 get 7.2.6
    //查询某个账户它的角色权限相关信息，账户进行权限修改或者分配时，需要先获到它的父角色权限
    getAccountParentPower:`${url}/e_view/role/accountOfRole/permission`,

    //获取指定角色父角色的权限信息 get 7.2.7
    //查询指定的角色 它的 父角色的权限相关信息，角色进行权限修改或者分配时，需要先获到它的父角色权限
    getRoleParentPower:`${url}/e_view/role/parent/permission`,

    //顺序 7.2.6 or 7.2.7 -> 7.2.5

    //根据父类的资产id，获取所有的其子类子类资产相关权限 post
    //给账户或者角色  初次分配或者修改权限时，资产相关的权限会因为勾选数量的变化，影响到附属资产的级联变动
    getSubClassAssest:`${url}/e_view/role/assest/change`,

    //为角色分配权限(用于创建&编辑) post
    allotRolePower:`${url}/e_view/role/allocation/permission`,

    //为账户分配权限(用于创建&编辑) post
    allotAccountPower:`${url}/e_view/role/allocation/permission/account`,


    //=======================================高德API=====================================================

    //根据 address or city 获取地址位置 get
    getGeocode:`/lbs/v3/geocode/geo`,


    //⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐小程序⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

     //⭐----------公用----------

    /**
     * 上传图片 post
     * @param file file 图片文件
     */
    uploadImage:`${miniUrl}/upload/uploadImage`,

    /**
      * 删除图片 post
      * @param string imageUrl 图片路径
      */
    deleteImage:`${miniUrl}/upload/deleteImage`,

    /**
      * 下载图片 post
      * @param string imageUrl 图片路径
      */
    downloadImage:`${miniUrl}/upload/downloadImage`,


     //⭐----------登录----------

    /**
      * 登录 post
    * @param String  accountName 用户名
    * @param String password 密码
    */
    login_mini:`${miniUrl}/login`,

    /**
     * 登出 get
     */
    logout_mini:`${miniUrl}/logout`,


    //⭐----------运行总览----------

    /**
     * 根据项目ID查询地图上设备/设施
     * @method get
     * @param Integer projectId 项目ID
     */
    getMapLabel:`${miniUrl}/overView/projectMap`,

    /**
     * 根据项目ID查询低压树状图 get
     * @param String projectIds 项目ID,多个,拼接 
     */
    getLowTensionTree:`${miniUrl}/overView/facilitiesTree`,

    /**
     * 根据项目ID统计设备告警总数 get
     * @param Integer projectId 项目ID 
     */
    getCountEquipmentTotal:`${miniUrl}/overView/countEquipmentTotal`,

    /**
     * 获取设备告警总数不同设备告警数量详情(电缆井,配电柜,主线缆,定位桩)
     * @param Integer projectId 项目ID
     */
    getSingleEquipmentAlarm:`${miniUrl}/overView/singleEquipmentAlarm`,

    /**
     * 设备告警统计详情---详情列表
     * @param Integer projectId 项目ID
     * @param String addresses  地址域,多个地址用英文逗号分开
     */
    getEquipmentAlarmList:`${miniUrl}/overView/statisticsWarn`,

    /**
     * 根据项目ID统计装置告警总数 get
     * @param Integer projectId 项目ID 
     */
    getCountAlarm:`${miniUrl}/overView/countAlarm`,

    /**
      * 获取装置告警总数不同装置告警数量详情
      * @param Integer projectId 项目ID
      */
    getCountSingleTotal:`${miniUrl}/overView/countSingleTotal`,

    /**
     * 根据项目ID统计装置在线率
     * @param Integer projectId 项目ID 
     */
    getCountOnline:`${miniUrl}/overView/countOnLineRate`,

    /**
      * 获取装置在线率不同装置在线数量详情
      * @param Integer projectId 项目ID
      */
    getCountOnOrOffLine:`${miniUrl}/overView/countOnOrOffLine`,

    /**
      * 根据项目ID查询装置不在线列表
      * @param Integer projectId 项目ID
      * @param String addresses  地址域,多个地址用英文逗号分开
      * @param Integer deviceType 装置类型（30、魔节；32、红外传感器；35、烟雾传感器；37、液位传感器；38、线缆温度传感器；40、线缆定位桩；33、集中器；36、魔戒）
      */
    getDeviceOnOrOffLine:`${miniUrl}/overView/deviceOnOrOffLine`,
    
    //⭐----------配电房详情----------
    /**
      * 根据配电房ID查询配电柜树状图
      * @param Integer roomId 配电房ID
      */
    getRoomTree:`${miniUrl}/overView/chestTree`,

    /**
      * 根据配电房ID查询配电柜树状图(配电房->配电柜->回路->相序)
      * @param Integer projectId 项目ID
      * @param Integer roomId 配电房ID
      */
    getFullRoomTree:`${miniUrl}/overView/newChestTree`,

    //⭐----------配电柜详情----------
    /**
      * 根据配电柜ID查询回路树状图
      * @param Integer chestId 配电柜ID
      */
    getChestTree:`${miniUrl}/overView/loopTree`,

    /**
      * 根据配电柜ID查询配电柜树状图(配电柜->回路->相序)
      * @param Integer projectId 项目ID
      * @param Integer chestId 配电房ID
      */
    getChestFullTree:`${miniUrl}/overView/newLoopTree`,

    //⭐----------设备概览----------
    /**
      * 设备概览模糊查询
      * @param Integer current 当前页码
      * @param String projectId 项目ID,多个,拼接
      * @param Integer size 每页显示条数
      * @param String queryInfo 模糊查询信息 
      */
    getEquipmentList:`${miniUrl}/facility/getList`,

    //⭐----------回路详情----------
    /**
      * 获取回路详情
      * @param Integer id 回路ID
      */
    getLoopInfo:`${miniUrl}/ring/getLoopInfo`,

    /**
      * 获取回路实时数据 post
      * @param String address 回路地址
      * @param Integer projectId 项目ID
      */
    getLoopCurrentData:`${miniUrl}/ring/getNewRingDataInfo`,

    /**
      * 获取回路历史数据 post
      * @param String address 回路地址
      * @param Integer projectId 项目ID
      * @param String startTime 起始时间 
      * @param String endTime 结束时间 
      * @param Integer current 当前页码(可用于设备数据查询)
      * @param Integer size 每页显示条数(可用于设备数据查询)
      */
    getLoopHistoryData:`${miniUrl}/ring/getRingHistoryInfos`,

    /**
      * 获取回路最新一条告警 post
      * @param String address 回路地址
      * @param Integer projectId 项目ID
      */
    getLoopCurrentAlarm:`${miniUrl}/ring/getNewWarnOfPhase`,

    //⭐----------电缆井详情----------

    /**
      * 获取电缆井最新得告警信息 
      * @param Integer id 电缆井资产ID
      * @param Integer projectId 项目id
      */
    getNewWarnOfTrap:`${miniUrl}/trap/getNewWarnOfTrap`,

    /**
      * 获取电缆井下的装置列表
      * @param Integer id 电缆井资产ID
      */
    getTrapAllDeviceMenu:`${miniUrl}/trap/getAllAddressListByTrap`,

    /**
      * 获取线缆温度传感器实时数据 post
      * @param Integer id 电缆井资产id
      */
    getCableTempListByTrap:`${miniUrl}/trap/getNewCableListByTrap`,

    /**
      * 获取线缆温度传感器历史数据 post 
      * @param Integer id 电缆井资产id
      * @param String startTime 开始时间
      * @param String endTime 开始时间
      */
    getCableHistoryListByTrap:`${miniUrl}/trap/getCableHistoryListByTrap`,

    /**
      * 获取电缆井下的所有红外最新数据
      * @param Integer id 电缆井资产id
      */
    getAllNewRedInfo:`${miniUrl}/trap/getAllNewRedInfo`,

    /**
      * 获取电缆井下的所有液位最新数据
      * @param Integer id 电缆井资产id
      */
    getAllNewWaterInfo:`${miniUrl}/trap/getAllNewWaterInfo`,

    /**
      * 获取电缆井下的所有烟感最新数据
      * @param Integer id 电缆井资产id
      */
    getAllNewSmokerInfo:`${miniUrl}/trap/getAllNewSmokerInfo`,

    //⭐----------装置查询----------
    /**
      * 装置查询 GET
      * @param String projectIds 项目ID
      * @param String nameOrAssetsCode 地址域或装置名称
      * @param Integer pageNum 当前页
      * @param Integer pageSize 每页显示条数
      */
    deviceQuery:`${miniUrl}/device/queryVagueDevice`,

     //⭐----------装置创建----------

    /**
      * 魔戒创建 post
      * @param Integer communicationTechnology 通讯技术（1、NB-IOT，2、LoRa，3、4G）
      * @param String ringName 设备名称
      * @param String assetsCode 资产编号
      * @param Integer transformerId 所属台区
      * @param Integer voltageConcentratorId 所属集中器
      * @param Integer distributionRoomId 所属配电房 ?必填
      * @param Integer distributionCabinetId 所属配电柜 ?必填
      * @param String loopCode 所属回路
      * @param String phaseSequence 相序
      * @param String positionInformation 位置信息
      * @param Integer isIndependent 是否为独立传感器（1、是；0、否）
      */
    ringCreate:`${miniUrl}/device/ringCreate`,

    /**
      * 创建
      * 集中器创建 post
      * @param Integer communicationTechnology 通讯技术（1、NB-IOT，2、LoRa，3、4G）
      * @param String voltageConcentratorName 集中器名称
      * @param String assetsCode 资产编号
      * @param Integer voltageConcentratorEui 集中器EUI
      * @param Integer transformerId 所属台区/变压器
      * @param String positionInformation 位置信息
      * @param Integer distributionRoomId 所属配电房 
      */
    concentratorCreate:`${miniUrl}/device/vcCreate`,

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
    cableTempCreate:`${miniUrl}/device/cableCreate`,

    /**
      * 创建
      * 独立传感器创建 post
      * @param Integer assetsType 所属资产类型（1、低压；2、高压）
      * @param Integer sensorType 传感器类型（1、红外；2、液位；3、烟感）
      * @param Integer communicationTechnology 通讯技术（1、NB-IOT，2、LoRa，3、4G）
      * @param String name 名称
      * @param String assetsCode 资产编号
      * @param String eui 设备EUI
      * @param Integer transformerId 所属台区or井盖ID
      * @param Integer hostId 所属主机ID（魔节ID或集中器ID 
      * @param String positionInformation 位置信息
      */
    independentSensorCreate:`${miniUrl}/device/independentSensorCreate`,

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
    magicCreate:`${miniUrl}/device/mfCreate`,

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
    cablePileCreate:`${miniUrl}/device/positioningPileCreate`,


    /**
      * 下拉列表
      * 获取变压器/台区下拉 get 多个项目以"1,2"入参
      * @param Integer projectId 项目ID
      */
    getCourtsMenu:`${miniUrl}/device/queryCourts`,

    /**
      * 下拉列表
      * 获取配电房下拉 get
      * @param Integer courtsId 所属变压器/台区ID
      */
    getRoomMenu:`${miniUrl}/device/queryRoom`,

    /**
      * 下拉列表
      * 获取集中器下拉 get
      * @param Integer courtsId 所属变压器/台区ID
      */
    getConcentratorMenu:`${miniUrl}/device/queryVoltageConcentrator`,

    /**
      * 下拉列表
      * 获取配电柜下拉 get
      * @param Integer roomId 所属配电房ID
      */
    getChestMenu:`${miniUrl}/device/queryChest`,

    /**
      * 下拉列表
      * 获取回路下拉 get
      * @param Integer chestId 所属配电柜ID
      */
    getLoopMenu:`${miniUrl}/device/queryLoop`,

    /**
      * 下拉列表
      * 获取相序下拉 get
      * @param Integer loopId 所属回路ID
      */
    getPhaseMenu:`${miniUrl}/device/queryRingDevice`,

    /**
      * 下拉列表
      * 获取电缆井下拉 get
      * @param Integer projectIds 项目ID "1,2"
      */
    getTrapMenu:`${miniUrl}/device/queryTrapInfo`,

    /**
      * 下拉列表
      * 获取主线缆下拉 get
      * @param Integer projectIds 项目ID "1,2"
      */
    getLineMenu:`${miniUrl}/device/queryLineInfo`,

    /**
      * 下拉列表
      * 获取魔节下拉 get
      * @param Integer transformerOrTrap 所属井盖或台区ID
      */
    getMagicMenu:`${miniUrl}/device/queryMagicFestival`,

    /**
      * 下拉列表
      * 获取电缆通道下拉 get
      * @param Integer projectIds 项目ID "1,2"
      */
    getCableChannelMenu:`${miniUrl}/device/queryAisleInfolList`,

    /**
      * 检验装置编号/EUI是否存在 get
      * @param Interger deviceType 装置类型（30、魔节；32、红外传感器；35、烟雾传感器；37、液位传感器；38、线缆温度传感器；40、线缆定位桩；33、集中器；36、魔戒）
      * @param String assetsCode 装置编号
      * @param String eui 装置EUI(魔节,集中器,电缆桩)
      */
    checkoutDeviceNumOrEui:`${miniUrl}/device/checkDevice`,

    //⭐----------装置编辑----------

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
     */
    editDevice:`${miniUrl}/device/updateDeviceDetails`,

    /**
     * 根据地址域查询定位桩的通知号码
     * @param String assetsCode 装置编号
     */
    queryCablePilePhone:`${miniUrl}/device/queryDevicePhone`,


     //⭐----------装置详情----------
    /**
      * 获取装置详情
      * @param Integer id 装置ID
      * @param deviceType deviceType 装置ID 装置类型（30、魔节；32、红外传感器；35、烟雾传感器；37、液位传感器；38、线缆温度传感器；40、电缆定位桩；33、集中器；36、魔戒）
      */
    getDeviceDetail:`${miniUrl}/device/queryDeviceDetails`,

    /**
      * 魔戒--实时数据
      * 获取魔戒实时数据 get
      * @param String deviceAdress 设备域
      */
    getRingCurrentData:`${miniUrl}/data/queryRingDeviceDataReal`,

    /**
      * 魔戒--历史数据
      * 获取魔戒历史数据 get
      * @param String deviceAdress 设备域
      * @param String startDataTime 开始时间
      * @param String startDataTime 开始时间
      */
    getRingHistoryData:`${miniUrl}/data/queryRingDeviceDataHistory`,

    /**
      * 集中器--实时数据
      * 获取集中器实时数据 get
      * @param String deviceAdress 设备域
      */
    getConcentratorCurrentData:`${miniUrl}/data/queryVoltageConcentratorDataReal`,

    /**
      * 集中器--历史数据
      * 获取集中器历史数据 get
      * @param String deviceAdress 设备域
      * @param String startDataTime 开始时间
      * @param String startDataTime 开始时间
      */
    getConcentratorHistoryData:`${miniUrl}/data/queryVoltageConcentratorDataHistory`,

    /**
      * 魔节--实时数据
      * 获取魔节实时数据 get
      * @param String deviceAdress 设备域
      * @param Integer projectId 项目ID
      */
    getMagicCurrentData:`${miniUrl}/data/queryMagicFestivalDataReal`,

    /**
      * 魔节--历史数据
      * 获取魔节历史数据 get
      * @param String deviceAdress 设备域
      * @param String startDataTime 开始时间
      * @param String startDataTime 开始时间
      */
    getMagicHistoryData_mini:`${miniUrl}/data/queryMagicFestivalDataHistory`,

    /**
      * 线缆温度传感器--实时数据
      * 获取线缆温度传感器实时数据 get
      * @param String deviceAdress 设备域
      */
    getCableTempCurrentData:`${miniUrl}/data/queryCableInfoDataReal`,

    /**
      * 线缆温度传感器--历史数据
      * 获取线缆温度传感器历史数据 get
      * @param String deviceAdress 设备域
      * @param String startDataTime 开始时间
      * @param String startDataTime 开始时间
      */
    getCableTempHistoryData:`${miniUrl}/data/queryCableInfoDataHistory`,

    /**
      * 红外传感器--实时数据
      * 获取红外传感器实时数据 get
      * @param String deviceAdress 设备域
      */
    getInfraredCurrentData:`${miniUrl}/data/queryInfraRedDataReal`,

    /**
      * 红外传感器--历史数据
      * 获取红外传感器历史数据 get
      * @param String deviceAdress 设备域
      * @param String startDataTime 开始时间
      * @param String startDataTime 开始时间
      */
    getInfraredHistoryData:`${miniUrl}/data/queryInfraRedDataHistory`,

    /**
      * 液位传感器--实时数据
      * 获取液位传感器实时数据 get
      * @param String deviceAdress 设备域
      */
    getLiquidLevelCurrentData:`${miniUrl}/data/queryLevelDataReal`,

    /**
      * 液位传感器--历史数据
      * 获取液位传感器历史数据 get
      * @param String deviceAdress 设备域
      * @param String startDataTime 开始时间
      * @param String startDataTime 开始时间
      */
    getLiquidLevelHistoryData:`${miniUrl}/data/queryLevelDataHistory`,

    /**
      * 烟感传感器--实时数据
      * 获取烟感传感器实时数据 get
      * @param String deviceAdress 设备域
      */
    getSmokeCurrentData:`${miniUrl}/data/querySmokeSensationDataReal`,

    /**
      * 烟感传感器--历史数据
      * 获取烟感传感器历史数据 get
      * @param String deviceAdress 设备域
      * @param String startDataTime 开始时间
      * @param String startDataTime 开始时间
      */
    getSmokeHistoryData:`${miniUrl}/data/querySmokeSensationDataHistory`,

    /**
      * 电缆定位桩--实时数据
      * 获取电缆定位桩实时数据 get
      * @param String deviceAdress 设备域
      */
    getCablePileCurrentData:`${miniUrl}/data/queryPositioningPileDataReal`,

    /**
      * 电缆定位桩--历史数据
      * 获取电缆定位桩历史数据 get
      * @param String deviceAdress 设备域
      * @param String startDataTime 开始时间
      * @param String startDataTime 开始时间
      */
    getCablePileHistoryData:`${miniUrl}/data/queryPositioningPileDataHistory`,

    /**
      * 电缆定位桩--修改装置状态
      * @param Integer positioningPileInfoId 定位桩ID
      * @param Integer isActivation 是否激活（1、已激活；2、未激活；3、激活中）false
      * @param Integer isWarn 是否激活（1、已激活；2、未激活；3、激活中）false
      */
    updatePileState:`${miniUrl}/device/updatePile`,

     //⭐----------装置删除----------
    /**
      * 装置删除 post
      * @param String oidAssets 旧的地址域
      * @param Interger userId 用户ID
      * @param String operationPwd 用户操作密码
      */
    deleteDevice:`${miniUrl}/device/deleteDevice`,

     //⭐----------装置替换----------
    /**
      * 装置替换 post
      * @param Integer deviceType 装置类型（30、魔节；32、红外传感器；35、烟雾传感器；37、液位传感器；38、线缆温度传感器；40、线缆定位桩；33、集中器；36、魔戒）
      * @param String newAssets 新地址域
      * @param String oidAssets 旧的地址域
      * @param String newEui 新的EUI
      * @param String oidEui 旧的EUI
      * @param Interger userId 用户ID
      * @param String operationPwd 用户操作密码
      */
    updateDevice:`${miniUrl}/device/updateDevice`,

    /**
      * 校验操作密码 get
      * @param Integer userId 用户ID
      * @param String operationPwd 操作密码 
      */
    checkoutOperationPassword:`${miniUrl}/device/userOperationPwd`,

     //⭐----------下发绑定列表----------
    /**
      * 下发绑定列表 post
      * @param String address 装置编号
      */
    issueBinding:`${miniUrl}/facility/setBuildAddress`,

     //⭐----------告警----------
    /**
      * 告警列表查询 get
      * @param String projectId 项目ID
      * @param Integer warnGrade 告警等级 1：设备，2：装置
      * @param String startTime 开始时间
      * @param String endTime 结束时间
      * @param String keyWordName 设备名称
      * @param Integer page 页码
      * @param Integer count 每页的条数
      * @param Integer status 0未处理 1已处理 
      */
    getWarnList:`${miniUrl}/warn/getWarnList`,


    /**
     * 按类型分组查询告警列表
     * @param String projectId 项目ID
     * @param Integer warnGrade 告警等级 1：设备，2：装置
     * @param String startTime 开始时间
     * @param String endTime 结束时间
     * @param String keyWordName 设备名称
     * @param Integer page 页码
     * @param Integer count 每页的条数
     * @param Integer status 0未处理 1已处理 
     */
    getWarnListByGroup:`${miniUrl}/warn/getWarnListGroupByType`,

    /**
      * 获取告警详细记录 get
      * @param String warnId 告警ID
      * @param String projectId 报警对应的项目id,通过装置详情获取
      */
    getWarnRecord:`${miniUrl}/warn/getWarnRecord`,

    /**
      * 处理告警信息 post
      * @param Integer warnId 告警Id
      * @param Integer warnGrade 告警等级
      * @param String recordUserid 处理人
      * @param Integer projectId 项目ID
      * @param String deviceAddress 设备源目标地址（数据第一次上报时更新)
      * @param Integer results 处理结论 1：已处理，2：不予处理，3：延期处理
      * @param String content 处理意见
      * @param String picUrls 图片url集合，String用,分割
      */
    addWarnRecord:`${miniUrl}/warn/addWarnRecord`,

    /**
      * 获取单个装置最新几条告警 get 装置详情获取最近一条告警
      * @param String address 装置地址
      * @param String projectId 项目ID
      * @param Integer count 数据条数  
      */
    getLastWarnList:`${miniUrl}/warn/getLastWarnList`,

    /**
      * 统计装置最新的一条告警 用于设备详情 get
      * @param String projectId 项目ID 
      * @param String addresses 地址域,多个地址用英文逗号分开 
      * @param String warnGrade 告警等级 1:设备 2:装置
      */
    statisticsWarn:`${miniUrl}/warn/statisticsWarn`,

     //⭐----------数据查询----------

     //----- 装置查询
    /**
      * 魔节
      * 获取魔节数据 get
      * @param Integer dataType 环境变量（1、温度；2、湿度；3、硫化氢；4、氧气；5、臭氧；6、甲烷；7、电池电压）
      * @param String deviceAdress 设备域
      * @param String startDataTime 开始时间
      * @param String startDataTime 开始时间
      */
    getMagicData:`${miniUrl}/queryMagicFestivalData`,


     //----- 告警数据

    /**
      * 告警数据筛选查询 get
      * @param String projectIds,多个,拼接 项目ID
      * @param String startTime 开始时间
      * @param String endTime 结束时间
      * @param Integer warnGrade 告警等级 1：设备，2：装置
      * @param Integer status 告警状态 -1：全部 0：未处理 1：已处理 2：不处理 3：延期
      * @param Integer voltage 低压/高压
      * @param Integer warnType 告警类型 参考告警类型表 -1 全部
      * @param Integer page 页码
      * @param Integer count 每页的条数
      * 
      * // 查询装置告警时
      * @param deviceAddress 装置地址, warnGrade为2时使用
      * 
      * // 查询低压告警时
      * @param String courtId 台区ID
      * @param String roomId 配电房ID
      * @param String chestId 配电柜ID
      * @param String loopAddress 回路地址
      * 
      * // 查询高压告警时
      * @param String trapId 电缆井ID
      */
    getWarnSift:`${miniUrl}/warn/getWarnSift`,


    /**
      * 告警数据查询---分组
      * 参数同上
      */
    getWarnSiftGroup:`${miniUrl}/warn/getWarnSiftGroup`,

    /**
      * 获取告警类型列表 get
      * @param Integer sort 告警类型 -1 全部 ；0：一级告警；2：二级告警
      */
    getWarnTypeList:`${miniUrl}/warn/getWarnTypeList`,

     //⭐----------我的----------
    /**
      * 更新用户信息(头像,昵称,密码,操作密码) post
      * @param Integer accountIds 用户ID
      * @param String imagePath 图片路径
      * @param String userName 用户密码
      * @param String password 密码
      * @param String operationPwd 操作密码
      */
    updateAccount_mini:`${miniUrl}/updateAccount`,

    /**
      * 操作记录列表查询 get
      * @param Integer accountId 用户ID
      * @param Integer page 页码
      * @param Integer count 每页显示条数
      */
    getOperationList:`${miniUrl}/getOperationList`
}

export default function(Vue){
    Vue.prototype.$api = api;
}