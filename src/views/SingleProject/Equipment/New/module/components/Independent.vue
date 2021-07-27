<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
        :hasChest="false"
    >   
        <template>
            <el-form-item label="所属电缆井" prop="transformerOrTrap">
                <el-select v-model="form.transformerOrTrap" @change="trapChange">
                    <el-option 
                        v-for="item in trapMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>

            <el-form-item  label="所属魔节" prop="hostId">
                <el-select v-model="form.hostId" clearable filterable>
                    <el-option 
                        v-for="item in deviceMenus"
                        :key="item.magicFestivalId"
                        :label="item.magicFestivalName" 
                        :value="item.magicFestivalId"
                    />
                </el-select>
            </el-form-item>

        </template>
    </cc-equipForm>
</template>

<script>
    import { resetSingle } from '@/utils/methods'
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
                form: {
                    assetsType:2,
                    sensorType:1,
                    communicationTechnology:1,
                    name:"",
                    assetsCode:"",
                    eui:"",
                    transformerOrTrap:"",
                    hostId:"",
                    positionInformation:""
                },
                trapMenus:[],
                deviceMenus:[]
            }
        },
        mounted () {
            const { id } = JSON.parse(sessionStorage.getItem('project'));
            const { data, editFlag } = JSON.parse(sessionStorage.getItem('equipObj'));
            this.projectId = id;
            this.editFlag = editFlag;
            this.form={
                ...this.form,
                transformerOrTrap: data.trapId,
                hostId: data.magicFestivalId,
                ...data,
            };
            //井盖
            this.getTrapMenu(id).then(res=>{
                if(!res)return;
                this.trapMenus = res ;
                if( editFlag && data.trapId ){
                    this.getItsTrap(data);
                }
            });
        },
        methods: {
            ...mapActions('mini',[
                'getTrapMenu',
                'getMagicMenu'
            ]),
            //井盖切换回调
            trapChange(id){
                resetSingle(this,['hostId']);
                this.getDeviceMenu(id);
            },
            //设备下拉列表
            getDeviceMenu(transformerOrTrap){
                this.getMagicMenu(transformerOrTrap).then(res=>{
                    if(!res)return;
                    this.deviceMenus=res;
                })
            },
            //获取井盖下资产&设备(编辑时)
            getItsTrap(obj){
                this.getDeviceMenu(obj.trapId);
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>