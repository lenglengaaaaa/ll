<template>
    <div 
        :id="vid" 
        class="map"
    />
</template>

<script>
    import AMap from "@/utils/AMap"

    const center = window.$cfg.mapCenter;

    export default {
        name:'cc-map',
        props: {
            vid:String,
            zoom:{
                type:Number,
                default:3
            },
            marker:{
                type:Array,
                default:()=>[]
            },
        },
        data() {
            return {
                map: null,
                resMap: null,
                center,
                markers:[],
                infoWindow:null
            };
        },
        mounted() {
            this.initAMap();
        },
        watch: {
            marker(newValue, oldValue) {
                this.initAMap();
            },
        },
        methods: {
            //初始化地图
            async initAMap() {
                try {
                    this.resMap = await AMap();
                    await this.marker;
                    this.infoWindow = new this.resMap.InfoWindow({
                        closeWhenClickMap:true,
                        offset: new this.resMap.Pixel(-4, -30)}
                    );
                    this.map = new this.resMap.Map(this.vid, {
                        resizeEnable: true, //是否监控地图容器尺寸变化
                        zooms: [3, 19], //设置地图级别范围
                        zoom: this.zoom, //初始化地图层级
                        zoomEnable: true, // 是否缩放
                        scrollWheel: true, // 是否支持滚轮缩放
                        dragEnable: true, // 是否支持鼠标拖拽平移
                        jogEnable: true, // 是否支持缓动效果
                        buildingAnimation: true, // 模块消失是否有动画效果
                        center: this.center //初始化地图中心点
                    });
                    this.map.on("zoomchange",()=>{
                        this.map.clearInfoWindow( );
                    })
                    this.map.on("complete",()=>{
                        this.addMarker();
                        let cluster = new this.resMap.MarkerClusterer(this.map, this.markers, {
                            gridSize: 40,
                            // zoomOnClick:false,
                            renderClusterMarker: this._renderClusterMarker
                        });
                        cluster.on('click',this.clusterClick)

                        var tool = new this.resMap.ToolBar();
                        this.map.addControl(tool);    
                    });
                } catch (err) {}
            },
            //新增点坐标回调
            addMarker() {
                if(!this.marker.length)return;
                this.marker
                    .filter(item=> item.longitude && item.latitude)
                    .map(item=>{
                    let point = new this.resMap.Marker({
                        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        position:  [ item.longitude, item.latitude ],
                        offset: new this.resMap.Pixel(-13, -30),
                    });
                    this.markers.push(point);
                    point.content = item.name;
                    point.on('click', this.markerClick);
                    this.map.add(point);
                })
                this.map.setFitView();
            },
            //点坐标点击事件
            markerClick(e) {
                this.infoWindow.setContent(`
                    <div class="info">
                        <strong>
                            设备名称 :
                        </strong>
                        <span>${e.target.content}</span>
                    </div>
                `);
                this.infoWindow.open(this.map, e.target.getPosition());
            },
            //点聚合点击事件
            clusterClick(e){
                const {markers} = e;
                let html ='';
                markers.forEach(item=>{
                    html += `
                        <div class="info">
                            <strong>
                                设备名称 :
                            </strong>
                            <span>${item.content}</span>
                        </div>
                    `
                })
                this.infoWindow.setContent(html);
                this.infoWindow.open(this.map, e.lnglat);
            },
            //点聚合样式
            _renderClusterMarker(context){
                const count = this.markers.length;
                var factor = Math.pow(context.count / count, 1 / 18);
                var div = document.createElement('div');
                var Hue = 180 - factor * 180;
                var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
                var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
                var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
                var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
                div.style.backgroundColor = bgColor;
                var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
                div.style.width = div.style.height = size + 'px';
                div.style.border = 'solid 1px ' + borderColor;
                div.style.borderRadius = size / 2 + 'px';
                div.style.boxShadow = '0 0 1px ' + shadowColor;
                div.innerHTML = context.count;
                div.style.lineHeight = size + 'px';
                div.style.color = fontColor;
                div.style.fontSize = '14px';
                div.style.textAlign = 'center';
                context.marker.setOffset(new this.resMap.Pixel(-size / 2, -size / 2));
                context.marker.setContent(div)
            }
        }
    }
</script>

<style lang="scss">
    .map{
        height: 500px;
    }
    
    .amap-info-content{
        max-height: 150px;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 1px 1px rgba(189, 195, 199, 0.8);
        .info{
            font-size: 14px;
            padding-bottom: 2px;
        }
        .amap-info-close{
            display: none;
        }
    }
</style>