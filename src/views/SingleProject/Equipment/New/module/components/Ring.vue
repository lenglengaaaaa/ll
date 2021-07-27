<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <template>
            <el-form-item label="所属台区" prop="transformerId">
                <el-select v-model="form.transformerId" @change="courtsChange">
                    <el-option 
                        v-for="item in courtsMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属集中器" prop="voltageConcentratorId">
                <el-select v-model="form.voltageConcentratorId">
                    <el-option 
                        v-for="item in concenMenus"
                        :key="item.voltageConcentratorId"
                        :label="item.voltageConcentratorName" 
                        :value="item.voltageConcentratorId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电房" prop="distributionRoomId">
                <el-select v-model="form.distributionRoomId" @change="roomChange">
                    <el-option 
                        v-for="item in roomMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电柜" prop="distributionCabinetId">
                <el-select v-model="form.distributionCabinetId" @change="chestChange">
                    <el-option 
                        v-for="item in chestMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属出线线路" prop="loopCode">
                <el-select v-model="form.loopCode" @change="switchChange">
                    <el-option 
                        v-for="item in switchMenus"
                        :key="item.address"
                        :label="item.name" 
                        :value="item.address"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="相序" prop="phaseSequence">
                <el-select v-model="form.phaseSequence">
                    <el-option 
                        v-for="item in outlineMenus"
                        :key="item.phaseSequence"
                        :label="item.phaseSequence" 
                        :value="item.phaseSequence"
                    />
                </el-select>
            </el-form-item>
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
                euiFlag:false,
                singleFlag:false,
                editFlag:false,
                form: {
                    ringName:"",
                    assetsCode:"",
                    communicationTechnology:1,
                    transformerId:null,
                    voltageConcentratorId:null,
                    distributionRoomId:null,
                    distributionCabinetId:null,
                    loopCode:null,
                    phaseSequence:null,
                    isIndependent:0
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
            const { id } = JSON.parse(sessionStorage.getItem('project'));
            const { data, editFlag } = JSON.parse(sessionStorage.getItem('equipObj'));
            this.editFlag = editFlag;
            this.singleFlag = editFlag;
            this.form={
                ...this.form,
                transformerId: data.courtsId,
                voltageConcentratorId: data.vcId,
                distributionRoomId: data.roomId,
                distributionCabinetId: data.chestId,
                loopCode: data.loopAddress,
                ...data
            };
            this.getCourtsMenu(`${id}`).then(res=>{
                if(!res)return;
                this.courtsMenus = res ;
                if(editFlag){
                    this.getItsAssets(data);
                }
            });
        },
        methods: {
            ...mapActions('mini',[
                'getCourtsMenu',
                'getRoomMenu',
                'getConcentratorMenu',
                'getChestMenu',
                'getLoopMenu',
                'getPhaseMenu'
            ]),
            //台区切换回调
            courtsChange(id){
                Promise.all([this.getRoomMenu(id),this.getConcentratorMenu(id)]).then(res=>{
                    const [res1,res2] = res;
                    if(!res1 || !res2)return;
                    resetSingle(this,['distributionRoomId','distributionCabinetId','loopCode','phaseSequence','voltageConcentratorId']);
                    this.roomMenus = res1;
                    this.concenMenus = res2 ;
                })
            },
            //配电房切换回调
            roomChange(id){
                this.getChestMenu(id).then(res=>{
                    if(!res)return;
                    resetSingle(this,['distributionCabinetId','loopCode','phaseSequence']);
                    this.chestMenus = res;
                })
            },
            //配电柜切换回调
            chestChange(id){
                this.getLoopMenu(id).then(res=>{
                    if(!res)return;
                    resetSingle(this,['loopCode','phaseSequence']);
                    this.switchMenus = res;
                })
            },
            //出线切换回调
            switchChange(id){
                this.getPhaseMenu(id).then(res=>{
                    if(!res)return;
                    resetSingle(this,['phaseSequence']);
                    this.outlineMenus = res;
                })
            },
            //编辑状态时请求配电房&配电柜
            getItsAssets(obj){
                if( !obj.courtsId )return;
                Promise.all([
                    this.getRoomMenu( obj.courtsId ),
                    this.getChestMenu( obj.roomId ),
                    this.getLoopMenu( obj.chestId ),
                    this.getPhaseMenu( obj.switchId ),
                    this.getConcentratorMenu( obj.courtsId )
                ]).then(res=>{
                    const [res1,res2,res3,res4, res5 ] = res;
                    if(!res1 || !res2 || !res3 || !res4 || !res5) return;
                    this.roomMenus = res1;
                    this.chestMenus = res2;
                    this.switchMenus = res3;
                    this.outlineMenus = res4;
                    this.concenMenus = res5;
                })
                // if(obj.isSingle){
                //     this.getEquipMenu({
                //         deviceType:33,
                //         projectId:this.projectId,
                //         commWay:obj.commWay,
                //         roomId:obj.roomId
                //     }).then(res=>{
                //         if(!res)return;
                //         this.concenMenus = res ;
                //     })
                // }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>