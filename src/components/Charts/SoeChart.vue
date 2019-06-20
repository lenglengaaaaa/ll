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
                chart: null,
                timer: null,
            }
        },
        mounted() {
            this.chart = this.$echarts.init(this.$refs.soeChart);
            setTimeout(()=>{this.initChart()})
            window.addEventListener('resize',()=>{
                clearTimeout(this.timer)
                this.timer = setTimeout(()=>{
                    this.chart&&this.chart.resize()
                },200)
            },false);
        },
        beforeDestroy() {
            if (!this.chart) return
            this.chart.dispose();
            this.chart = null;
        },
        watch: {
            '$store.state.app.sidebar.opened'(flag) {
                this.chart&&this.chart.resize();
            },
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
                this.chart&&this.chart.resize();
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