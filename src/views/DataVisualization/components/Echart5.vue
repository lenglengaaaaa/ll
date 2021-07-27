<template>
    <div 
        id="echart5"
        ref="echart5"
    />
</template>

<script>
    export default {
        name:"Echart5",
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
                this.chart = this.$echarts.init(this.$refs.echart5);
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
                        bottom: "2%",
                        containLabel: true
                    },
                    xAxis: [{
                        type: "category",
                        data: ["浙江", "上海", "江苏", "广东", "北京", "深圳", "安徽", "四川"],
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
                        data: [2, 3, 3, 9, 15, 12, 6, 4, 6, 7, 4, 10],
                        barWidth: "35%",
                        itemStyle: {
                            normal: {
                                color: "#2f89cf",
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
    #echart5{
        width: 100%;
        height: 100%;
    }
</style>