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
                    prop="moduleName"
                    label="模组名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="manufacturerId"
                    label="厂商ID"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="manufacturerName"
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
                            :type="scope.row.activated? 'success' : 'danger'"
                            disable-transitions
                        >
                            {{scope.row.activated?'已连接':'已断开'}}
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
                            :type="scope.row.status? 'success' : 'danger'"
                            disable-transitions
                        >
                            {{scope.row.status?'已连接':'已断开'}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="moduleDetail"
                    label=描述
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.moduleDetail || '-' " 
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
                        moduleName:'模组一',
                        manufacturerId:'110',
                        manufacturerName:'中科研究院',
                        mac:'123',
                        model:'AAA',
                        activated:0,
                        status:0,
                        location:'深圳',
                        swversion:'1.0',
                        fwversion:'1.0',
                        hwversion:'1.0',
                        protocolType:'1',
                        bridgeid:'1',
                        moduleDetail:''
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
                if(type==="edit"){
                    this.$router.push({
                        name:'ModuleEdit',
                        params:{
                            data:row
                        }
                    })
                    return
                }
                this.$router.push({name:'ModuleDetail'})
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