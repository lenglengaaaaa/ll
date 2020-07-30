<template>
    <div
        id="category"
        ref="categoryChart" 
    />
</template>

<script>
    export default {
        props: {
            equipList: Array
        },
        data() {
            return {
                chart: null,
            }
        },
        mounted() {
            this.$nextTick(()=>{
                this.chart = this.$echarts.init(this.$refs.categoryChart);
                this.initChart();
            })
            
            window.addEventListener('resize',this.$_handleResizeChart);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize',this.$_handleResizeChart)
                if (!this.chart) return
                this.chart.dispose();
                this.chart = null;
            })
        },
        watch: {
            '$store.state.app.sidebar.opened'(flag) {
                this.chart&&this.chart.resize();
            }
        },
        methods: {
            $_handleResizeChart(){
                this.chart && this.chart.resize()
            },
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
                            radius : [20, 110],
                            center : ['50%', '45%'],
                            roseType : 'area',
                            lableLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:this.equipList,
                            animationEasing: 'cubicInOut',
                            animationDuration: 2600,
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