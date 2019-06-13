<template>
    <div class="amap-page-container">
        <div class="amap_container">
            <el-amap-search-box class="search-box" :on-search-result="onSearchResult">
            </el-amap-search-box>
            <el-amap 
                :vid="vid" 
                class="amap-demo" 
                :center="center"
                :zoom="18"
                :events="events"
            >
                <el-amap-marker vid="marker" :position="marker.position"/>
            </el-amap>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            vid: {
                type: String,
                default: 'amap'
            },
            position:{
                type:Array,
                default:()=>[113.991244,22.595988]
            },
            get:Function
        },
        data(){
            const _this = this;
            return {
                center:[],
                marker:{},
                events: {
                    init(o){},
                    click(e){
                        const lng = e.lnglat.lng;
                        const lat = e.lnglat.lat;
                        _this.marker.position = [lng,lat]
                        _this.get(lng,lat)
                    }
                },
            }
        },
        created () {
            this.center = this.position;
            this.marker={ position: this.position}
        },
        methods: {
            //搜索组件
            onSearchResult(pois) {
                let latSum = 0;
                let lngSum = 0;
                if (pois.length > 0) {
                    pois.forEach(poi => {
                        let {lng, lat} = poi;
                        lngSum += lng;
                        latSum += lat;
                    });
                    let center = {
                        lng: lngSum / pois.length,
                        lat: latSum / pois.length
                    };
                    this.center = [center.lng, center.lat];
                }
            }
        },
    }
</script>

<style lang="scss">
    .amap_container{
        position: relative;
        .search-box {
            position: absolute;
            top: 25px;
            left: 20px;
        }
        .el-vue-search-box-container{
            width: 220px;
        }
        .amap-demo {
            height: 500px;
        }
    }
</style>