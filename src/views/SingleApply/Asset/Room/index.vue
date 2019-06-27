<template>
    <ApplyMgt
        title="配电柜"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
    >
        <template>
            <el-table-column
                prop="name"
                label="配电房名称"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="number"
                label="配电房编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="courtsId"
                label="所属台区"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="mainId"
                label="主进线"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="standbyId"
                label="备用进线"
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
                :formatter="(row)=>row.description || '-'"
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
                        type:'0',
                        courtsId:'0',
                        mainId:'0',
                        standbyId:'0',
                        description:''
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
                //修改资产类型
                this.$store.dispatch('app/setAsset',1)
                this.$store.dispatch('app/setEdit',{
                    editFlag:type==='edit'?true:false,
                    data:row
                })
                this.$router.push({name:'NewRoom'})
            },
            remove(){
                console.log('删除')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>