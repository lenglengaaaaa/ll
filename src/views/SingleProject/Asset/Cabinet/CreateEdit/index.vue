<template>
    <cc-assetEdit
        :form="form"
        :create="create"
        :edit="edit"
        :type="2"
    >
        <template>
            <el-form-item 
                label="配电柜类型" 
                class="cabinetType"
                :rules="[{  required:false, trigger: ['change','blur'],message:'请选择主进线' }]"
            >
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
            <el-form-item 
                label="主进线" 
                prop="mainComeline"
                :rules="[{  required:true, trigger: ['change','blur'],message:'请选择主进线' }]"
            >
                <el-cascader
                    v-model="form.mainComeline"
                    placeholder="请选择主进线"
                    :options="incomingLineList"
                    :props="{ label: 'name', emitPath:false }"
                />
            </el-form-item>
            <!-- <el-form-item 
                label="备用进线" 
                prop="comeLine"
                v-if="form.remark1!=='3'"
                :rules="[{  required:false, trigger: ['change','blur'],message:'请选择备用进线' }]"
            >
                <el-cascader
                    v-model="form.comeLine"
                    placeholder="请选择备用进线"
                    :options="incomingLineList"
                    :props="{ label: 'name' }"
                />
            </el-form-item> -->
            <el-form-item 
                label="出线数量" 
                :rules="[{  required:true, trigger: ['change','blur'],message:'出线数量最少为1' }]"
                prop="remark2"
            >
                <el-input-number 
                    v-model="form.remark2"  
                    :min="1" 
                    :precision="0"
                    size="medium"
                    controls-position="right"
                />
                
            </el-form-item>

            <!-- 1.新增主线ID -->
            <div class="outgoing_line" v-for="(i,index) in form.remark2" :key="index">
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

                <el-form-item 
                    label="所属单元柜" 
                    :prop="`unitChest[${index}]`"
                    :rules="{ required: false, message: '填写所属单元柜名称', trigger: 'blur' }"
                >
                    <el-input 
                        v-model="form.unitChest[index]" 
                        placeholder="请输入所属单元柜名称"
                    />
                </el-form-item>
                <el-form-item 
                    label="额定电流" 
                    :prop="`recurrent[${index}]`"
                    :rules="{ required: false, message: '填写额定电流', trigger: 'blur' }"
                >
                    <el-input 
                        v-model="form.recurrent[index]" 
                        placeholder="请输入额定电流"
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
                    remark2:1,
                    listName:[],
                    unitChest:[],
                    recurrent:[],
                    remark1:"1",
                    detail:"",
                    mainComeline:""
                },
                testnum:0,
                cabinetType:[
                    {label:"低压配网柜", value :"1"},
                    {label:"中高压环网柜", value :"2"},
                    {label:"分支箱", value :"3"},
                ],
                courtsMenu:[],
                roomMenu:[],
                incomingLineList:[],
                loopList:[],
            }
        },
        created () {
            const { editFlag, data } = JSON.parse(sessionStorage.getItem('assetObj'));
            //获取台区下拉
            this.getCourtsMenu(this.projectId).then(res=>{
                if(!res)return;
                this.courtsMenu = res;
                //当状态为编辑时,获取下拉配电房&配电柜
                if(editFlag){
                    this.getRoomList(data.courtsId);
                    this.getIncomingFacilityList({ 
                        id: data.courtsId, 
                        roomId: data.roomId,
                        projectId:this.projectId 
                    })
                }
            })

            //2.排序后获取出线ID & name( 新增主线ID )
            const result =  this._.sortBy(data.switchList,item => item.id).reduce(( pre, cur )=>{
                pre.listName.push(cur.name);
                pre.unitChest.push(cur.unitChest);
                pre.recurrent.push(cur.recurrent);
                return pre;
            },{
                listName:[],
                unitChest:[],
                recurrent:[]
            })
            
            //赋值
            this.form={
                ...this.form,
                remark2:data.loopList && data.loopList.length || 1,
                listName: ( result && result.listName ) || [],
                unitChest: ( result && result.unitChest ) || [],
                recurrent: ( result && result.recurrent ) || [],
                ...data
            };
            this.loopList = data.loopList || [];
        },
        watch: {
            'form.remark2'(count) {
                this.form.listName = this.form.listName.slice(0,count);
                this.form.unitChest = this.form.unitChest.slice(0,count);
                this.form.recurrent = this.form.recurrent.slice(0,count);
            }
        },
        computed: {
            editFlag() {
                return JSON.parse(sessionStorage.getItem('assetObj')).editFlag;
            },
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            }
        },
        methods: {
            ...mapActions('asset',[
                'getCourtsMenu',
                'getRoomMenu',
                'getChestMenu',
                'createChest', 
                'updateChest',
                'getIncomingFacility',
                "getIncomingLine"
            ]),
            create(obj) {
                const { listName, unitChest, recurrent, mainLine } = obj;
                let list ;
                if( listName && listName.length ){
                    list = listName.reduce((pre, current, index )=>{
                        //3.新增主线ID
                        return [
                            ...pre,
                            {
                                name: current,
                                unitChest: unitChest[index] || "",
                                recurrent: recurrent[index] || ""
                            }
                        ]
                    },[])
                }
                const data = {
                    ...obj,
                    loopList:list || null
                }
                this.createChest(data).then(res=>{
                    if(!res)return
                    this.$router.push({ name:'CabinetList' })
                })
            },
            edit(obj){
                const { loopList, listName, unitChest, recurrent } = obj;
                const result = this._.sortBy(loopList,item=>item.id);
                let list ;
                if(  listName && listName.length ){
                    list = listName.reduce((pre,current,index)=>{
                        return [...pre,{
                            name:current,
                            unitChest: unitChest[index] || "",
                            recurrent: recurrent[index] || ""
                        }]
                    },[])
                }
                const data = {
                    ...obj,
                    loopList:list || null
                }
                this.updateChest(data).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CabinetList'})
                })
            },
            //根据台区ID获取台区下的配电房列表
            changeCourts(id){
                resetSingle(this,['roomId','parentId'],'assetForm');
                this.incomingLineList = [];
                this.getRoomList(id);
            },
            //根据配电房ID获取台区下的配电柜
            changeRoom(id){
                resetSingle(this,['parentId'],'assetForm');
                this.mainComeline = "",
                this.comeLine = "",
                this.incomingLineList = [];
                this.getIncomingFacilityList({ 
                    id:this.form.courtsId, 
                    roomId: id,
                    projectId:this.projectId 
                })
            },
            // 选择配电柜类型
            changeCabinetType(){
                if(!this.form.roomId) return;
                resetSingle(this,['parentId'],'assetForm');

            },
            //获取配电房列表
            getRoomList(id){
                this.getRoomMenu(id).then(res=>{
                    if(!res)return;
                    this.roomMenu = res;
                })
            },
            //获取进线设备(设施)列表
            getIncomingFacilityList(obj){
                this.getIncomingFacility(obj).then(res=>{
                    if(!res) return;
                    // id存在说明是变压器, chestId存在说是配电柜
                    const result = res.map(item=>{
                        return {
                            name:item.name || item.chestName,
                            value: item.id || item.chestId,
                            type: item.type, // 1:配电柜 2:变压器
                            children:[{
                                name:"xxx",
                                value:123
                            }]
                        }
                    })

                    result.map(item => {
                        const { type, value } = item;

                        let obj = {};
                        type == 2? obj["courtsId"] = value: obj["chestId"] = value;
                        obj.type = type == 2 ? 2 : 1;
                        this.getIncomingLine(obj).then(res=>{
                            if(!res) return [];
                            let children = res.map(item => {
                                return {
                                    ...item,
                                    value:item.address
                                }
                            })
                            item.children = children
                        })
                    })

                    setTimeout(()=>{
                        this.incomingLineList = result;
                    })
                    
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .outgoing_line{
        display: flex;
        justify-content: space-between;
        .el-form-item{
            // width: 49%;
            width: 32%;
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