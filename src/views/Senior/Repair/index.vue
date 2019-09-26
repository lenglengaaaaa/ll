<template>
    <div>
        <cc-table
            title="设备修复"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
        >   
            <template>
                <el-table-column
                    prop="deviceAdress"
                    label="设备EUI"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="creater"
                    label="创建人"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    label="创建时间"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>this.$moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')"
                />
                <el-table-column
                    label="修改时间"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>this.$moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')"
                />
                <el-table-column
                    prop="comment"
                    label="备注"
                    align="center"
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
    import { judgeLastData } from '@/utils/methods'
    import CreateEdit from './components/CreateEdit'

    export default {
        components: {
            CreateEdit
        },
        data() {
            return {
                data: [
                    {
                        deviceAdress:'119',
                        creater:'plugin',
                        createTime:1561714114536,
                        updateTime:1571714115536,
                        comment:'Hello World',
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