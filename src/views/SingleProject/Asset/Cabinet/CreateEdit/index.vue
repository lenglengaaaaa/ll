<template>
    <CreateEdit
        :form="form"
        :create="create"
        :edit="edit"
        :type="2"
    >
        <template>
            <el-form-item label="所属台区" prop="courtsId">
                <el-select v-model="form.courtsId" @change="changeCourts">
                    <el-option 
                        v-for="i in courtsMenu" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电房" prop="roomId" >
                <el-select v-model="form.roomId" @change="changeRoom">
                    <el-option 
                        v-for="i in roomMenu" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="是否在配电柜中">
                <el-select v-model="form.inChest" @change="changeInChest">
                    <el-option label="否" :value="0"></el-option>
                    <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电柜" v-if="form.inChest===1" prop="parentId">
                <el-select v-model="form.parentId">
                    <el-option 
                        v-for="i in chestMenu" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
        </template>
    </CreateEdit>
</template>

<script>
    import CreateEdit from '@/components/CreateEdit'
    import {mapActions} from 'vuex'

    export default {
        components: {
            CreateEdit,
        },
        data() {
            return {
                form: {
                    roomId:'',
                    parentId:0,
                    inChest:0
                },
                courtsMenu:[],
                roomMenu:[],
                chestMenu:[],
            }
        },
        created () {
            const {editFlag,data} = JSON.parse(sessionStorage.getItem('assetObj'));
            const projectId=JSON.parse(sessionStorage.getItem('project')).id;
            //获取台区下拉
            this.getCourtsMenu(projectId).then(res=>{
                if(!res)return;
                this.courtsMenu = res;
                if(editFlag){
                    this.getRoomList(data.courtsId);
                    this.getChestList(data.roomId);
                }
            })
            this.form={
                ...this.form,
                inChest:data.parentId>0?1:0,
                ...data
            };
        },
        methods: {
            ...mapActions('asset',[
                'getCourtsMenu',
                'getRoomMenu',
                'getChestMenu',
                'createChest', 
                'updateChest'
            ]),
            create(obj) {
                this.createChest(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CabinetList'})
                })
            },
            edit(obj){
                this.updateChest(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CabinetList'})
                })
            },
            //根据台区ID获取台区下的配电房列表
            changeCourts(id){
                this.form.roomId = '';
                this.form.parentId = '';
                this.getRoomList(id);
            },
            //根据配电房ID获取台区下的配电柜
            changeRoom(id){
                this.form.parentId = '';
                this.getChestList(id)
            },
            changeInChest(val){
                if(val===0){
                    this.form.parentId=0;
                }
            },
            //获取配电房列表
            getRoomList(id){
                this.getRoomMenu(id).then(res=>{
                    if(!res)return;
                    this.roomMenu = res;
                })
            },
            //获取配电柜列表
            getChestList(id){
                this.getChestMenu({id,type:0}).then(res=>{
                    if(!res) return;
                    this.chestMenu = res;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>