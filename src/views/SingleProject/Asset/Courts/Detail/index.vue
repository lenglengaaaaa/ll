<template>
    <AssetDetail
        label="附属配电房"
        :data="data"
    >
        <template #column>
            <el-table-column
                prop="number"
                label="配电房编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="配电房名称"
                align="center"
                sortable
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="courtsId"
                label="所属台区"
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
                        type:'0',
                        courtsId:'0',
                        mainComeline:'0',
                        comeLine:'0',
                        detail:'Hello'
                    }
                ],
            }
        },
        methods: {
            skipToDetail() {
                this.$router.push({
                    name:'RoomDetail'
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>