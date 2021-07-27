<template>
    <div>
        <cc-table
            title="产品"
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
        </cc-table>
        <CreateEdit
            :visible="dialogVisible"
            :close="close"
            :editFlag="editFlag"
            :value="value"
        />
    </div>
</template>

<script>
    import CreateEdit from './components/CreateEdit'

    export default {
        components: {
            CreateEdit
        },
        data() {
            return {
                dialogVisible:false,
                editFlag:false,
                value:{}
            }
        },
        methods: {
            getList(){
                // data: [
                //     {
                //         productName:'产品一',
                //         productProfile:'NB',
                //         deviceEUI:'imei',
                //         appId:'2,1'
                //     }
                // ],
                // total:100,
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
                
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>