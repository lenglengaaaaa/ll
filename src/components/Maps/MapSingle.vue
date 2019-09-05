<template>
    <div class="single_container">
        <div 
            :id="vid" 
            class="map"
        />
        <div class="info" v-show="hasSearch">
            <el-input 
                id="searchInput" 
                placeholder="请输入关键字" 
                v-model="location" 
            />
        </div>
    </div>
</template>

<script>
    import AMap from "@/utils/AMap"
    const center = window.$cfg.mapCenter;

    export default {
        props: {
            vid:String,
            position:{
                type:Array,
                default:()=>[113.991244,22.595988]
            },
            get:{
                type:Function,
                default:()=>{}
            },
            hasSearch:{
                type:Boolean,
                default:true
            },
            hasClick:{
                type:Boolean,
                default:true
            }
        },
        data() {
            return {
                resMap: null,
                map: null,
                center,
                location:'',
                placeSearch:null,
                marker:null
            };
        },
        mounted() {
            this.initAMap();
        },
        methods: {
            async initAMap() {
                try {
                    this.resMap = await AMap();
                    await this.marker;
                    this.map = new this.resMap.Map(this.vid, {
                        resizeEnable: true, //是否监控地图容器尺寸变化
                        zooms: [3, 19], //设置地图级别范围
                        zoom: 19, //初始化地图层级
                        zoomEnable: true, // 是否缩放
                        scrollWheel: true, // 是否支持滚轮缩放
                        dragEnable: true, // 是否支持鼠标拖拽平移
                        jogEnable: true, // 是否支持缓动效果
                        buildingAnimation: true, // 模块消失是否有动画效果
                        center: this.center //初始化地图中心点
                    });
                    //加载搜索服务
                    if(this.hasSearch){
                        const auto = new this.resMap.Autocomplete({ 
                            input: "searchInput",
                        });
                        new this.resMap.PlaceSearch({ map:this.map});
                        const select = (e)=>{ this.map.setCenter(e.poi.location) };
                        this.resMap.event.addListener(auto, "select", select);
                    }
                    this.map.on('complete',(e)=>{
                        const [lng,lat] = this.position;
                        this.addMarker(lng,lat);
                    })
                    this.hasClick&&this.map.on('click',(e)=>{
                        const [lng,lat] = e.lnglat.toString().split(',');
                        this.get(lng,lat);
                        this.addMarker(lng,lat);
                    });
                } catch (err) {}
            },
            addMarker(lng,lat) {
                if(this.marker){
                    this.marker.setMap(null);
                    this.marker = null;
                }
                this.marker = new this.resMap.Marker({
                    icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    position:  [lng,lat],
                    offset: new this.resMap.Pixel(-13, -30),
                });
                this.map.add(this.marker);
                this.map.setFitView();
            },
        }
    }
</script>

<style lang="scss">
    .single_container{
        position: relative;
        .map{
            height: 480px;
        }
        .info{
            position: absolute;
            top: 10px;
            left: 10px;
            padding: .5rem .75rem;
            margin-bottom: 1rem;
            border-radius: .25rem;
            background-color: white;
            width: auto;
            min-width: 2rem;
            box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
            .input-item{
                position: relative;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                width: 100%;
                height: 3rem;
            }
        }
    }
    .amap-sug-result{
        display: none;
    }
</style>