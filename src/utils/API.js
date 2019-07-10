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

    //=======================================资产管理=====================================================
    //验证资产编号是否存在 get
    checkNo:`${url}/e_view/number/exis`,

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

    //================井盖===================
    //井盖创建 post
    createTrap:`${url}/e_view/trap/create`,

    //井盖修改 post
    updateTrap:`${url}/e_view/trap/update`,

    //井盖删除 get
    deleteTrap:`${url}/e_view/trap/delete`,

    //井盖列表 post
    trapList:`${url}/e_view/trap/list`,

    //井盖下拉 get
    trapListAll:`${url}/e_view/trap/list/all`,

    //================线缆===================
    //线缆创建 post
    createLine:`${url}/e_view/line/create`,

    //线缆修改 post
    updateLine:`${url}/e_view/line/update`,

    //线缆删除 get
    deleteLine:`${url}/e_view/line/delete`,

    //线缆列表 post
    lineList:`${url}/e_view/line/list`,

    //线缆下拉 get
    lineListAll:`${url}/e_view/line/list/all`,

}

export default function(Vue){
    Vue.prototype.$api = api;
}