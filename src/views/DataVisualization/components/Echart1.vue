<template>
    <div 
        id="echart1"
        ref="echart1"
    />
</template>

<script>
    export default {
        name:"Echart1",
        props: {
            soeCount: {
                type: Array,
                default: ()=>[]
            },
        },
        data() {
            return {
                chart:null
            }
        },
        watch: {
            soeCount() {
                this.createChart();
            }
        },
        mounted() {
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
            createChart() {
                this.chart = this.$echarts.init(this.$refs.echart1);
                
                let option = {
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow"
                        }
                    },
                    grid: {
                        left: "0%",
                        top: "10px",
                        right: "0%",
                        bottom: "4%",
                        containLabel: true
                    },
                    xAxis: [{
                        type: "category",
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月' , '9月', '10月', '11月' ,'12月'],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "rgba(255,255,255,.1)",
                                width: 1,
                                type: "solid"
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            interval: 0,
                            show: true,
                            splitNumber: 15,
                            textStyle: {
                                color: "rgba(255,255,255,.6)",
                                fontSize: "12",
                            },
                        },
                    }],
                    yAxis: [{
                        type: "value",
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: "rgba(255,255,255,.6)",
                                fontSize: "12",
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "rgba(255,255,255,.1	)",
                                width: 1,
                                type: "solid"
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: "rgba(255,255,255,.1)",
                            }
                        }
                    }],
                    series: [{
                        type: "bar",
                        data: this.soeCount,
                        barWidth: "35%",
                        itemStyle: {
                            normal: {
                                color: "#2f89cf",
                                opacity: 1,
                                barBorderRadius: 5,
                            }
                        },
                    }]
                };
                this.chart.setOption(option);
                window.addEventListener('resize',this.$_handleResizeChart);
            }
        },
    }
</script>

<style lang="scss">
    #echart1{
        width: 100%;
        height: 100%;
    }
</style>