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
            this.getData();
            window.addEventListener('resize',()=>{
                this.chart&&this.chart.resize()
            },false);
        },
        beforeDestroy() {
            if (!this.chart) return
            this.chart.dispose();
            this.chart = null;
        },
        watch: {
            value(value) {
                this.getData();
            }
        },
        methods: {
            //获取当前数值
            getData(){
                const {name,value} = this.value;
                const magicParam = ['temp','hum','o2','h2s','co','ch4','o3','bat']
                let cfg ={value};
                let max =0;
                switch (name) {
                    case "temp":
                        cfg.name = "环境温度(℃)";
                        max = 150;
                        break;
                    case "hum":
                        cfg.name = "环境湿度(%)";
                        max = 100;
                        break;
                    case "o2":
                        cfg.name = "氧气(%)";
                        max = 100;
                        break;
                    case "h2s":
                        cfg.name = "硫化氢(ppm)";
                        max = 50;
                        break;
                    case "co":
                        cfg.name = "一氧化碳(ppm)";
                        max = 5000;
                        break;
                    case "ch4":
                        cfg.name = "烷类(ppm)";
                        max = 10000;
                        break;
                    case "o3":
                        cfg.name = "臭氧(ppm)";
                        max = 5000;
                        break;
                    case "bat":
                        cfg.name = "电池(V)";
                        max = 5;
                        break;
                    default:;
                }
                this.initChart(max,[cfg]);
            },
            initChart(max,data) {
            // 把配置和数据放这里
                this.chart.setOption({
                    tooltip : {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    toolbox: {
                    },
                    series: [
                        {
                            name: '环境数据',
                            type: 'gauge',
                            center: ['50%', '50%'],    // 默认全局居中
                            radius: '100%',
                            min:0,
                            max,
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
                            data
                        },
                    ]
                },true)
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