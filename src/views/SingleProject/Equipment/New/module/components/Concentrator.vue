<template>
    <AddEquipForm
        :form="form"
        :next="next" 
        :pre="pre"
        :hasChest="false"
    >
        <el-form-item :label="`设备EUI(请填写${form.commWay===0?15:16}位设备EUI)`" prop="deviceEui">
            <el-input 
                v-model="form.deviceEui" 
                :placeholder="form.commWay===0?'000000000000000':'0000000000000000'" 
                :maxlength="form.commWay==0?16:15"
            />
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
                form: {
                    commWay:0,
                    assetType:0
                },
                courtsMenus:[],
                roomMenus:[],
                chestMenus:[],
            }
        },
        mounted () {
            const {id} = JSON.parse(sessionStorage.getItem('project'));
            this.getCourtsMenu(id).then(res=>{
                if(!res)return;
                this.courtsMenus = res ;
            });
        },
        methods: {
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
                    resetSingle(this,['chestId','switchId','outLineId']);
                    this.chestMenus = res;
                })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>