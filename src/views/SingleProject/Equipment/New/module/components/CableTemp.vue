<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
        :hasChest="false"
    >
        <template>
            <el-form-item label="所属电缆井" prop="transformerId">
                <el-select v-model="form.transformerId" @change="trapChange">
                    <el-option 
                        v-for="item in trapMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="所属魔节" prop="cabinetId" >
                    <el-select v-model="form.cabinetId" clearable filterable>
                        <el-option 
                            v-for="item in deviceMenus"
                            :key="item.magicFestivalId"
                            :label="item.magicFestivalName" 
                            :value="item.magicFestivalId"
                        />
                    </el-select>
                </el-form-item>
            </template>

            <el-form-item label="所属主线缆" prop="roomId">
                <el-select v-model="form.roomId">
                    <el-option 
                        v-for="item in lineMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            
            
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
                form: {
                    assetsType:2,
                    communicationTechnology:1,
                    cableName:"",
                    assetsCode:"",
                    transformerId:"",
                    cabinetId:"",
                    roomId:"",
                    positionInformation:""
                },
                trapMenus:[],
                lineMenus:[],
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
                ...data,
                transformerId: data.trapId,
                cabinetId: data.magicFestivalId,
                roomId: data.lineId,
            };
            //电缆井
            this.getTrapMenu(id).then(res=>{
                if(!res)return;
                this.trapMenus = res ;
                if( editFlag && data.trapId ){
                    this.getDeviceMenu(data.trapId);
                }
            });
            //主线缆
            this.getLineMenu(id).then(res=>{
                if(!res)return;
                this.lineMenus = res ;
            });
        },
        methods: {
            ...mapActions('mini',[
                'getTrapMenu',
                'getLineMenu',
                'getMagicMenu'
            ]),
            //井盖切换回调
            trapChange(id){
                resetSingle(this,['cabinetId']);
                this.getMagicMenu(id).then(res=>{
                    if(!res) return;
                    this.deviceMenus = res;
                })
            },
            //设备下拉列表
            getDeviceMenu(transformerOrTrap){
                this.getMagicMenu(transformerOrTrap).then(res=>{
                    if(!res)return;
                    this.deviceMenus=res;
                })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>