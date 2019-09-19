<template>
    <div class="deviceThreshold">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="info">
                    <strong>阈值设置</strong>
                    <div>{{deviceName}}</div>
                </div>
                <!-- <el-button type="text" @click="resetDeafault">重置为默认值</el-button> -->
            </div>
            <el-form 
                :model="thForm" 
                :rules="rules"
                ref="thForm"
                label-position="top"  
                :style="{'width':'600px'}"
            >
                <el-form-item label="一氧化碳限值(ppm)" prop="co" v-if="this.deviceType!=32 && this.deviceType!=37">
                        <el-input v-model.number="thForm.co" autocomplete="off" />
                </el-form-item>
                <el-form-item label="电池电压限值(V)" prop="batteryA">
                        <el-input v-model.number="thForm.batteryA" autocomplete="off" />
                </el-form-item>
                <el-form-item label="传感器数据的采集周期(秒)" prop="samplingPeriod">
                        <el-input v-model.number="thForm.samplingPeriod" autocomplete="off" />
                </el-form-item>
                <el-form-item label="传感器上报数据的周期(分)" prop="reportedPeriod">
                        <el-input v-model.number="thForm.reportedPeriod" autocomplete="off" />
                </el-form-item>
                <el-form-item class="submit">
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <el-button @click="resetForm">重置为默认值</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import Threshold from './mixin'
    
    export default {
        mixins: [Threshold],
        data() {
            return {
                thForm:{  
                    co:100,
                    batteryA:2.8,
                    samplingPeriod:600,
                    reportedPeriod:20
                },
            }
        },
    }

</script>

<style lang="scss">

</style>