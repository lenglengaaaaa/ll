<template>
    <div
        id="gauge"
        ref="gaugeChart" 
    />
</template>

<script>
    export default {
        props: {
            value: {
                type: Object,
                default:()=>{} 
            },
        },
        data() {
            return {
                chart: null,
            }
        },
        mounted() {
            this.chart = this.$echarts.init(this.$refs.gaugeChart);
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
                    tooltip : {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    toolbox: {
                    },
                    series: [
                        {
                            name: '转速',
                            type: 'gauge',
                            center: ['50%', '50%'],    // 默认全局居中
                            radius: '100%',
                            min:0,
                            max:100,
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    width: 10,
                                    color: [[0.25, '#0277bd'],[0.5, '#4caf50'],[0.75, '#f57c00'],[1, '#f44336']],
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                length:5,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: '#fff',
                                }
                            },
                            splitLine: {           // 分隔线
                                length:20,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            pointer: {
                                width:5
                            },
                            title: {
                                offsetCenter: [0, '-30%'],       // x, y，单位px
                                fontWeight:'bolder',
                                fontSize: 20,
                            },
                            detail: {
                                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize:35
                            },
                            data:[{value: 30,name: '氧气(%)'}]
                        },
                    ]
                })
                this.chart&&this.chart.resize();
            }
        }
    }
</script>

<style lang="scss" scoped>
    #gauge{
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
    }
</style>