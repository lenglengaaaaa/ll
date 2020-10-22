<template>
    <div
        id="soe"
        ref="soeChart" 
    />
</template>

<script>
    import ChartMixin from './mixin/Chart_mixin';

    export default {
        props: {
            soeCount: {
                type: Array,
                default: ()=>[]
            },
        },
        mixins:[ ChartMixin ],
        data() {
            return {}
        },
        mounted() {
            this.$nextTick(()=>{
                this.chart = this.$echarts.init(this.$refs.soeChart);
                this.initChart();
            })
        },
        methods: {
            initChart() {
            // 把配置和数据放这里
                this.chart.setOption({
                    title:{
                        text:'当前年份SOE总数',
                        x:'center'
                    },
                    color: ['#3398DB'],
                    tooltip: {},
                    grid: {
                        left: '2%',
                        right: '10%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月' , '9月', '10月', '11月' ,'12月'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [
                        {
                            name: '当月soe总数 :',
                            type: 'bar',
                            barWidth: '50%',
                            data:this.soeCount,
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    // {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                // data : [
                                //     {type : 'average', name: '平均值'}
                                // ]
                            }
                        }
                    ]
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    #soe{
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>