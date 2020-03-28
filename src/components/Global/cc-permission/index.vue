<template>
    <div class="Permission-container">
        <div class="wrap">
            <el-row >
                <el-col :span="24">
                    {{roleOrAccount === 1? '用户': '角色'}}权限分配
                </el-col>
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
            />
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

    const permissionNames = {
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
        name:'cc-permission',
        props: {
            roleOrAccount: Number //0为角色 , 1为账户
        },
        data() {
            return {
                currentObj:null,
                tree:[],
                props: {
                    label: 'name',
                    children: 'childList'
                },
                curCheckStatus:true,
                assets_childList:[],
                powerInfo:{}
            }
        },
        created () {
            const obj = JSON.parse(sessionStorage.getItem("obj"));
            this.currentObj = obj;
            this.$route.meta.title = obj.name;
            this.getCurrentRoleTree();
        },
        methods: {
            ...mapActions('permission',[
                'getPowerTree', 
                'getPowerInfo',
                'getRoleParentPower',
                'getAccountParentPower',
                'getSubClassAssest',
                'allotRolePower',
                'allotAccountPower'
            ]),
            //获取当前角色筛选后的权限树(完整权限树与当前角色父角色拥有权限并集)
            async getCurrentRoleTree(){

                //(1) 获取完整权限树
                const integrityTree = await this.getPowerTree().then( res =>{
                    if(!res) return;

                    //保存项目、台区、配电房、配电柜、井盖childList,用于后面操作
                    let assets_childList = {};

                    const addNodeId =  (node,permissionName)=>{
                        node.nodeId = `${permissionName}${node.id}`;
                        if(!node.childList) return node;
                        node.childList.map(item=> addNodeId(item,permissionName));
                        return node;
                    } 

                    for(let outermostNode of res){
                        outermostNode.level = 1;
                        outermostNode.permissionName = permissionNames[outermostNode.id];

                        //为节点添加nodeId标识
                        addNodeId(outermostNode,permissionNames[outermostNode.id]);
                        //最外层添加first标志与子类的nodeId进行区分
                        outermostNode.nodeId = `${outermostNode.nodeId}first`

                        assets_childList[outermostNode.permissionName] = outermostNode.childList ;
                    }

                    this.assets_childList = assets_childList ;
                    
                    return res;
                })

                
                //(2) 获取当前角色/用户 父角色 拥有的权限 , 与完整的权限树匹配取并集
                const parentFunctions = {
                    0:this.getRoleParentPower, //角色
                    1:this.getAccountParentPower  //用户
                }
                const filteredTree = await parentFunctions[this.roleOrAccount](this.currentObj.id).then(res=>{
                    return this.filterForParent(res,integrityTree);
                })


                //(3) 获取当前角色已配置过的权限信息 , 为node添加选中状态 
                //注意: 保存项目 和 各资产的id信息用于提交时应用 以及 重新获取资产改变id
                await this.getPowerInfo({
                    roleOrAccountId:this.currentObj.id,
                    type:this.roleOrAccount
                }).then(res=>{
                    if( !res ) return;

                    for(let i in res){
                        if(Array.isArray(res[i])){
                            //保留id 切换资产时使用 & 提交权限需要
                            this.powerInfo = { ...this.powerInfo, [i]:res[i] };
                            
                            res[i].length && res[i].forEach( item =>{
                                item.permissionIds.split(',').forEach( k =>{
                                    this.$refs.tree.setChecked(`${i}${k}${item.assetId}`,true)
                                })
                            })
                        }else{
                            //基础设置和菜单设置状态改变
                            res[i]&&res[i].permissionIds.split(',').forEach(item=> {
                                this.$refs.tree.setChecked(`${i}${item}`,true)
                            })
                        }
                    }
                    this.tree.forEach(item=>{
                        if(item.id === "1" || item.id === "2"){
                            item.id = res[item.permissionName] && res[item.permissionName].id
                        }else{
                            for(let k of item.childList){
                                if(!res[item.permissionName].length){
                                    k.id = null;
                                }else{
                                    for(let i of res[item.permissionName]){
                                        if(k.assetId === i.assetId){
                                            k.id = i.id;
                                            break;
                                        }
                                        k.id = null;
                                    }
                                }
                            }
                        }
                    })

                    console.log(this.tree)
                })
            },
            //匹配父权限
            filterForParent(res,integrityTree){
                if(!res || !integrityTree) return;
                const cloneObj = JSON.parse(JSON.stringify(res));
                //∵ res有数组和对象两种情况 , ∴ 需要需要分开两种情况处理
                for(let i in cloneObj){
                    //数组
                    if(Array.isArray(cloneObj[i])){
                        cloneObj[i].map(item=>{
                            item.level = 2;
                            item.nodeId = `${i}${item.assetId}`;

                            //为筛选资产所拥有的childList做准备
                            item.permissionIds = [...item.permissionIds.split(',').map(k=>`${i}${k}${item.assetId}`)];
                            
                            //为资产添加childList
                            //为节点添加nodeId以自身nodeId与资产ID拼接组成 , 生成唯一的nodeId
                            //筛选出当前资产拥有权限的childList
                            const tempList = JSON.parse(JSON.stringify(this.assets_childList))[i];
                            const filterList = tempList.filter( node =>{
                                node.nodeId = `${node.nodeId}${item.assetId}`;
                                return item.permissionIds.includes(node.nodeId);
                            })
                            item.childList = filterList;
                            
                            return item ;
                        })
                    }else{
                        //对象
                        if( cloneObj[i] ){
                            const hadPower = cloneObj[i].permissionIds.length ? cloneObj[i].permissionIds.split(',').map(item => `${i}${item}`) :[];
                            cloneObj[i].permissionIds = hadPower;
                        }
                    }
                }

                for(let item of integrityTree){
                    //取基础设置&菜单设置 与 权限的并集
                    if(item.id === "1" || item.id === "2"){

                        const hasPermissionIds = cloneObj[item.permissionName]&&cloneObj[item.permissionName].permissionIds;

                        //第一层,如基础设置、菜单设置, 如果permissionIds为空时, 说明没有权限, 应为disabled状态.
                        if( !hasPermissionIds || (item.level ==1 && !hasPermissionIds.length) ){
                            item.disabled = true;
                            //为空将childList设置空.
                            setTimeout(()=>{ this.$refs.tree.updateKeyChildren(item.nodeId,[]) });
                            continue;
                        };

                        //第二层
                        item.childList.forEach( node =>{
                            if(node.nodeId === "menuPermissionIds1" || node.nodeId === "menuPermissionIds2"){
                                // nodeId为"menuPermissionIds1" and "menuPermissionIds2" 如果不存在数组中删除
                                !hasPermissionIds.includes(node.nodeId) && setTimeout(()=>{ this.$refs.tree.remove(node.nodeId) });
                            }else{
                                    // 第三层, 拥有权限的进行保留
                                const ownedList = node.childList.filter( k =>{
                                    return hasPermissionIds.includes(k.nodeId);
                                }) 
                                node.childList = ownedList;

                                !node.childList.length && setTimeout(()=>{ this.$refs.tree.remove(node.nodeId)});
                            }
                        })
                    }else{
                        item.childList = cloneObj[item.permissionName];
                        //if childLis为空 , 将checkBox设置为不可选状态
                        if( !item.childList.length ) item.disabled = true ;
                    }
                }

                this.tree = integrityTree;

                return integrityTree;
            },
            /**
             * 节点选中状态发生变化时的回调 , 用于level为2,获取项目、资产下子类资产相关权限信息
             * @param data 改节点对应的对象
             * @param checked 节点本身是否被选中
             */
            handleCheckChange(data, checked) {
                this.curCheckStatus = checked;
            },
            /**
             * 当复选框被点击的时候触发 , 用于level为1时
             * @param curNode 所点击的节点信息
             */
            currentChange(curNode){
                const permissionName = curNode.permissionName;
                //当level为1时,表示最外层
                if(curNode.level === 1 && obj[curNode.permissionName]){
                    //当取消'项目'全选时, 台区、配电房、配电柜、井盖权限列表为空
                    //当取消'台区'全选时, 配电房、配电柜权限列表为空
                    //当取消'配电房'全选时, 配电柜权限列表为空
                    if(!this.curCheckStatus){ 
                        //取消全选
                        obj[curNode.permissionName].forEach(item=>this.$refs.tree.setChecked(item ,false));
                        this.getSonAsset( [], assetType[permissionName] );
                    }else{
                        //全选

                        //台区、配电房 , 如果项目设置为全选状态 , 不用进行接口请求;
                        // const { checked } = this.$refs.tree.getNode("projecPermissionList3first");
                        // if( (curNode.id == 4 || curNode.id == 5) && checked) return;

                        //😑当选择台区时应该只返回配电房列表 台区 -> 配电房 -> 配电柜 , 接口需要调整
                        const assetIds = curNode.childList.length&&curNode.childList.map( item => item.assetId);
                        if(!assetIds.length) return; 
                        this.getSonAsset( assetIds, assetType[permissionName] );
                    }
                }else{
                    const str = curNode.nodeId.replace(/[^a-zA-Z]/g, ''); //
                    if(!obj[str]) return;
                    const list = this.tree.filter(item =>item.permissionName === str)[0].childList; //

                    const assetIds = list.reduce((pre,cur)=>{
                        let node = this.$refs.tree.getNode(cur.nodeId);
                        //往下找是否childNodes中是否有选中的
                        const LeafChecked = node.childNodes.some(item=>item.checked);

                        if(node.checked || LeafChecked) { 
                            return  [...pre,cur.assetId];
                        };
                        return pre
                    },[]);
                    
                    obj[str].forEach(item=>this.$refs.tree.setChecked(item ,false));
                    this.getSonAsset( assetIds, assetType[str] );
                }
            },
            //获取项目、资产下子类资产相关权限信息
            getSonAsset( assetArr, assetType ){
                this.getSubClassAssest({
                    roleOrAccountId:this.roleOrAccount === 0 ?this.currentObj.parentId :this.currentObj.roleId,
                    type:0,
                    assetArr,
                    assetType
                }).then(res=>{
                    if(!res)return;
                    for(let i in res){
                        res[i].forEach(item=>{
                            if(this.powerInfo[i].length){
                                this.powerInfo[i].forEach(k=>{
                                    if(item.assetId === k.assetId){
                                        item.id = k.id;
                                    }
                                })
                            }else{
                                item.id = null;
                            }
                            item.nodeId = `${i}${item.assetId}`;
                            item.level = 2;

                             //为筛选资产所拥有的childList做准备
                            const permissionIds = [...item.permissionIds.split(',').map(k=>`${i}${k}${item.assetId}`)];
                            
                            //为资产添加childList
                            //为节点添加nodeId以自身nodeId与资产ID拼接组成 , 生成唯一的nodeId
                            //筛选出当前资产拥有权限的childList
                            const tempList = JSON.parse(JSON.stringify(this.assets_childList))[i];
                            const filterList = tempList.filter( node =>{
                                node.nodeId = `${node.nodeId}${item.assetId}`;
                                return permissionIds.includes(node.nodeId);
                            })
                            item.childList = filterList;
                            
                            return item ;
                        })
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
            //操作
            opera(type){
                if(type ==='save'){
                    //获取各资产(包括项目)permissions
                    const level2 = this.$refs.tree.getCheckedNodes().reduce((pre,cur)=>{
                        const str = cur.nodeId.replace(/[^a-zA-Z]/g, '');
                        const isArr = [
                            'projecPermissionList',
                            'courtsPermissionList',
                            'roomPermissionList',
                            "chestPermissionList",
                            "trapPermissionList"
                        ];
                        if(!isArr.includes(str)) return pre;
                        //有全选的情况
                        if( cur.level !== 2 ){
                            const parent = this.$refs.tree.getNode(cur.nodeId).parent.data ;
                            if( pre.some(item=>item.nodeId === parent.nodeId) ===false){
                                pre.push(parent);
                            }
                        }
                        return pre
                    },[]);

                    //✔ 
                    const assetsGather = level2.reduce((pre,cur)=>{
                        const str = cur.nodeId.replace(/[^a-zA-Z]/g, '');
                        const ids = this.$refs.tree.getNode(cur.nodeId).childNodes.reduce((previous,current)=>{
                            if(current.checked){
                                return [...previous,current.data.id]
                            }
                            return previous;
                        },[])

                        pre[str].push({
                            id:cur.id,
                            name:cur.name,
                            assetId:cur.assetId,
                            permissionIds:ids.join(',')
                        })
                        return pre;
                    },{ "projecPermissionList":[], "courtsPermissionList":[],
                        "roomPermissionList":[], "chestPermissionList":[],
                        "trapPermissionList":[] });

                    //获取基础设置、菜单设置permissions
                    const { basiPermissionIds, menuPermissionIds } = this.$refs.tree.getCheckedKeys(true).reduce((pre,cur)=>{
                        const str = cur.replace(/[^a-zA-Z]/g, '');
                        const num = cur.replace(/[^0-9]/ig,"");
                        if(pre[str]){
                            pre[str].push(num);
                        }
                        return pre;
                    },{ basiPermissionIds:[], menuPermissionIds:[] });

                    //✔
                    let basicGather = {
                        basiPermissionIds:{
                            id: this.$refs.tree.getNode("basiPermissionIds1first").data.id,
                            permissionIds: basiPermissionIds.join(',')
                        },
                        menuPermissionIds:{
                            id: this.$refs.tree.getNode("menuPermissionIds2first").data.id,
                            permissionIds: menuPermissionIds.join(',')
                        }
                    };

                    if(this.roleOrAccount === 0){
                        this.allotRolePower({
                            personId:this.currentObj.id,
                            ...basicGather, 
                            ...assetsGather
                        }).then(res=>{
                            if(!res)return;
                            this.$router.push({name:'RoleList'});
                        })
                    }else{
                        this.allotAccountPower({
                            personId:this.currentObj.id,
                            ...basicGather, 
                            ...assetsGather
                        }).then(res=>{
                            if(!res)return;
                            this.$router.push({name:'UserList'});
                        })
                    }
                }else{
                    this.roleOrAccount === 0 ? this.$router.push({name:'RoleList'}) :this.$router.push({name:'UserList'});
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
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