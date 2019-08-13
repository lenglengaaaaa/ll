<template>
    <div class="Overview_container">
        <div class="title_bar">
            <span>
                欢迎使用E+view物联网云平台
            </span>
        </div>
        <div class="body">
            <CountRow :rows="rows" />
            <div class="ChartRow">
                <el-row :gutter="20" type="flex" >
                    <el-col :span="12" :xs="24">
                        <div class="data-content" >
                            <SoeChart></SoeChart>
                        </div>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <div class="data-content" >
                            <CategoryChart
                                v-if="equipList.length" 
                                :equipList="equipList"
                            />
                            <Empty v-else/>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <MapRow />
        </div>
    </div>
</template>

<script>
    import {CountRow} from '@/components/Row'
    import { SoeChart , CategoryChart} from '@/components/Charts'
    import Empty from '@/components/Empty'
    import MapRow from './components/MapRow'

    export default {
        components:{
            CountRow,
            SoeChart,
            CategoryChart,
            Empty,
            MapRow
        },
        data() {
            return {
                rows: [
                    {
                        name:'网关',
                        icon:'#icon-natNATwangguan',
                        path:'/gateway',
                        total:5,
                        has:4
                    },
                    {
                        name:"项目",
                        icon:'#icon-yingyong',
                        path:'/project',
                        total:1,
                        has:1,
                    },
                    {
                        name:'设备',
                        icon:'#icon-huabanfuben',
                        path:'/project',
                        total:4,
                        has:2
                    }
                ],
                equipList:[]
            }
        }
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 870px) {
        .Overview_container{
            padding: 0px !important;
            .body{
                padding: 0 20px;
            }
        }
        .ChartRow{
            .el-row{
                flex-direction: column;
            }
        }
    }
    .Overview_container{
        padding:10px 1vw;
        height: calc(100% - 20px);
        overflow: scroll;
        .title_bar{
            background: #fff;
            padding: 15px 15px;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            span{
                font-size: 1.06rem;
                font-weight: 300;
                color: #4abced;
            }
        }
        .ChartRow{
            .el-row {
                margin-bottom: 20px;
                .data-content {
                        padding: 30px 0px;
                        background: #fff;
                        margin-bottom: 20px;
                        box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
                        height: 400px;
                    }
            }
        }   
    }
</style>