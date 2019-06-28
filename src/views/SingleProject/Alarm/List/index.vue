<template>
    <ApplyMgt
        title="告警"
        :data="data"
        :total="total"
        :getList="getList"
        :remove="remove"
    >   
        <template #header>
            <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </template>
        <template>
            <el-table-column
                prop="name"
                label="设备名称"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="number"
                label="资产编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="details"
                label="告警详情"
                align="center"
                sortable
            >
                <template slot-scope="scope" >
                    <span class="red">
                        {{scope.row.details}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="time"
                label="告警时间"
                align="center"
                sortable
                :formatter="(row)=>this.$moment(row.time).format('YYYY-MM-DD HH:mm:ss')"
            />
        </template>
        <template #operation>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="linkTo(scope.row)"
                    >
                        查看
                    </el-button>
                </template>
            </el-table-column>
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
                date:'',
                data: [
                    {
                        name:'侨城东电缆沟',
                        number:'381800000066',
                        details:'震动值：静止',
                        time:'2019-06-19 13:05:11'
                    }
                ],
                total:100
            }
        },
        watch: {
            date(newValue, oldValue) {
                console.log(newValue,'value')
            }
        },
        methods: {
            getList(){
                console.log('获取数据')
            },
            linkTo(row) {
                this.$router.push({name:'Detail'})
            },
            remove(){
                console.log('删除')
            }
        },
    }
</script>

<style lang="scss" scoped>
    .red{
        color: red;
    }
</style>