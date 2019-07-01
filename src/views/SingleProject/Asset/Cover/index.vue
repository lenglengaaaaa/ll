<template>
    <ApplyMgt
        title="井盖"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
    >
        <template>
            <el-table-column
                prop="name"
                label="井盖名称"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="number"
                label="井盖编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="lineId"
                label="所属主线缆"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="detail"
                label="资产描述"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.detail || '-'"
            />
        </template>
    </ApplyMgt>
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
                        name:'演示平台',
                        number:'0049',
                        lineId:'0',
                        detail:'Hi'
                    }
                ],
                total:100
            }
        },
        methods: {
            getList(){
                console.log('获取数据')
            },
            skipTo(type,row) {
                this.$router.push({name:'NewCover'})
                //修改资产类型
                this.$store.dispatch('app/setAsset',3)
                this.$store.dispatch('app/setEdit',{
                    editFlag:type==='edit'?true:false,
                    data:row
                })
            },
            remove(){
                console.log('删除')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>