<template>
    <div
        :id="id"
        class="lineChart"
        ref="lineChart" 
    />
</template>

<script>
    import ChartMixin from './mixin/Chart_mixin';
    import { getUnit } from "@/utils/methods";

    export default {
        props: {
            id:String,
            value:{
                type:Object,
                default:()=>{}
            },
            text:{
                type:String,
                default:''
            }
        },
        mixins:[ ChartMixin ],
        data() {
            return {}
        },
        watch: {
            value() {
                this.drawLine();
            }
        },
        mounted() {
            this.chart = this.$echarts.init(document.getElementById(this.id));
            this.drawLine();
        },
        methods: {
            drawLine(){
                // 解决数据残留问题
                // this.chart && this.chart.clear();
                const { type, dataArr, timeArr } = this.value;
                
                const option = {
                    title: {
                        text: this.text
                    },
                    color: ['#fdd835','#43a047','#e53935','#22a7f0'],
                    legend: {
                        type: 'scroll',
                        x:'center',
                        align:'right',
                        formatter:function (params, ticket, callback) {
                            if(params.length>10){
                            return `${params.slice(0,4)}...`
                            }
                            return params;
                        },
                        tooltip: {
                            show: true
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        padding: [5, 10]
                    },
                    grid: {
                        left: 20,
                        right: 20,
                        top: '20%',
                        bottom:"20%",
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: timeArr,
                        axisLine: {
                            onZero: false,
                        },
                        // axisLabel: {  //X轴文字过长解决方案
                        //     interval: 0,  
                        //     formatter:function(params,index)  
                        //     {  
                        //       if (index % 2 != 0) {
                        //           return '\n\n' + params;
                        //         } else {
                        //           return params;
                        //       }
                        //     }  
                        // }  
                    },
                    yAxis: {
                        name:getUnit(type),
                        x: 'center',
                        nameTextStyle:{
                            fontWeight:"bold",
                            fontSize:15
                        },
                        type: 'value',
                        boundaryGap: ['20%', '20%'],
                        axisTick: {
                            show: false
                        }
                    },
                    dataZoom: [
                        { type: 'inside' },
                        { type: 'slider', filterMode: 'none' }
                    ],
                    series: dataArr
                }
                // this.text && (option.color = color);

                // 绘制图表
                this.chart.setOption(option, true);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .lineChart{
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
    }
</style>