<template>
    <div>
        <ApplyMgt
            title="应用"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
        >   
            <template>
                <el-table-column
                    prop="name"
                    label="应用名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="key"
                    label="应用密钥"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="type"
                    label="应用类型"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="netIn"
                    label="入网类型"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="coap"
                    label="coap链接方式"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="mqtt"
                    label="mqtt链接方式"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="agent"
                    label="AgentLite链接方式"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    width="200"
                />
                <el-table-column
                    prop="https"
                    label="https链接方式"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="description"
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
                        name:'应用一',
                        key:'userName',
                        type:'13612345678',
                        netIn:'123@163.com',
                        coap:'1',
                        mqtt:'2',
                        agent:'3',
                        https:'4',
                        description:'震动值：静止',
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