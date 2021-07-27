<template>
    <div 
        class="data_visualization"
        :style="{
            backgroundImage:`url(${bg})`
        }"
    >
        <div class="header">
            <h1>EIOT数据展示页面</h1>
            <div class="entrance">
                <el-button 
                    size="small"
                    @click="enter"
                >
                    进入操作界面
                </el-button>
            </div>
            <div class="weather">
                <span id="showTime">{{currentTime}}</span>
            </div>
        </div>
        <div class="mainBox">
            <ul>
                <li class="module">
                    <div class="boxall">
                        <div class="alltitle">当前年份每月SOE数量</div>
                        <div class="allnav">
                            <Echart1
                                :soeCount="soeCount"
                            />
                        </div>
                        <div class="boxfoot"></div>
                    </div>
                    <div class="boxall">
                        <div class="alltitle">模块标题样式</div>
                        <div class="allnav">
                            <Echart2></Echart2>
                        </div>
                        <div class="boxfoot"></div>
                    </div>
                    <div class="boxall">
                        <div class="alltitle">模块标题样式</div>
                        <div class="allnav">
                            <Echart6></Echart6>
                        </div>
                        <div class="boxfoot"></div>
                    </div>
                </li>
                <li>
                    <div class="bar">
                        <div class="barbox">
                            <ul class="clearfix">
                                <li class="pulll_left counter">12581189</li>
                                <li class="pulll_left counter">3912410</li>
                            </ul>
                        </div>
                        <div class="barbox2">
                            <ul class="clearfix">
                                <li class="pulll_left">2018年总收入情况</li>
                                <li class="pulll_left">2018年总支出情况</li>
                            </ul>
                        </div>
                    </div>
                    <div class="map">
                        <div class="map1">
                            <img src="@images/lbx.png" >
                        </div>
                        <div class="map2">
                            <img src="@images/jt.png">
                        </div>
                        <div class="map3">
                            <img src="@images/map.png">
                        </div>
                        <div class="map4">
                            <ChinaChart></ChinaChart>
                        </div>
                    </div>
                </li>
                <li class="module">
                    <div class="boxall">
                        <div class="alltitle">模块标题样式</div>
                        <div class="allnav">
                            <Echart4></Echart4>
                        </div>
                        <div class="boxfoot"></div>
                    </div>
                    <div class="boxall">
                        <div class="alltitle">模块标题样式</div>
                        <div class="allnav">
                            <Echart5></Echart5>
                        </div>
                        <div class="boxfoot"></div>
                    </div>
                    <div class="boxall">
                        <div class="alltitle">模块标题样式</div>
                        <div class="allnav">
                            <Echart6></Echart6>
                        </div>
                        <div class="boxfoot"></div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex'
    import { ChinaChart, Echart1, Echart2, Echart3, Echart4, Echart5, Echart6} from './components'

    export default {
        components: {
            ChinaChart,
            Echart1,
            Echart2,
            Echart3,
            Echart4,
            Echart5,
            Echart6
        },
        data() {
            return {
                currentTime: '',
                bg:require('@images/bg.png'),
                soeCount:[]
            }
        },
        mounted () {
            this.getCurrentTime();
            this.getSoe();
        },
        methods: {
            ...mapActions('overall',[
                'getEquipCount',
                'getSoeCount',
            ]),
            //获取SOE数量
            getSoe(){
                let startTime = this.$moment().startOf('year').format('YYYY-MM-DD');
                let endTime = this.$moment().endOf('year').format('YYYY-MM-DD');
                this.getSoeCount({
                    query:null,
                    queryType:0,
                    startTime,
                    endTime,
                    timeType:0
                }).then(res=>{
                    if(!res)return;
                    this.soeCount = Object.values(res);
                })
            },
            getCurrentTime() {
                var t = null;
                const time = ()=>{
                    clearTimeout(t);
                    var dt = new Date();
                    var y = dt.getFullYear();
                    var mt = dt.getMonth() + 1;
                    var day = dt.getDate();
                    var h = dt.getHours();
                    var m = dt.getMinutes();
                    var s = dt.getSeconds();
                    this.currentTime = `${y}年${mt}月${day}日${h}时${m}分${s}秒`
                    t = setTimeout(time, 1000);
                }

                t = setTimeout(time,1000);
            },
            enter(){
                this.$router.push({name:'Overall'})
            }
        },
    }
</script>

