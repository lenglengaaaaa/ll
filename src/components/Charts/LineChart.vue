<template>
    <div
        :id="id"
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
                        trigger: 'axis'
                    },
                    legend: {
                        x:'left',
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
                        boundaryGap: ['20%', '20%']
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            xAxisIndex: 0,
                            filterMode: 'empty'
                        },
                    ],
                    series:[],
                    // animation: false 
                }
            }
        },
        watch: {
            value() {
                this.drawLine();
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
                const result = this.value.map(item=>{
                    return {
                        data:item.data,
                        name:item.name,
                        type:'line',
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
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
    #line,#MagicLine,#keyA,#keyT{
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
    }
</style>