<template>
    <keep-alive>
        <div 
            :is="currentForm" 
            :next="next" 
            :pre="pre" 
        />
    </keep-alive>
</template>

<script>
    import {
        Ring,
        CableTemp,
        Independent,
        Concentrator,
        Magic,
        CablePile
    } from './components'

    export default {
        props: {
            pre: {
                type: Function,
                default: ()=>{}
            },
            next: {
                type: Function,
                default: ()=>{}
            }
        },
        components: {
            Ring,
            CableTemp,
            Independent,
            Concentrator,
            Magic,
            CablePile
        },
        data() {
            return {
                currentForm: null
            }
        },
        mounted () {
            const appType = sessionStorage.getItem('appType');
            this.currentForm = this.classifyType(appType);
        },
        methods: {
            //设备分类
            classifyType(id){
                switch (+id) {
                    //集中器
                    case 33:
                        return Concentrator;
                    //魔戒
                    case 36:
                        return Ring;
                    //魔节
                    case 30:
                        return Magic;
                    //线缆温度传感器
                    case 38:
                        return CableTemp;
                    //电缆定位桩
                    case 40:
                        return CablePile;
                    //独立传感器
                    default:
                        return Independent;
                }
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>