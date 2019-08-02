<template>
    <div>
        <ApplyMgt
            title="产品"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
            :hasAdd="false"
        >   
            <template>
                <el-table-column
                    prop="productName"
                    label="产品名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="productProfile"
                    label="产品自解码插件"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="deviceEUI"
                    label="IMEI"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="appId"
                    label="所关联应用"
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
                        productName:'产品一',
                        productProfile:'NB',
                        deviceEUI:'imei',
                        appId:'2,1'
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