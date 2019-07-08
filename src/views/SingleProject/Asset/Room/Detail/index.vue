<template>
    <AssetDetail
        label="附属配电柜"
        :data="data"
    >
        <template #column>
            <el-table-column
                prop="number"
                label="配电柜编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="配电柜名称"
                align="center"
                sortable
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="roomId"
                label="所属配电房"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="mainComeline"
                label="主进线"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="comeLine"
                label="备用进线"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="detail"
                label="描述"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.detail || '-'"
            />
        </template>
        <template>
            <el-tab-pane label="魔节">
                
            </el-tab-pane>
            <el-tab-pane label="独立传感器">
                
            </el-tab-pane>
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'

    export default {
        components: {
            AssetDetail
        },
        data() {
            return {
                data: [
                    {
                        name:'演示平台',
                        number:'0049',
                        roomId:'1',
                        mainComeline:'0',
                        comeLine:'0',
                        detail:'world'
                    }
                ],
            }
        },
        methods: {
            skipToDetail() {
                this.$router.push({
                    name:'CabinetDetail'
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>