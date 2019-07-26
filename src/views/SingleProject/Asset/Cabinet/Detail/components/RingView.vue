<template>
    <div class="RING_VIEW">
        <el-row :gutter="20" >
            <el-col :span="10" :xs="24">
                <div class="view">
                    <ul class="wrap">
                        <strong>宝善街线段</strong>
                        <li v-for="(i,index) in 3" :key="index">
                            <div class="title">
                                <span 
                                    @click="selectRing(index)" 
                                    :class="highlight===index&&'active'"
                                >
                                    标题
                                </span>
                            </div>
                            <ul class="list">
                                <li v-for="(i,index) in 4" :key="index">
                                    <div class="info">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#icon-ring"></use>
                                        </svg>
                                        <span>26.1℃</span>
                                        <span>37.0A</span>
                                        <span>有压</span>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="14" :xs="24">
                <div class="chart">
                    <Tline></Tline>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Tline from './Tline'

    export default {
        components: {
            Tline,
        },
        data() {
            return {
                highlight: 0
            }
        },
        methods: {
            selectRing(index) {
                this.highlight = index;
            }
        },
    }
</script>

<style lang="scss" scoped>
    .RING_VIEW{
        height: 100%;
        .el-row{
            height: 100%;
            .el-col{
                height: 100%;
                .view{
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: scroll;
                    .wrap{
                        padding: 0;
                        margin: 0;
                        position: relative;
                        max-width: 100%;
                        strong{
                            position: absolute;
                            width: 220px;
                            top: -99px;
                            left: 120px;
                            padding: 5px;
                            font-size: 0.8rem;
                            border-radius: 5px;
                            border: 4px solid black;
                        }
                        > li{
                            display: flex;
                            width: 400px;
                            height: 120px;
                            .title{
                                    width: 30%;
                                    padding: 15px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    span{
                                        font-size: 0.8rem;
                                        font-weight: bold;
                                        cursor: pointer;
                                        width: 100%;
                                        padding: 5px;
                                        display: inline-block;
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        white-space: nowrap;
                                        border-radius: 5px;
                                        text-align: center;
                                    }
                                    .active{
                                        color: #fff;
                                        background-color: rgb(54, 169, 225);
                                    }
                            }
                            .list{
                                width: 70%;
                                background:url('../../../../../../assets/img/linemap.png') no-repeat ;
                                position: relative;
                                &::before{
                                        content: ' ';
                                        position: absolute;
                                        top: -60px;
                                        left: 0px;
                                        height: 100%;
                                        border-left: 4px solid #000;
                                }
                                li{
                                    font-size: 0.75rem;
                                    position: relative;
                                    height: 26.5px;
                                    .info{
                                        width: 100%;
                                        position: absolute;
                                        top: 5px;
                                        left: 90px;
                                        display: flex;
                                        align-items: center;
                                        .icon{
                                            width: 20px;
                                            height: 19px;;
                                        }
                                        span{
                                            padding: 0 5px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .chart{

                }
            }
        }
        
    }
</style>