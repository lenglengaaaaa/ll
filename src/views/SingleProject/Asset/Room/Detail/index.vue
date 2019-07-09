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
            <el-tab-pane label="魔节" lazy class="magic">
                <Magic></Magic>
            </el-tab-pane>
            <el-tab-pane label="独立传感器" >
                
            </el-tab-pane>
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'
    import Magic from './components/Magic'

    export default {
        components: {
            AssetDetail,
            Magic
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
                options: [
                        {value: '0',label: '环境温度'}, 
                        {value: '1',label: '环境湿度'}, 
                        {value: '6',label: '氧气含量'}, 
                        {value: '2',label: '硫化氢'}, 
                        {value: '3',label: '一氧化碳'}, 
                        {value: '4',label: '烷类'}, 
                        {value: '5',label: '臭氧'}, 
                        {value: '7',label: '电池电压'}
                    ],
                value: '0',
                time: [new Date(), new Date()],
            }
        },
        created () {
            const result =JSON.parse(sessionStorage.getItem("obj"));
        },
        methods: {
            skipToDetail(row) {
                this.$router.push({
                    name:'CabinetDetail'
                })
                sessionStorage.setItem('obj',JSON.stringify(row))
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>