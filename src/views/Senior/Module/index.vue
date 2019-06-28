<template>
    <div>
        <ApplyMgt
            title="模组"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
        >   
            <template>
                <el-table-column
                    prop="name"
                    label="模组名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.name || '-' " 
                />
                <el-table-column
                    prop="phoneNumber"
                    label="厂商ID"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.phoneNumber || '-' " 
                />
                <el-table-column
                    prop="phoneNumber"
                    label="厂商名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.phoneNumber || '-' " 
                />
                <el-table-column
                    prop="phoneNumber"
                    label="模组类型"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.phoneNumber || '-' " 
                />
                <el-table-column
                    prop="phoneNumber"
                    label="模组信号强度"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.phoneNumber || '-' " 
                />
                <el-table-column
                    prop="phoneNumber"
                    label="信号等级"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.phoneNumber || '-' " 
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
                    prop="phoneNumber"
                    label="手机号码"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.phoneNumber || '-' " 
                />
            </template>
        </ApplyMgt>
    </div>
</template>

<script>
    import {ApplyMgt} from '@/components/Management'

    export default {
        components: {
            ApplyMgt,
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
            }
        },
        methods: {
            getList(){
                console.log('获取数据')
            },
            skipTo(type,row) {

            },
            close(){

            },
            remove(){
                console.log('删除')
            }
        },
    }
</script>

<style lang="scss" scoped>
    .red{
        color: red;
    }
</style>