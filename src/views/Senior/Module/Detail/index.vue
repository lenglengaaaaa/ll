<template>
    <div class="Alarm_Detail">
        <div class="wrap">
            <el-divider content-position="left">模组信息</el-divider>
            <el-row :gutter="20" align="center">
                <el-col :span="12" :xs="24">
                    <div>
                        <p>
                            <strong>模组名称</strong>
                            <span>侨城东电缆沟</span>
                        </p>
                        <p>
                            <strong>模组类型</strong>
                            <span>类型一</span>
                        </p>
                        <p>
                            <strong>模组型号</strong>
                            <span>型号一</span>
                        </p>
                        <p>
                            <strong>模组信号强度</strong>
                            <span>11Hz</span>
                        </p>
                        <p>
                            <strong>信号等级</strong>
                            <span>1</span>
                        </p>
                        <p>
                            <strong>模组描述信息</strong>
                            <span>无</span>
                        </p>
                        <p>
                            <strong>Bridge标识</strong>
                            <span>不知</span>
                        </p>
                        <p>
                            <strong>模组绑定的设备状态</strong>
                            <span>不知</span>
                        </p>
                        <p>
                            <strong>模组sig版本</strong>
                            <span>2.0</span>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12" :xs="24">
                    <p>
                        <strong>模组信噪比</strong>
                        <span>信噪比</span>
                    </p>
                    <p>
                        <strong>模组状态</strong>
                        <span>OK</span>
                    </p>
                    <p>
                        <strong>模组位置</strong>
                        <span>中科研究院</span>
                    </p>
                    <p>
                        <strong>厂商ID</strong>
                        <span>123</span>
                    </p>
                    <p>
                        <strong>厂商名称</strong>
                        <span>测试线缆6</span>
                    </p>
                    <p>
                        <strong>使用的通讯技术</strong>
                        <span>通讯技术</span>
                    </p>
                    <p>
                        <strong>设备激活状态</strong>
                        <span>激活</span>
                    </p>
                    <p>
                        <strong>mac</strong>
                        <span>123456789</span>
                    </p>
                    <p>
                        <strong>模组软件版本</strong>
                        <span>1.0</span>
                    </p>
                    <p>
                        <strong>模组固件版本</strong>
                        <span>1.0</span>
                    </p>
                    <p>
                        <strong>模组硬件版本</strong>
                        <span>1.0</span>
                    </p>
                    <p>
                        <strong>协议类型</strong>
                        <span>不知</span>
                    </p>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

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
                display: flex;
                div{
                    width: 100%;
                }
                p{
                    border: 0 solid #e4e6eb;
                    padding: 0px 20px;
                    border-left-width: 5px;
                    border-radius: 5px;
                    border-left-color: #67c2ef;
                    .red{
                        color: red;
                    }
                }
            }
        }
    }
</style>