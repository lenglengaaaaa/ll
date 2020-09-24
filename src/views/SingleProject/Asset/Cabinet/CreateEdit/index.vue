<template>
    <cc-assetEdit
        :form="form"
        :create="create"
        :edit="edit"
        :type="2"
    >
        <template>
            <el-form-item label="配电柜类型" class="cabinetType" prop="remark1">
                <el-tooltip 
                    effect="dark" 
                    placement="top-start" 
                    content="低压柜 -> 魔戒 , 中压柜 -> RFID" 
                >
                    <i class="el-icon-warning"/>
                </el-tooltip>
                <el-select v-model="form.remark1" @change="changeCabinetType" :disabled="editFlag">
                    <el-option 
                        v-for="i in cabinetType" 
                        :key="i.value" 
                        :label="i.label" 
                        :value="i.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属台区" prop="courtsId">
                <el-select v-model="form.courtsId" @change="changeCourts">
                    <el-option 
                        v-for="i in courtsMenu" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电房" prop="roomId" >
                <el-select v-model="form.roomId" @change="changeRoom">
                    <el-option 
                        v-for="i in roomMenu" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="是否在配电柜中">
                <el-select v-model="form.inChest" @change="changeInChest">
                    <el-option label="否" :value="0"></el-option>
                    <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电柜" v-if="form.inChest===1" prop="parentId">
                <el-select v-model="form.parentId">
                    <el-option 
                        v-for="i in chestMenu" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item 
                label="出线数量" 
                :rules="[{  required:true, trigger: ['change','blue'],message:'出线数量最少为1' }]"
                prop="count"
            >
                <el-input-number 
                    v-model="form.count"  
                    :min="1" 
                    :max="12" 
                    :precision="0"
                    size="medium"
                    controls-position="right"
                />
            </el-form-item>

            <!-- 1.新增主线ID -->
            <div class="outgoing_line" v-for="(i,index) in form.count" :key="index">
                <el-form-item 
                    :label="`出线线路-${index+1}-ID ${form.remark1 == 0? '(88或99开头)': '(66或77开头)'}`" 
                    :prop="`listIds[${index}]`"
                    :rules="[{ validator: validateId, required:true, trigger: ['blur'] }]"
                > 
                    <div class="outLineId_box">
                        <el-input 
                            v-model.number="form.listIds[index]" 
                            placeholder="请输入出线ID" 
                            :maxlength="12"
                        />
                        <el-tooltip 
                            v-if="editFlag"
                            effect="dark" 
                            placement="top-start" 
                            content="如所修改的出线ID, 出线上有节点绑定, 需重新更新集中器绑定关系(设备管理-其他功能)" 
                        >
                            <i class="el-icon-warning"/>
                        </el-tooltip>
                    </div>
                    
                </el-form-item>
                <el-form-item 
                    :label="`出线线路-${index+1}-名称`" 
                    :prop="`listName[${index}]`"
                    :rules="{ required: true, message: '填写出线名称', trigger: 'blur' }"
                >
                    <el-input 
                        v-model="form.listName[index]" 
                        placeholder="请输入出线名称"
                    />
                </el-form-item>
            </div>
        </template>
    </cc-assetEdit>
</template>

