<template>
    <CreateEdit
        :form="form"
        :create="create"
        :edit="edit"
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
            <el-form-item label="所属配电房" prop="roomId">
                <el-select v-model="form.roomId">
                    <el-option 
                        v-for="i in roomMenu" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="是否在配电柜中">
                <el-select v-model="form.parentId">
                    <el-option label="否" :value="0"></el-option>
                    <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电柜" v-if="form.parentId===1" prop="cabinetId">
                <el-select v-model="form.cabinetId">
                    <el-option label="配电柜一" :value="1"></el-option>
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
                    parentId:0
                },
                courtsMenu:[],
                roomMenu:[]
            }
        },
        created () {
            const {editFlag,data} = JSON.parse(sessionStorage.getItem('assetObj'));
            const projectId=JSON.parse(sessionStorage.getItem('project')).projectId;
            //获取台区下拉
            this.getCourtsMenu(projectId).then(res=>{
                if(!res)return;
                this.courtsMenu = res;
                if(editFlag){
                    this.getRoomList(data.courtsId);
                }
            })
            this.form={
                ...this.form,
                ...data
            };
        },
        methods: {
            ...mapActions('asset',[
                'getCourtsMenu',
                'getRoomMenu',
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
                this.getRoomList(id);
            },
            //获取配电房列表
            getRoomList(id){
                this.getRoomMenu(id).then(res=>{
                    if(!res)return;
                    this.roomMenu = res;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>