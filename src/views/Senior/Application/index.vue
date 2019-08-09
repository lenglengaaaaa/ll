<template>
    <div>
        <ApplyMgt
            title="应用"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
            :verify="false"
        >   
            <template>
                <el-table-column
                    prop="appName"
                    label="应用名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="appKey"
                    label="应用密钥"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="appType"
                    label="应用类型"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="netModel"
                    label="入网类型"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="coapWay"
                    label="coap链接方式"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="mqttWay"
                    label="mqtt链接方式"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="agentliteWay"
                    label="AgentLite链接方式"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    width="200"
                />
                <el-table-column
                    prop="httpsWay"
                    label="https链接方式"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="appDetail"
                    label="描述"
                    align="center"
                    sortable
                    show-overflow-tooltip
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
    import { judgeLastData } from '@/utils/methods'
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
                        appName:'应用一',
                        appKey:'userName',
                        appType:'13612345678',
                        netModel:'123@163.com',
                        coapWay:'1',
                        mqttWay:'2',
                        agentliteWay:'3',
                        httpsWay:'4',
                        appDetail:'震动值：静止',
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