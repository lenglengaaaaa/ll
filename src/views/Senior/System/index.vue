<template>
    <div>
        <ApplyMgt
            title="系统操作"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
            :hasAdd="false"
            :hasOpera="false"
        >   
            <template>
                <el-table-column
                    prop="name"
                    label="操作名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="ip"
                    label="操作IP"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="user"
                    label="操作用户"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="way"
                    label="操作方式"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="detail"
                    label="操作详情"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="order"
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
                    prop="creater"
                    label="创建者"
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
                        name:'操作一',
                        ip:'11:21:33:14',
                        user:'imei',
                        way:'点击',
                        detail:'我也不知道',
                        order:'Hello world',
                        isSuccess:1,
                        creater:'Zain'
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
</style>