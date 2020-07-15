<template>
    <div id="map"></div>
</template>

<script>
    import mapboxgl from 'mapbox-gl'
    // import 'mapbox-gl/dist/mapbox-gl.css'
    import MapboxLanguage  from '@mapbox/mapbox-gl-language'
    import ClusterPointLayer from './ClusterPointLayer'

    export default {
        props: {
            markers: {
                type: Array,
                default: ()=>[]
            },
        },
        data() {
            return {}
        },
        mounted () {
            this.init();
        },
        methods: {
            init() {
                mapboxgl.accessToken = 'pk.eyJ1IjoiamluMDA2cyIsImEiOiJjanFnMWR6Z3Q1YXM3NDNtczh4YXluYzNrIn0.EPlgNl1mrjErUxtTxcDi5w';
                var map = new mapboxgl.Map({
                    container: 'map', // container id
                    style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
                    center: [113.991244,22.595988], // starting position [lng, lat]
                    zoom: 6 // starting zoom
                });

                // 设置语言
                var language = new MapboxLanguage({ defaultLanguage: "zh" });
                map.addControl(language);

                // 地图导航
                var nav = new mapboxgl.NavigationControl();
                map.addControl(nav, "top-left");

                // disable map rotation using right click + drag
                map.dragRotate.disable();
                
                // disable map rotation using touch rotation gesture
                map.touchZoomRotate.disableRotation();

                map.on('load', ()=>{

                    const pointlayer = new ClusterPointLayer(map, this.markers, 'earthquakes');
                    pointlayer.addLayer();

                    // inspect a cluster on click
                    map.on('click', 'clusters', function (e) {
                        var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                        var clusterId = features[0].properties.cluster_id;
                        map.getSource('earthquakes').getClusterExpansionZoom(clusterId, function (err, zoom) {
                            if (err) return;
                            
                            map.easeTo({
                                center: features[0].geometry.coordinates,
                                zoom: zoom
                            });
                        });
                    });
                    
                    map.on('mouseenter', 'clusters', function () {
                        map.getCanvas().style.cursor = 'pointer';
                    });
                    map.on('mouseleave', 'clusters', function () {
                        map.getCanvas().style.cursor = '';
                    });

                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    #map { 
        width: 100%;
        height: 100%;
    }
</style>