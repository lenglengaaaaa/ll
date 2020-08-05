<template>
    <div 
        :id="vid" 
        class="map_all"
    />
</template>

<script>
    import AMap from "@/utils/AMap";
    import equipIcon from "@images/equip_icon.png";
    import CablePile from "@images/Cable/skewing.png";
    import Incline from "@images/Cable/lean.png";
    import { xyTransformation } from '@/utils/methods'

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
            // 地图点标记是否实时更新状态
            hasUpdate:{
                type:Boolean,
                default:false
            }
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
            "$store.state.overall.pileAlarm"(obj){
                if( !this.hasUpdate ) return;

                const { address, alertMsg, lat, lng } = obj;

                if( alertMsg.slice(0,4) !== "倾斜角度" ) return;

                // Marker
                const pile = this.markers.filter(item => item.content.deviceAdress === address)[0];

                // 倾斜度数
                const angle = alertMsg.slice(alertMsg.indexOf("：")+1);
                const result = angle.slice(0,angle.indexOf(" °"));

                pile && pile.setIcon(+result > 29.9 ? Incline: CablePile);
                pile && pile.setAngle(+result);

                if(lat != "0.0" && lng != "0.0"){
                    xyTransformation([ lng, lat ]).then(res=>{
                        const [ longitude, latitude ] = res;
                        pile && pile.setPosition([ longitude, latitude ]);
                    })
                } 
            }
        },
        methods: {
            //初始化地图
            async initAMap() {
                try {
                    this.resMap = await AMap();
                    await this.marker;
                    this.infoWindow = new this.resMap.InfoWindow({
                        closeWhenClickMap:true,
                        offset: new this.resMap.Pixel(2, -30)}
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
                        const { deviceType, deviceAdress } = item;
                        const equipType = item.deviceType || item.deviceAdress? item.deviceAdress.slice(0,2): null;
                        // equipType为40,为电缆装设备.
                        let point = new this.resMap.Marker({
                            icon: equipType == "40"? ( item.remark2 && +item.remark2 > 29.9? Incline: CablePile): equipIcon,
                            position:  [ item.longitude, item.latitude ],
                            offset: new this.resMap.Pixel(-13, -30),
                            angle: equipType == "40" ? (item.remark2 || 0) :0 //点标记的旋转角度,电缆桩倾斜角度.
                        });
                        this.markers.push(point);
                        point.content = {
                            name:item.name,
                            deviceAdress:item.deviceAdress || null
                        };
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
                        <span>${ e.target.content.name }</span>
                    </div>
                `);
                this.infoWindow.open(this.map, e.target.getPosition());
            },
            //点聚合点击事件
            clusterClick(e){
                const { markers } = e;
                let html ='';
                markers.forEach(item=>{
                    html += `
                        <div class="info">
                            <strong>
                                设备名称 :
                            </strong>
                            <span>${ item.content.name }</span>
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
    .map_all{
        height: 500px;
        .amap-icon,.amap-marker-content{
            img{
                width: 35px;
                height: 35px;
                // transform: rotate(45deg);
            }
        }
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