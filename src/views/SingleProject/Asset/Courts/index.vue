<template>
    <ApplyMgt
        title="台区"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
    >
        <template>
            <el-table-column
                prop="name"
                label="台区名称"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="number"
                label="台区编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="type"
                label="台区类型"
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
                prop="preVoltage"
                label="变压前电压"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="nextVoltage"
                label="变压后电压"
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
                        mainId:'0',
                        standbyId:'0',
                        preVoltage:'1100V',
                        nextVoltage:'220V',
                        rating:'1',
                        classes:'2',
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
                this.$router.push({name:'NewCourts'})
                //修改资产类型
                this.$store.dispatch('app/setAsset',0)
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