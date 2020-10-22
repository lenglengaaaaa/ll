<template>
    <div
        :id="id"
        class="lineChart"
        ref="lineChart" 
    />
</template>

<script>
    import ChartMixin from './mixin/Chart_mixin';

    export default {
        props: {
            id:String,
            timeArray:Array,
            value:Array,
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
            this.chart = this.$echarts.init(document.getElementById(this.id))
            this.drawLine();
        },
        methods: {
            drawLine(){
                // 解决数据残留问题
                this.chart && this.chart.clear();

                const result = this.value.map((item,index)=>{
                    return {
                        data:item.data,
                        name:item.name,
                        type:'line',
                        smooth: true,
                        markPoint: {
                            // itemStyle:{
                            //     normal:{
                            //         label:{ 
                            //             show: true,  
                            //             color: '#000000',//气泡中字体颜色
                            //         }
                            //     }
                            // },
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        animationDuration: 2800,
                        animationEasing: 'quadraticOut',
                        symbolSize: 8,
                        // showAllSymbol: true//标注所有数据点 , 多数据时会有卡顿
                    }
                })
                
                const option = {
                    title: {
                        text: this.text
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        padding: [5, 10]
                    },
                    grid: {
                        left: 30,
                        right: 30,
                        top: 60,
                        containLabel: true
                    },
                    legend: {
                        type: 'scroll',
                        x:'right',
                        // orient:'vertical',
                        align:'right',
                        formatter: (name) =>{
                            return this.$echarts.format.truncateText(name, 100, '14px Microsoft Yahei', '…');
                        },
                        tooltip: {
                            show: true
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data:this.timeArray,
                        axisLine: {onZero: false},
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: ['20%', '20%'],
                        axisTick: {
                            show: false
                        }
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                        },
                        {
                            type: 'slider',
                            filterMode: 'none',
                        }
                    ],
                    series:result
                }
                this.text && (option.color=['#fdd835','#43a047','#e53935','#22a7f0']);

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