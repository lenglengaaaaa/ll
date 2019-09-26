<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
        :hasChest="false"
    >
        <el-form-item :label="`设备EUI(请填写${form.commWay===0?15:16}位设备EUI)`" prop="deviceEui">
            <el-input 
                v-model="form.deviceEui" 
                :placeholder="form.commWay===0?'000000000000000':'0000000000000000'" 
                :maxlength="form.commWay===0?15:16"
                :disabled="editFlag"
            />
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
        <el-form-item label="所属配电柜" prop="chestId">
            <el-select v-model="form.chestId">
                <el-option 
                    v-for="item in chestMenus"
                    :key="item.id"
                    :label="item.name" 
                    :value="item.id"
                />
            </el-select>
        </el-form-item>
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
                form: {
                    gatewayId:null,
                    isSon:1,
                    isSingle:0,
                    commWay:0,
                    assetType:0,
                    roomId:null,
                    chestId:null
                },
                gateWayMenu:[],
                courtsMenus:[],
                roomMenus:[],
                chestMenus:[],
            }
        },
        mounted () {
            const {id} = JSON.parse(sessionStorage.getItem('project'));
            const {data,editFlag} = JSON.parse(sessionStorage.getItem('equipObj'));
            this.editFlag = editFlag;
            this.form={
                ...this.form,
                ...data,
            };
            this.getGatewayMenu({current:1,size:50}).then(res=>{
                if(!res)return;
                this.gateWayMenu = res;
            })
            this.getCourtsMenu(id).then(res=>{
                if(!res)return;
                this.courtsMenus = res ;
                if(editFlag){ this.getItsAssets(data) }
            });
        },
        methods: {
            ...mapActions('overall',[
                'getGatewayMenu'
            ]),
            ...mapActions('asset',[
                'getCourtsMenu',
                'getRoomMenu',
                'getChestMenu',
            ]),
            //台区切换回调
            courtsChange(id){
                this.getRoomMenu(id).then(res=>{
                    if(!res)return;
                    resetSingle(this,['roomId','chestId']);
                    this.roomMenus = res;
                })
            },
            //配电房切换回调
            roomChange(id){
                this.getChestMenu({id,type:2}).then(res=>{
                    if(!res)return;
                    resetSingle(this,['chestId']);
                    this.chestMenus = res;
                })
            },
            //编辑状态时请求配电房&配电柜
            getItsAssets(obj){
                if(!obj.courtsId)return;
                Promise.all([this.getRoomMenu(obj.courtsId),this.getChestMenu({id:obj.roomId,type:2})]).then(res=>{
                    const [res1,res2] = res;
                    if(!res1 || !res2) return;
                    this.roomMenus = res1;
                    this.chestMenus = res2;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>