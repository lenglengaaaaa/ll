<template>
    <div 
        :is="currentForm" 
    />
</template>

<script>
    import { Magic, Sensor, CableTemp, Ring, Concentrator } from '@/components/Threshold'

    export default {
        components: {
            Ring,
            CableTemp,
            Magic,
            Sensor
        },
        data() {
            return {
                currentForm: null
            }
        },
        computed: {
            device() {
                return JSON.parse(sessionStorage.getItem('equipObj')).data
            }
        },
        created () {
            const {deviceType} = this.device;
            this.currentForm = this.classifyType(deviceType);;
        },
        methods: {
            //设备分类
            classifyType(type){
                switch (+type) {
                    //魔戒
                    case 36:
                        return Ring;
                    //集中器
                    case 33:
                        return Concentrator;
                    //魔节
                    case 30:
                        return Magic;
                    //线缆温度传感器
                    case 38:
                        return CableTemp;
                    //独立传感器
                    default:
                        return Sensor;
                }
            },
        },
    }

</script>

<style lang="scss" >
    @import '@styles/deviceThreshold.scss';
</style>