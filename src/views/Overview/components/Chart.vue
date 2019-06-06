<template>
    <div :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart" />
</template>

<script>
    export default {
        props: {
            className: {
                type: String,
                default: 'yourClassName'
            },
            id: {
                type: String,
                default: 'yourID'
            },
            width: {
                type: String,
                default: '500px'
            },
            height: {
                type: String,
                default: '500px'
            }
        },
        data() {
            return {
                chart: null
            }
        },
        mounted() {
            this.initChart();
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            this.chart.dispose();
            this.chart = null;
        },
        methods: {
            initChart() {
            this.chart = this.$echarts.init(this.$refs.myEchart);
            // 把配置和数据放这里
                this.chart.setOption({
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
                        // axisTick: {
                        //     alignWithLabel: true
                        // }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '直接访问',
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

</style>