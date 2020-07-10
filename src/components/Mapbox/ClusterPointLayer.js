class ClusterPointLayer {

    constructor(map, data, layername) {
        this.map = map;
        this.data = data;
        this.layername = layername;
    }
    
    getSource = ()=>{
        return {
            type: "geojson",
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data:{
                "type": "FeatureCollection",
                "features": [...this.data]
            },
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        }
    }

    getLayer = ()=>{
        return {
            id: "clusters",
            type: "circle",
            source: "earthquakes",
            filter: ["has", "point_count"],
            paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                "circle-color": [
                    "step",
                    ["get", "point_count"],
                    "#51bbd6",
                    100,
                    "#f1f075",
                    750,
                    "#f28cb1"
                ],
                "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        }
    }

    getLabelStyle = ()=>{
        return {
            id: "cluster-count",
            type: "symbol",
            source: "earthquakes",
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12
            }
        }
    }

    getCircleStyle = ()=>{
        return {
            id: "unclustered-point",
            type: "circle",
            source: "earthquakes",
            filter: ["!", ["has", "point_count"]],
            paint: {
                "circle-color": "#11b4da",
                "circle-radius": 4,
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff"
            }
        }
    }

    addLayer=()=>{
        this.map.addSource("earthquakes",this.getSource());

        this.map.addLayer(this.getLayer());

        this.map.addLayer(this.getLabelStyle());

        this.map.addLayer(this.getCircleStyle());
    }

}

export default ClusterPointLayer;