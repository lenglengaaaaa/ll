<template>
    <div
        id="double_line"
        ref="lineChart" 
    />
</template>

<script>
    export default {
        name:'DoubleLineChart',
        props: {
            value:{
                type:Object,
                default:()=>{}
            },
            text:{
                type:String,
                default:''
            }
        },
        data() {
            return {
                chart: null,
                option:{
                    title: {
                        text: this.text,
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        padding: [5, 10]
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
                    axisPointer: {
                        link: {xAxisIndex: 'all'}
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: 30,
                            end: 70,
                            xAxisIndex: [0, 1]
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            start: 30,
                            end: 70,
                            xAxisIndex: [0, 1]
                        }
                    ],
                    grid: [
                        {
                            left: 50,
                            right: 50,
                            height: '33%'
                        }, 
                        {
                            left: 50,
                            right: 50,
                            top: '55%',
                            height: '33%'
                        }
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            axisLine: {onZero: false},
                            data:[]
                        },
                        {
                            gridIndex: 1,
                            type: 'category',
                            axisLine: {onZero: false},
                            data:[]
                        }
                    ],
                    yAxis: [
                        {
                            name: `电流(A)`,
                            nameTextStyle:{
                                fontWeight:'bold',
                                fontSize:14
                            },
                            type: 'value',
                            boundaryGap: ['20%', '20%'],
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            gridIndex: 1,
                            name: `温度(℃)`,
                            nameTextStyle:{
                                fontWeight:'bold',
                                fontSize:14
                            },
                            type: 'value',
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series: []
                }   
            }
        },
        watch: {
            value() {
                this.drawLine();
            },
            text(value){
                this.option.title.text = value;
            },
            '$store.state.app.sidebar.opened'(flag) {
                this.chart && this.chart.resize();
            }
        },
        mounted() {
            this.chart = this.$echarts.init(document.getElementById('double_line'))
            this.drawLine();
            window.addEventListener('resize',()=>{
                this.chart && this.chart.resize()
            },false);
        },
        beforeDestroy() {
            if (!this.chart) return
            this.chart.dispose();
            this.chart = null;
        },
        destroyed(){
            window.removeEventListener('resize',()=>{
                this.chart && this.chart.resize()
            },false);
        },
        methods: {
            drawLine(){
                console.log(this.value,'value')
                const { timeArray, data } = this.value;
                const { lineA, lineTemp } = data;
                const lineA_result = lineA.map((item,index)=>{
                    return {
                        data:item.data,
                        name:item.name,
                        type:'line',
                        smooth: true,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        animationDuration: 2800,
                        animationEasing: 'quadraticOut',
                        symbolSize: 8,
                        hoverAnimation: false,
                        // showAllSymbol: true//标注所有数据点 , 多数据时会有卡顿
                    }
                })
                const lineTemp_result = lineTemp.map((item,index)=>{
                    return {
                        data:item.data,
                        name:item.name,
                        type:'line',
                        smooth: true,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        animationDuration: 2800,
                        animationEasing: 'quadraticOut',
                        symbolSize: 8,
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        hoverAnimation: false,
                        // showAllSymbol: true//标注所有数据点 , 多数据时会有卡顿
                    }
                })
                this.option.series = [...lineA_result, ...lineTemp_result];
                // this.option.series[1] = lineTemp_result;

                this.option.xAxis[0].data = timeArray;
                this.option.xAxis[1].data = timeArray;

                // 基于准备好的dom，初始化echarts实例
                // 绘制图表
                this.chart.setOption(this.option,true)
            },
        }
    }
</script>

<style lang="scss" scoped>
    #double_line{
        height: 630px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
    }
</style>