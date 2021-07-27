<template>
    <div
        id="tree"
        ref="treeChart" 
    />
</template>

<script>
    import ChartMixin from './mixin/Chart_mixin';

    export default {
        props: {
            tree_data:{
                type:Object,
                default:()=>{}
            },
            // clickBar:Function
        },
        mixins:[ ChartMixin ],
        data() {
            return {}
        },
        mounted() {
            this.$nextTick(()=>{
                this.chart = this.$echarts.init(this.$refs.treeChart);
                this.initChart();
            })
        },
        watch: {
            tree_data(newValue) {
                this.initChart();
            }
        },
        methods: {
            initChart() {
                //把配置和数据放这里
                this.chart.setOption({
                    tooltip: {
                        show:false,
                        trigger: 'item',
                        triggerOn: 'click',
                        // formatter: function (params) {
                        //   console.log(params)
                        //   // return params.data.intro
                        // },
                    },
                    series: [
                        {
                            type: 'tree',

                            name: 'tree1',

                            data: [ this.tree_data ],

                            top: '10%',
                            left: '10%',

                            symbol:'emptyCircle',
                            symbolSize: 15,
                            itemStyle:{
                                color:'#22a7f0',
                                borderColor:'#22a7f0',
                            },

                            roam:true,
                            scaleLimit: { //滚轮缩放的极限控制
                                min: 0.7,
                                max: 2
                            },
                            initialTreeDepth:-1,//初始展开的层级(深度)

                            label: {
                                distance:14,
                                position: 'top',
                                verticalAlign: 'middle',
                                align: 'center',
                                fontWeight:"bold",
                                formatter:function(data) {
                                const { name } = data.data;
                                let str = "";
                                
                                if( name && name.length ){  
                                    str = name;
                                    if(name.length > 7 ){
                                    str = `${name.slice(0,7)}\n${name.slice(7)}`
                                    }
                                }
                                
                                return str;
                                },
                            },

                            leaves: {
                                label: {
                                    position: 'right',
                                    verticalAlign: 'middle',
                                    align: 'left'
                                }
                            },

                            emphasis: {
                                focus: 'descendant'
                            },

                            expandAndCollapse: false,
                            animationDuration: 550,
                            animationDurationUpdate: 750

                        },
                    ]
                })
                this.chart&&this.chart.resize();

                // 避免重复点击
                this.chart.off("click");
                this.chart.on("click",(param)=>{
                    const { data } = param;

                    /**
                        * equipmentType 
                        * 1.配电柜　2.电缆井 3.主线缆 4.定位桩 5.台区 6.配电房 7.回路
                        */
                    const { equipmentType, id, loopId, address } = data;

                    console.log(data,"data")

                    if(!equipmentType || equipmentType == 7) return;

                    const url = {
                        5:`CourtsDetail`, //变压器
                        6:`RoomDetail`, //配电房
                        1:`CabinetDetail`, //配电柜
                    }
                    sessionStorage.setItem('obj',JSON.stringify(data));
                    this.$router.push({ name: url[equipmentType] });
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    #tree{
        height: 700px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>