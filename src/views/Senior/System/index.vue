<template>
    <div>
        <ApplyMgt
            title="系统操作"
            :data="data"
            :total="total"
            :getList="getList"
            :hasAdd="false"
            :hasOpera="false"
        >   
            <template>
                <el-table-column
                    prop="operationName"
                    label="操作名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="IP"
                    label="操作IP"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="operationTerrace"
                    label="操作方式"
                    align="center"
                    sortable
                    show-overflow-tooltip
                >
                    <template slot-scope="scope" >
                        <span>
                            {{scope.row.operationTerrace===0?
                                'web端':scope.row.operationTerrace===1?
                                    'IOS':scope.row.operationTerrace===2?
                                        'Android':'API接口'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operationDetail"
                    label="操作详情"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="accountAction"
                    label="执行的命令"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="isSuccess"
                    label="是否执行成功"
                    align="center"
                    sortable
                    show-overflow-tooltip
                >
                    <template slot-scope="scope" >
                        <el-tag
                            :type="scope.row.isSuccess? 'success' : 'danger'"
                            disable-transitions
                        >
                            {{scope.row.isSuccess?'成功':'失败'}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="accountId"
                    label="操作用户"
                    align="center"
                    sortable
                    show-overflow-tooltip
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
                        operationName:'操作一',
                        IP:'11:21:33:14',
                        accountId:'imei',
                        way:'点击',
                        operationDetail:'我也不知道',
                        operationTerrace:0,
                        accountAction:'Hello world',
                        isSuccess:1,
                    }
                ],
                total:100,
            }
        },
        methods: {
            getList(){
                
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>