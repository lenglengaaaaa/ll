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
                    prop="name"
                    label="用户名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="userName"
                    label="账号"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="phoneNumber"
                    label="手机号码"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.phoneNumber || '-' " 
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
                    prop="details"
                    label="详情"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.details || '-' " 
                />
                <el-table-column
                    prop="time"
                    label="创建时间"
                    align="center"
                    sortable
                    :formatter="(row)=>this.$moment(row.time).format('YYYY-MM-DD HH:mm:ss')"
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
                data: [
                    {
                        name:'侨城东电缆沟',
                        userName:'userName',
                        phoneNumber:'13612345678',
                        email:'123@163.com',
                        details:'震动值：静止',
                    }
                ],
                total:100,
                dialogVisible:false,
                editFlag:false,
                value:{}
            }
        },
        methods: {
            getList(){
                console.log('获取数据')
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