<template>
    <div 
        id="echart2"
        ref="echart2"
    />
</template>

<script>
    export default {
        name:"Echart2",
        data() {
            return {
                chart:null
            }
        },
        mounted() {
            this.createChart();
        },
        beforeDestroy() {
            if (!this.chart) return
            this.chart.dispose();
            this.chart = null;
        },
        methods: {
            createChart() {
                this.chart = this.$echarts.init(this.$refs.echart2);
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
                        data: ["浙江", "上海", "江苏", "广东", "北京", "深圳", "安徽"],
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
                        data: [1500, 1200, 600, 200, 300, 300, 900],
                        barWidth: "35%",
                        itemStyle: {
                            normal: {
                                color: "#27d08a",
                                opacity: 1,
                                barBorderRadius: 5,
                            }
                        }
                    }]
                };
                this.chart.setOption(option);
                window.addEventListener('resize',()=>{
                    this.chart&&this.chart.resize()
                },false);    
            }
        },
    }
</script>

<style lang="scss">
    #echart2{
        width: 100%;
        height: 100%;
    }
</style>