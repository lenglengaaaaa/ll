<template>
    <div 
        id="echart3"
        ref="echart3"
    />
</template>

<script>
    export default {
        name:"Echart3",
        data() {
            return {
                chart:null
            }
        },
        mounted() {
            this.createChart();
        },
        beforeDestroy() {
            if (!this.chart) return
            this.chart.dispose();
            this.chart = null;
        },
        methods: {
            createChart() {
                this.chart = this.$echarts.init(this.$refs.echart3);
                let option = {
                    title: [{
                    text: "职业分布",
                    left: "center",
                    textStyle: {
                        color: "#fff",
                        fontSize: "16"
                    }
                }],
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)",
                    position: function(b) {
                        return [b[0] + 10, b[1] - 10]
                    }
                },
                legend: {
                    type: 'scroll',
                    top: "70%",
                    itemWidth: 10,
                    itemHeight: 10,
                    data: ["电子商务", "教育", "IT/互联网", "金融", "学生", "其他"],
                    textStyle: {
                        color: "rgba(255,255,255,.5)",
                        fontSize: "12",
                    }
                },
                series: [{
                    name: "年龄分布",
                    type: "pie",
                    center: ["50%", "42%"],
                    radius: ["40%", "60%"],
                    color: ["#065aab", "#066eab", "#0682ab", "#0696ab", "#06a0ab", "#06b4ab", "#06c8ab", "#06dcab", "#06f0ab"],
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    data: [{
                        value: 5,
                        name: "电子商务"
                    }, {
                        value: 1,
                        name: "教育"
                    }, {
                        value: 6,
                        name: "IT/互联网"
                    }, {
                        value: 2,
                        name: "金融"
                    }, {
                        value: 1,
                        name: "学生"
                    }, {
                        value: 1,
                        name: "其他"
                    }, ]
                }]
                };
                this.chart.setOption(option);
                window.addEventListener('resize',()=>{
                    this.chart&&this.chart.resize()
                },false);    
            }
        },
    }
</script>

<style lang="scss">
    #echart3{
        width: 100%;
        height: 100%;
    }
</style>