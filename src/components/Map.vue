<template>
    <div class="amap-page-container">
        <div class="amap_container">
            <el-amap 
                :vid="vid" 
                class="amap-demo" 
                :center="center"
                :zoom="3"
                :events="events"
            >
                <el-amap-marker 
                    v-for="(marker,index) in markers" 
                    :key="index"
                    :position="marker.position"
                    :events="marker.events"
                />
                <el-amap-info-window 
                    v-if="window" 
                    :position="window.position" 
                    :visible="window.visible" 
                    :content="window.content"
                />
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
            marker:{
                type:Array,
                default:()=>[]
            }
        },
        data(){
            let self = this;
            return {
                center:[113.991244,22.595988],
                markers: [],
                markerRefs: [],
                windows: [],
                window: '',
                events: {
                    init(o) {
                        setTimeout(() => {
                            let cluster = new window.AMap.MarkerClusterer(o, self.markerRefs,{
                                gridSize: 80,
                                renderCluserMarker: self._renderCluserMarker
                            });
                        }, 1000);
                    },
                },
            }
        },
        created(){
            let self = this;
            let markers = [];
            let windows = [];
            this.marker.map((item,index)=>{
                markers.push({
                    position: item.position,
                    // content: '<div style="text-align:center; background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                    events: {
                        init(o) {
                            self.markerRefs.push(o);
                        },
                        click() {
                            self.windows.forEach(window => {
                                window.visible = false;
                            });
                            self.window = self.windows[index];
                            self.$nextTick(() => {
                                self.window.visible = true;
                            });
                        }
                    }
                });
                windows.push({
                    position: item.position,
                    content: `<div class="prompt">${ index }</div>`,
                    visible: false
                });
            })
            this.markers = markers;
            this.windows = windows;
        },
        methods: {
            _renderCluserMarker(context) {
                const count = this.markers.length;
                let factor = Math.pow(context.count/count, 1/18)
                let div = document.createElement('div');
                let Hue = 180 - factor* 180;
                let bgColor = 'hsla('+Hue+',100%,50%,0.7)';
                let fontColor = 'hsla('+Hue+',100%,20%,1)';
                let borderColor = 'hsla('+Hue+',100%,40%,1)';
                let shadowColor = 'hsla('+Hue+',100%,50%,1)';
                div.style.backgroundColor = bgColor
                let size = Math.round(30 + Math.pow(context.count/count,1/5) * 20);
                div.style.width = div.style.height = size+'px';
                div.style.border = 'solid 1px '+ borderColor;
                div.style.borderRadius = size/2 + 'px';
                div.style.boxShadow = '0 0 1px '+ shadowColor;
                div.innerHTML = context.count;
                div.style.lineHeight = size+'px';
                div.style.color = fontColor;
                div.style.fontSize = '14px';
                div.style.textAlign = 'center';
                context.marker.setOffset(new AMap.Pixel(-size/2,-size/2));
                context.marker.setContent(div)
            }
        },
    }
</script>

<style lang="scss">
    .amap_container{
        .amap-demo {
            height: 500px;
        }
    }
</style>