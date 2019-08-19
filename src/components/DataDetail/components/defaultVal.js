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
                "cbtemp": {
                    "value": null,
                    "createTime": null
                }
            }
        }
    })
    return result;
}

export const s800Default = ()=>{
    const result = ['一','二','三','四'].map(item=>{
        return {
            name:`S800${item}`,
            createTime:null,
            data:{
                "co": {
                    "value": null,
                    "createTime": null
                },
                "infrared": {
                    "value": null,
                    "createTime": null
                },
                "liquid": {
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
                "cbtemp": {
                    "value": null,
                    "createTime": null
                }
            }
        }
    })
    return result;
}