<script>
    import { mapActions } from 'vuex'
    import { resetSingle } from '@/utils/methods'

    export default {
        data() {
            return {
                form: {
                    roomId:'',
                    parentId:null,
                    inChest:0,
                    count:1,
                    listName:[],
                    listIds:[],
                    remark1:"0"
                },
                testnum:0,
                cabinetType:[
                    {label:"低压配网柜", value :"0"},
                    {label:"中高压环网柜", value :"1"},
                ],
                courtsMenu:[],
                roomMenu:[],
                chestMenu:[],
                switchList:[]
            }
        },
        created () {
            const { editFlag, data } = JSON.parse(sessionStorage.getItem('assetObj'));
            const projectId=JSON.parse(sessionStorage.getItem('project')).id;
            //获取台区下拉
            this.getCourtsMenu(projectId).then(res=>{
                if(!res)return;
                this.courtsMenu = res;
                //当状态为编辑时,获取下拉配电房&配电柜
                if(editFlag){
                    this.getRoomList(data.courtsId);
                    this.getChestList(data.roomId);
                }
            })

            //2.排序后获取出线ID & name( 新增主线ID )
            const result =  this._.sortBy(data.switchList,item => item.id).reduce(( pre, cur )=>{
                pre.listIds.push(+cur.address);
                pre.listName.push(cur.name);
                return pre;
            },{
                listIds:[],
                listName:[]
            })
            
            //赋值
            this.form={
                ...this.form,
                inChest:data.parentId>0?1:0,
                count:data.switchList && data.switchList.length || 1,
                listName: ( result && result.listName ) || [],
                listIds: ( result && result.listIds ) || [],
                ...data
            };
            this.switchList = data.switchList || [];
        },
        watch: {
            'form.count'(count) {
                this.form.listIds = this.form.listIds.slice(0,count);
                this.form.listName = this.form.listName.slice(0,count);
            }
        },
        computed: {
            editFlag() {
                return JSON.parse(sessionStorage.getItem('assetObj')).editFlag;
            }
        },
        methods: {
            ...mapActions('asset',[
                'getCourtsMenu',
                'getRoomMenu',
                'getChestMenu',
                'createChest', 
                'updateChest',
                'verifySwitchId'
            ]),
            //校验出线ID
            validateId(rule, value, callback, param){
                if(!value){
                    callback(new Error('出线ID不能为空!'));
                    return;
                }

                if (typeof value !== 'number') {
                    callback(new Error('出线ID必须是是数字!'));
                    return;
                }
                
                if(!`${value}`.match(new RegExp(`^(${this.form.remark1 == 0 ? '88|99' :'66|77'}).*$`))){
                    callback(new Error(this.form.remark1 == 0 ? '必须以88或99开头!' :'必须以66或77开头!'));
                    return;
                }
                if (`${value}`.length !== 12) {
                    callback(new Error('出线ID长度为12!'));
                    return;
                }

                let params = { address:value, id:null };

                if( this.editFlag ){
                    const Index = Object.keys(param)[0].replace(/[^0-9]/ig,"");
                    const switchList = this.switchList[+Index] ;
                    params.id = switchList? switchList.id : null;
                }
                this.verifySwitchId(params).then(res=>{
                    if(res){
                        callback()
                    }else{
                        callback(new Error('该出线ID已存在'));
                        return;
                    }
                });
            },
            create(obj) {
                const { listName, listIds } = obj;
                let list ;
                if( listName && listName.length ){
                    list = listName.reduce((pre, current, index )=>{
                        //3.新增主线ID
                        return [
                            ...pre,
                            {
                                address: listIds[index],
                                name: current
                            }
                        ]
                    },[])
                }
                const data = {
                    ...obj,
                    switchList:list || null
                }
                this.createChest(data).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CabinetList'})
                })
            },
            edit(obj){
                const { switchList, listName, listIds } = obj;
                const result = this._.sortBy(switchList,item=>item.id);
                let list ;
                if(  listName && listName.length ){
                    list = listName.reduce((pre,current,index)=>{
                        return [...pre,{
                            id:result && result.length && result[index] && result[index].id || null,
                            address: listIds[index],
                            name:current
                        }]
                    },[])
                }
                const data = {
                    ...obj,
                    switchList:list || null,
                    formerSwitchList:this.form.formerSwitchList
                }
                this.updateChest(data).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CabinetList'})
                })
            },
            //根据台区ID获取台区下的配电房列表
            changeCourts(id){
                resetSingle(this,['roomId','parentId'],'assetForm');
                this.getRoomList(id);
            },
            //根据配电房ID获取台区下的配电柜
            changeRoom(id){
                resetSingle(this,['parentId'],'assetForm');
                this.getChestList()
            },
            changeInChest(val){
                if(!val){ 
                    resetSingle(this,['parentId'],'assetForm');
                }
            },
            // 选择配电柜类型
            changeCabinetType(){
                if(!this.form.roomId) return;
                resetSingle(this,['parentId'],'assetForm');
                this.getChestList()
                

            },
            //获取配电房列表
            getRoomList(id){
                this.getRoomMenu(id).then(res=>{
                    if(!res)return;
                    this.roomMenu = res;
                })
            },
            //获取配电柜列表
            getChestList(){
                this.getChestMenu({
                    id:this.form.roomId,
                    type:0,
                    cabinetType:this.form.remark1
                }).then(res=>{
                    if(!res) return;
                    this.chestMenu = res;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .outgoing_line{
        display: flex;
        justify-content: space-between;
        .el-form-item{
            width: 49%;
        }
    }
    .outLineId_box{
        display: flex;
        align-items: center;
        .el-icon-warning{
            padding: 0 10px;
            cursor: pointer;
            color: #5cb6ff;
        }
    }
    .cabinetType{
        position: relative;
        .el-icon-warning{
            position: absolute;
            cursor: pointer;
            color: #5cb6ff;
            top: -27px;
            left:84px;
        }
    }
    
</style>