<style lang="scss" scoped>
    .data_visualization{
        background: #000d4a url('') center top;
        width: 100%;
        height: 100vh;
        .header{
            height: 100px;
            background: url('../../assets/images/head_bg.png') no-repeat center center;
            background-size: 100% 100%;
            position: relative;
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            h1{
                color: #fff;
                font-size: 30px;
                margin: 0;
                margin-top: -15px;
            }
            .entrance{
                position: absolute;
                left: 35px;
                top: 20px;
                .el-button{
                    background: transparent;
                    color: #fff;
                    border: 1px solid rgba(25, 186, 139, 0.17);
                    position: relative;
                    &::before{
                        border-left: 2px solid #02a6b5;
                        left: 0;
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        content: "";
                        border-top: 2px solid #02a6b5;
                        top: 0;
                    }
                    &::after{
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        content: "";
                        border-bottom: 2px solid #02a6b5;
                        bottom: 0;
                        border-right: 2px solid #02a6b5;
                        right: 0;
                    }
                }
            }
            .weather{
                position: absolute;
                right: 35px;
                top: 20px;
                span{
                    color: rgba(255,255,255,.7);
                    font-size: 15px;
                }
            }
        }
        .mainBox{
            height: calc(100vh - 110px);
            padding: 10px 10px 0px 10px;
            &>ul{
                margin:0;
                display: flex;
                height: 100%;
                &>li{
                    width: 30%;
                    padding: 0 5px;
                    &:nth-child(2){
                        width: 40%;
                    }
                }
                .module{
                    display: flex;
                    flex-direction: column;
                    .boxall{
                        flex:1;
                        border: 1px solid rgba(25,186,139,.17);
                        padding: 0 15px 10px 15px;
                        background: rgba(255,255,255,.04) url('../../assets/images/line.png');
                        background-size: 100% auto;
                        position: relative;
                        z-index: 10;
                        margin-bottom: 15px;
                        &::before{
                            border-left: 2px solid #02a6b5;
                            left: 0;
                            position: absolute;
                            width: 10px;
                            height: 10px;
                            content: "";
                            border-top: 2px solid #02a6b5;
                            top: 0;
                        }
                        &::after{
                            position: absolute;
                            width: 10px;
                            height: 10px;
                            content: "";
                            border-top: 2px solid #02a6b5;
                            top: 0;
                            border-right: 2px solid #02a6b5;
                            right: 0;
                        }
                        .alltitle{
                            font-size: 16px;
                            color: #fff;
                            text-align: center;
                            line-height: 40px;
                        }

                        .allnav{
                            width: 100%;
                            height: calc(100% - 40px);
                        }

                        .charts{
                            display: flex;
                            height: 100%;
                            .sy{
                                flex: 1;
                            }
                        }

                        .boxfoot{
                            &::before{
                                position: absolute;
                                width: 10px;
                                height: 10px;
                                content: "";
                                border-bottom: 2px solid #02a6b5;
                                bottom: 0;
                                border-left: 2px solid #02a6b5;
                                left: 0;
                            }
                            &::after{
                                position: absolute;
                                width: 10px;
                                height: 10px;
                                content: "";
                                border-bottom: 2px solid #02a6b5;
                                bottom: 0;
                                border-right: 2px solid #02a6b5;
                                right: 0;
                            }
                        }
                    }
                }
                .bar{
                    background: rgba(101,132,226,.1);
                    padding: 12px;
                    .barbox{
                        border: 1px solid rgba(25,186,139,.17);
                        position: relative;
                        height: 60px;
                        &::before{
                            border-left: 2px solid #02a6b5;
                            left: 0;
                            border-top: 2px solid #02a6b5;
                            position: absolute;
                            width: 15px;
                            height: 10px;
                            content: "";
                        }
                        &::after{
                            border-right: 2px solid #02a6b5;
                            right: 0;
                            bottom: 0;
                            border-bottom: 2px solid #02a6b5;
                            position: absolute;
                            width: 15px;
                            height: 10px;
                            content: "";
                        }
                        &>ul{
                            display: flex;
                            height: 100%;
                            li{
                                flex:1;
                                font-size: 30px;
                                color: #ffeb7b;
                                padding: 5px 0;
                                font-weight: bold;
                                text-align: center;
                                position: relative;
                                z-index: 100;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                &:nth-child(1){
                                    &::before{
                                        position: absolute;
                                        content: "";
                                        height: 50%;
                                        width: 1px;
                                        background: rgba(255,255,255,.2);
                                        right: 0;
                                        top: 25%;
                                    }
                                }
                            }
                        }
                    }
                    .barbox2{
                        &>ul{
                            display: flex;
                            li{
                                flex:1;
                                text-align: center;
                                font-size: 16px;
                                color: rgba(255,255,255,.7);
                                padding-top: 8px;
                            }
                        }
                    }
                }
                .map{
                    position: relative;
                    height: calc(100% - 115px);
                    z-index: 9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    @keyframes myfirst {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(-359deg);
                        }
                    }
                    @keyframes myfirst2 {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(359deg);
                        }
                    }
                    .map1{
                        position: absolute;
                        width: calc(100% - 150px);
                        z-index: 2;
                        animation: myfirst2 15s infinite linear;
                        img{
                            border: none;
                            max-width: 100%;
                        }
                    }
                    .map2{
                        position: absolute;
                        width: calc(100% - 215px);
                        z-index: 3;
                        opacity: 0.2;
                        animation: myfirst 10s infinite linear;
                        img{
                            width: 100%;
                        }
                    }
                    .map3{
                        position: absolute;
                        width: calc(100% - 280px);
                        z-index: 1;
                        border: none;
                        display: flex;
                        justify-content: center;
                        opacity: .5;
                        img{
                            width: 100%;
                        }
                    }
                    .map4{
                        width: 100%;
                        position: relative;
                        margin-top: 16px;
                        z-index: 5;
                        #china_chart{
                            height: 650px;
                        }
                    }
                }
            }
        }
    }
</style>