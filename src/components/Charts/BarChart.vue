<template>
    <div
        id="bar"
        ref="barChart" 
    />
</template>

<script>
    import ChartMixin from './mixin/Chart_mixin';

    export default {
        props: {
            bar_data:{
                type:Object,
                default:()=>{
                    return {
                        name:[],
                        normalData:[],
                        alarmData:[]
                    }
                }
            },
            clickBar:Function
        },
        mixins:[ ChartMixin ],
        data() {
            return {}
        },
        mounted() {
            this.$nextTick(()=>{
                this.chart = this.$echarts.init(this.$refs.barChart);
                this.initChart();
            })
        },
        watch: {
            bar_data(newValue) {
                this.initChart();
            }
        },
        methods: {
            initChart() {
                //把配置和数据放这里
                this.chart.setOption({
                    color:  ['#9dde7f','#facb59', '#f86c6c'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // Use axis to trigger tooltip
                            type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                    },
                    legend: {
                        data: ["正常","预警","告警"]
                    },
                    grid: {
                        left: 0,
                        right: 10,
                        top: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        minInterval: 1
                    },
                    yAxis: {
                        type: 'category',
                        data: this.bar_data.name
                    },
                    series:[
                        {
                            name: '正常',
                            type: 'bar',
                            stack: 'total',
                            label: { show: true },
                            emphasis: { focus: 'series' },
                            barWidth : 20,
                            data: this.bar_data.normalData
                        },
                        {
                            name: '预警',
                            type: 'bar',
                            stack: 'total',
                            label: { show: true },
                            emphasis: { focus: 'series' },
                            barWidth : 20,
                            data: this.bar_data.earlyWarningData
                        },
                        {
                            name: '告警',
                            type: 'bar',
                            stack: 'total',
                            label: { show: true },
                            emphasis: { focus: 'series' },
                            barWidth : 20,
                            data: this.bar_data.alarmData
                        }
                    ]
                })
                this.chart&&this.chart.resize();

                this.chart.getZr().off("click");

                this.chart.getZr().on('click', (params) => {
                    let point=[ params.offsetX, params.offsetY ];

                    if(this.chart.containPixel('grid',point)){
                        let xIndex=this.chart.convertFromPixel({seriesIndex:0},point)[1];
                        let op=this.chart.getOption();
                        let name=op.yAxis[0].data[xIndex];// y轴名称
                        this.clickBar(name);
                    }
                    // if( params.componentType == "markPoint" ){
                    //     const { temp } = params.data;
                    //     //跳转单个应用管理页面
                    //     sessionStorage.setItem('project',JSON.stringify(temp));
                    //     this.$router.push({ name:"ProjectOverview" });
                    // }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    #bar{
        height: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>