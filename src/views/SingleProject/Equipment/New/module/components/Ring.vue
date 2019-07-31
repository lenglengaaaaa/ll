<template>
    <AddEquipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <template>
            <el-form-item label="是否为独立传感器(是否自身上传数据)">
                <el-select v-model="form.isSingle" :disabled ="singleFlag">
                    <el-option label="是" :value="0"></el-option>
                    <el-option label="否" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="`设备EUI(请填写${form.commWay===0?15:16}位设备EUI)`" prop="deviceEui" v-if="!form.isSingle" >
                <el-input 
                    v-model="form.deviceEui" 
                    :placeholder="form.commWay===0?'000000000000000':'0000000000000000'" 
                    :maxlength="form.commWay===0?15:16"
                    :disabled="editFlag"
                />
            </el-form-item>
            <el-form-item label="所属集中器" prop="parentId" v-else>
                <el-select v-model="form.parentId">
                    <el-option 
                        v-for="item in concenMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属台区" prop="courtsId">
                <el-select v-model="form.courtsId" @change="courtsChange">
                    <el-option 
                        v-for="item in courtsMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电房" prop="roomId" ref="roomId">
                <el-select v-model="form.roomId" @change="roomChange">
                    <el-option 
                        v-for="item in roomMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电柜" prop="chestId" ref="chestId">
                <el-select v-model="form.chestId" @change="chestChange">
                    <el-option 
                        v-for="item in chestMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属出线线路" prop="switchId" ref="switchId">
                <el-select v-model="form.switchId" @change="switchChange">
                    <el-option 
                        v-for="item in switchMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="相序" prop="outLineId" ref="outLineId">
                <el-select v-model="form.outLineId">
                    <el-option 
                        v-for="item in outlineMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
        </template>
    </AddEquipForm>
</template>

<script>
    import AddEquipForm from '@/components/AddEquipForm'
    import {resetSingle} from '@/utils/methods'
    import { mapActions } from 'vuex'

    export default {
        components: {
            AddEquipForm,
        },
        props: {
            next:Function,
            pre:Function
        },
        data() {
            return {
                euiFlag:false,
                singleFlag:false,
                form: {
                    deviceEui:'',
                    commWay:0,
                    isSingle:1,
                    courstId:null,
                    roomId:null,
                    chestId:null,
                    switchId:null,
                    outLineId:null,
                    parentId:null
                },
                courtsMenus:[],
                roomMenus:[],
                chestMenus:[],
                switchMenus:[],
                outlineMenus:[],
                concenMenus:[]
            }
        },
        mounted () {
            const {id} = JSON.parse(sessionStorage.getItem('project'));
            const {data,editFlag} = JSON.parse(sessionStorage.getItem('equipObj'));
            this.editFlag = editFlag;
            this.singleFlag = editFlag;
            this.form={
                ...this.form,
                ...data,
            };
            this.getCourtsMenu(id).then(res=>{
                if(!res)return;
                this.courtsMenus = res ;
                if(editFlag){
                    this.getItsAssets(data);
                }
            });
        },
        watch: {
            "form.isSingle"(value) {
                if(!value){
                    resetSingle(this,['deviceEui']);
                    return;
                }
                resetSingle(this,['parentId']);
            },
            "form.commway"(value){
                if(!this.form.roomId)return;
                this.getEquipMenu({
                    deviceType:33,
                    projectId:this.projectId,
                    commWay:value,
                    roomId:this.form.roomId
                }).then(res=>{
                    if(!res)return
                    this.concenMenus = res;
                })
            }
        },
        methods: {
            ...mapActions('asset',[
                'getCourtsMenu',
                'getRoomMenu',
                'getChestMenu',
                'getSwitchMenu',
                'getOutLineMenu',
            ]),
            ...mapActions('equip',[
                'getEquipMenu'
            ]),
            //配电房切换回调
            courtsChange(id){
                this.getRoomMenu(id).then(res=>{
                    if(!res)return;
                    resetSingle(this,['roomId','chestId','switchId','outLineId']);
                    this.roomMenus = res;
                })
            },
            //配电房切换回调
            roomChange(id){
                Promise.all([this.getChestMenu({id,type:2}),this.getEquipMenu({
                    deviceType:33,
                    projectId:this.projectId,
                    commWay:this.form.commWay,
                    roomId:id
                })]).then(res=>{
                    const [res1,res2] = res;
                    if(!res1 || !res2)return;
                    resetSingle(this,['chestId','switchId','outLineId']);
                    this.chestMenus = res1;
                    this.concenMenus = res2 ;
                })
            },
            //配电柜切换回调
            chestChange(id){
                this.getSwitchMenu(id).then(res=>{
                    if(!res)return;
                    resetSingle(this,['switchId','outLineId']);
                    this.switchMenus = res;
                })
            },
            //出线切换回调
            switchChange(id){
                this.getOutLineMenu(id).then(res=>{
                    if(!res)return;
                    resetSingle(this,['outLineId']);
                    this.outlineMenus = res;
                })
            },
            //编辑状态时请求配电房&配电柜
            getItsAssets(obj){
                if(!obj.courtsId)return;
                Promise.all([
                    this.getRoomMenu(obj.courtsId),
                    this.getChestMenu({id:obj.roomId,type:2}),
                    this.getSwitchMenu(obj.chestId),
                    this.getOutLineMenu(obj.switchId)
                ]).then(res=>{
                    const [res1,res2,res3,res4] = res;
                    if(!res1 || !res2 || !res3 || !res4) return;
                    this.roomMenus = res1;
                    this.chestMenus = res2;
                    this.switchMenus = res3;
                    this.outlineMenus = res4;
                })
                if(obj.isSingle){
                    this.getEquipMenu({
                        deviceType:33,
                        projectId:this.projectId,
                        commWay:obj.commWay,
                        roomId:obj.roomId
                    }).then(res=>{
                        if(!res)return;
                        this.concenMenus = res ;
                    })
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>