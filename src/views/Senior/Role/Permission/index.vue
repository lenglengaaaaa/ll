<template>
    <div class="Permission-container">
        <div class="wrap">
            <el-row >
                <el-col :span="6">模块</el-col>
                <el-col :span="18">方法</el-col>
            </el-row>
            <el-tree
                :props="props"
                :data="tree"
                node-key="nodeId"
                highlight-current
                show-checkbox
                ref="tree"
                @check-change="handleCheckChange"
                :default-checked-keys="defaultChecked"
            >
            </el-tree>
            <el-row >
                <el-col :span="24">
                    <el-button type="primary" size="small" @click="opera('save')">保存</el-button>
                    <el-button size="small" @click="opera('back')">返回</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        data() {
            return {
                currentObj:null,
                tree:[],
                props: {
                    label: 'name',
                    children: 'childList'
                },
                defaultChecked:[]
            };
        },
        created () {
            const obj = JSON.parse(sessionStorage.getItem("obj"));
            this.currentObj = obj;
            this.$route.meta.title = obj.name;
            this.getCurrentRoleOrAccountTree();
        },
        methods: {
            ...mapActions('permission',[
                'getPowerTree', 
                'getParentLevelPower',
                'getRoleParentPower',
                'getSubClassAssest'
            ]),
            //获取当前角色 / 账户 权限树
            async getCurrentRoleOrAccountTree(){
                let childList = {};
                const fullTree = await this.getPowerTree().then(res=>{
                    if(!res) return false;
                    const addNodeId =  (node,permissionName)=>{
                        node.nodeId = `${permissionName}${node.id}`;
                        if(!node.childList) return node;
                        node.childList.map(item=> addNodeId(item,permissionName));
                        return node
                    } 
                    const permissionName = {
                        '1':'basiPermissionIds',
                        '2':'menuPermissionIds',
                        '3':'projecPermissionList',
                        '4':'courtsPermissionList',
                        '5':'roomPermissionList',
                        '6':'chestPermissionList',
                        '7':'trapPermissionList',
                    }
                    const result = res.reduce((pre,cur)=>{
                        cur.permissionName = permissionName[cur.id];
                        childList[cur.permissionName] = cur.childList;
                        addNodeId(cur,permissionName[cur.id])
                        return [...pre, cur ];
                    },[])
                    return result;
                }) ;
                await this.getRoleParentPower(this.currentObj.id).then(res=>{
                    if(!res || !fullTree) return;
                    let defaultChecked = [];
                    for(let i in res){
                        if(Array.isArray(res[i])){
                            res[i].map(item=>{
                                item.nodeId = `${i}${item.assetId}`;
                                item.childList = childList[i];

                                const arr = [`${item.assetId}`,...item.permissionIds.split(',')].map(item=> `${i}${item}`);
                                item.permissionIds = arr.join(',');

                                defaultChecked.push(...arr);
                                return item ;
                            })
                        }else{
                            const arr = res[i].permissionIds.split(',').map(item=> `${i}${item}`)
                            defaultChecked.push(...arr);
                            res[i].permissionIds = arr.join(',');
                        }
                    }
                    fullTree.reduce((pre,cur)=>{
                        cur.childList = cur.permissionName === "basiPermissionIds" || cur.permissionName === "menuPermissionIds"
                            ?  cur.childList : res[cur.permissionName];
                        return [...pre,cur];
                    },[])
                    this.tree = fullTree.reduce((pre,cur)=>{
                        let result = [];
                        if(!Array.isArray(res[cur.permissionName])){
                            result = this.attachDisableParamForObj( res[cur.permissionName].permissionIds, cur );
                        }else{
                            result = this.attachDisableParamForArray( cur );
                        }
                        return [...pre,result];
                    },[])
                    this.defaultChecked = defaultChecked ;
                })
            },
            /**
             * 通过递归查询父权限与权限树存在部分 disabled = !存在 (对象)
             * @param permissionIds 拥有的权限Id集合
             * @param node JSON数据
             */
            attachDisableParamForObj(permissionIds,node){
                node.disabled = !permissionIds.includes(node.nodeId);
                if(!node.childList) return node;
                node.childList.map(item => this.attachDisableParamForObj( permissionIds, item ))
                return node;
            },
            /**
             * 通过递归查询父权限与权限树存在部分 disabled = !存在 (数组)
             * @param node Array数据
             */
            attachDisableParamForArray(node){
                node.childList.map(cur =>{
                    const permissionIds = cur.permissionIds.split(',');
                    cur.disabled = !permissionIds.includes(`${cur.nodeId}`);
                    cur.childList.map(item=>{
                        item.disabled = !permissionIds.includes(item.nodeId)
                    })
                })
                return node;
            },
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            handleNodeClick(data) {
                console.log(data);
            },
            //操作
            opera(type){
                if(type ==='save'){

                }else{

                }
                this.$router.push({name:'RoleList'});
            }
        },
    }
</script>

<style lang="scss">
    .Permission-container{
        background: #fff;
        height: calc(100% - 42px);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        padding: 20px ;
        .wrap{
            border: 1px solid #ebeef5;
            height: 100%;
            overflow-y: auto;
            .el-row{
                .el-col{
                    padding:10px 20px;
                    border-right: 1px solid #ebeef5;
                    border-bottom: 1px solid #ebeef5;
                    font-weight: 700;
                    color: #3c4353;
                    text-align: center;
                    font-size: 15px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
</style>