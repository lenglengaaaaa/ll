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
                        productName:'产品一',
                        productProfile:'NB',
                        deviceEUI:'imei',
                        appId:'12,23'
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