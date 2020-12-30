import store from "@/store";


const { permissionIds, permissionVO } = store.state.user;

const {
    basiPermissionIds,          //基础权限
    menuPermissionIds,          //菜单权限
    projecPermissionList,       //项目权限
    courtsPermissionList,       //台区权限
    roomPermissionList,         //配电房权限 
    chestPermissionList,        //配电柜权限
    trapPermissionList,         //电缆井权限
} = permissionVO;

const basiPermission = basiPermissionIds.permissionIds.split(',');

function checkArray(key) {
    console.log('xxx')
    const { title, value } = key;
    if(!value) return true;

    if(title === '台区' || title ==='井盖'){
        const project = JSON.parse(sessionStorage.getItem('project'));
        console.log(projecPermissionList,'projecPermissionList')

        const filterArr  = projecPermissionList.filter( item=> item.assetId == project.id );
        console.log(filterArr,'filterArr')
        if( !filterArr.length ) return false;
        console.log(filterArr[0].permissionIds.split(',').includes(value),'filterArr')
        return filterArr[0].permissionIds.split(',').includes(value);

    }else{
        return basiPermission.includes(value);
    }
}

const permission = {
    inserted: function (el, binding) {
        let permission = binding.value // 获取到 v-permission的值
        if (permission) {
            let hasPermission = checkArray(permission);
            if (!hasPermission) {
                // 没有权限 移除Dom元素
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    },
}

export default permission