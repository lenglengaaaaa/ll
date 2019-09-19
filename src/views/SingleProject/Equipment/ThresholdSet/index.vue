<template>
    <div 
        :is="currentForm" 
    />
</template>

<script>
    import { Magic, Sensor ,CableTemp } from '@/components/Threshold'

    export default {
        components: {
            // Ring,
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
            classifyType(id){
                switch (+id) {
                    //魔戒
                    // case 36:
                    //     return Ring;
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
    .deviceThreshold{
        max-width: 100%;
        display: flex;
        justify-content: center;
        .box-card{
            .el-card__header{
                padding: 10px 20px;
                .clearfix{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .info{
                        strong{
                            font-size: 1.2rem;
                        }
                        div{
                            padding-top: 5px;
                            font-size: .7rem;
                            color: #708090;
                        }
                    }   
                }
            }
            .el-card__body{
                padding: 10px 20px;
                .el-form{
                    width:1000px;
                    max-width: 100%;
                    .submit{
                        padding-top: 20px;
                        text-align: center;
                    }
                    .el-select{
                        width:100%;
                    }
                }
            }
        }
    }
</style>