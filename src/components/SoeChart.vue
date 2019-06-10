<template>
    <div
        id="soe"
        ref="soeChart" 
    />
</template>

<script>
    export default {
        data() {
            return {
                chart: null
            }
        },
        mounted() {
            this.chart = this.$echarts.init(this.$refs.soeChart);
            this.initChart();
            window.addEventListener("resize", () => { 
                this.chart&&this.chart.resize()
            });
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
                    title:{
                        text:'当年soe总数',
                        x:'center'
                    },
                    color: ['#3398DB'],
                    tooltip: {},
                    grid: {
                        left: '3%',
                        right: '4%',
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
                    series: [{
                        name: '当月soe总数 :',
                        type: 'bar',
                        barWidth: '60%',
                        data: [10, 52, 200, 334, 390, 330, 220]
                    }]
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