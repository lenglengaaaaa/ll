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
            this.chart = this.$echarts.init(this.$refs.categoryChart);
            setTimeout(()=>{this.initChart()})
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
            '$store.state.app.sidebar.opened'(flag) {
                this.chart&&this.chart.resize();
            }
        },
        methods: {
            initChart() {
                const names = this.equipList.map(item=>item.name);
                //把配置和数据放这里
                this.chart.setOption({
                    title:{
                        text:'设备种类数量',
                        x:'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c}台 ({d}%)"
                    },
                    legend: {
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
                            radius : [30, 110],
                            center : ['50%', '45%'],
                            roseType : 'radius',
                            data:this.equipList,
                            animationEasing: 'cubicInOut',
                            animationDuration: 2600
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