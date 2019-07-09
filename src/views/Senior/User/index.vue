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

    export default {
        components: {
            ApplyMgt,
            CreateEdit
        },
        data() {
            return {
                data: [],
                total:100,
                dialogVisible:false,
                editFlag:false,
                value:{},
                param:{
                    size:10,    
                    current:1 ,   
                    projectId: 0
                }
            }
        },
        methods: {
            getList(){
                this.$store.dispatch('user/getAccountList', this.param).then(res=>{
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                });
            },
            skipTo(type,row) {
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
            remove(){
                console.log('删除')
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>