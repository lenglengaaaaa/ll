<template>
    <div>
        <ApplyMgt
            title="角色"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
            hasCheck
        >
            <template>
                <el-table-column
                    prop="name"
                    label="角色名称"
                    align="center"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="description"
                    label="角色描述"
                    align="center"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="list"
                    label="用户列表"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.list || '-'"
                />
            </template>
        </ApplyMgt>
        <CreateEdit
            :visible="dialogVisible"
            :close="close"
            :editFlag="editFlag"
            :value="value"
        />
    </div>
</template>

<script>
    import {ApplyMgt} from '@/components/Management'
    import CreateEdit from '../components/CreateEdit'
    import { mapActions } from 'vuex';
    
    export default {
        components: {
            ApplyMgt,
            CreateEdit
        },
        data() {
            return {
                data: [{
                    name:'管理员',
                    description:'系统管理员',
                    list:[]
                }],
                total:0,
                params:{
                    size:20,    
                    current:1 ,   
                    parentId:0,
                },
                dialogVisible:false,
                editFlag:false,
                value:{}
            }
        },
        mounted () {
            // this.getList();
        },
        methods: {
            ...mapActions('asset',[
                'skipToEdit',
                'getLineList', 
                'deleteLine'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
            },
            remove(row){
            },
            skipTo(type,row) {
                if(type==='check'){
                    this.$router.push({name:'Authority'});
                    this.skipToEdit({type,row,storage:'obj'});
                    return;
                }
                this.dialogVisible = true;
                if(type==="edit"){
                    this.editFlag = true;
                    this.value=row;
                }
            },
            close(){
                this.dialogVisible=false;
                this.editFlag=false;
                this.value  ={};
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>