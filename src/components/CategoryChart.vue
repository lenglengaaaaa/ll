<template>
    <div
        id="category"
        ref="categoryChart" 
    />
</template>

<script>
    export default {
        data() {
            return {
                chart: null,
                timer: null
            }
        },
        mounted() {
            this.chart = this.$echarts.init(this.$refs.categoryChart);
            this.initChart();
        },
        watch: {
            '$store.state.screenWidth'(value) {
                clearTimeout(this.timer)
                this.timer = setTimeout(()=>{
                    this.chart&&this.chart.resize()
                },200)
            }
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
                        text:'设备种类数量',
                        x:'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        x: 'center',
                        y:'bottom',
                        data:['魔戒','魔节','红外','烟感','液位','中继器']
                    },
                    series: [
                        {
                            name:'设备数量 :',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:335, name:'魔戒'},
                                {value:310, name:'魔节'},
                                {value:234, name:'红外'},
                                {value:135, name:'烟感'},
                                {value:1548, name:'液位'},
                                {value:222, name:'中继器'}
                            ]
                        }
                    ]
                })
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