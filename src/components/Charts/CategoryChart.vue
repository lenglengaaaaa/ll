<template>
    <div
        id="category"
        ref="categoryChart" 
    />
</template>

<script>
    import ChartMixin from './mixin/Chart_mixin';

    export default {
        props: {
            equipList: Array
        },
        mixins:[ ChartMixin ],
        data() {
            return {}
        },
        mounted() {
            this.$nextTick(()=>{
                this.chart = this.$echarts.init(this.$refs.categoryChart);
                this.initChart();
            })
        },
        methods: {
            initChart() {
                const names = this.equipList.map(item=>item.name);
                //把配置和数据放这里
                this.chart.setOption({
                    title:{
                        text:'设备数量',
                        x:'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c}台 ({d}%)"
                    },
                    legend: {
                        type: 'scroll',
                        x: 'center',
                        y:'bottom',
                        data:names
                    },
                    noDataLoadingOption:{
                        text:'暂无数据'
                    },
                    series: [
                        {   
                            name:'设备数量 :',
                            type:'pie',
                            // radius : [20, 110],
                            radius:"65%",
                            center : ['50%', '45%'],
                            roseType : 'area',
                            lableLine: {
                                normal: { show: false },
                                emphasis: { show: true },
                                smooth: 0.2,
                                length: 5,
                                length2: 20
                            },
                            data:this.equipList,
                            // animationEasing: 'cubicInOut',
                            // animationDuration: 2600,
                            animationType: 'scale',
                            animationEasing: 'elasticOut',
                            animationDelay: function (idx) {
                                return Math.random() * 200;
                            }
                        }
                    ],
                })
                this.chart&&this.chart.resize();
            },
        }
    }
</script>

<style lang="scss" scoped>
    #category{
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>