<template>
    <div class="Overview_container">
        <div class="title_bar">
            <span>
                欢迎使用E+view物联网云平台
            </span>
        </div>
        <div class="body">
            <el-row :gutter="0" class="row-wrap" type="flex">
                <el-col :span="4" :xs="24">
                    <CountRow />
                </el-col>
                <el-col :span="20" :xs="24">
                    <div class="body-right">
                        <div class="body-right-top">
                            <el-row :gutter="20" type="flex" class="chart-wrap">
                                <el-col :span="12" :xs="24">
                                    <div class="data-content" >
                                        <SoeChart
                                            v-if="soeCount.length"
                                            :soeCount="soeCount"
                                        />
                                        <cc-empty v-else/>
                                    </div>
                                </el-col>
                                <el-col :span="12" :xs="24">
                                    <div class="data-content" >
                                        <CategoryChart
                                            v-if="equipList.length" 
                                            :equipList="equipList"
                                        />
                                        <cc-empty v-else/>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="body-right-bottom">
                            <MapRow />
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <cc-backtop target=".Overview_container"/>
    </div>
</template>

<script>
    import { SoeChart , CategoryChart} from '@/components/Charts'
    import CountRow from './components/CountRow'
    import MapRow from './components/MapRow'

    export default {
        components:{
            CountRow,
            SoeChart,
            CategoryChart,
            MapRow
        },
        data() {
            return {
                equipList:[],
                soeCount:[]
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
                height: auto !important;
                .row-wrap,.chart-wrap{
                    flex-direction: column;
                }
                &-right{
                    &-top{
                        margin-bottom: 0px !important;
                        .el-col{
                            margin: 10px 0 !important;
                        }
                        .data-content {
                            height: 400px !important;
                        }
                    }
                }
            }
        }
    }
    .Overview_container{
        padding:10px 1vw;
        height: calc(100% - 20px);
        overflow: auto;
        .title_bar{
            background: #fff;
            padding: 10px 15px;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            span{
                font-size: 0.8rem;
                font-weight: 500;
                color: #4abced;
            }
        }
        .body{
            height: calc(100% - 51px);
            .el-row{
                width: 100%;
                height: 100%;
                margin: 0px !important;
                .el-col{
                    height: inherit;
                }
            }
            &-right{
                display: flex;
                flex-direction: column;
                height: inherit;
                &-top{
                    height: 50%;
                    margin-bottom: 5px;
                    .el-col{
                        padding: 0 !important;
                        &:nth-child(1){
                            margin: 0 10px 0 10px;
                        }
                    }
                    .data-content {
                        margin-bottom: 5px;
                        width: 100%;
                        background: #fff;
                        box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
                        height: 100%;
                        border-radius: 5px;
                    }
                }
                &-bottom{
                    height: 50%;
                }
            }
        }
    }
</style>