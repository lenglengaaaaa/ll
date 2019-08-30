export const magicDefault = {
    "createTime": null,
    "data": {
        "temp": {
            "value": null,
            "createTime": null
        },
        "hum": {
            "value": null,
            "createTime": null
        },
        "o2": {
            "value": null,
            "createTime": null
        },
        "co": {
            "value": null,
            "createTime": null
        },
        "h2s": {
            "value": null,
            "createTime": null
        },
        "o3": {
            "value": null,
            "createTime": null
        },
        "ch4": {
            "value": null,
            "createTime": null
        },
        "bat": {
            "value": null,
            "createTime": null
        },
    },
}

export const lineDefault = ()=>{
    const result = ['一','二','三','四'].map(item=>{
        return {
            name:`线缆${item}`,
            createTime:null,
            data:{
                "lineTemp": {
                    "value": null,
                    "createTime": null
                },
                "lineA": {
                    "value": null,
                    "createTime": null
                },
                "lineV": {
                    "value": null,
                    "createTime": null
                },
                "batteryA": {
                    "value": null,
                    "createTime": null
                },
                "shake": {
                    "value": null,
                    "createTime": null
                },
                "node433": {
                    "value": null,
                    "createTime": null
                },
                "signal": {
                    "value": null,
                    "createTime": null
                },
                "CBTemp": {
                    "value": null,
                    "createTime": null
                }
            }
        }
    })
    return result;
}

export const s800Default = ()=>{
    const result = ['一','二','三'].map(item=>{
        return {
            name:`S800${item}`,
            createTime:null,
            data:{
                "co": {
                    "value": null,
                    "createTime": null
                },
                "infrared": {
                    "value": 1,
                    "createTime": null
                },
                "liquid": {
                    "value": 1,
                    "createTime": null
                },
                "batteryA": {
                    "value": null,
                    "createTime": null
                },
                "shake": {
                    "value": 1,
                    "createTime": null
                },
                "node433": {
                    "value": 2,
                    "createTime": null
                },
                "signal": {
                    "value": null,
                    "createTime": null
                },
                "CBTemp": {
                    "value": null,
                    "createTime": null
                }
            }
        }
    })
    return result;
}

export const sensorDefault = [
        {
            address: "",
            createTime: null,
            data:{
                CBTemp:{
                    createTime: null,
                    value: null
                },
                batteryA:{
                    createTime: null,
                    value: null
                },
                co:{
                    createTime: null,
                    value: null
                },
                lifrared:{
                    createTime: null,
                    value: null
                },
                liquid:{
                    createTime: null,
                    value: null
                },
                node433:{
                    createTime: null,
                    value: null
                },
                shake:{
                    createTime: null,
                    value: null
                },
                signal:{
                    createTime: null,
                    value: null
                },
            },
            name:'占位数据'
        }
    ]
