<template>
    <div class="Alarm_Detail">
        <div class="wrap">
            <div class="top">
                <el-divider content-position="left">基本信息</el-divider>
                <div class="intro">
                    <p>
                        <strong>设备名称</strong>
                        <span>侨城东电缆沟</span>
                    </p>
                    <p>
                        <strong>设备名称</strong>
                        <span>线缆温度传感器</span>
                    </p>
                    <p>
                        <strong>设备EUI</strong>
                        <span>869029034403569</span>
                    </p>
                    <p>
                        <strong>资产编号</strong>
                        <span>381800000066</span>
                    </p>
                </div>
            </div>
            <div class="center">
                <el-divider content-position="left">从属关系</el-divider>
                <div class="intro">
                    <p>
                        <strong>所属井盖</strong>
                        <span>测试井盖1</span>
                    </p>
                    <p>
                        <strong>所属魔节</strong>
                        <span>中科能源NB-IOT</span>
                    </p>
                    <p>
                        <strong>所属线缆</strong>
                        <span>测试线缆6</span>
                    </p>
                </div>
            </div>
            <div class="footer">
                <el-divider content-position="left">告警详情</el-divider>
                <div class="intro">
                    <p>
                        <strong>告警时间</strong>
                        <span>2019-06-19 13:05:11</span>
                    </p>
                    <p>
                        <strong>告警地址</strong>
                        <span>深圳侨城东</span>
                    </p>
                    <p>
                        <strong>故障信息</strong>
                        <span class="red">震动值：静止</span>
                    </p>
                    <p>
                        <strong>告警处理</strong>
                        <span>
                            <el-button type="primary" size="small">已处理</el-button>
                            <el-button type="primary" size="small">忽略告警</el-button>
                            <el-button type="primary" size="small">延后处理</el-button>
                        </span>
                    </p>
                </div>
            </div>
            <div>
                <MapSingle 
                    vid="alarmDetail"
                    :position="position"
                    :hasSearch="false"
                    :hasClick="false"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import {MapSingle} from '@/components/Maps'

    export default {
        components: {
            MapSingle,
        },
        data() {
            return {
                position:[113.991244,22.5959]
            }
        },
    }
</script>

<style lang="scss" scoped>
    .Alarm_Detail{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        .wrap{
            padding: 20px;
            padding-top: 0px;
            width: 1200px;
            max-width: 100%;
            max-height: calc(100vh - 150px);
            overflow: scroll;
            background: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) ;
            font-size: 15px;
            .el-divider--horizontal{
                margin: 28px 0;
            }
            .intro{
                p{
                    display: flex;
                    align-items: center;
                    margin: 15px 0 ;    
                    strong{
                        flex:0.5;
                    }
                    span{
                        flex:2;
                    }
                    .red{
                        color: red;
                    }
                }
            }
        }
    }
</style>