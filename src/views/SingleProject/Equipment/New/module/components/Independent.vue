<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
        :hasChest="false"
    >   
        <template>
            <el-form-item label="是否为独立传感器(是否自身上传数据)">
                <el-select v-model="form.isSingle" :disabled ="singleFlag">
                    <el-option label="是" :value="0"></el-option>
                    <el-option label="否" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item 
                :label="`设备EUI(请填写${form.commWay===0?15:16}位设备EUI)`" 
                prop="deviceEui"
                v-if="!form.isSingle"
            >
                <el-input 
                    v-model="form.deviceEui" 
                    :placeholder="form.commWay===0?'000000000000000':'0000000000000000'" 
                    :maxlength="form.commWay===0?15:16"
                    :disabled="editFlag"
                />
            </el-form-item>
            <el-form-item label="所属网关" v-if="form.commWay&&!form.isSingle" prop="gatewayId">
                <el-select v-model="form.gatewayId">
                        <el-option 
                            v-for="item in gateWayMenu"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
                        />
                </el-select>
            </el-form-item>
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
                <!-- <el-form-item label="所属线缆" prop="lineId">
                    <el-select v-model="form.lineId">
                        <el-option 
                            v-for="item in lineMenus"
                            :key="item.lineId"
                            :label="item.lineName" 
                            :value="item.lineId"
                        />
                    </el-select>
                </el-form-item> -->
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

            <el-form-item label="是否为附属传感器">
                <el-select v-model="form.isSon" :disabled="form.isSingle?true:false">
                    <el-option label="是" :value="0"></el-option>
                    <el-option label="否" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="!form.isSon">
                <el-form-item label="所属传感设备" >
                    <el-select v-model="form.sensorType" @change="sensorChange" :disabled="form.assetType?false:true">
                        <el-option label="魔节" :value="0"></el-option>
                        <el-option label="集中器" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item 
                    label="所属魔节" 
                    :prop="form.isSingle?'parentId':''"
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
                    :prop="form.isSingle?'parentId':''" 
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
                editFlag:false,
                singleFlag:false,
                form: {
                    commWay:0,
                    gatewayId:null,
                    isSingle:1,
                    isSon:0,
                    assetType:0,
                    sensorType:0,
                    courtsId:null,
                    roomId:null,
                    chestId:null,
                    trapId:null,
                    // lineId:null,
                    parentId:null
                },
                gateWayMenu:[],
                trapMenus:[],
                // lineMenus:[],
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
            this.singleFlag = editFlag;
            this.form={
                ...this.form,
                ...data,
                assetType:(!data.trapName&&!data.courtsName)?0:data.trapName?0:1,
                sensorType:!data.parentType?0:data.parentType==33?1:0
            };
            //网关
            this.getGatewayMenu({current:1,size:50}).then(res=>{
                if(!res)return;
                this.gateWayMenu = res;
            })
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
        watch: {
            "form.assetType"(value){
                this.form.sensorType = 0;
            },
            "form.isSingle"(value){
                if(value) this.form.isSon = 0;
            }
        },
        methods: {
            ...mapActions('overall',[
                'getGatewayMenu'
            ]),
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
                // this.lineMenus = [];
                this.roomMenus = [];
                this.chestMenus = [];
                this.gateWayMenu = [];
                if(!value){
                    this.form.chestId = null;
                    resetSingle(this,['courtsId','roomId','chestId'])
                    this.getTrapMenu(this.projectId).then(res=>{
                        if(!res)return;
                        resetSingle(this,['parentId'])
                        this.trapMenus = res ;
                    });
                    return;
                }
                // resetSingle(this,['trapId','lineId']);
                resetSingle(this,['trapId'])

                this.getCourtsMenu(this.projectId).then(res=>{
                    if(!res)return;
                    //切换延迟原因
                    resetSingle(this,['parentId'])
                    this.courtsMenus = res ;
                });
            },
            //井盖切换回调
            trapChange(id){
                this.getDeviceMenu(30);
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
                Promise.all([this.getChestMenu({ id, type:2 }),this.getDeviceMenu(type)]).then(res=>{
                    const [res1] = res;
                    if(!res1)return;
                    resetSingle(this,['chestId']);
                    this.chestMenus = res1;
                })
            },
            //传感设备切换回调
            sensorChange(value){
                resetSingle(this,['parentId'])
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
                    //切换延迟原因
                    this.deviceMenus=res;
                })
            },
            //获取台区下属设备(编辑时)
            getItsCourts(obj){
                const type = !this.form.sensorType?30:33
                Promise.all([this.getRoomMenu(obj.courtsId),this.getChestMenu({ id:obj.roomId, type:2 }),this.getDeviceMenu(type)]).then(res=>{
                    const [res1,res2] = res;
                    if(!res1 || !res2 )return;
                    this.roomMenus = res1;
                    this.chestMenus = res2;
                })
            },
            //获取井盖下资产&设备(编辑时)
            getItsTrap(obj){
                this.getDeviceMenu(30);
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>