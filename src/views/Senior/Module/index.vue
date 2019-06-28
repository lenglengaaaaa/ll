<template>
    <div>
        <ApplyMgt
            title="模组"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
            :hasCheck="true"
            :hasAdd="false"
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
                    prop="firmId"
                    label="厂商ID"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="firmName"
                    label="厂商名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="mac"
                    label="mac地址"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="model"
                    label="模组型号"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    label="设备激活状态"
                    align="center"
                    sortable
                    show-overflow-tooltip
                >
                    <template slot-scope="scope" >
                        <el-tag
                            :type="scope.row.status? 'success' : 'danger'"
                            disable-transitions
                        >
                            {{scope.row.status?'已连接':'已断开'}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="模组状态"
                    align="center"
                    sortable
                    show-overflow-tooltip
                >
                    <template slot-scope="scope" >
                        <el-tag
                            :type="scope.row.modStatus? 'success' : 'danger'"
                            disable-transitions
                        >
                            {{scope.row.modStatus?'已连接':'已断开'}}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="description"
                    label=描述
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.description || '-' " 
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
                        name:'模组一',
                        firmId:'110',
                        firmName:'中科研究院',
                        mac:'1234567',
                        model:'AAA',
                        status:0,
                        modStatus:1,
                        description:''
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