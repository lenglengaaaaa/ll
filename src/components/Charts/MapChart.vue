<template>
    <div
        id="map"
        ref="mapChart" 
    />
</template>

<script>
    import ChartMixin from './mixin/Chart_mixin';

    export default {
        props: {
            value:{
                type:Array,
                default:()=>[]
            }
        },
        mixins:[ ChartMixin ],
        data() {
            return {}
        },
        watch: {
            value(newValue) {
                this.initChart();
            }
        },
        mounted() {
            this.$nextTick(()=>{
                this.chart = this.$echarts.init(this.$refs.mapChart);
                this.initChart();
            })
        },
        methods: {
            initChart() {
                const result = this.value.reduce((pre,cur)=>{
                    if( cur.longitude && cur.latitude ){
                        pre.push({
                            name: cur.name,
                            value:cur.name,
                            temp: cur,
                            coord: [ cur.longitude, cur.latitude ],
                            symbol: 'image://https://www.eplusview.com:8082/image/mapIcon/location.png',  // 标注图片地址路径
                            symbolSize: 40,
                            symbolOffset:[0, '-50%'],
                            service:'自定义',
                        })
                        return pre;
                    }
                    return pre;
                },[])


                //把配置和数据放这里
                this.chart.setOption({
                    backgroundColor: '#404a59',
                    // title: {
                    //     text: '项目分布图',
                    //     left: 'center',
                    //     top:'5%',
                    //     textStyle: {
                    //         color: '#fff',
                    //         fontSize:25
                    //     }
                    // },
                    tooltip: {           //提示框组件
                        trigger: 'item',
                        formatter:'{b} <br/> ',  //{c@[2]}
                        show:false
                    },
                    legend: {            //图例
                        orient: 'vertical',
                        y: 'bottom',
                        x: 'right',
                        data: ['危害性'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    geo: {
                        map: "china",
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: false,
                        zoom:1,
                        itemStyle: {
                            normal: {
                                areaColor: "#323c48",
                                borderColor: "#000000"
                            },
                            emphasis: {
                                areaColor: "#2a333d"
                            }
                        },
                    },
                    series: [
                        // {
                        //     name: '危险指数：',
                        //     type: 'scatter',
                        //     coordinateSystem: 'geo',
                        //     data: this.value,    //选取从 start 到数组结尾的所有元素，该方法并不会修改数组，而是返回一个子数组
                        //     symbolSize: function (val) {
                        //         return val[2] / 2;        //res数组中的第三个元素
                        //     },
                        //     showEffectOn: 'render',
                        //     rippleEffect: {
                        //         brushType: 'stroke'
                        //     },
                        //     hoverAnimation: true,
                        //     label: {
                        //         normal: {
                        //             formatter: '{b}:{@2}',
                        //             position: 'right',
                        //             show: false
                        //         },
                        //         emphasis: {
                        //             show: true
                        //         }
                        //     },
                        //     itemStyle: {
                        //         normal: {
                        //             color: '#f4e925',
                        //             shadowBlur: 10,
                        //             shadowColor: '#333'
                        //         }
                        //     },
                        //     zlevel: 1
                        // }
                        {
                            name: '节点分布',
                            type: 'map',
                            geoIndex: 0,
                            markPoint: { //图表标注。
                                label: {
                                    show:true,
                                    position:'bottom',
                                    color:'#fff'
                                },
                                data: result
                            }
                        }
                    ]
                })
                this.chart&&this.chart.resize();

                this.chart .on('click', (params) => {
                    if( params.componentType == "markPoint" ){
                        const { temp } = params.data;
                        //跳转单个应用管理页面
                        sessionStorage.setItem('project',JSON.stringify(temp));
                        this.$router.push({ name:"ProjectOverview" });
                    }
                })
                
            },
            convertData(data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)   //新值= 坐标+旧值；
                        });
                    }
                }
                return res; 
            },
        },
    }
</script>

<style lang="scss" scoped>
    #map{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>