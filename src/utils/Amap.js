export default function MapLoader() {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap);
        } else {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src =
                'https://webapi.amap.com/maps?v=1.4.15&key=788e08def03f95c670944fe2c78fa76f&plugin=AMap.MarkerClusterer,AMap.Autocomplete,AMap.PlaceSearch&callback=initAMap';
            script.onerror = reject;
            document.head.appendChild(script);
        }
        window.initAMap = () => {
            resolve(window.AMap);
        };
    });
}