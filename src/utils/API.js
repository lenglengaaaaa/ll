let url;

//判断环境
const env =process.env.NODE_ENV;
if(env ==='development'){
    url = $cfg.dev_url;
}else{
    url = $cfg.pro_url;
}

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

    //===========================项目管理====================================

    //项目列表 post
    projectList:`${url}/e_view/project/list`,
    
    //项目创建 post
    createProject:`${url}/e_view/project/create`,

    //项目修改 post
    updateProject:`${url}/e_view/project/update`,

    //项目删除 get
    deleteProject:`${url}/e_view/project/delete`,

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

    //=======================================资产管理=====================================================
    //验证资产编号是否存在 get
    checkNo:`${url}/e_view/number/exist`,

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

    //=======================================设备管理=====================================================
    
    //验证dev_EUI是否存在 get
    checkEUI:`${url}/e_view/device/exist`,

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

    //获取配电房/配电柜下的设备列表 post
    equipInAsset:`${url}/e_view/device/room/list`,



}

export default function(Vue){
    Vue.prototype.$api = api;
}