<template>
    <div
        id="line"
        ref="lineChart" 
    />
</template>

<script>
    export default {
        props: {
            value: {
                type: Array,
                default:()=>[
                    {name:'线缆一',data:[820, 932, 901, 934, 1290, 1330, 1320]},
                    {name:'线缆二',data:[820, 1290, 901, 1330, 1290, 1330, 1320]},
                    {name:'线缆三',data:[820, 1290, 901, 820, 1330, 1330, 1320]},
                    {name:'线缆四',data:[1320, 1290, 901, 1330, 1290, 820, 1320]},
                    {name:'线缆五',data:[820, 820, 901, 1330, 1290, 1330, 1330]},

                ]
            },
        },
        data() {
            return {
                chart: null,
                legend:[],
                series:[]
            }
        },
        mounted() {
            this.chart = this.$echarts.init(this.$refs.lineChart);
            this.legend = 
            this.series = this.value.reduce((pre,current)=>{
                this.legend.push(current.legend)
                return [
                    ...pre,
                    {
                        name:current.name,
                        type:'line',
                        data:current.data,
                        type: 'line',
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        }
                    }
                ]
            },[])
            setTimeout(()=>{this.initChart()})
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
            initChart() {
            // 把配置和数据放这里
                this.chart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:this.legend,
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisLine: {onZero: false},
                    },
                    yAxis: {
                        type: 'value',
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            xAxisIndex: 0,
                            filterMode: 'empty'
                        },
                    ],
                    series:this.series
                })
                this.chart&&this.chart.resize();
            }
        }
    }
</script>

<style lang="scss" scoped>
    #line{
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
    }
</style>