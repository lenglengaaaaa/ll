<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
        :hasChest="false"
    >
        <template>
            <el-form-item label="所属资产类型">
                <el-select v-model="form.assetType" @change="assetTypeChange">
                    <el-option label="井盖" :value="0"></el-option>
                    <el-option label="台区" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="!form.assetType">
                <el-form-item label="所属井盖" prop="trapId">
                    <el-select v-model="form.trapId" @change="trapChange">
                        <el-option 
                            v-for="item in trapMenus"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属线缆" prop="lineId">
                    <el-select v-model="form.lineId">
                        <el-option 
                            v-for="item in lineMenus"
                            :key="item.lineId"
                            :label="item.lineName" 
                            :value="item.lineId"
                        />
                    </el-select>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item label="所属台区" prop="courtsId" >
                    <el-select v-model="form.courtsId" @change="courtsChange">
                        <el-option 
                            v-for="item in courtsMenus"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属配电房" prop="roomId">
                    <el-select v-model="form.roomId" @change="roomChange">
                        <el-option 
                            v-for="item in roomMenus"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属配电柜" prop="chestId" >
                    <el-select v-model="form.chestId" clearable>
                        <el-option 
                            v-for="item in chestMenus"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </template>
            
            <!-- 井盖下传感设备只有魔节 -->
            <template v-if="!form.assetType">
                <el-form-item label="所属魔节" prop="parentId" >
                    <el-select v-model="form.parentId" clearable filterable>
                        <el-option 
                            v-for="item in deviceMenus"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </template>
            
            <!-- 台区下传感设备有魔节 or 集中器 -->
            <template v-else>
                <el-form-item label="所属传感设备" >
                    <el-select v-model="form.sensorType" @change="sensorChange">
                        <el-option label="魔节" :value="0"></el-option>
                        <el-option label="集中器" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item 
                    label="所属魔节" 
                    prop="parentId"
                    v-if="!form.sensorType"
                >
                    <el-select v-model="form.parentId" clearable filterable>
                        <el-option 
                            v-for="item in deviceMenus"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item 
                    label="所属集中器" 
                    prop="parentId" 
                    v-else
                >
                    <el-select v-model="form.parentId" clearable>
                        <el-option 
                            v-for="item in deviceMenus"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </template>
        </template>
    </cc-equipForm>
</template>

<script>
    import {resetSingle} from '@/utils/methods'
    import { mapActions } from 'vuex'

    export default {
        props: {
            next:Function,
            pre:Function
        },
        data() {
            return {
                projectId:0,
                form: {
                    isSingle:1,
                    isSon:0,
                    commWay:0,
                    assetType:0,
                    sensorType:0,
                    courtsId:null,
                    roomId:null,
                    chestId:null,
                    trapId:null,
                    lineId:null,
                    parentId:null
                },
                trapMenus:[],
                lineMenus:[],
                courtsMenus:[],
                roomMenus:[],
                chestMenus:[],
                deviceMenus:[]
            }
        },
        mounted () {
            const {id} = JSON.parse(sessionStorage.getItem('project'));
            const {data,editFlag} = JSON.parse(sessionStorage.getItem('equipObj'));
            this.projectId = id;
            this.editFlag = editFlag;
            this.form={
                ...this.form,
                ...data,
                assetType:(!data.trapName&&!data.courtsName)?0:data.trapName?0:1,
                sensorType:!data.parentType?0:data.parentType==33?1:0
            };
            //井盖
            this.getTrapMenu(id).then(res=>{
                if(!res)return;
                this.trapMenus = res ;
                if(editFlag&&data.trapId){
                    this.getItsTrap(data);
                }
            });
            //台区
            if(editFlag&&data.courtsId){
                this.getCourtsMenu(id).then(res=>{
                    if(!res)return;
                    this.courtsMenus = res ;
                    this.getItsCourts(data);
                });
            }
        },
        methods: {
            ...mapActions('asset',[
                'getTrapMenu',
                'getLineInTrapMenu',
                'getCourtsMenu',
                'getRoomMenu',
                'getChestMenu',
            ]),
            ...mapActions('equip',[
                'getEquipMenu'
            ]),
            //资产类型切换回调
            assetTypeChange(value){
                this.deviceMenus=[];
                if(!value){
                    resetSingle(this,['courtsId','roomId','chestId','parentId'])
                    this.getTrapMenu(this.projectId).then(res=>{
                        if(!res)return;
                        this.trapMenus = res ;
                    });
                    return;
                }
                resetSingle(this,['trapId','lineId','parentId'])
                this.getCourtsMenu(this.projectId).then(res=>{
                    if(!res)return;
                    this.courtsMenus = res ;
                });
            },
            //井盖切换回调
            trapChange(id){
                Promise.all([this.getLineInTrapMenu(id),this.getDeviceMenu(30)]).then(res=>{
                    const [res1] = res;
                    if(!res1)return;
                    resetSingle(this,['lineId','parentId']);
                    this.lineMenus = res1;
                })
            },
            //台区切换回调
            courtsChange(id){
                this.getRoomMenu(id).then(res=>{
                    if(!res)return;
                    resetSingle(this,['roomId','chestId','parentId']);
                    this.roomMenus = res;
                })
            },
            //配电房切换回调
            roomChange(id){
                const type = !this.form.sensorType?30:33
                Promise.all([this.getChestMenu({id,type:2}),this.getDeviceMenu(type)]).then(res=>{
                    const [res1] = res;
                    if(!res1)return;
                    resetSingle(this,['chestId']);
                    this.chestMenus = res1;
                })
            },
            //传感设备切换回调
            sensorChange(value){
                this.form.parentId = null;
                if(!this.form.roomId&&!this.form.trapId)return;
                const type = !value?30:33;
                this.getDeviceMenu(type);
            },
            //设备下拉列表
            getDeviceMenu(deviceType){
                const data = {
                    deviceType,
                    commWay:this.form.commWay,
                    roomId:this.form.roomId || null,
                    trapId:this.form.trapId || null
                }
                this.getEquipMenu(data).then(res=>{
                    if(!res)return;
                    this.deviceMenus=res;
                })
            },
            //获取台区下属设备(编辑时)
            getItsCourts(obj){
                const type = !this.form.sensorType?30:33
                Promise.all([this.getRoomMenu(obj.courtsId),this.getChestMenu({id:obj.roomId,type:2}),this.getDeviceMenu(type)]).then(res=>{
                    const [res1,res2] = res;
                    if(!res1 || !res2 )return;
                    this.roomMenus = res1;
                    this.chestMenus = res2;
                })
            },
            //获取井盖下资产&设备(编辑时)
            getItsTrap(obj){
                Promise.all([this.getLineInTrapMenu(obj.trapId),this.getDeviceMenu(30)]).then(res=>{
                    const [res1] = res;
                    if(!res1) return;
                    this.lineMenus = res1;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>