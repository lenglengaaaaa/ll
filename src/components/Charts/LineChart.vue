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
                            filterMode: 'none',
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
                this.chart && this.chart.resize();
            },
            '$store.state.app.tab_index'(label) {
                const should_resize = ['魔戒总览','数据视图'];
                if(should_resize.includes(label)){
                    this.chart && this.chart.resize();
                }
            }
        },
        mounted() {
            this.chart = this.$echarts.init(document.getElementById(this.id))
            this.drawLine();
            
            window.addEventListener('resize',this.$_handleResizeChart);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize',this.$_handleResizeChart)
                if (!this.chart) return
                this.chart.dispose();
                this.chart = null;
            })
        },
        methods: {
            $_handleResizeChart(){
                this.chart && this.chart.resize()
            },
            drawLine(){
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
                this.option.series = result;
                this.option.xAxis.data = this.timeArray;
                
                //魔戒折线颜色
                this.text && (this.option.color=['#fdd835','#43a047','#e53935','#795548']);
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