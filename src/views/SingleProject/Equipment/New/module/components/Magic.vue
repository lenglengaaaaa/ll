<template>
    <AddEquipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <template>
            <el-form-item :label="`设备EUI(请填写${form.commWay===0?15:16}位设备EUI)`" prop="deviceEui">
                <el-input 
                    v-model="form.deviceEui" 
                    :placeholder="form.commWay===0?'000000000000000':'0000000000000000'" 
                    :maxlength="form.commWay===0?15:16"
                    :disabled="editFlag"
                />
            </el-form-item>
            <el-form-item label="所属资产类型">
                <el-select v-model="form.assetType">
                    <el-option label="井盖" :value="0"></el-option>
                    <el-option label="台区" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属网关" v-if="form.commWay" prop="gatewayId">
                <el-select v-model="form.gatewayId">
                        <el-option 
                            v-for="item in gateWayMenu"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
                        />
                </el-select>
            </el-form-item>
            <template v-if="form.assetType===0">
                <el-form-item label="所属井盖" prop="trapId">
                    <el-select v-model="form.trapId">
                        <el-option 
                            v-for="item in trapMenus"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
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
                    <el-select v-model="form.roomId">
                        <el-option 
                            v-for="item in roomMenus"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </template>
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
                projectId:0,
                editFlag:false,
                form: {
                    gatewayId:null,
                    isSon:1,
                    isSingle:0,
                    commWay:0,
                    assetType:0,
                    trapId:null,
                    courtsId:null,
                    roomId:null,
                },
                gateWayMenu:[],
                trapMenus:[],
                courtsMenus:[],
                roomMenus:[]
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
                assetType:(!data.trapName&&!data.courtsName)?0:data.trapName?0:1
            };
            this.getGatewayMenu({current:1,size:50}).then(res=>{
                if(!res)return;
                this.gateWayMenu = res;
            })
            this.getTrapMenu(id).then(res=>{
                if(!res)return;
                this.trapMenus = res ;
            });
            if(editFlag&&data.courtsId){
                this.getRoomMenu(data.courtsId).then(res=>{
                    if(!res)return;
                    this.roomMenus = res;
                })
            }
        },
        watch: {
            'form.assetType'(value) {
                if(!value){
                    resetSingle(this,['courtsId','roomId'])
                    this.getTrapMenu(this.projectId).then(res=>{
                        if(!res)return;
                        this.trapMenus = res ;
                    });
                    return;
                }
                resetSingle(this,['trapId'])
                this.getCourtsMenu(this.projectId).then(res=>{
                    if(!res)return;
                    this.courtsMenus = res ;
                });
            },
        },
        methods: {
            ...mapActions('overall',[
                'getGatewayMenu'
            ]),
            ...mapActions('asset',[
                'getTrapMenu',
                'getCourtsMenu',
                'getRoomMenu',
            ]),
            //台区切换回调
            courtsChange(id){
                this.getRoomMenu(id).then(res=>{
                    if(!res)return;
                    resetSingle(this,['roomId']);
                    this.roomMenus = res;
                })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>