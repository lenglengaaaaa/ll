<template>
    <div 
        id="china_chart"
        ref="china_chart"
    />

</template>

<script>
    import 'echarts/map/js/china.js' // 引入中国地图数据
    // import 'echarts/map/js/province/beijing.js' // 引入北京地图数据
    // import 'echarts/map/js/province/fujian.js' // 引入福建地图数据
    // import 'echarts/map/js/province/anhui.js' // 引入安徽地图数据
    // import 'echarts/map/js/province/xinjiang.js' // 引入新疆地图数据
    // import 'echarts/map/js/province/xizang.js' // 引入西藏地图数据

    export default {
        name:"ChinaChart",
        data() {
            return {
                chart:null
            }
        },
        mounted() {
            this.chinaConfigure();
        },
        beforeDestroy() {
            if (!this.chart) return
            this.chart.dispose();
            this.chart = null;
        },
        methods: {
            chinaConfigure() {
                this.chart = this.$echarts.init(this.$refs.china_chart); //这里是为了获得容器所在位置    
                window.onresize = this.chart.resize;
                
                let option = ({ // 进行相关配置
                    // backgroundColor: '#404a59',          // 图表背景色
                    tooltip: {//悬浮时显示
                        trigger: 'item',
                        formatter: function(c) {
                            if (typeof (c.value)[2] == "undefined") {
                                return c.name + " : " + c.value
                            } else {
                                return c.name + " : " + c.value[2]
                            }
                        }
                        // formatter: function (params) {
                        //     var info = '<p style="font-size:18px">' + params.name + '</p>'
                        //     return info;
                        // },
                        // backgroundColor: "#ff7f50",//提示标签背景颜色
                        // textStyle: { color: "#fff" } //提示标签字体颜色
                    },
                    geo: { 
                        map: 'china', // 表示中国地图
                        roam: false, //是否开启鼠标缩放和平移漫游
                        label: {
                            emphasis: {
                                show: false //标签显示
                            }
                        },
                        itemStyle: {
                            normal: {
                                areaColor: "#4c60ff", //区域颜色
                                borderColor: "#002097"  //边框颜色
                            },
                            emphasis: {
                                areaColor: "#293fff"  //高亮颜色
                            }
                        }
                    },
                    series: [
                        {
                            name: "消费金额",
                            type: "scatter",
                            coordinateSystem: "geo",
                            symbolSize: function(c) {
                                return c[2] / 15
                            },
                            label: {
                                normal: {
                                    formatter: "{b}",
                                    position: "right",
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: "#ffeb7b"
                                }
                            },
                            //虚拟数据
                            data:[
                                //value 经度,纬度,数据
                                {name: '海门', value: [121.15, 31.89, 90]},
                                {name: '鄂尔多斯', value: [109.781327, 39.608266, 120]},
                                {name: '招远', value: [120.38, 37.35, 188]},
                            ], 
                        }
                    ],
                })

                this.chart.setOption(option);



                //=======================================================
                /**
                 * 点击省份显示省份详情
                 */

                // var cityArr=[
                //     ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林','黑龙江',  '江苏', '浙江', '安徽', '福建', '江西', '山东','河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门', '台湾'],
                //     ['shanghai', 'hebei','shanxi','neimenggu','liaoning','jilin','heilongjiang','jiangsu','zhejiang','anhui','fujian','jiangxi','shandong','henan','hubei','hunan','guangdong','guangxi','hainan','sichuan','guizhou','yunnan','xizang','shanxi1','gansu','qinghai','ningxia','xinjiang', 'beijing', 'tianjin', 'chongqing', 'xianggang', 'aomen', 'taiwan']
                // ];


                // const showCity = (zhName,pyName)=>{
                //     return new Promise(resolve=>{
                //         import(`echarts/map/js/province/${pyName}.js`);
                //         resolve();
                //     }).then(res=>{
                //         option.series[0].mapType = zhName;

                //         var cityOption = JSON.parse(JSON.stringify(option));

                //         if(zhName==='广东'){
                //             cityOption.series[0].data=[{
                //                 name:'梅州市',
                //                 value:[100,100]
                //             },{
                //                 name:'深圳市',
                //                 value:[100,200]
                //             }]
                //         }
                //         this.chart.setOption(cityOption);
                //     })
                // }

                // this.chart.on('click', param => {
                //     var cityName = param.name;
                //     // 查找是否有对应城市有则加载城市
                //     for(var i=0,len=cityArr[0].length;i<len;i++){
                //         if(cityName === cityArr[0][i]){
                //             // 获取得城市拼音
                //             showCity(cityArr[0][i], cityArr[1][i]);
                //             return;
                //         }
                //     }
                //     //没有找到对应城市的话，那么返回到全国地图 
                //     option.series[0].mapType='china';
                //     this.chart.setOption(option);
                // });
                
            },
            
        },
    }
</script>

<style lang="scss" scoped>
    // #china_chart{
    //     height:600px;
    //     width:100%;
    // }
</style>