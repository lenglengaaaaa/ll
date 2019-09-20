<template>
    <div class="THRESHOLD_SET">
        <el-tabs type="border-card">
            <el-tab-pane label="魔节" lazy>
                <Magic :deviceType="30" />
            </el-tab-pane>
            <el-tab-pane label="线缆温度传感器" lazy>
                <Sensor :deviceType="38" />
            </el-tab-pane>
            <el-tab-pane label="红外传感器" lazy>
                <Sensor :deviceType="32" />
            </el-tab-pane>
            <el-tab-pane label="烟雾传感器" lazy>
                <Sensor :deviceType="35" />
            </el-tab-pane>
            <el-tab-pane label="水浸传感器" lazy>
                <Sensor :deviceType="37" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { Magic , Sensor , CableTemp } from '@/components/Threshold'

    export default {
        components: {
            // Ring,
            CableTemp,
            Magic,
            Sensor
        },
        data() {
            return {
                // types:[
                //     {id:30,value:'电缆监测终端（魔节）'},
                //     {id:38,value:'线缆温度传感器'},
                //     {id:32,value:'红外传感器'},
                //     {id:35,value:'烟雾传感器'},
                //     {id:37,value:'水浸传感器'},
                // ]
            }
        }
    }

</script>

<style lang="scss" >
    @import '@/styles/deviceThreshold.scss';

    .THRESHOLD_SET{
        .el-tabs {
            .el-tabs__content{
                    height: calc(100vh - 215px);
                    max-height: calc(100vh - 215px);
                    overflow: scroll;
            }
            .is-always-shadow{
                box-shadow: none;
                border: 1px solid #dcdfe6;
            }
        }
    }

</style>