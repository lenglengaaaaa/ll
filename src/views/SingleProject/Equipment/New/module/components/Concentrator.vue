<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
        :hasChest="false"
    >
        <el-form-item :label="`设备EUI(请填写${form.communicationTechnology==1?15:16}位设备EUI)`" prop="voltageConcentratorEui">
            <el-input 
                v-model="form.voltageConcentratorEui" 
                :placeholder="form.communicationTechnology==1?'000000000000000':'0000000000000000'" 
                :maxlength="form.communicationTechnology==1?15:16"
                :disabled="editFlag"
            />
        </el-form-item>
        <el-form-item label="所属台区" prop="transformerId" >
            <el-select v-model="form.transformerId" @change="courtsChange">
                <el-option 
                    v-for="item in courtsMenus"
                    :key="item.id"
                    :label="item.name" 
                    :value="item.id"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="所属配电房"  prop="distributionRoomId" >
            <el-select v-model="form.distributionRoomId">
                <el-option 
                    v-for="item in roomMenus"
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
                editFlag:false,
                form: {
                    communicationTechnology:1,
                    voltageConcentratorName:"",
                    assetsCode:"",
                    voltageConcentratorEui:"",
                    transformerId:null,
                    distributionRoomId:null,
                    positionInformation:""
                },
                gateWayMenu:[],
                courtsMenus:[],
                roomMenus:[],
                chestMenus:[],
            }
        },
        mounted () {
            const { id } = JSON.parse(sessionStorage.getItem('project'));
            const { data, editFlag } = JSON.parse(sessionStorage.getItem('equipObj'));
            this.editFlag = editFlag;
            this.form={
                ...this.form,
                voltageConcentratorEui: data.deviceEui,
                transformerId: data.courtsId,
                distributionRoomId: data.roomId,
                ...data
            };
            this.getCourtsMenu(id).then(res=>{
                if(!res)return;
                this.courtsMenus = res ;
                if(editFlag){ this.getItsAssets(data) }
            });
        },
        methods: {
            ...mapActions('mini',[
                'getCourtsMenu',
                'getRoomMenu',
                'getChestMenu',
            ]),
            //台区切换回调
            courtsChange(id){
                this.getRoomMenu(id).then(res=>{
                    if(!res)return;
                    resetSingle(this,['distributionRoomId']);
                    this.roomMenus = res;
                })
            },
            //编辑状态时请求配电房&配电柜
            getItsAssets(obj){
                if(!obj.courtsId)return;
                this.getRoomMenu(obj.courtsId).then(res=>{
                    if(!res)return;
                    this.roomMenus = res;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>