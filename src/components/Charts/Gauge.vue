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
        destroyed(){
            window.removeEventListener('resize',()=>{
                this.chart && this.chart.resize()
            },false);
        },
        watch: {
            value(value) {
                this.getData();
            },
            '$store.state.app.sidebar.opened'(flag) {
                this.chart&&this.chart.resize();
            },
            '$store.state.app.tab_index'(label) {
                const should_resize = ['数据视图'];
                if(should_resize.includes(label)){
                    this.chart && this.chart.resize();
                }
            }
        },
        methods: {
            //获取当前数值
            getData(){
                const {name,value,createTime} = this.value;
                const time = createTime&&this.$moment(createTime).format('YYYY-MM-DD HH:mm:ss') || "未知";
                let obj = {
                    max:0,
                    title:'',//名称,
                    time
                }
                let cfg ={value};
                switch (name) {
                    case "temp":
                        obj.name = "环境温度";
                        cfg.name = "℃";
                        obj.max = 150;
                        break;
                    case "hum":
                        obj.name = "环境湿度";
                        cfg.name = "%";
                        obj.max = 100;
                        break;
                    case "o2":
                        obj.name = "氧气";
                        cfg.name = "%";
                        obj.max = 100;
                        break;
                    case "h2s":
                        obj.name = "硫化氢";
                        cfg.name = "ppm";
                        obj.max = 50;
                        break;
                    case "co":
                        obj.name = "一氧化碳";
                        cfg.name = "ppm";
                        obj.max = 5000;
                        break;
                    case "ch4":
                        obj.name = "烷类";
                        cfg.name = "ppm";
                        obj.max = 10000;
                        break;
                    case "o3":
                        obj.name = "臭氧";
                        cfg.name = "ppm";
                        obj.max = 5000;
                        break;
                    case "bat":
                        obj.name = "电池电压";
                        cfg.name = "V";
                        obj.max = 5;
                        break;
                    default:;
                }
                this.initChart(obj,cfg);
            },
            initChart(value,cfg) {
            // 把配置和数据放这里
                this.chart.setOption({
                    tooltip : {
                        position: ['50%', '50%'],
                        formatter:`
                            {a} <br/>
                            ${value.name} : {c} ${cfg.name} <br/>
                            上传时间 : ${value.time}
                        `
                    },
                    title: {
                        text: value.name,
                        textAlign:'center',
                        left:'50%',
                        bottom:'-5',
                        textStyle:{
                            fontSize:20
                        }
                    },
                    series: [
                        {
                            name: '环境数据',
                            type: 'gauge',
                            center: ['50%', '50%'],    // 默认全局居中
                            radius: '100%',
                            min:value.min || 0,
                            max:value.max,
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
                            axisLabel:{
                                fontWeight:'bolder',
                            },
                            splitLine: {           // 分隔线
                                length:15,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            pointer: {
                                width:6
                            },
                            title: {
                                offsetCenter: [0, '-30%'],       // x, y，单位px
                                fontWeight:'bolder',
                                fontSize: 24,
                            },
                            detail: {
                                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize:30
                            },
                            data:[cfg]
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
        padding-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
    }
</style>