<template>
    <div>
        <ApplyMgt
            title="用户"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
        >   
            <template>
                <el-table-column
                    prop="userName"
                    label="用户名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="name"
                    label="账号"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="phoneNum"
                    label="手机号码"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.phoneNum || '-' " 
                />
                <el-table-column
                    prop="email"
                    label="邮箱"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.email || '-' " 
                />
                <el-table-column
                    prop="description"
                    label="详情"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.description || '-' " 
                />
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align="center"
                    sortable
                    :formatter="(row)=>this.$moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')"
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
    import CreateEdit from './components/CreateEdit'
    import { judgeLastData } from '@/utils/methods'
    import { mapActions } from 'vuex';

    export default {
        components: {
            ApplyMgt,
            CreateEdit
        },
        data() {
            return {
                data: [],
                total:0,
                dialogVisible:false,
                editFlag:false,
                value:{},
                params:{
                    size:20,    
                    current:1 ,   
                    projectId: 0
                }
            }
        },
        mounted () {
            this.getList();
        },
        methods: {
            ...mapActions('user',[
                'getAccountList', 
                'deleteAccount'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                this.getAccountList(data).then(res=>{
                    if(!res)return;
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                })
            },
            remove(row){
                const {id} = row;
                const current = judgeLastData(this.data,this.params.current);
                this.params ={
                    ...this.params,
                    current
                }
                this.deleteAccount(id).then(res=>{
                    if(!res)return;
                    this.getList();
                })
            },
            skipTo(type,row) {
                this.dialogVisible = true;
                if(type==="edit"){
                    this.editFlag = true;
                    this.value=row;
                }
            },
            close(result){
                this.dialogVisible=false;
                this.editFlag=false;
                this.value  ={};
                if(!result)return;
                this.getList(this.params);
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>