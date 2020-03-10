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
                accordion
                ref="tree"
                @check="currentChange"
                @check-change="handleCheckChange"
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

    //为了获取数组下权限permissionId
    const permissionName = {
        '1':'basiPermissionIds',        //基础设置
        '2':"menuPermissionIds",        //菜单设置
        '3':'projecPermissionList',     //项目设置
        '4':'courtsPermissionList',     //台区设置
        '5':'roomPermissionList',       //配电房设置
        '6':'chestPermissionList',      //配电柜设置
        '7':'trapPermissionList',       //井盖设置
    }

    const obj = {
        'projecPermissionList':[
            "courtsPermissionList4first",
            "roomPermissionList5first",
            "chestPermissionList6first",
            "trapPermissionList7first"
        ],
        'courtsPermissionList': [ "roomPermissionList5first", "chestPermissionList6first" ],
        'roomPermissionList':[ "chestPermissionList6first" ]
    }

    const assetType = {
        'projecPermissionList' : 0,
        'courtsPermissionList' : 1,
        'roomPermissionList' : 2,
    }


    export default {
        data() {
            return {
                currentObj:null,
                tree:[],
                props: {
                    label: 'name',
                    children: 'childList'
                },
                curCheckStatus:true,
                childList:[],
                powerInfo:{}
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
                'getPowerInfo',
                'getRoleParentPower',
                'getSubClassAssest',
                'allotRolePower'
            ]),
            //获取当前角色 / 账户 权限树
            async getCurrentRoleOrAccountTree(){
                let childList = {};
                const fullTree = await this.getPowerTree().then(res=>{
                    if(!res) return false;
                    //为节点添加nodeId标识
                    const addNodeId =  (node,permissionName)=>{
                        node.nodeId = `${permissionName}${node.id}`;
                        if(!node.childList) return node;
                        node.childList.map(item=> addNodeId(item,permissionName));
                        return node
                    } 
                    const result = res.reduce((pre,cur)=>{
                        cur.level = 1 ;
                        cur.permissionName = permissionName[cur.id];
                        childList[cur.permissionName] = cur.childList;
                        addNodeId(cur,permissionName[cur.id])
                        cur.nodeId = `${cur.nodeId}first`
                        return [...pre, cur ];
                    },[])
                    this.childList = childList;
                    return result;
                }) ;
                await this.getRoleParentPower(this.currentObj.id).then(res=>{
                    if(!res || !fullTree) return;
                    for(let i in res){
                        if(Array.isArray(res[i])){
                            this.addBottomNodeId(res[i],i);
                            // res[i].map(item=>{
                            //     item.nodeId = `${i}${item.assetId}`;

                            //     item.level = 2;
                            //     let powerIds = [];
                            //     const tempArr = JSON.parse(JSON.stringify(childList))[i];
                            //     const list = tempArr.reduce((pre,cur)=>{
                            //         cur.nodeId = `${cur.nodeId}${item.assetId}`
                            //         powerIds.push(cur.nodeId);
                            //         return [...pre,cur]
                            //     },[])
                            //     item.childList = list;

                            //     const arr = [item.nodeId,...powerIds];
                            //     item.permissionIds = arr.join(',');
                            //     return item ;
                            // })
                        }else{
                            const arr = res[i].permissionIds.split(',').map(item=> `${i}${item}`)
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
                            result = this.removeNodeForObj( res[cur.permissionName].permissionIds, cur );
                        }else{
                            result = this.removeArrayForObj( cur );
                        }
                        return [...pre,result];
                    },[])
                })
                //获取当前角色权限信息
                await this.getPowerInfo({
                    roleOrAccountId:this.currentObj.id,
                    type:0
                }).then(res=>{
                    if(!res) return;

                    //permissionIds 不包括父ID
                    //项目选中 , 以及台区、配电房、配电柜、井盖checkBox状态
                    for(let i in res){
                        //替换台区、配电房、配电柜、井盖列表
                        //如果项目为空 , 下方的权限都为不可选状态
                        if(i==='projecPermissionList'){
                            res[i].length&&res[i].forEach(item=>{
                                item.permissionIds.split(',').forEach(k=>{
                                    this.$refs.tree.setChecked(`${i}${k}${item.assetId}`,true)
                                })
                            })
                        }

                        //增加标识
                        if(Array.isArray(res[i])){
                            this.powerInfo = {
                                ...this.powerInfo,
                                [i]:res[i]
                            }

                            res[i].length&&res[i].map(item=>{
                                item.nodeId = `${i}${item.assetId}`;
                                
                                item.level = 2;
                                const powerIds = [];
                                const tempArr = JSON.parse(JSON.stringify(childList))[i];
                                const list = tempArr.reduce((pre,cur)=>{
                                    cur.nodeId = `${cur.nodeId}${item.assetId}`
                                    powerIds.push(cur.nodeId);
                                    return [...pre,cur]
                                },[])
                                item.childList = list;

                                const arr = [item.nodeId,...powerIds];
                                item.permissionIds = arr.join(',');
                                return item ;
                            })
                        }else{
                            res[i]&&res[i].permissionIds.split(',').forEach(item=> {
                                this.$refs.tree.setChecked(`${i}${item}`,true)
                            })
                        }
                    }
                    
                    this.tree.reduce((pre,cur)=>{
                        if(cur.permissionName === 'basiPermissionIds' || cur.permissionName === 'menuPermissionIds'){
                            cur.id = res[cur.permissionName].id;
                            return pre;
                        };
                        //替换项目中ID
                        if(cur.permissionName === 'projecPermissionList'){
                            cur.childList.map(item=>{
                                res[cur.permissionName].forEach(k=>{
                                    if(item.name === k.name){
                                        item.id = k.id;
                                    }
                                })
                            })
                        }else{
                            cur.childList = res[cur.permissionName];
                        }
                        //数组存在时为'可选状态'False,不存在时为'不可选状态'true
                        cur.disabled = res[cur.permissionName].length?false:true;
                        return [...pre,cur]
                    },[])
                    console.log(this.tree,'tree')
                });
                await this.tree.forEach(item=>{
                    if(item.permissionName !== 'basiPermissionIds' && item.permissionName !== 'menuPermissionIds' && item.permissionName !== 'projecPermissionList'){
                        item.childList.length&&item.childList.forEach(i=>{
                            i.permissionIds.split(',').forEach((k,index)=>{
                                if(index !==0){
                                    this.$refs.tree.setChecked(k,true);
                                }
                            })
                        })
                    }
                })
                // await this.$refs.tree.setCheckedNodes(this.tree);
            },
            /**
             * 对象方面,通过递归查询父权限与权限树存在部分,不存在的进行remove
             * @param permissionIds 拥有的权限Id集合
             * @param node JSON数据
             */
            removeNodeForObj(permissionIds,node){
                let cur = 0;
                if(cur!==0 && !permissionIds.includes(node.nodeId)){
                    this.$ref.tree.remove(node.nodeId);
                }
                cur++;
                if(!node.childList) return node;
                node.childList.map(item => this.removeNodeForObj( permissionIds, item ))
                return node;
            },
            /**
             * 数组方面,通过递归查询父权限与权限树存在部分 ,不存在的进行remove
             * @param node Array数据
             */
            removeArrayForObj(node){
                node.childList.map(cur =>{
                    const permissionIds = cur.permissionIds.split(',');
                    if(!permissionIds.includes(`${cur.nodeId}`)){
                        this.$ref.tree.remove(node.nodeId);
                    }
                    cur.childList.map(item=>{
                        if(!permissionIds.includes(`${cur.nodeId}`)){
                            this.$ref.tree.remove(node.nodeId);
                        }
                    })
                })
                return node;
            },
            /**
             * 节点选中状态发生变化时的回调 , 用于level为2
             * @param data 改节点对应的对象
             * @param checked 节点本身是否被选中
             */
            handleCheckChange(data, checked) {
                this.curCheckStatus = checked;

                //当level为2时,表示项目管理下的项目(台区、配单房)
                const sonClass = data.level && data.level === 2 && data;
                if( sonClass ){
                    const str = sonClass.nodeId.replace(/[^a-zA-Z]/g, '');
                    if(!obj[str]) return;
                    const list = this.tree.filter(item =>item.permissionName === str)[0].childList;
                    const assetIds = list.reduce((pre,cur)=>{
                        let node = this.$refs.tree.getNode(cur.nodeId);
                        if(node.checked)  return  [...pre,cur.assetId];
                        return pre
                    },[]);
                    obj[str].forEach(item=>this.$refs.tree.setChecked(item ,false));
                    this.getSonAsset( assetIds, assetType[str] );
                }
            },
            /**
             * 当复选框被点击的时候触发 , 用于level为1时
             * @param curNode 所点击的节点信息
             */
            currentChange(curNode){
                const permissionName = curNode.permissionName;
                //当level为1时,表示最外层
                if(curNode.level === 1 && obj[curNode.permissionName]){
                    //当curCheckStatus状态为false时, 台区、配电房、配电柜、井盖权限列表为空
                    //当curCheckStatus状态为false时, 配电房、配电柜权限列表为空
                    //当curCheckStatus状态为false时, 配电柜权限列表为空
                    if(!this.curCheckStatus){ 
                        //取消全选
                        obj[curNode.permissionName].forEach(item=>this.$refs.tree.setChecked(item ,false));
                        this.getSonAsset( [], assetType[permissionName] );
                    }else{
                        //全选
                        const assetIds = curNode.childList.length&&curNode.childList.map( item => item.assetId);
                        if(!assetIds.length) return; 
                        this.getSonAsset( assetIds, assetType[permissionName] );
                    }
                    
                }
            },
            //获取项目、资产下子类资产相关权限信息
            getSonAsset( assetArr, assetType ){
                this.getSubClassAssest({
                    roleOrAccountId:this.currentObj.parentId,
                    type:0,
                    assetArr,
                    assetType
                }).then(res=>{
                    if(!res)return;
                    for(let i in res){
                        this.addBottomNodeId(res[i],i);
                    }
                    this.tree.reduce((pre,cur)=>{
                        if(res[cur.permissionName]){
                            cur.childList = res[cur.permissionName];
                            //数组存在时为'可选状态'False,不存在时为'不可选状态'true
                            cur.disabled = res[cur.permissionName].length?false:true;
                        }
                        return [...pre,cur]
                    },[])
                })
            },
            //给最底层加上nodeId 例如 项目XXX-创建.nodeId = 项目nodeName+创建Id+项目XX资产ID
            addBottomNodeId(data,i){
                data.map(item=>{
                    item.nodeId = `${i}${item.assetId}`;
                    if(this.powerInfo[i]){
                        this.powerInfo[i].forEach(k=>{
                            if(item.name === k.name){
                                item.id = k.id;
                            }
                        })
                    }
                    item.level = 2;
                    const powerIds = [];
                    const tempArr = JSON.parse(JSON.stringify(this.childList))[i];
                    const list = tempArr.reduce((pre,cur)=>{
                        cur.nodeId = `${cur.nodeId}${item.assetId}`
                        powerIds.push(cur.nodeId);
                        return [...pre,cur]
                    },[])
                    item.childList = list;
                    const arr = [item.nodeId,...powerIds];
                    item.permissionIds = arr.join(',');

                    return item ;
                })
            },
            //操作
            opera(type){
                if(type ==='save'){
                    const tempObj = this.$refs.tree.getCheckedNodes().reduce((pre,cur)=>{
                        if(cur.level === 2){
                            pre['level2'].push(cur);
                        }
                        return pre
                    },{ level2:[] })
                    const { level2 } = tempObj;

                    const box = level2.reduce((pre,cur)=>{
                        const str = cur.nodeId.replace(/[^a-zA-Z]/g, '');
                        const ids = this.$refs.tree.getNode(cur.nodeId).childNodes.reduce((previous,current)=>{
                            if(current.checked){
                                return [...previous,current.data.id]
                            }
                        },[])
                        pre[str].push({
                            id:cur.id,
                            name:cur.name,
                            assetId:cur.assetId,
                            permissionIds:ids.join(',')
                        })
                        return pre;
                    },{
                        "projecPermissionList":[],
                        "courtsPermissionList":[],
                        "roomPermissionList":[],
                        "chestPermissionList":[],
                        "trapPermissionList":[]
                    })
                    //获取基础设置、菜单设置permissions
                    const res = this.$refs.tree.getCheckedKeys(true).reduce((pre,cur)=>{
                        const str = cur.replace(/[^a-zA-Z]/g, '');
                        const num = cur.replace(/[^0-9]/ig,"");
                        if(pre[str]){
                            pre[str].push(num);
                        }
                        return pre;
                    },{
                        basiPermissionIds:[],
                        menuPermissionIds:[]
                    })
                    let last = {
                        basiPermissionIds:{
                            id:this.$refs.tree.getNode("basiPermissionIds1first").data.id,
                            permissionIds:res["basiPermissionIds"].join(',')
                        },
                        menuPermissionIds:{
                            id:this.$refs.tree.getNode("menuPermissionIds2first").data.id,
                            permissionIds:res["menuPermissionIds"].join(',')
                        }
                    };

                    this.allotRolePower({
                        personId:this.currentObj.id,
                        ...last, 
                        ...box
                    }).then(res=>{
                        if(!res)return;
                        this.$router.push({name:'RoleList'});
                    })
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