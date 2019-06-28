<template>
    <div>
        <ApplyMgt
            title="设备修复"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
        >   
            <template>
                <el-table-column
                    prop="eui"
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
                    :formatter="(row)=>this.$moment(row.modifyTime).format('YYYY-MM-DD HH:mm:ss')"
                >
                </el-table-column>
                <el-table-column
                    prop="comment"
                    label="备注"
                    align="center"
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
                        eui:'119',
                        creater:'plugin',
                        creatTime:'1561714114536',
                        comment:'Hello World',
                        modifyTime:'1561714114536',
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