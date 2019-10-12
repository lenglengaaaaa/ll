<template>
    <div
        :id="id"
        class="lineChart"
        ref="lineChart" 
    />
</template>

<script>
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
        data() {
            return {
                chart: null,
                option:{
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
                        left: 10,
                        right: 10,
                        top: 30,
                        containLabel: true
                    },
                    legend: {
                        x:'right',
                        // orient:'vertical',
                        align:'right',
                        formatter: function (name) {
                            return echarts.format.truncateText(name, 100, '14px Microsoft Yahei', '…');
                        },
                        tooltip: {
                            show: true
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data:[],
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
                            xAxisIndex: 0,
                            filterMode: 'empty'
                        }
                    ],
                    series:[],
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
                this.chart&&this.chart.resize();
            }
        },
        mounted() {
            this.chart = this.$echarts.init(document.getElementById(this.id))
            this.drawLine();
            window.addEventListener('resize',()=>{
                this.chart&&this.chart.resize()
            },false);
        },
        beforeDestroy() {
            if (!this.chart) return
            this.chart.dispose();
            this.chart = null;
        },
        methods: {
            drawLine(){
                const result = this.value.map((item,index)=>{
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
                        animationEasing: 'quadraticOut'
                    }
                })
                this.option.series = result;
                this.option.xAxis.data = this.timeArray;
                // 基于准备好的dom，初始化echarts实例
                // 绘制图表
                this.chart.setOption(this.option,true)
                
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